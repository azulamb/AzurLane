interface CheckBoxElement extends HTMLElement {
	save: boolean;
	name: string;
	value: string;
	checked: boolean;
}

((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	((component, tagname = 'check-box') => {
		if (customElements.get(tagname)) {
			return;
		}
		customElements.define(tagname, component);
	})(
		class extends HTMLElement implements CheckBoxElement {
			protected check: HTMLButtonElement; //HTMLInputElement;

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: inline-block; --selected: #0075fc; --color: white; --border: 1px solid #767676; }',
					':host(:hover) { background: rgba(125, 125, 125, 0.3); }',
					':host > label { display: grid; grid-template-columns: 1em 1fr; user-select: none; align-items: center; gap: 8px; cursor: pointer; }',
					':host > label > button { display: block; box-sizing: border-box; width: 100%; padding: 0; border: var(--border); border-radius: 2px; position: relative; }',
					':host > label > button::before { content: ""; display: block; width: 100%; padding-top: 100%; }',
					':host([checked]) > label > button { background: var(--selected); }',
					':host([checked]) > label > button::after { content: "✔"; display: block; width: 100%; height: 100%; top: 0; left: 0; color: var(--color); position: absolute; }',
				].join('');

				this.check = document.createElement('button');
				this.check.addEventListener('click', () => {
					this.checked = !this.checked;
				});

				const contents = document.createElement('label');
				contents.appendChild(this.check);
				contents.appendChild(document.createElement('slot'));

				const name = this.getAttribute('name');
				if (name) {
					this.name = name;
				}

				const value = this.getAttribute('name');
				if (value) {
					this.value = value;
				}

				if (this.hasAttribute('checked')) {
					this.checked = true;
				}

				this.load();

				shadow.appendChild(style);
				shadow.appendChild(contents);
			}

			get save() {
				return this.hasAttribute('save');
			}
			set save(value) {
				if (!value) {
					this.removeAttribute('save');
				} else {
					this.setAttribute('save', '');
				}
			}

			get name() {
				return this.getAttribute('name') || '';
			}
			set name(value) {
				this.setAttribute('name', value);
			}

			get value() {
				return this.getAttribute('value') || '';
			}
			set value(value) {
				this.setAttribute('value', value);
			}

			get checked() {
				return this.hasAttribute('checked');
			}
			set checked(value) {
				if (!value) {
					this.removeAttribute('checked');
				} else {
					this.setAttribute('checked', '');
				}
			}

			protected load() {
				if (!this.save || !this.id) {
					return;
				}
				const value = localStorage.getItem(this.id);
				if (!value) {
					return;
				}
				this.checked = value === '1';
			}

			protected update() {
				if (!this.save || !this.id) {
					return;
				}
				localStorage.setItem(this.id, this.checked ? '1' : '0');
			}

			static get observedAttributes() {
				return ['save', 'checked', 'id'];
			}

			attributeChangedCallback(name: string, oldValue: any, newValue: any) {
				if (oldValue === newValue) {
					return;
				}
				if (name === 'id' || name === 'save') {
					this.load();
				} else {
					this.update();
				}
				this.update();
			}
		},
		script.dataset.tagname,
	);
});
