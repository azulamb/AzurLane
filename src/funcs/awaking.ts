/// <reference path="../types.d.ts" />

const RARITY_LIST: RARITY[] = ['N', 'R', 'SR', 'SSR', 'UR'];
declare const AWAKING: {
	[K in RARITY]: {
		money: number;
		chips: number;
		arrays?: number;
	};
}[];

function DrawAwaking(parent: HTMLElement) {
	setTimeout(() => {
		const total: { [K in RARITY]: { chips: number; arrays: number; money: number } } = <any> {};

		const tbody = document.createElement('tbody');

		const theadLine = Common.tr(
			{},
			Common.td('', { colSpan: 2 }),
			...RARITY_LIST.map((rarity) => {
				return Common.td(rarity);
			}),
		);

		AWAKING.forEach((item, index) => {
			const chips = Common.tr({});
			const arrays = 4 <= index ? Common.tr({}) : null;
			const money = Common.tr({});

			chips.appendChild(Common.td(`LV ${100 + (index + 1) * 5}`, { rowSpan: 4 <= index ? 3 : 2 }));

			chips.appendChild(Common.td('Ⅰ'));
			chips.classList.add('chips');
			if (arrays) {
				arrays.appendChild(Common.td('Ⅱ'));
				arrays.classList.add('arrays');
			}
			money.appendChild(Common.td('資金'));
			money.classList.add('money');

			RARITY_LIST.forEach((rarity) => {
				const data = item[rarity];
				chips.appendChild(Common.td(data.chips + '', { class: ['rarity', `back_${rarity}`] }));
				if (arrays) {
					arrays.appendChild(Common.td(data.arrays + '', { class: ['rarity', `back_${rarity}`] }));
				}
				money.appendChild(Common.td(data.money + '', { class: ['rarity', `back_${rarity}`] }));

				if (!total[rarity]) {
					total[rarity] = {
						chips: 0,
						arrays: 0,
						money: 0,
					};
				}
				total[rarity].chips += data.chips;
				total[rarity].arrays += data.arrays || 0;
				total[rarity].money += data.money;
			});

			tbody.appendChild(chips);
			if (arrays) {
				tbody.appendChild(arrays);
			}
			tbody.appendChild(money);

			tbody.appendChild(Common.tr({ class: 'line' }, Common.td('', { colSpan: 2 + RARITY_LIST.length })));
		});

		const chips = Common.tr(
			{ class: 'chips' },
			Common.td('合計', { rowSpan: 3 }),
			Common.td('Ⅰ'),
		);
		const arrays = Common.tr(
			{ class: 'arrays' },
			Common.td('Ⅱ'),
		);
		const money = Common.tr(
			{ class: 'money' },
			Common.td('資金'),
		);
		tbody.appendChild(chips);
		tbody.appendChild(arrays);
		tbody.appendChild(money);

		RARITY_LIST.forEach((rarity) => {
			const data = total[rarity];
			chips.appendChild(Common.td(data.chips + '', { class: ['rarity', `back_${rarity}`] }));
			arrays.appendChild(Common.td(data.arrays + '', { class: ['rarity', `back_${rarity}`] }));
			money.appendChild(Common.td(data.money + '', { class: ['rarity', `back_${rarity}`] }));
		});

		const thead = document.createElement('thead');
		thead.appendChild(theadLine);

		const table = document.createElement('table');
		table.classList.add('awaking');

		table.appendChild(thead);
		table.appendChild(tbody);

		parent.appendChild(table);
	}, 0);
}
