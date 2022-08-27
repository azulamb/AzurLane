/// <reference path="../modules/section-pages.ts" />
/// <reference path="../funcs/augment_module_list.ts" />

Promise.all([
	customElements.whenDefined('section-pages'),
]).then(() => {
	setTimeout(() => {
		DrawAugmentModuleList(<HTMLElement> document.getElementById('general_augment_modules'));
	}, 100);
});
