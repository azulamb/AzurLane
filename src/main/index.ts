/// <reference path="../funcs/common.ts" />
/// <reference path="../components/section-pages.ts" />
/// <reference path="../components/calc-time.ts" />
/// <reference path="../components/skill-book.ts" />
/// <reference path="../components/skill-exp.ts" />
/// <reference path="../funcs/skill_lvup.ts" />
/// <reference path="../funcs/awaking.ts" />
/// <reference path="../funcs/parts_lvup.ts" />

Promise.all([
	customElements.whenDefined('section-pages'),
	customElements.whenDefined('skill-book'),
	customElements.whenDefined('skill-exp'),
]).then(() => {
	DrawSkillLvUp(<SkillExpElement> document.getElementById('skill_lvup'));
	DrawAwaking(<SkillExpElement> document.getElementById('awaking'));
	DrawPartsLvUp(<HTMLElement> document.getElementById('parts_lvup'));
});
