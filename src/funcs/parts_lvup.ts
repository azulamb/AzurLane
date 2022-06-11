declare const PARTS_NAMES: string[];
declare const PARTS_LVUP: {
	rarelity: number;
	list: {
		rarelity: number;
		num: number;
		money: number;
		ex?: { rarelity: number; num: number };
	}[];
}[];

function DrawPartsLvUp(parent: HTMLElement) {
	setTimeout(() => {
		PARTS_LVUP.forEach((item, index) => {
			const table = document.createElement('table');
			table.classList.add('parts');

			const caption = document.createElement('caption');
			caption.classList.add(`rarelity${item.rarelity}`);
			caption.textContent = (0 < index && item.rarelity + 1 !== PARTS_LVUP[index - 1].rarelity)
				? `★${item.rarelity}～★${PARTS_LVUP[index - 1].rarelity - 1} 装備`
				: `★${item.rarelity} 装備`;
			table.appendChild(caption);

			const tr = Common.tr(
				{},
				...[
					'LV',
					'パーツ',
					'個数',
					'資金',
					'合計',
				].map((title) => {
					return Common.td(title);
				}),
			);
			const thead = document.createElement('thead');
			thead.appendChild(tr);
			table.appendChild(thead);

			const tbody = document.createElement('tbody');
			table.appendChild(tbody);

			let lv = 0;
			let total = 0;
			item.list.forEach((item) => {
				total += item.money;

				const tr = Common.tr(
					{ class: `rarelity${item.rarelity}` },
					...[
						`+${++lv}`,
						PARTS_NAMES[item.rarelity - 1],
						item.num,
						item.money,
						total,
					].map((data) => {
						return Common.td(data + '');
					}),
				);

				(<HTMLTableCellElement> tr.children[1]).classList.add('parts');
				tbody.appendChild(tr);

				if (item.ex) {
					(<HTMLTableCellElement> tr.children[0]).rowSpan = 2;
					(<HTMLTableCellElement> tr.children[3]).rowSpan = 2;
					(<HTMLTableCellElement> tr.children[4]).rowSpan = 2;

					const trEx = Common.tr(
						{ class: `rarelity${item.ex.rarelity}` },
						...[
							PARTS_NAMES[item.ex.rarelity],
							item.ex.num,
						].map((data) => {
							return Common.td(data + '');
						}),
					);

					(<HTMLTableCellElement> trEx.children[0]).classList.add('parts', 'ex');
					tbody.appendChild(trEx);
				}
			});

			parent.appendChild(table);
		});
	}, 0);
}
