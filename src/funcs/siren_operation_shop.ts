declare const SIREN_OPERATION_SHOP: { price: number; amount: number; name: string; img?: string }[];

function DrawSirenOperationShop(parent: HTMLTableElement) {
	setTimeout(() => {
		const list: { check: HTMLInputElement; price: number; amount: HTMLInputElement }[] = [];

		const tfoot = document.createElement('tfoot');
		const update = ((parent) => {
			const tr = Common.tr({});

			const total = Common.td('合計');
			total.colSpan = 2;
			const td = Common.td('', { colSpan: 2 });
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
			const tr = Common.tr({});

			tr.appendChild(Common.td(''));
			tr.appendChild(Common.td('名前'));
			tr.appendChild(Common.td('値段'));
			tr.appendChild(Common.td('個数'));

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
			label.classList.add('icon');
			if (data.img) {
				label.style.backgroundImage = `url(./operation_siren/${data.img}.png)`;
			}

			const amount = document.createElement('input');
			amount.type = 'number';
			amount.step = '1';
			amount.min = '0';
			amount.max = data.amount + '';
			amount.value = data.amount + '';
			amount.addEventListener('change', update);

			const tr = Common.tr({});
			tr.appendChild(Common.td(label));
			tr.appendChild(Common.td(data.name));
			tr.appendChild(Common.td(data.price + ''));
			tr.appendChild(Common.td(amount));

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
