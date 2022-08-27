/// <reference path="../modules/section-pages.ts" />
/// <reference path="../funcs/fleet.ts" />

Promise.all([
	customElements.whenDefined('section-pages'),
]).then(() => {
	setTimeout(() => {
		DrawFleet(<HTMLElement> document.getElementById('page_fleet_modules'));
	}, 100);
});
