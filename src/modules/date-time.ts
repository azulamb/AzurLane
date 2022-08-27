/* */

interface DateTimeElement extends HTMLElement {
	value: Date;
	fillzero: boolean;
	year: boolean;
	second: boolean;
}

((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	((component, tagname = 'date-time') => {
		if (customElements.get(tagname)) {
			return;
		}
		customElements.define(tagname, component);
	})(
		class extends HTMLElement implements DateTimeElement {
			protected datetime: Date;
			protected showYear: HTMLElement;
			protected showMonth: HTMLElement;
			protected showDay: HTMLElement;
			protected showHour: HTMLElement;
			protected showMinute: HTMLElement;
			protected showSecond: HTMLElement;
			protected separates: HTMLElement[];

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: inline-block; }',
					':host > div { display: grid; grid-template-columns: 5fr 1fr 3fr 1fr 3fr 1fr 3fr 1fr 3fr 1fr 3fr; text-align: center; position: relative; }',
					':host([year][second]) > div { grid-template-columns: 3fr 1fr 3fr 1fr 3fr 1fr 3fr; }',
					':host([year]:not([second])) > div { grid-template-columns: 3fr 1fr 3fr 1fr 3fr 1fr 3fr 1fr 3fr; }',
					':host([second]:not([year])) > div { grid-template-columns: 5fr 1fr 3fr 1fr 3fr 1fr 3fr 1fr 3fr; }',
					':host([year]) > div > .year { display: none; position: absolute; }',
					':host([second]) > div > .second { display: none; position: absolute; }',
				].join('');

				this.showYear = document.createElement('div');
				this.showYear.classList.add('year');
				this.showMonth = document.createElement('div');
				this.showDay = document.createElement('div');
				this.showHour = document.createElement('div');
				this.showMinute = document.createElement('div');
				this.showSecond = document.createElement('div');
				this.showSecond.classList.add('second');
				this.separates = [
					document.createElement('span'),
					document.createElement('span'),
					document.createElement('span'),
					document.createElement('span'),
				];
				for (let i = 0; i < 2; ++i) {
					this.separates[i].textContent = '/';
					this.separates[i + 2].textContent = ':';
				}
				this.separates[0].classList.add('year');
				this.separates[3].classList.add('second');
				const space = document.createElement('span');
				space.textContent = ' ';

				const contents = document.createElement('div');
				contents.appendChild(this.showYear);
				contents.appendChild(this.separates[0]);
				contents.appendChild(this.showMonth);
				contents.appendChild(this.separates[1]);
				contents.appendChild(this.showDay);
				contents.appendChild(space);
				contents.appendChild(this.showHour);
				contents.appendChild(this.separates[2]);
				contents.appendChild(this.showMinute);
				contents.appendChild(this.separates[3]);
				contents.appendChild(this.showSecond);

				this.datetime = new Date();

				this.updateDatetime();

				shadow.appendChild(style);
				shadow.appendChild(contents);
			}

			protected updateDatetime() {
				const pad = this.fillzero ? 2 : 1;
				this.showYear.textContent = this.datetime.getFullYear() + '';
				this.showMonth.textContent = `${this.datetime.getMonth() + 1}`.padStart(pad, '0');
				this.showDay.textContent = `${this.datetime.getDate()}`.padStart(pad, '0');
				this.showHour.textContent = `${this.datetime.getHours()}`.padStart(pad, '0');
				this.showMinute.textContent = `${this.datetime.getMinutes()}`.padStart(pad, '0');
				this.showSecond.textContent = `${this.datetime.getSeconds()}`.padStart(pad, '0');
			}

			get value() {
				return this.datetime;
			}
			set value(value) {
				this.datetime = new Date(value);
				this.updateDatetime();
			}

			get fillzero() {
				return this.hasAttribute('fillzero');
			}
			set fillzero(value) {
				if (!value) {
					this.removeAttribute('fillzero');
				} else {
					this.setAttribute('fillzero', '');
				}
			}

			get year() {
				return this.hasAttribute('year');
			}
			set year(value) {
				if (!value) {
					this.removeAttribute('year');
				} else {
					this.setAttribute('year', '');
				}
			}

			get second() {
				return this.hasAttribute('second');
			}
			set second(value) {
				if (!value) {
					this.removeAttribute('second');
				} else {
					this.setAttribute('second', '');
				}
			}

			static get observedAttributes() {
				return ['value', 'fillzero'];
			}

			attributeChangedCallback(name: string, oldValue: any, newValue: any) {
				if (oldValue === newValue) {
					return;
				}
				if (name === 'value') {
					this.value = newValue;
				} else {
					this.updateDatetime();
				}
			}
		},
		script.dataset.tagname,
	);
});
