/// <reference path="../types.d.ts" />
/// <reference path="../funcs/Common.ts" />
/// <reference path="../components/meowfficer-ability.ts" />
/// <reference path="../components/ship-type.ts" />

type NATIONS = 'IronBlood';
declare const MEOWFFICERS: {
	[keys: string]: {
		name: string;
		rarelity: RARELITY;
		type: 0 | 1 | 2; // 無・参謀・指揮
		siren?: 0 | 1 | 2; // 無・参謀・指揮
		target: 'Destroyer' | 'Cruiser' | 'Battleship' | 'Carrier' | 'Submarine';
		nation: NATIONS;
		logistics: { min: number; max: number };
		tactics: { min: number; max: number };
		directives: { min: number; max: number };
		skill: MEOWFFICER_SKILLS;
		abilities: string[];
		abilities2?: string[];
	};
};

function DrawMeowfficers(parent: HTMLElement) {
	const createMeowfficerAbility = (ability: MEOWFFICERS_ABILITY, lv: 0 | 1 | 2 | 3 = 0) => {
		const meowfficerAbility = new (<{ new (): MeowfficerAbilityElement }> customElements.get('meowfficer-ability'))();
		meowfficerAbility.type = ability.type;
		if (ability.target) {
			meowfficerAbility.target = ability.target;
		}
		if (0 < lv) {
			meowfficerAbility.lv = <1 | 2 | 3> lv;
		}
		return meowfficerAbility;
	};
	Promise.all([
		customElements.whenDefined('meowfficer-ability'),
		customElements.whenDefined('ship-type'),
	]).then(() => {
		const tbody = document.createElement('tbody');

		const SP = [
			//'BestFriend', 'RisingStar', 'Miracle',
			'WindsAlacrity', 'ForestsSerenity', 'FlamesAggression', 'MountainsTenacity', 'Destiny',
		];
		Object.keys(MEOWFFICERS).forEach((name) => {
			const data = MEOWFFICERS[name];
			const sp = Common.td('', { class: ['abilities', 'sp'] });
			const abilities = Common.td('', { class: 'abilities' });
			const shipType = new (<{ new (): ShipTypeElement }> customElements.get('ship-type'))();
			shipType.type = data.target;
			const tr = Common.tr(
				{ class: ['rarelity', `back_${data.rarelity}`] },
				Common.td('', { class: ['icon', name] }),
				Common.td(data.name),
				Common.td('', { class: data.nation }),
				Common.td('', { class: `type${data.type}` }),
				Common.td(shipType),
				sp,
				abilities,
			);
			data.abilities.forEach((ability) => {
				const data = Meowfficer.search(ability);
				if (!data) {
					return;
				}
				const button = createMeowfficerAbility(data);
				button.title = Meowfficer.convertNameJa(data, data.lv ? 1 : 0);
				button.option = true;
				const name = Meowfficer.convertName(data, data.lv ? 1 : 0);
				button.addEventListener('click', () => {
					(<HTMLElement> document.getElementById(name)).scrollIntoView({ behavior: 'smooth' });
				});
				abilities.appendChild(button);
			});
			if (data.abilities2) {
				data.abilities2.forEach((ability) => {
					const data = Meowfficer.search(ability);
					if (!data) {
						return;
					}
					const button = createMeowfficerAbility(data, 2);
					button.title = Meowfficer.convertNameJa(data, 2);
					button.option = true;
					const name = Meowfficer.convertName(data, 2);
					button.addEventListener('click', () => {
						(<HTMLElement> document.getElementById(name)).scrollIntoView({ behavior: 'smooth' });
					});
					abilities.appendChild(button);
				});
			}
			Meowfficer.sort(abilities);
			const list = [];
			for (const ability of abilities.children) {
				if (SP.includes((<MeowfficerAbilityElement> ability).type)) {
					list.push(ability);
				}
			}
			for (const button of list) {
				sp.appendChild(button);
			}

			tbody.appendChild(tr);
		});

		const header = Common.tr(
			{},
			Common.td(''),
			Common.td('名前', { class: 'name' }),
			Common.td('所属', { class: 'nation' }),
			Common.td('タイプ', { class: 'type' }),
			Common.td('艦種', { class: 'ship' }),
			Common.td('初期アビリティ', { colSpan: 2 }),
		);

		const thead = document.createElement('thead');
		thead.appendChild(header);

		const table = document.createElement('table');
		table.classList.add('meowfficers');
		table.appendChild(thead);
		table.appendChild(tbody);

		parent.appendChild(table);

		const abilities = document.createElement('table');
		abilities.classList.add('abilities');
		Meowfficer.ABILITIES.forEach((ability) => {
			const max = 0 < ability.lv ? 3 : 1;
			for (let lv = 1; lv <= max; ++lv) {
				const icon = createMeowfficerAbility(ability, max === 1 ? 0 : <1 | 2 | 3> lv);
				const name = Meowfficer.convertName(ability, <0 | 1 | 2 | 3> lv);
				abilities.appendChild(Common.tr(
					{ id: name, class: name },
					Common.td(icon),
					Common.td(Meowfficer.convertNameJa(ability, <0 | 1 | 2 | 3> lv)),
					Common.td(Meowfficer.getSkillInfo(ability, <0 | 1 | 2 | 3> lv), { isHTML: true }),
				));
			}
		});
		Meowfficer.sort(abilities);

		parent.appendChild(abilities);
	});
}
