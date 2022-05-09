/* */

interface SkillBookElement extends HTMLElement {
	rarelity: number;
	hours: number;
	exp: number;
	bonus: number;
	readonly totalHours: number;
	readonly totalExp: number;
}

((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	((component, tagname = 'skill-book') => {
		if (customElements.get(tagname)) {
			return;
		}
		customElements.define(tagname, component);
	})(
		class extends HTMLElement implements SkillBookElement {
			protected hoursArea: HTMLElement;
			protected expArea: HTMLElement;
			protected bonusArea: HTMLElement;
			protected books: HTMLInputElement;
			protected booksBonus: HTMLInputElement;

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
					':host > div { display: grid; grid-template-columns: 1.5em 1fr 2em 4em 1em 3em 1em 4em 1em 3em 1em; }',
					':host > div > div:nth-child(n+3) { text-align: right; }',
					'#icon { width: 1em; height: 1em; }',
					':host([rarelity="2"]) #name::after { content: "2"; }',
					':host([rarelity="3"]) #name::after { content: "3"; }',
					':host([rarelity="4"]) #name::after { content: "4"; }',
					':host #name::after { content: "1"; }',
					'#hours::after { content: "h"; }',
					'.sub::after { content: "-"; }',
					'.add::after { content: "+"; }',
				].join('');

				const icon = document.createElement('div');
				icon.id = 'icon';
				const name = document.createElement('div');
				name.id = 'name';
				name.textContent = '教科書T';
				this.hoursArea = document.createElement('div');
				this.hoursArea.id = 'hours';
				this.expArea = document.createElement('div');
				this.bonusArea = document.createElement('div');

				this.books = document.createElement('input');
				this.books.type = 'number';
				this.books.min = '0';
				this.books.max = '185';
				this.books.value = '0';
				this.books.addEventListener('change', (event) => {
					this.onChange(event);
				});
				const subBook = document.createElement('button');
				subBook.classList.add('sub');
				subBook.addEventListener('click', (event) => {
					const count = parseInt(this.books.value);
					if (parseInt(this.books.min) < count) {
						this.books.value = `${count - 1}`;
					}
					this.onChange(event);
				});
				const addBook = document.createElement('button');
				addBook.classList.add('add');
				addBook.addEventListener('click', (event) => {
					const count = parseInt(this.books.value);
					if (count < parseInt(this.books.max)) {
						this.books.value = `${count + 1}`;
					}
					this.onChange(event);
				});

				this.booksBonus = document.createElement('input');
				this.booksBonus.type = 'number';
				this.booksBonus.min = '0';
				this.booksBonus.max = '124';
				this.booksBonus.value = '0';
				this.booksBonus.addEventListener('change', (event) => {
					this.onChange(event);
				});
				const subBookBonus = document.createElement('button');
				subBookBonus.classList.add('sub');
				subBookBonus.addEventListener('click', (event) => {
					const count = parseInt(this.booksBonus.value);
					if (parseInt(this.booksBonus.min) < count) {
						this.booksBonus.value = `${count - 1}`;
					}
					this.onChange(event);
				});
				const addBookBonus = document.createElement('button');
				addBookBonus.classList.add('add');
				addBookBonus.addEventListener('click', (event) => {
					const count = parseInt(this.booksBonus.value);
					if (count < parseInt(this.booksBonus.max)) {
						this.booksBonus.value = `${count + 1}`;
					}
					this.onChange(event);
				});

				const contents = document.createElement('div');
				contents.appendChild(icon);
				contents.appendChild(name);
				contents.appendChild(this.hoursArea);

				contents.appendChild(this.expArea);
				contents.appendChild(subBook);
				contents.appendChild(this.books);
				contents.appendChild(addBook);

				contents.appendChild(this.bonusArea);
				contents.appendChild(subBookBonus);
				contents.appendChild(this.booksBonus);
				contents.appendChild(addBookBonus);

				shadow.appendChild(style);
				shadow.appendChild(contents);
			}

			protected onChange(event: Event) {
				event.stopPropagation();
				this.dispatchEvent(new CustomEvent('change'));
			}

			get rarelity() {
				return parseInt(this.getAttribute('rarelity') || '') || 1;
			}
			set rarelity(value) {
				this.setAttribute('rarelity', value + '');
			}

			get hours() {
				return parseInt(this.getAttribute('hours') || '') || 1;
			}
			set hours(value) {
				this.setAttribute('hours', value + '');
				this.hoursArea.textContent = value + '';
			}

			get exp() {
				return parseInt(this.getAttribute('exp') || '') || 100;
			}
			set exp(value) {
				this.setAttribute('exp', value + '');
				this.expArea.textContent = value + '';
			}

			get bonus() {
				return parseInt(this.getAttribute('bonus') || '') || 100;
			}
			set bonus(value) {
				this.setAttribute('bonus', value + '');
				this.bonusArea.textContent = value + '';
			}

			get totalHours() {
				const total = parseInt(this.books.value) + parseInt(this.booksBonus.value);
				return total * this.hours;
			}

			get totalExp() {
				return parseInt(this.books.value) * this.exp + parseInt(this.booksBonus.value) * this.bonus;
			}
		},
		script.dataset.tagname,
	);
});
