declare const SIREN_OPERATION_SHOP: { price: number; amount: number; name: string }[];

function DrawSirenOperationShop(parent: HTMLTableElement) {
	function createTd(contents?: string | HTMLElement) {
		const td = document.createElement('td');
		if (contents) {
			if (typeof contents === 'string') {
				td.textContent = contents;
			} else {
				td.appendChild(contents);
			}
		}
		return td;
	}

	setTimeout(() => {
		const list: { check: HTMLInputElement; price: number; amount: HTMLInputElement }[] = [];

		const tfoot = document.createElement('tfoot');
		const update = ((parent) => {
			const tr = document.createElement('tr');

			const total = createTd('合計');
			total.colSpan = 2;
			const td = createTd();
			td.colSpan = 2;
			tr.appendChild(total);
			tr.appendChild(td);

			parent.appendChild(tr);
			return () => {
				let total = 0;
				for (const data of list) {
					if (data.check.checked) {
						total += data.price * parseInt(data.amount.value);
					}
				}
				td.textContent = total + '';
			};
		})(tfoot);

		const thead = ((parent) => {
			const tr = document.createElement('tr');

			tr.appendChild(createTd());
			tr.appendChild(createTd('名前'));
			tr.appendChild(createTd('値段'));
			tr.appendChild(createTd('個数'));

			parent.appendChild(tr);
			return parent;
		})(document.createElement('thead'));

		const tbody = document.createElement('tbody');
		for (const data of SIREN_OPERATION_SHOP) {
			const check = document.createElement('input');
			check.type = 'checkbox';
			check.checked = true;
			check.addEventListener('change', update);
			const label = document.createElement('label');
			label.appendChild(check);

			const amount = document.createElement('input');
			amount.type = 'number';
			amount.step = '1';
			amount.min = '0';
			amount.max = data.amount + '';
			amount.value = data.amount + '';
			amount.addEventListener('change', update);

			const tr = document.createElement('tr');
			tr.appendChild(createTd(label));
			tr.appendChild(createTd(data.name));
			tr.appendChild(createTd(data.price + ''));
			tr.appendChild(createTd(amount));

			tbody.appendChild(tr);
			list.push({
				check: check,
				price: data.price,
				amount: amount,
			});
		}

		parent.appendChild(thead);
		parent.appendChild(tbody);
		parent.appendChild(tfoot);

		update();
	}, 0);
}
