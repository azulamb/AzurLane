/// <reference path="./common.ts" />

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
	function addShopTable(key: 'ny_city' | 'liverpool' | 'gibraltar' | 'st_petersburg', token: boolean) {
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
				const value = token ? (<SIREN_PORT_SHOP_ITEM_TOKEN> item).token : (<SIREN_PORT_SHOP_ITEM_COIN> item).coin;
				if (!value) {
					continue;
				}
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
						Common.td(`${value}`),
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
			Common.td(token ? 'トークン' : 'コイン'),
		);
		const thead = document.createElement('thead');
		thead.appendChild(header);
		const table = document.createElement('table');
		table.classList.add('siren_operation_port_shop', key);
		table.appendChild(thead);
		table.appendChild(tbody);

		return table;
	}
	function countWeekdaysInMonth(weekday: number, year: number, month: number) {
		const last = new Date(year, month, 0);
		const lastDay = last.getDate();
		if (lastDay === 28) {
			return 4;
		}
		const lastWeekDay = last.getDay();
		const firstWeekDay = (7 + lastWeekDay - (lastDay % 7) + 1) % 7;

		if (firstWeekDay <= lastWeekDay) {
			return firstWeekDay <= weekday && weekday <= lastWeekDay ? 5 : 4;
		}

		return weekday <= lastWeekDay || firstWeekDay <= weekday ? 5 : 4;
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
		contents.appendChild(addShopTable('ny_city', false));
		contents.appendChild(addShopTable('ny_city', true));
		contents.appendChild(addShopTable('liverpool', false));
		contents.appendChild(addShopTable('liverpool', true));
		contents.appendChild(addShopTable('gibraltar', false));
		contents.appendChild(addShopTable('gibraltar', true));
		contents.appendChild(addShopTable('st_petersburg', false));
		contents.appendChild(addShopTable('st_petersburg', true));

		const now = new Date();

		const schedule = document.createElement('div');
		schedule.classList.add('schedule');
		const updateSchedule = () => {
			schedule.innerHTML = '';
			const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
			for (let day = 0; day < lastDay; day += 3) {
				const button = document.createElement('button');
				const title = day + 1 < lastDay ? `${day + 1}-${day + 3}` : `${lastDay}`;
				button.title = title;
				if (day + 1 <= now.getDate() && now.getDate() <= day + 3) {
					button.classList.add('now');
					const progress = day + 3 - now.getDate();
					button.dataset.progress = `${progress}`;
				} else if (day + 3 < now.getDate()) {
					button.disabled = true;
				}
				button.textContent = <string> title.split('-').shift();
				schedule.appendChild(button);
			}
		};
		updateSchedule();
		schedule.addEventListener('click', updateSchedule);

		const strongholds = document.createElement('div');
		strongholds.classList.add('strongholds');
		function updateStrongholds() {
			strongholds.innerHTML = '';
			const strongholdsCount = countWeekdaysInMonth(1, now.getFullYear(), now.getMonth() + 1) + 1 + (now.getDay() === 1 ? 0 : 1);
			const firstWeekDay = (7 + now.getDay() - (now.getDate() % 7) + 1) % 7;
			for (let stronghold = 0; stronghold < strongholdsCount; ++stronghold) {
				const span = document.createElement('span');
				span.textContent = '🌀';
				strongholds.appendChild(span);
				if (now.getDate() < firstWeekDay + (stronghold - 1) * 7) {
					span.classList.add('no');
				}
			}
		}
		updateStrongholds();
		strongholds.addEventListener('click', updateStrongholds);

		parent.appendChild(schedule);
		parent.appendChild(strongholds);
		parent.appendChild(tab);
		parent.appendChild(contents);
	}, 0);
}
