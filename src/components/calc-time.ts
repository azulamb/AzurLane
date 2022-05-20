/// <reference path="./input-slider.ts" />
/// <reference path="./date-time.ts" />

interface CalcTimeElement extends HTMLElement {
	max: number;
	mins: number;
	add: number;
	value: number;
}

((script, init) => {
	Promise.all([
		customElements.whenDefined('input-slider'),
		customElements.whenDefined('date-time'),
	]).then(() => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	((component, tagname = 'calc-time') => {
		if (customElements.get(tagname)) {
			return;
		}
		customElements.define(tagname, component);
	})(
		class extends HTMLElement implements CalcTimeElement {
			private slider: InputSliderElement;
			private complete: DateTimeElement;

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
					':host > div { display: grid; grid-template-columns: 7rem 1fr 5rem 7rem; }',
					':host > div > input-slider { --input-size: 5rem; }',
				].join('');

				const label = document.createElement('div');
				label.appendChild(document.createElement('slot'));

				this.slider = new (<{ new (): InputSliderElement }> customElements.get('input-slider'))();
				this.slider.step = 1;
				this.slider.value = 0;
				if (this.hasAttribute('value')) {
					this.slider.value = parseInt(this.getAttribute('value') || '') || 0;
				}
				if (this.hasAttribute('max')) {
					this.slider.max = parseInt(this.getAttribute('max') || '') || 1;
				}

				this.complete = new (<{ new (): DateTimeElement }> customElements.get('date-time'))();
				this.complete.fillzero = true;
				this.complete.year = true;
				this.complete.second = true;

				const timelimit = document.createElement('div');
				timelimit.style.textAlign = 'center';
				timelimit.textContent = '到達時間';

				this.updateTime();

				this.slider.addEventListener('change', () => {
					this.updateTime();
				});

				const contents = document.createElement('div');
				contents.appendChild(label);
				contents.appendChild(this.slider);
				contents.appendChild(timelimit);
				contents.appendChild(this.complete);

				shadow.appendChild(style);
				shadow.appendChild(contents);
			}

			protected updateTime() {
				const date = new Date();
				const value = this.max - this.value;
				if (0 < value) {
					const mins = value / this.add * this.mins;
					date.setMinutes(date.getMinutes() + mins);
				}
				this.complete.value = date;
			}

			get max() {
				return this.slider.max;
			}
			set max(value) {
				this.slider.max = value;
			}

			get mins() {
				return parseInt(this.getAttribute('mins') || '') || 1;
			}
			set mins(value) {
				this.setAttribute('mins', value + '');
			}

			get add() {
				return parseInt(this.getAttribute('add') || '') || 1;
			}
			set add(value) {
				this.setAttribute('add', value + '');
			}

			get value() {
				return this.slider.value;
			}
			set value(value) {
				this.slider.value = value;
			}

			static get observedAttributes() {
				return ['max', 'value', 'add'];
			}

			attributeChangedCallback(name: string, oldValue: any, newValue: any) {
				if (oldValue === newValue) {
					return;
				}
				switch (name) {
					case 'max':
						this.max = newValue;
						break;
					case 'add':
						this.add = newValue;
						break;
					case 'value':
						this.value = newValue;
						break;
				}
				this.updateTime();
			}
		},
		script.dataset.tagname,
	);
});
