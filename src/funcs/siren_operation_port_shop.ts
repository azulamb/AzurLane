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
interface ShopData {
	now: string;
	items: { [keys: string]: boolean };
}
function DrawSirenOperationPortShop(parent: HTMLElement) {
	function load(): ShopData {
		try {
			const data = JSON.parse(localStorage.getItem('siren_shop_items') || '{}');
			if (typeof data !== 'object') {
				throw new Error('Invalid data.');
			}

			if (!data.now || typeof data.now !== 'string') {
				throw new Error('Invalid data.');
			}

			const now = new Date(data.now);
			if (Number.isNaN(now.valueOf())) {
				throw new Error('Invalid data.');
			}

			if (typeof data.items !== 'object') {
				data.items = {};
			}

			return data;
		} catch (error) {
			return {
				now: new Date().toISOString(),
				items: {},
			};
		}
	}
	function save(key?: string, check?: boolean) {
		const now = new Date();
		const data = load();
		let allUpdate = false;
		if (new Date(data.now).getMonth() !== now.getMonth()) {
			data.now = now.toISOString();
			data.items = {};
			allUpdate = true;
		}
		if (key !== undefined) {
			data.items[key] = !!check;
		}
		localStorage.setItem('siren_shop_items', JSON.stringify(data));
		return allUpdate;
	}
	function addShopTable(key: 'ny_city' | 'liverpool' | 'gibraltar' | 'st_petersburg') {
		const list = SIREN_PORT_SHOP_ITEMS[key];
		const inputs: HTMLInputElement[] = [];
		function update() {
			const items = load().items;
			for (const input of inputs) {
				if (items[input.name]) {
					input.checked = true;
				} else {
					input.checked = false;
				}
			}
		}

		const tbody = document.createElement('tbody');
		for (const item of list) {
			for (let i = 0; i < item.count; ++i) {
				const input = document.createElement('input');
				inputs.push(input);
				input.type = 'checkbox';
				input.name = `${key}_${item.item}_${item.amount}_${i}`;
				input.addEventListener('change', () => {
					if (save(input.name, input.checked)) {
						update();
					}
				});
				const label = document.createElement('label');
				label.classList.add('icon');
				label.style.backgroundImage = `url(./operation_siren/${item.item}.png)`;
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

		save();
		update();

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
		table.classList.add('siren_operation_port_shop', key);
		table.appendChild(thead);
		table.appendChild(tbody);

		return table;
	}

	setTimeout(() => {
		function click(target: string) {
			parent.dataset.target = target;
		}
		const h1 = document.createElement('h5');
		h1.textContent = SIREN_PORTS.ny_city;
		h1.dataset.target = 'ny_city';
		h1.addEventListener('click', () => {
			click(<string> h1.dataset.target);
		});
		const h2 = document.createElement('h5');
		h2.textContent = SIREN_PORTS.liverpool;
		h2.dataset.target = 'liverpool';
		h2.addEventListener('click', () => {
			click(<string> h2.dataset.target);
		});
		const h3 = document.createElement('h5');
		h3.textContent = SIREN_PORTS.gibraltar;
		h3.dataset.target = 'gibraltar';
		h3.addEventListener('click', () => {
			click(<string> h3.dataset.target);
		});
		const h4 = document.createElement('h5');
		h4.textContent = SIREN_PORTS.st_petersburg;
		h4.dataset.target = 'st_petersburg';
		h4.addEventListener('click', () => {
			click(<string> h4.dataset.target);
		});

		click('ny_city');

		const tab = document.createElement('div');
		tab.classList.add('tab');
		tab.appendChild(h1);
		tab.appendChild(h2);
		tab.appendChild(h3);
		tab.appendChild(h4);

		const contents = document.createElement('div');
		contents.classList.add('tab_contents');
		contents.appendChild(addShopTable('ny_city'));
		contents.appendChild(addShopTable('liverpool'));
		contents.appendChild(addShopTable('gibraltar'));
		contents.appendChild(addShopTable('st_petersburg'));

		parent.appendChild(tab);
		parent.appendChild(contents);
	}, 0);
}