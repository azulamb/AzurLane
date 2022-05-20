/// <reference path="../funcs/common.ts" />
/// <reference path="../components/section-pages.ts" />
/// <reference path="../components/calc-time.ts" />
/// <reference path="../components/skill-book.ts" />
/// <reference path="../funcs/skill_lvup.ts" />
/// <reference path="../funcs/awaking.ts" />
/// <reference path="../funcs/parts_lvup.ts" />

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
	((parent) => {
		setTimeout(() => {
			(<HTMLButtonElement> parent.querySelector('button')).addEventListener('click', () => {
				Notification.requestPermission().then((result) => {
					if (result === 'denied') {
						throw new Error('Denied');
					}
					console.log(result);
					const data = {
						icon: './favicon.svg',
						body: 'test',
						vibrate: true,
					};
					const notification = new Notification('title', {
						icon: './favicon.svg',
						body: 'test',
						vibrate: 5,
					});
				}).catch((error) => {
					console.error(error);
				});
			});
		}, 0);
	})(<HTMLElement> document.getElementById('notification'));
	DrawSkillLvUp(<SkillExpElement> document.getElementById('skill_lvup'));
	DrawAwaking(<SkillExpElement> document.getElementById('awaking'));
	DrawPartsLvUp(<HTMLElement> document.getElementById('parts_lvup'));
});
