declare const SIREN_SHOP_ITEMS: { [keys: string]: string };
declare const SIREN_PORTS: {
	ny_city: string;
	liverpool: string;
	gibraltar: string;
	st_petersburg: string;
};
interface SIREN_PORT_SHOP_ITEM_COIN {
	item: string;
	amount: number;
	count: number;
	coin: 300;
}
interface SIREN_PORT_SHOP_ITEM_TOKEN {
	item: string;
	amount: number;
	count: number;
	token: number;
}
type SIREN_PORT_SHOP_ITEM = SIREN_PORT_SHOP_ITEM_COIN | SIREN_PORT_SHOP_ITEM_TOKEN;
declare const SIREN_PORT_SHOP_ITEMS: {
	ny_city: SIREN_PORT_SHOP_ITEM[];
	liverpool: SIREN_PORT_SHOP_ITEM[];
	gibraltar: SIREN_PORT_SHOP_ITEM[];
	st_petersburg: SIREN_PORT_SHOP_ITEM[];
};
function DrawSirenOperationPortShop(parent: HTMLElement) {
	function addShopTable(key: 'ny_city' | 'liverpool' | 'gibraltar' | 'st_petersburg') {
		const list = SIREN_PORT_SHOP_ITEMS[key];

		const tbody = document.createElement('tbody');
		for (const item of list) {
			for (let i = 0; i < item.count; ++i) {
				const input = document.createElement('input');
				input.type = 'checkbox';
				const label = document.createElement('label');
				label.appendChild(input);

				tbody.appendChild(
					Common.tr(
						{},
						Common.td(label),
						Common.td(SIREN_SHOP_ITEMS[item.item]),
						Common.td(item.amount + ''),
						Common.td(`${(<SIREN_PORT_SHOP_ITEM_COIN> item).coin || ''}`),
						Common.td(`${(<SIREN_PORT_SHOP_ITEM_TOKEN> item).token || ''}`),
					),
				);
			}
		}

		const header = Common.tr(
			{},
			Common.td(''),
			Common.td('名前'),
			Common.td('個数'),
			Common.td('コイン'),
			Common.td('トークン'),
		);
		const thead = document.createElement('thead');
		thead.appendChild(header);
		const table = document.createElement('table');
		table.classList.add('siren_operation_port_shop');
		table.appendChild(thead);
		table.appendChild(tbody);

		return table;
	}

	setTimeout(() => {
		const h1 = document.createElement('h5');
		h1.textContent = SIREN_PORTS.ny_city;
		const h2 = document.createElement('h5');
		h2.textContent = SIREN_PORTS.liverpool;
		const h3 = document.createElement('h5');
		h3.textContent = SIREN_PORTS.gibraltar;
		const h4 = document.createElement('h5');
		h4.textContent = SIREN_PORTS.st_petersburg;
		parent.appendChild(h1);
		parent.appendChild(addShopTable('ny_city'));
		parent.appendChild(h2);
		parent.appendChild(addShopTable('liverpool'));
		parent.appendChild(h3);
		parent.appendChild(addShopTable('gibraltar'));
		parent.appendChild(h4);
		parent.appendChild(addShopTable('st_petersburg'));
	}, 0);
}
