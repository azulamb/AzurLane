import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.142.0/path/mod.ts';

type SHIP_TYPE =
	| 'destroyer'
	| 'light_cruiser'
	| 'heavy_cruiser'
	| 'large_cruiser'
	| 'battlecruiser'
	| 'battleship'
	| 'light_aircraft_carrier'
	| 'aircraft_carrier'
	| 'aviation_battleship'
	| 'monitor'
	| 'submarine_carrier'
	| 'submarine'
	| 'repair_ship'
	| 'munition_ship'
	| 'sailing_frigate';
type NATION_TYPE =
	| 'eagle_union'
	| 'royal_navy'
	| 'sakura_empire'
	| 'iron_blood'
	| 'dragon_empery'
	| 'iris_libre'
	| 'northern_parliament'
	| 'sardegna_empire'
	| 'tempesta'
	| 'universal';
type EQUIP_RARITY = 'N' | 'R' | 'SR' | 'SSR' | 'UR';
type EQUIP_GROUP = 'destroyer_guns' | 'anti_submarine_warfare' | 'cargo';

interface EquipData {
	tier: number;
	star: number;
	rarity: EQUIP_RARITY;
}

interface EquipCommonData {
	name: string;
	group: EQUIP_GROUP;
	nation: NATION_TYPE;
	ship?: SHIP_TYPE[];
	limit?: number;
	list: EquipData[];
	kansen?: string[];
}

interface EquipDefaultEquipData {
	ship: string[];
	kansen: string[];
}

const sortTypeKeys: SHIP_TYPE[] = [
	'destroyer',
	'light_cruiser',
	'heavy_cruiser',
	'large_cruiser',
	'munition_ship',
	'battleship',
	'battlecruiser',
	'aviation_battleship',
	'light_aircraft_carrier',
	'aircraft_carrier',
	'monitor',
	'repair_ship',
	'submarine',
	'submarine_carrier',
];

const sortGroupKeys: EQUIP_GROUP[] = [
	'destroyer_guns',
	'anti_submarine_warfare',
	'cargo',
];

const meta = import.meta;

const targetDir = join(dirname(fromFileUrl(meta.url)), '../docs/components/equipment');
const outDir = join(dirname(fromFileUrl(meta.url)), '../docs/components/equipment');

console.log(targetDir);

const equip: {
	data: { [key in EQUIP_GROUP]: EquipDefaultEquipData };
	list: { [keys: string]: EquipCommonData };
} = await Deno.readTextFile(
	join(outDir, 'list.json'),
	//join(targetDir, 'list_.json'),
).then((result) => {
	return JSON.parse(result);
}).catch((error) => {
	console.error(error);
	return {};
});

for await (const dirEntry of Deno.readDir(targetDir)) {
	if (dirEntry.isDirectory) {
		continue;
	}

	const file = dirEntry.name;
	console.log(file);
	if (!file.match(/\.png$/)) {
		continue;
	}
	const nameParts = file.split('.')[0].split('_');
	const tierName = <string> nameParts.pop();
	const name = nameParts.join('_');
	if (!tierName.match(/^t[0-9]^/)) {
		console.error(`Name ERROR: ${file}`);
	}
	const tier = parseInt(tierName.substring(1));

	const data: EquipCommonData = {
		name: '',
		group: <any> '',
		nation: <any> '',
		list: [],
	};

	if (!equip.list[name]) {
		equip.list[name] = data;
	} else {
		equip.list[name] = Object.assign(data, equip.list[name]);
	}
	const item: EquipData = {
		tier: tier,
		star: 0,
		rarity: <any> '',
	};

	let newItem = true;
	for (let i = 0; i < equip.list[name].list.length; ++i) {
		if (equip.list[name].list[i].tier === item.tier) {
			equip.list[name].list[i] = Object.assign(item, equip.list[name].list[i]);
			newItem = false;
		}
	}
	if (newItem) {
		equip.list[name].list.push(item);
	}
	if (equip.list[name].ship) {
		(<SHIP_TYPE[]> equip.list[name].ship).sort((a, b) => {
			return sortTypeKeys.indexOf(a) - sortTypeKeys.indexOf(b);
		});
	}
	equip.list[name].list.sort((a, b) => {
		return a.tier - b.tier;
	});
}

console.log(equip);

function RenderDefaultEquip(data: EquipDefaultEquipData) {
	const keys = Object.keys(data);
	return keys.map((key) => {
		const d = data[<keyof EquipDefaultEquipData> key];
		return `			"${key}": ${JSON.stringify(d)}`;
	}).join(',\n');
}

function RenderData(data: { [key in EQUIP_GROUP]: EquipDefaultEquipData }) {
	const keys = Object.keys(data);
	return keys.map((key) => {
		const d = data[<EQUIP_GROUP> key];
		return `		"${key}": {\n${RenderDefaultEquip(d)}\n		}`;
	}).join(',\n');
}

function RenderEquips(data: EquipCommonData) {
	const keys = Object.keys(data).filter((key) => {
		return key !== 'list';
	});
	keys.sort();
	return keys.map((key) => {
		const value = data[<keyof EquipCommonData> key];
		return `			"${key}": ${JSON.stringify(value)}`;
	}).join(',\n') + `,\n			"list": [\n${
		data.list.map((item) => {
			return `				${JSON.stringify(item)}`;
		}).join(',\n')
	}\n			]`;
}

function RenderJSON() {
	const list = Object.keys(equip.list);
	list.sort((a, b) => {
		if (equip.list[a].group === equip.list[b].group) {
			return a < b ? -1 : 1;
		}
		return sortGroupKeys.indexOf(equip.list[a].group) - sortGroupKeys.indexOf(equip.list[b].group);
	});
	return `{\n	"data": {\n${RenderData(equip.data)}\n	},\n	"list": {\n${
		list.map((key) => {
			return `		"${key}": {\n${RenderEquips(equip.list[key])}\n		}`;
		}).join(',\n')
	}	\n	}\n}\n`;
}

await Deno.writeTextFile(join(targetDir, 'list.json'), RenderJSON());
