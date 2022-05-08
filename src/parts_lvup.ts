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
			table.classList.add('list');

			const caption = document.createElement('caption');
			caption.classList.add(`rarelity${item.rarelity}`);
			caption.textContent = (0 < index && item.rarelity + 1 !== PARTS_LVUP[index - 1].rarelity)
				? `★${item.rarelity}～★${PARTS_LVUP[index - 1].rarelity - 1} 装備`
				: `★${item.rarelity} 装備`;
			table.appendChild(caption);

			const tr = document.createElement('tr');
			[
				'LV',
				'パーツ',
				'個数',
				'資金',
				'累計',
			].forEach((title) => {
				const td = document.createElement('td');
				td.textContent = title;
				tr.appendChild(td);
			});
			const thead = document.createElement('thead');
			thead.appendChild(tr);
			table.appendChild(thead);

			const tbody = document.createElement('tbody');
			table.appendChild(tbody);

			let lv = 0;
			let total = 0;
			item.list.forEach((item) => {
				total += item.money;

				const tr = document.createElement('tr');
				tr.classList.add(`rarelity${item.rarelity}`);

				[
					`+${++lv}`,
					PARTS_NAMES[item.rarelity - 1],
					item.num,
					item.money,
					total,
				].forEach((data) => {
					const td = document.createElement('td');
					td.textContent = data + '';
					tr.appendChild(td);
				});

				(<HTMLTableCellElement> tr.children[1]).classList.add('parts');
				tbody.appendChild(tr);

				if (item.ex) {
					(<HTMLTableCellElement> tr.children[0]).rowSpan = 2;
					(<HTMLTableCellElement> tr.children[3]).rowSpan = 2;
					(<HTMLTableCellElement> tr.children[4]).rowSpan = 2;

					const trEx = document.createElement('tr');
					trEx.classList.add(`rarelity${item.ex.rarelity}`);

					[
						PARTS_NAMES[item.ex.rarelity],
						item.ex.num,
					].forEach((data) => {
						const td = document.createElement('td');
						td.textContent = data + '';
						trEx.appendChild(td);
					});

					(<HTMLTableCellElement> trEx.children[0]).classList.add('parts', 'ex');
					tbody.appendChild(trEx);
				}
			});

			parent.appendChild(table);
		});
	}, 0);
}
