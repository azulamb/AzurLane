/// <reference path="../components/section-pages.ts" />
/// <reference path="../funcs/meowfficers.ts" />

Promise.all([
	customElements.whenDefined('section-pages'),
]).then(() => {
	DrawMeowfficers(<HTMLElement> document.getElementById('meowfficers'));
});
