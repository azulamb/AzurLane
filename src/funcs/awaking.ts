/// <reference path="../types.d.ts" />

const RARELITY_LIST: RARELITY[] = ['N', 'R', 'SR', 'SSR', 'UR'];
declare const AWAKING: {
	[K in RARELITY]: {
		money: number;
		chips: number;
		arrays?: number;
	};
}[];

function DrawAwaking(parent: HTMLElement) {
	setTimeout(() => {
		const total: { [K in RARELITY]: { chips: number; arrays: number; money: number } } = <any> {};

		const tbody = document.createElement('tbody');

		const theadLine = Common.tr(
			{},
			Common.td('', { colSpan: 2 }),
			...RARELITY_LIST.map((rarelity) => {
				return Common.td(rarelity);
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

			RARELITY_LIST.forEach((rarelity) => {
				const data = item[rarelity];
				chips.appendChild(Common.td(data.chips + '', { class: ['rarelity', `back_${rarelity}`] }));
				if (arrays) {
					arrays.appendChild(Common.td(data.arrays + '', { class: ['rarelity', `back_${rarelity}`] }));
				}
				money.appendChild(Common.td(data.money + '', { class: ['rarelity', `back_${rarelity}`] }));

				if (!total[rarelity]) {
					total[rarelity] = {
						chips: 0,
						arrays: 0,
						money: 0,
					};
				}
				total[rarelity].chips += data.chips;
				total[rarelity].arrays += data.arrays || 0;
				total[rarelity].money += data.money;
			});

			tbody.appendChild(chips);
			if (arrays) {
				tbody.appendChild(arrays);
			}
			tbody.appendChild(money);

			tbody.appendChild(Common.tr({ class: 'line' }, Common.td('', { colSpan: 2 + RARELITY_LIST.length })));
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

		RARELITY_LIST.forEach((rarelity) => {
			const data = total[rarelity];
			chips.appendChild(Common.td(data.chips + '', { class: ['rarelity', `back_${rarelity}`] }));
			arrays.appendChild(Common.td(data.arrays + '', { class: ['rarelity', `back_${rarelity}`] }));
			money.appendChild(Common.td(data.money + '', { class: ['rarelity', `back_${rarelity}`] }));
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
