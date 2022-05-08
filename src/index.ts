/// <reference path="./calc-time.ts" />
/// <reference path="./skill-book.ts" />
/// <reference path="./skill-exp.ts" />
/// <reference path="./parts_lvup.ts" />
/// <reference path="./skill_lvup.ts" />

Promise.all([
	customElements.whenDefined('skill-book'),
	customElements.whenDefined('skill-exp'),
]).then(() => {
	document.querySelectorAll('header > button').forEach((button) => {
		button.addEventListener('click', () => {
			document.body.dataset.page = button.id;
		});
	});
	DrawSkillLvUp(<SkillExpElement> document.getElementById('skill_lvup'));
	DrawPartsLvUp(<HTMLElement> document.getElementById('parts_lvup'));
});
