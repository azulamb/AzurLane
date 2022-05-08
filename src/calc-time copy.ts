/// <reference path="./input-slider.ts" />

interface CalcTimeElement extends HTMLElement {
	max: number;
	mins: number;
	add: number;
	value: number;
}

((script, init) => {
	customElements.whenDefined('input-slider').then(() => {
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
			private complete: HTMLInputElement;

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
					':host > div { display: grid; }',
					':host > div > input-slider { --input-size: 5rem; }',
				].join('');

				const label = document.createElement('div');
				label.appendChild(document.createElement('slot'));

				this.slider = new (<{ new (): InputSliderElement }> customElements.get('input-slider'))();
				this.slider.step = 1;
				this.slider.value = 0;
				if (this.hasAttribute('max')) {
					this.slider.max = parseInt(this.getAttribute('max') || '') || 1;
				}

				this.complete = document.createElement('input');
				this.complete.type = 'datetime';
				this.complete.readOnly = true;

				this.updateTime();

				const contents = document.createElement('div');
				contents.appendChild(label);
				contents.appendChild(this.slider);
				contents.appendChild(this.complete);

				shadow.appendChild(style);
				shadow.appendChild(contents);
			}

			protected updateTime() {
				const value = this.max - this.value;
				const mins = value / this.add * this.mins;
				const date = new Date();
				date.setMinutes(date.getMinutes() + mins);
				this.complete.value = date.toISOString();
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
				return ['max', 'value'];
			}

			attributeChangedCallback(name: string, oldValue: any, newValue: any) {
				if (oldValue === newValue) {
					return;
				}
				switch (name) {
					case 'max':
						this.max = newValue;
						break;
					case 'value':
						this.value = newValue;
						break;
				}
			}
		},
		script.dataset.tagname,
	);
});
