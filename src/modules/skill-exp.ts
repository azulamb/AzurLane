/// <reference path="./skill-book.ts" />

/* */

interface SkillExpElement extends HTMLElement {
	exp: number[];
}

((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	((component, tagname = 'skill-exp') => {
		if (customElements.get(tagname)) {
			return;
		}
		customElements.define(tagname, component);
	})(
		class extends HTMLElement implements SkillExpElement {
			protected bar: HTMLElement;
			protected lv: HTMLSelectElement;
			protected nowExp: HTMLInputElement;
			protected hours: HTMLElement;
			protected expArea: HTMLElement;
			protected totalArea: HTMLElement;

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; --bar-0: hsl(90, 50%, 50%); --bar-1: hsl(80, 50%, 50%); --bar-2: hsl(70, 50%, 50%); --bar-3: hsl(60, 50%, 50%); --bar-4: hsl(50, 50%, 50%); --bar-5: hsl(40, 50%, 50%); --bar-6: hsl(30, 50%, 50%); --bar-7: hsl(20, 50%, 50%); --bar-8: hsl(10, 50%, 50%); --bar-9: hsl(0, 50%, 50%); }',
					':host > div {}',
					'#values { display: grid; grid-template-columns: 10em 10em 3em 1em 4em 1fr 3.5em; }',
					'#hours::before { content: "合計教育時間:"; }',
					'#hours::after { content: "h"; }',
					'.text.skill::before { content: "現在のスキル経験値："; }',
					'.text.skilladd::before { content: "+"; }',
					'[data-status="equal"] { color: blue; }',
					'[data-status="over"] { color: red; }',
					'#exp { text-align: right; }',
					'#exp::before { content: "獲得経験値:"; }',
					'#total::before { content: "/"; }',
					'#bar { display: grid; width: 100%; height: 1em; position: relative; --gauge: 100%; }',
					'#bar::after { content: ""; display: block; width: var(--gauge); height: 100%; position: absolute; right: 0; background: rgba(0, 0, 0, 0.5); transition: width 0.1s; }',
				].join('');

				this.hours = document.createElement('div');
				this.hours.id = 'hours';
				this.hours.textContent = '0';

				this.lv = document.createElement('select');
				this.lv.addEventListener('change', () => {
					this.update();
				});

				this.nowExp = document.createElement('input');
				this.nowExp.type = 'number';
				this.nowExp.min = '0';
				this.nowExp.max = '5800';
				this.nowExp.step = '1';
				this.nowExp.value = '0';
				this.nowExp.addEventListener('change', () => {
					this.update();
				});

				this.expArea = document.createElement('div');
				this.expArea.id = 'exp';
				this.totalArea = document.createElement('div');
				this.totalArea.id = 'total';
				this.totalArea.textContent = '1';

				const skillTitle = document.createElement('div');
				skillTitle.classList.add('text', 'skill');

				const skillAdd = document.createElement('div');
				skillAdd.classList.add('text', 'skilladd');

				const values = document.createElement('div');
				values.id = 'values';
				values.appendChild(this.hours);
				values.appendChild(skillTitle);
				values.appendChild(this.lv);
				values.appendChild(skillAdd);
				values.appendChild(this.nowExp);
				values.appendChild(this.expArea);
				values.appendChild(this.totalArea);

				this.bar = document.createElement('div');
				this.bar.id = 'bar';

				const slot = document.createElement('slot');
				slot.addEventListener('slotchange', (event) => {
					for (const child of this.children) {
						child.removeEventListener('change', onChange);
						child.addEventListener('change', onChange);
					}
				});

				const books = document.createElement('div');
				books.appendChild(slot);

				const contents = document.createElement('div');
				contents.appendChild(values);
				contents.appendChild(this.bar);
				contents.appendChild(books);

				const onChange = () => {
					this.update();
				};

				shadow.appendChild(style);
				shadow.appendChild(contents);
			}

			protected update() {
				let hours = 0;
				let exp = parseInt(this.lv.options[this.lv.selectedIndex].value) + parseInt(this.nowExp.value);

				const total = parseInt(this.totalArea.textContent || '');
				for (const child of this.children) {
					const book = <SkillBookElement> child;
					if (!book.totalHours) {
						continue;
					}
					hours += book.totalHours;
					exp += book.totalExp;
				}

				this.bar.style.setProperty('--gauge', `calc(100% * ${total - exp} / ${total})`);

				if (exp === total) {
					this.expArea.dataset.status = 'equal';
				} else if (total < exp) {
					this.expArea.dataset.status = 'over';
				} else {
					this.expArea.dataset.status = '';
				}
				this.hours.textContent = hours + '';
				this.expArea.textContent = exp + '';
			}

			protected updateBaseExp(exps: string) {
				let total = 0;

				this.lv.innerHTML = '';
				const lv = document.createElement('option');
				lv.value = '0';
				lv.textContent = 'LV 1';
				this.lv.appendChild(lv);

				this.bar.innerHTML = '';
				this.bar.style.gridTemplateColumns = exps.split(',').map((str, index) => {
					const exp = parseInt(str);
					total += exp;
					const bar = document.createElement('div');
					bar.style.background = `var(--bar-${index})`;
					this.bar.appendChild(bar);

					const lv = document.createElement('option');
					lv.value = total + '';
					lv.textContent = `LV ${index + 2}`;
					this.lv.appendChild(lv);

					return `${exp}fr`;
				}).join(' ');

				this.totalArea.textContent = total + '';
			}

			get exp() {
				return (this.getAttribute('exp') || '').split(',').map((v) => {
					return parseInt(v);
				});
			}
			set exp(value) {
				this.setAttribute('exp', value.join(','));
			}

			static get observedAttributes() {
				return ['exp'];
			}

			attributeChangedCallback(name: string, oldValue: any, newValue: any) {
				if (oldValue === newValue) {
					return;
				}
				if (name === 'exp') {
					this.updateBaseExp(newValue);
				}
				this.update();
			}
		},
		script.dataset.tagname,
	);
});
