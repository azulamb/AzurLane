/// <reference path="../funcs/common.ts" />
/// <reference path="../components/section-pages.ts" />
/// <reference path="../funcs/meowfficers.ts" />

Promise.all([
	customElements.whenDefined('section-pages'),
	customElements.whenDefined('meowfficer-ability'),
]).then(() => {
	DrawMeowfficers(<HTMLElement> document.getElementById('meowfficers'));
});
