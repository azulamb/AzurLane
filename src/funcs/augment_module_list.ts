/// <reference path="../types.d.ts" />
/// <reference path="../modules/vanguard-type.ts" />
/// <reference path="../modules/ship-type.ts" />

type GENERAL_AUGMENT_MODULE_KEY =
	| 'Kunai'
	| 'Dagger'
	| 'Scepter'
	| 'HuntingBow'
	| 'Bowgun'
	| 'OfficersSword'
	| 'Lance'
	| 'GreatSword'
	| 'Crossbow'
	| 'Sword'
	| 'Hammer'
	| 'DualSword';
type GENERAL_AUGMENT_MODULE_EFFECT = 'area' | 'diffusion';

declare const GENERAL_AUGMENT_MODULES: {
	id: GENERAL_AUGMENT_MODULE_KEY;
	name: string;
	skill: string;
	effect?: GENERAL_AUGMENT_MODULE_EFFECT;
	types: ALL_SHIP_TYPE[];
}[];

function DrawAugmentModuleList(parent: HTMLElement) {
	Promise.all([
		customElements.whenDefined('vanguard-type'),
		customElements.whenDefined('ship-type'),
	]).then(() => {
		const SKILL: { [keys: string]: { name: string; text: string } } = {
			k0: { name: '損害効果向上-魚雷', text: '自身の魚雷攻撃が敵に命中時に8%で発動、その敵が10秒間与えるダメージを5%ダウンさせる（「損害効果向上-魚雷」装備効果は1回しか加算されない）' },
			k1: { name: 'クリティカル性能向上-魚雷', text: '自身の魚雷並走のクリティカル率が10%アップ' },
			k2: { name: '先導攻撃-航空', text: '自身が戦闘中1回目の航空攻撃を行う場合、味方主力艦隊の航空が10秒間20アップ（「先導攻撃-航空」装備効果は1回しか加算されない）' },
			k3: { name: '空中戦闘技術', text: '自身の艦載機が敵機5機を撃墜した場合に1度だけ、自身の航空が20アップ' },
			k4: { name: '弾薬調整-徹甲', text: '自身の1番目の兵装枠に装備されている兵装の攻撃が装甲タイプが重装甲の敵に与えるダメージが5%アップし、軽装甲の敵に与えるダメージが5%ダウン' },
			k5: { name: '先導攻撃-火力', text: '自身が戦闘中1回目の遠隔砲撃攻撃を行う場合、味方主力艦隊の火力が10秒間20アップ（「先導攻撃-火力」装備効果は1回しか加算されない）' },
			k6: { name: '底力向上-火力', text: '自身が戦闘中ダメージを受け耐久を上限の50%を下回った場合に1度だけ、20秒間自身の火力が20アップ' },
			k7: { name: '特殊斬撃-領域', text: '戦闘中の味方前衛艦隊先頭の艦船が「特殊斬撃」を放つ。軌跡や範囲・ダメージは味方前衛艦隊「特殊斬撃」装備の艦船数・艦種。装備効果種類による' },
			k8: { name: 'ダメージ軽減-航空', text: '味方前衛艦船が受ける航空ダメージを5%軽減する（「ダメージ軽減-航空」装備効果は1回しか加算されない）' },
			k9: { name: '特殊斬撃-拡散', text: '戦闘中の味方前衛艦隊先頭の艦船が「特殊斬撃」を放つ。軌跡や範囲・ダメージは味方前衛艦隊「特殊斬撃」装備の艦船数・艦種・装備効果種類による' },
		};

		function CreateVanguardType(type?: string) {
			if (type !== 'area' && type !== 'diffusion') {
				return '';
			}
			const vanguardType = new (<{ new (): VanguardEffectTypeElement }> customElements.get('vanguard-type'))();
			vanguardType.type = type;
			return vanguardType;
		}

		const tbody = document.createElement('tbody');

		const theadLine = Common.tr(
			{},
			Common.td(''),
			Common.td('名前'),
			Common.td('タイプ'),
			Common.td('艦種'),
			Common.td('スキル'),
		);

		GENERAL_AUGMENT_MODULES.forEach((item, index) => {
			const skill = SKILL[item.skill];
			const skillName = document.createElement('h5');
			skillName.textContent = skill.name;
			const skillText = document.createElement('div');
			skillText.textContent = skill.text;
			const icon = document.createElement('div');
			icon.classList.add(item.id);
			const tr = Common.tr(
				{},
				Common.td(icon),
				Common.td(item.name),
				Common.td(CreateVanguardType(item.effect), { class: 'center' }),
				Common.td(item.types.map((type) => {
					const shipType = new (<{ new (): ShipTypeElement }> customElements.get('ship-type'))();
					shipType.type = type;
					return shipType;
				})),
				Common.td([
					skillName,
					skillText,
				]),
			);

			tbody.appendChild(tr);
		});

		const thead = document.createElement('thead');
		thead.appendChild(theadLine);

		const table = document.createElement('table');
		table.classList.add('general_augment_modules');

		table.appendChild(thead);
		table.appendChild(tbody);

		parent.appendChild(table);
	});
}
