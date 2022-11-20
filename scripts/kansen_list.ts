import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.142.0/path/mod.ts';
import { createCanvas, ImageData, loadImage, SkImage } from 'https://deno.land/x/canvas@v1.4.1/mod.ts';

interface KansenData {
	name: string;
	type: string;
	rarity: string;
	mu?: boolean;
	battleship?: boolean;
	research?: boolean;
	retrofit?: boolean | string;
}

const meta = import.meta;

const targetDir = join(dirname(fromFileUrl(meta.url)), '../docs/components/kansen');
const outDir = join(dirname(fromFileUrl(meta.url)), '../docs/components/kansen');

console.log(targetDir);

const kansen: {
	[keys: string]: {
		[keys: string]: KansenData;
	};
} = await Deno.readTextFile(
	join(outDir, 'list.json'),
	//join(targetDir, 'list_.json'),
).then((result) => {
	return JSON.parse(result);
}).catch((error) => {
	console.error(error);
	return {};
});

const imgs: string[] = [];
for await (const dirEntry of Deno.readDir(targetDir)) {
	if (!dirEntry.isDirectory) {
		continue;
	}
	const affiliation = dirEntry.name;
	const dir = join(targetDir, affiliation);

	if (!kansen[affiliation]) {
		kansen[affiliation] = {};
	}

	for await (const dirEntry of Deno.readDir(dir)) {
		if (!dirEntry.isFile) {
			continue;
		}
		const file = dirEntry.name;
		if (!file.match(/\.png$/)) {
			continue;
		}
		imgs.push(join(dir, file));
		const fileName: string = file.split('.')[0];

		const key = fileName.replace(/(_vanguard|_main)$/, '').replace(/(_retrofit|_mu|_battleship)$/, '');
		//console.log(key);
		if (!kansen[affiliation][key]) {
			kansen[affiliation][key] = { name: '', type: '', rarity: '' };
		} else {
			if (!kansen[affiliation][key].name) {
				kansen[affiliation][key].name = '';
			}
			if (!kansen[affiliation][key].type) {
				kansen[affiliation][key].type = '';
			}
			if (!kansen[affiliation][key].rarity) {
				kansen[affiliation][key].rarity = '';
			}
		}
		if (fileName.match(/_mu/)) {
			kansen[affiliation][key].mu = true;
		}
		if (fileName.match(/_battleship/)) {
			kansen[affiliation][key].battleship = true;
		}
		if (fileName.match(/_retrofit/) && !kansen[affiliation][key].retrofit) {
			kansen[affiliation][key].retrofit = true;
		}
		const key2 = key.replace( /[A-Z]/g, ( c ) => {
			return String.fromCharCode( c.charCodeAt( 0 ) | 32 );
		} );
		if (key!==key2) {
			console.warn(`WARNING: ${key}`);
		}
	}
}

const canvas = createCanvas(140, 140);
const context = canvas.getContext('2d');
if (!context) {
	console.error('ERROR! cannot create canvas.');
} else {
	for (const file of imgs) {
		const image = await loadImage(file);
		context.clearRect(0, 0, 140, 140);
		context.drawImage(image, 0, 0, 140, 140);
		await Deno.writeTextFile(
			file.replace(targetDir, outDir).replace(/png$/, 'json'),
			JSON.stringify({ i: canvas.toDataURL() }),
		);
	}
}

/*const mdir = join(targetDir,'../meowfficer');
for await (const dirEntry of Deno.readDir(mdir)) {
	if (!dirEntry.isFile) {
		continue;
	}
	const file = dirEntry.name;
	if (!file.match(/\.png$/)) {
		continue;
	}
	const path = join(mdir, file);
	const image = await loadImage(path);
	context.clearRect(0, 0, 140, 140);
	context.drawImage(image, 0, 0, 140, 140);
	await Deno.writeTextFile(
		path.replace(/png$/, 'json'),
		JSON.stringify({ i: canvas.toDataURL()},
	));
}*/

//console.log(kansen);
console.log(join(targetDir, '../meowfficer'));

const sortAffiliationKeys = ['uss', 'hms', 'ijn', 'kms', 'pran', 'rn', 'sn', 'ffnf', 'mnf', 'meta'];
const sortRarityKeys: KANSEN_RARITY[] = ['N', 'R', 'SR', 'SSR', 'UR'];
const sortTypeKeys = [
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

//await Deno.writeTextFile(join(targetDir, 'list.json'), JSON.stringify(kansen, null, '\t'));

function RenderKansen(name: string, data: KansenData) {
	return `"${name}": ${
		//JSON.stringify(data, null, '\t').replace(/(\t+)/g, '\t$1').replace(/}$/, '\t}')
		JSON.stringify(data, null, '\t').replace(/(\t+)/g, '\t\t$1').replace(/}$/, '\t\t}')}`;
}

function RenderAffiliation(key: string, data: { [keys: string]: KansenData }) {
	const list = Object.keys(data);
	list.sort((a, b) => {
		const A = (sortTypeKeys.indexOf(data[a].type) + 1) || 9999;
		const B = (sortTypeKeys.indexOf(data[b].type) + 1) || 9999;
		if (A === B) {
			const RA = (sortRarityKeys.indexOf(<any> data[a].rarity || '') + 1) || 9999;
			const RB = (sortRarityKeys.indexOf(<any> data[b].rarity || '') + 1) || 9999;
			if (RA !== RB) {
				return RB - RA;
			}
			const x = parseInt(a.replace(/[^\d]/g, '')) || 0;
			const y = parseInt(b.replace(/[^\d]/g, '')) || 0;
			if (x && y) {
				return x - y;
			}
		}
		return A - B;
	});
	return `	"${key}": {\n\t\t${
		list.map((key) => {
			return RenderKansen(key, data[key]);
		}).join(',\n\t\t')
	}\n\t}`;
}

function RenderJSON() {
	const list = Object.keys(kansen).filter((key) => {
		return key !== 'other';
	});
	list.sort((a, b) => {
		const A = (sortAffiliationKeys.indexOf(a) + 1) || 9999;
		const B = (sortAffiliationKeys.indexOf(b) + 1) || 9999;
		return A - B;
	});
	list.push('other');
	return `{\n${
		list.map((key) => {
			return RenderAffiliation(key, kansen[key]);
		}).join(',\n')
	}\n}\n`;
}

await Deno.writeTextFile(join(targetDir, 'list.json'), RenderJSON());
