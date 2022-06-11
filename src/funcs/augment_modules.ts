/// <reference path="../types.d.ts" />

declare const AUGMENT_MODULE_LVUP: {
	R: { exp: number; money: number; core?: number };
	SR?: { exp: number; money: number; core?: number };
	SSR?: { exp: number; money: number; core?: number };
}[];

function AugmentModules(parent: HTMLElement) {
	setTimeout(() => {
		const total = {
			R: { exp: 0, money: 0, core: 0 },
			SR: { exp: 0, money: 0, core: 0 },
			SSR: { exp: 0, money: 0, core: 0 },
		};
		const tbody = document.createElement('tbody');

		const theadLine = Common.tr(
			{},
			Common.td('LV', { rowSpan: 2 }),
			...['R', 'SR', 'SSR'].map((rarelity) => {
				return Common.td(rarelity, { colSpan: 3 });
			}),
		);
		const subTheadLine = Common.tr(
			{},
			...['経験値', '資金', 'ｺｱ', '経験値', '資金', 'ｺｱ', '経験値', '資金', 'ｺｱ'].map((title, index) => {
				return Common.td(title, index % 3 === 2 ? { class: 'core' } : undefined);
			}),
		);

		const SP_TITLE = {
			0: '作成',
			11: '進化',
		};

		AUGMENT_MODULE_LVUP.forEach((item, index) => {
			if (0 < index) {
				total.R.exp += item.R.exp;
				total.R.money += item.R.money;
				total.R.core += item.R.core || 0;
				if (item.SR) {
					total.SR.exp += item.SR.exp;
					total.SR.money += item.SR.money;
					total.SR.core += item.SR.core || 0;
				}
				if (item.SSR) {
					total.SSR.exp += item.SSR.exp;
					total.SSR.money += item.SSR.money;
					total.SSR.core += item.SSR.core || 0;
				}
			}

			const tr = Common.tr(
				{},
				Common.td(SP_TITLE[<0 | 11> index] || `${index}`),
				Common.td(`${item.R.exp}`),
				Common.td(`${item.R.money}`, { class: 'money' }),
				Common.td(item.R.core ? `${item.R.core}` : '', { class: 'core' }),
				Common.td(item.SR ? `${item.SR.exp}` : ''),
				Common.td(item.SR ? `${item.SR.money}` : '', { class: 'money' }),
				Common.td(item.SR?.core ? `${item.SR.core}` : '', { class: 'core' }),
				Common.td(item.SSR ? `${item.SSR.exp}` : ''),
				Common.td(item.SSR ? `${item.SSR.money}` : '', { class: 'money' }),
				Common.td(item.SSR?.core ? `${item.SSR.core}` : '', { class: 'core' }),
			);
			tbody.appendChild(tr);

			if (SP_TITLE[<0 | 11> index]) {
				tbody.appendChild(Common.tr({ class: 'line' }, Common.td('', { colSpan: 10 })));
			} else if (index === AUGMENT_MODULE_LVUP.length - 2) {
				tbody.appendChild(Common.tr(
					{},
					Common.td('強化合計'),
					Common.td(`${total.R.exp}`),
					Common.td(`${total.R.money}`, { class: 'money' }),
					Common.td(total.R.core ? `${total.R.core}` : '', { class: 'core' }),
					Common.td(`${total.SR.exp}`),
					Common.td(`${total.SR.money}`, { class: 'money' }),
					Common.td(total.SR.core ? `${total.SR.core}` : '', { class: 'core' }),
					Common.td(`${total.SSR.exp}`),
					Common.td(`${total.SSR.money}`, { class: 'money' }),
					Common.td(total.SSR.core ? `${total.SSR.core}` : '', { class: 'core' }),
				));
				tbody.appendChild(Common.tr({ class: 'line' }, Common.td('', { colSpan: 10 })));
			}
		});

		total.R.exp += AUGMENT_MODULE_LVUP[0].R.exp;
		total.R.money += AUGMENT_MODULE_LVUP[0].R.money;
		total.R.core += AUGMENT_MODULE_LVUP[0].R?.core || 0;
		total.SR.exp += AUGMENT_MODULE_LVUP[0].SR?.exp || 0;
		total.SR.money += AUGMENT_MODULE_LVUP[0].SR?.money || 0;
		total.SR.core += AUGMENT_MODULE_LVUP[0].SR?.core || 0;
		total.SSR.exp += AUGMENT_MODULE_LVUP[0].SSR?.exp || 0;
		total.SSR.money += AUGMENT_MODULE_LVUP[0].SSR?.money || 0;
		total.SSR.core += AUGMENT_MODULE_LVUP[0].SSR?.core || 0;

		tbody.appendChild(Common.tr(
			{},
			Common.td('合計'),
			Common.td(`${total.R.exp}`),
			Common.td(`${total.R.money}`, { class: 'money' }),
			Common.td(`${total.R.core}`, { class: 'core' }),
			Common.td(`${total.SR.exp}`),
			Common.td(`${total.SR.money}`, { class: 'money' }),
			Common.td(`${total.SR.core}`, { class: 'core' }),
			Common.td(`${total.SSR.exp}`),
			Common.td(`${total.SSR.money}`, { class: 'money' }),
			Common.td(`${total.SSR.core}`, { class: 'core' }),
		));

		const thead = document.createElement('thead');
		thead.appendChild(theadLine);
		thead.appendChild(subTheadLine);

		const table = document.createElement('table');
		table.classList.add('augment_module_lvup');

		table.appendChild(thead);
		table.appendChild(tbody);

		parent.appendChild(table);
	}, 0);
}
