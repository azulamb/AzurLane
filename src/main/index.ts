/// <reference path="../funcs/common.ts" />
/// <reference path="../modules/section-pages.ts" />
/// <reference path="../modules/calc-time.ts" />
/// <reference path="../modules/skill-book.ts" />
/// <reference path="../modules/notification-like.ts" />
/// <reference path="../funcs/skill_lvup.ts" />
/// <reference path="../funcs/awaking.ts" />
/// <reference path="../funcs/augment_modules.ts" />
/// <reference path="../funcs/parts_lvup.ts" />
/// <reference path="../funcs/fleet_force.ts" />
/// <reference path="../funcs/siren_operation_shop.ts" />
/// <reference path="../funcs/siren_operation_port_shop.ts" />

Promise.all([
	customElements.whenDefined('section-pages'),
	customElements.whenDefined('skill-book'),
	customElements.whenDefined('skill-exp'),
]).then(() => {
	((parent) => {
		setTimeout(() => {
			const condition = <CalcTimeElement> parent.querySelector('calc-time');

			let nowPlace = 2;
			let nowMarriage = 0;
			const Update = () => {
				condition.max = nowPlace <= 2 ? 119 : 150;
				if (condition.max < condition.value) {
					condition.value = condition.max;
				}
				condition.add = nowPlace + nowMarriage;
			};
			for (const place of parent.querySelectorAll('input[name="place"]')) {
				place.addEventListener('change', () => {
					nowPlace = parseInt((<HTMLInputElement> place).value);
					Update();
				});
			}
			for (const marriage of parent.querySelectorAll('input[name="marriage"]')) {
				marriage.addEventListener('change', () => {
					nowMarriage = parseInt((<HTMLInputElement> marriage).value);
					Update();
				});
			}
		}, 0);
	})(<HTMLElement> document.getElementById('condition'));
	setTimeout(() => {
		DrawSkillLvUp(<SkillExpElement> document.getElementById('skill_lvup'));
		DrawAwaking(<SkillExpElement> document.getElementById('awaking'));
		DrawPartsLvUp(<HTMLElement> document.getElementById('parts_lvup'));
		AugmentModules(<HTMLElement> document.getElementById('augment_modules'));
		DrawFleetForce(<HTMLElement> document.getElementById('freet_force'));
		DrawSirenOperationShop(<HTMLTableElement> document.getElementById('siren_operation_shop'));
		DrawSirenOperationPortShop(<HTMLTableElement> document.getElementById('siren_operation_port_shop'));
	}, 100);
});
