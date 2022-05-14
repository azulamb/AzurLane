/// <reference path="../types.d.ts" />
/// <reference path="../components/meowfficer-ability.ts" />

type NATIONS = 'IronBlood';
declare const MEOWFFICERS_SKILL: {};
declare const MEOWFFICERS: {
	[keys: string]: {
		name: string;
		rarelity: RARELITY;
		type: 0 | 1 | 2; // 無・参謀・指揮
		target: 'destroyer' | 'cruiser' | 'battleship' | 'carrier' | 'submarine';
		nation: NATIONS;
		logistics: { min: number; max: number };
		tactics: { min: number; max: number };
		directives: { min: number; max: number };
		skill: string;
		abilities: string[];
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
	setTimeout(() => {
		const tbody = document.createElement('tbody');

		Object.keys(MEOWFFICERS).forEach((name) => {
			const data = MEOWFFICERS[name];
			const abilities = Common.td('', { class: 'abilities' });
			const tr = Common.tr(
				{ class: ['rarelity', `back_${data.rarelity}`] },
				Common.td('', { class: ['icon', name] }),
				Common.td(data.name),
				Common.td('', { class: data.nation }),
				Common.td('', { class: `type${data.type}` }),
				Common.td('', { class: `${data.target}` }),
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
				abilities.appendChild(button);
			});
			Meowfficer.sort(abilities);

			tbody.appendChild(tr);
		});

		const header = Common.tr(
			{},
			Common.td(''),
			Common.td('名前', { class: 'name' }),
			Common.td('所属', { class: 'nation' }),
			Common.td('タイプ', { class: 'type' }),
			Common.td('艦種', { class: 'ship' }),
			Common.td('初期アビリティ'),
		);

		const thead = document.createElement('thead');
		thead.appendChild(header);

		const table = document.createElement('table');
		table.classList.add('meowfficers');
		table.appendChild(thead);
		table.appendChild(tbody);

		parent.appendChild(table);

		const abilities = document.createElement('table');
		Meowfficer.ABILITIES.forEach((ability) => {
			const max = 0 < ability.lv ? 3 : 1;
			for (let lv = 1; lv <= max; ++lv) {
				const icon = createMeowfficerAbility(ability, max === 1 ? 0 : <1 | 2 | 3> lv);
				const name = Meowfficer.convertName(ability, <0 | 1 | 2 | 3> lv);
				abilities.appendChild(Common.tr(
					{class: name},
					Common.td(icon),
					//Common.td(name),
					Common.td(Meowfficer.convertNameJa(ability, <0 | 1 | 2 | 3> lv)),
				));
			}
		});
		Meowfficer.sort(abilities);

		parent.appendChild(abilities);
	}, 0);
}
