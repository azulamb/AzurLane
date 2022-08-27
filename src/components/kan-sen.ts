/* */
interface KANSEN_INFO_OPTION {
	mu?: boolean;
	battleship?: boolean;
	research?: boolean;
	retrofit?: boolean | KANSEN_TYPE;
}
interface KANSEN_INFO extends KANSEN_INFO_OPTION {
	name: string;
	type: KANSEN_TYPE;
	rarity: KANSEN_RARITY;
}
interface KANSEN_INFO_DETAIL extends KANSEN_INFO {
	fullkey: string;
	key: string;
	fleet: KANSEN_FLEET_TYPE;
	url: string;
	affiliation: AFFILIATION_TYPE;
}
interface KANSEN_JSON {
	[keys: string]: {
		[keys: string]: KANSEN_INFO;
	};
}

type KANSEN_RARITY = 'N' | 'R' | 'SR' | 'SSR' | 'UR';
type KANSEN_ALL_RARITY = KANSEN_RARITY | 'PR' | 'DR';

type KANSEN_TYPE =
	| 'destroyer'
	| 'ddg'
	| 'light_cruiser'
	| 'heavy_cruiser'
	| 'large_cruiser'
	| 'munition_ship'
	| 'battleship'
	| 'battlecruiser'
	| 'aviation_battleship'
	| 'light_aircraft_carrier'
	| 'aircraft_carrier'
	| 'monitor'
	| 'repair_ship'
	| 'submarine'
	| 'submarine_carrier';
type KANSEN_FLEET_TYPE = 'main' | 'vanguard' | 'submarine';
type AFFILIATION_TYPE = 'uss' | 'hms' | 'ijn' | 'kms' | 'pran' | 'rn' | 'sn' | 'ffnf' | 'mnf' | 'meta' | 'other';
type ALL_AFFILIATION_TYPE =
	| 'union'
	| 'eagleunion'
	| 'eagle_union'
	| 'royal'
	| 'royalnavy'
	| 'royal_navy'
	| 'sakura'
	| 'sakuraempire'
	| 'sakura_empire'
	| 'ironblood'
	| 'iron_blood'
	| 'dragon'
	| 'dragonempery'
	| 'dragon_empery'
	| 'sardegna'
	| 'sardegnaempire'
	| 'sardegna_empire'
	| 'northern'
	| 'northernparliament'
	| 'northern_parliament'
	| 'iris'
	| 'irislibre'
	| 'iris_libre'
	| 'vichya'
	| 'vichyadominion'
	| 'vichya_dominion'
	| 'venus'
	| 'venusvacation'
	| 'venus_vacation'
	| 'imas'
	| 'idolmaster'
	| 'ssss'
	| 'neptunia'
	| 'utaware'
	| 'utawarerumono'
	| 'kizunaai'
	| 'kizuna_ai'
	| 'holo'
	| 'hololive'
	| 'univ'
	| 'universal'
	| AFFILIATION_TYPE;

type KANSEN_OPTION = 'mu' | 'battleship' | 'main' | 'vanguard';

interface KansenElementClass {
	new (): KanSenElement;
	readonly kansen: KANSEN_JSON;
	list(type: KANSEN_FLEET_TYPE): KANSEN_INFO_DETAIL[];
}

interface KanSenElement extends HTMLElement {
	fleet: KANSEN_FLEET_TYPE | '';
	affiliation: ALL_AFFILIATION_TYPE | '';
	name: string;
	retrofit: boolean;
	option: KANSEN_OPTION | '';
	reset(): this;
	readonly fullkey: string;
	readonly icon: string;
}

((script, init) => {
	const baseDir = script.dataset.kansen || new URL('./kansen', script.src).toString();
	if (document.readyState !== 'loading') {
		return init(script, baseDir);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script, baseDir);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement, baseDir: string) => {
	try {
		new URL(baseDir);
	} catch (error) {
		baseDir = new URL(baseDir, script.src).toString();
	}

	const loader = fetch(`${baseDir}/list.json`).then((response): Promise<KANSEN_JSON> => {
		if (response.ok) {
			return response.json();
		}
		throw new Error(`Error: ${response.statusText}(${response.status})`);
	}).catch((error) => {
		console.error(error);
		return <KANSEN_JSON> {};
	});

	const KANSEN_RARITYS: KANSEN_RARITY[] = ['N', 'R', 'SR', 'SSR', 'UR'];
	const KANSEN_TYPES: KANSEN_TYPE[] = [
		'destroyer',
		'ddg',
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
	const KANSEN_FLEET_TYPES: KANSEN_FLEET_TYPE[] = ['main', 'vanguard', 'submarine'];
	const KANSEN_FLEET_MAIN = [
		'ddg',
		'battleship',
		'battlecruiser',
		'aviation_battleship',
		'light_aircraft_carrier',
		'aircraft_carrier',
		'monitor',
		'repair_ship',
	];
	const KANSEN_FLEET_VANGUARD = [
		'destroyer',
		'ddg',
		'light_cruiser',
		'heavy_cruiser',
		'large_cruiser',
		'munition_ship',
	];
	const KANSEN_FLEET_SUBMARINE = [
		'submarine',
		'submarine_carrier',
	];
	const KANSEN_OPTIONS: KANSEN_OPTION[] = ['mu', 'battleship', 'main', 'vanguard'];
	const CONVERT_TABLE: { [keys: string]: AFFILIATION_TYPE } = {
		uss: 'uss',
		union: 'uss',
		eagleunion: 'uss',
		eagle_union: 'uss',
		hms: 'hms',
		royal: 'hms',
		royalnavy: 'hms',
		royal_navy: 'hms',
		ijn: 'ijn',
		sakura: 'ijn',
		sakuraempire: 'ijn',
		sakura_empire: 'ijn',
		kms: 'kms',
		ironblood: 'kms',
		iron_blood: 'kms',
		pran: 'pran',
		dragon: 'pran',
		dragonempery: 'pran',
		dragon_empery: 'pran',
		rn: 'rn',
		sardegna: 'rn',
		sardegnaempire: 'rn',
		sardegna_empire: 'rn',
		sn: 'sn',
		northern: 'sn',
		northernparliament: 'sn',
		northern_parliament: 'sn',
		ffnf: 'ffnf',
		iris: 'ffnf',
		irislibre: 'ffnf',
		iris_libre: 'ffnf',
		mnf: 'mnf',
		vichya: 'mnf',
		vichyadominion: 'mnf',
		vichya_dominion: 'mnf',
		meta: 'meta',
	};
	const AFFILIATION_TYPES: ALL_AFFILIATION_TYPE[] = [
		'uss',
		'union',
		'eagleunion',
		'eagle_union',
		'hms',
		'royal',
		'royalnavy',
		'royal_navy',
		'ijn',
		'sakura',
		'sakuraempire',
		'sakura_empire',
		'kms',
		'ironblood',
		'iron_blood',
		'pran',
		'dragon',
		'dragonempery',
		'dragon_empery',
		'rn',
		'sardegna',
		'sardegnaempire',
		'sardegna_empire',
		'sn',
		'northern',
		'northernparliament',
		'northern_parliament',
		'ffnf',
		'iris',
		'irislibre',
		'iris_libre',
		'mnf',
		'vichya',
		'vichyadominion',
		'vichya_dominion',
		'meta',
		'other',
		'venus',
		'venusvacation',
		'venus_vacation',
		'imas',
		'idolmaster',
		'ssss',
		'neptunia',
		'utaware',
		'utawarerumono',
		'kizunaai',
		'kizuna_ai',
		'holo',
		'hololive',
		'univ',
		'universal',
	];

	((component, tagname = 'kan-sen') => {
		if (customElements.get(tagname)) {
			return;
		}
		loader.then((kansen) => {
			component.kansen = kansen;
			customElements.define(tagname, component);
		});
	})(
		class KanSen extends HTMLElement implements KanSenElement {
			static kansen: KANSEN_JSON = {};

			static list(fleet: KANSEN_FLEET_TYPE) {
				const list: KANSEN_INFO_DETAIL[] = [];
				const TYPES = fleet === 'submarine' ? KANSEN_FLEET_SUBMARINE : fleet === 'main' ? KANSEN_FLEET_MAIN : KANSEN_FLEET_VANGUARD;

				const create = (detail: KANSEN_INFO_DETAIL) => {
					detail.name = this.createName(detail.name, detail);

					const option = detail.type === 'ddg' ? <'main' | 'vanguard'> detail.fleet : detail.mu ? 'mu' : detail.battleship ? 'battleship' : '';

					detail.fullkey = this.createFullKey(
						detail.key,
						detail.affiliation,
						{
							retrofit: !!detail.retrofit,
							option: option,
						},
					);

					detail.url = this.createURL(detail.key, detail.affiliation, {
						retrofit: !!detail.retrofit,
						option: option,
					});
					return detail;
				};
				Object.keys(this.kansen).forEach((affiliation: AFFILIATION_TYPE) => {
					const kansens = this.kansen[affiliation];
					Object.keys(kansens).forEach((name) => {
						const kansen = kansens[name];

						if (TYPES.includes(kansen.type)) {
							list.push(create({
								key: name,
								fullkey: '',
								fleet: fleet,
								url: '',
								affiliation: affiliation,
								name: kansen.name,
								type: kansen.type,
								rarity: kansen.rarity,
							}));

							if (kansen.mu) {
								list.push(create({
									key: name,
									fullkey: '',
									fleet: fleet,
									url: '',
									affiliation: affiliation,
									name: kansen.name,
									type: kansen.type,
									rarity: kansen.rarity,
									mu: true,
								}));
							}

							if (kansen.battleship) {
								list.push(create({
									key: name,
									fullkey: '',
									fleet: fleet,
									url: '',
									affiliation: affiliation,
									name: kansen.name,
									type: kansen.type,
									rarity: kansen.rarity,
									battleship: true,
								}));
							}
						}

						if (kansen.retrofit) {
							const type = typeof kansen.retrofit === 'string' ? kansen.retrofit : kansen.type;
							if (TYPES.includes(type)) {
								list.push(create({
									key: name,
									fullkey: '',
									fleet: fleet,
									url: '',
									affiliation: affiliation,
									name: kansen.name,
									type: type,
									rarity: KANSEN_RARITYS[KANSEN_RARITYS.indexOf(kansen.rarity) + 1],
									retrofit: true,
								}));
							}
						}
					});
				});

				list.sort((a, b) => {
					const ra = KANSEN_RARITYS.indexOf(a.rarity);
					const rb = KANSEN_RARITYS.indexOf(b.rarity);
					if (ra !== rb) {
						return rb - ra;
					}

					const ta = KANSEN_TYPES.indexOf(a.type);
					const tb = KANSEN_TYPES.indexOf(b.type);
					if (ta !== tb) {
						return ta - tb;
					}

					const aa = AFFILIATION_TYPES.indexOf(a.affiliation);
					const ab = AFFILIATION_TYPES.indexOf(b.affiliation);

					return aa - ab;
				});

				return list;
			}

			static createName(name: string, option: KANSEN_INFO_OPTION) {
				return `${name}${option.battleship ? '(戦艦)' : ''}${option.mu ? '(μ兵装)' : ''}${option.retrofit ? '改' : ''}`;
			}

			static createFullKey(name: string, affiliation: AFFILIATION_TYPE | '', option: { retrofit?: boolean; option: KANSEN_OPTION | '' }) {
				if (!name) {
					return '';
				}
				const op = `${option.retrofit ? '_retrofit' : ''}${option.option ? '_' + option.option : ''}`;

				return `${affiliation ? affiliation + ':' : ''}${name}${op}`;
			}

			static createURL(name: string, affiliation: AFFILIATION_TYPE, option: { retrofit?: boolean; option: KANSEN_OPTION | '' }) {
				if (!affiliation || !name) {
					return '';
				}
				const dir = CONVERT_TABLE[affiliation] || 'other';

				return `${baseDir}/${dir}/${this.createFullKey(name, '', option)}.png`;
			}

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
				].join('');

				if (this.hasAttribute('affiliation')) {
					this.affiliation = this.affiliation;
				}

				shadow.appendChild(style);

				this.update();
			}

			public reset() {
				this.removeAttribute('fleet');
				this.removeAttribute('name');
				this.removeAttribute('affiliation');
				this.removeAttribute('retrofit');
				this.removeAttribute('option');
				return this;
			}

			protected update() {
				const data = this.search(this.name, <AFFILIATION_TYPE> this.affiliation);
				if (!data) {
					return;
				}
				if (data.fleet !== this.fleet) {
					this.fleet = data.fleet;
				}
				this.affiliation = data.affiliation;
				if (data.retrofit !== this.retrofit) {
					this.retrofit = data.retrofit;
				}
				if (data.option !== this.option) {
					this.option = data.option;
				} else if (data.info.type === 'ddg') {
					this.option = data.fleet === 'main' ? 'main' : 'vanguard';
				}
				if (data.type === 'ddg') {
					this.fleet = data.fleet;
				} else {
					const fleet: KANSEN_FLEET_TYPE = KANSEN_FLEET_MAIN.includes(data.info.type)
						? 'main'
						: KANSEN_FLEET_SUBMARINE.includes(data.info.type)
						? 'submarine'
						: 'vanguard';
					if (this.fleet !== fleet) {
						this.fleet = fleet;
					}
				}
				if (data.name !== this.name) {
					this.name = data.name;
				}
			}

			protected searchFromAffiliation(name: string, affiliation: AFFILIATION_TYPE) {
				const option: {
					name: string;
					type: KANSEN_TYPE;
					retrofit: boolean;
					option: KANSEN_OPTION | '';
					fleet: KANSEN_FLEET_TYPE | '';
				} = {
					name: name,
					type: <KANSEN_TYPE> '',
					retrofit: !!name.match(/_retrofit(_vanguard|_main){0,1}$/),
					option: '',
					fleet: <KANSEN_FLEET_TYPE> name.replace(/^.+_(vanguard|main)$/, '$1'),
				};
				if (option.fleet === name) {
					option.fleet = '';
				}
				if (name.match(/_mu$/)) {
					option.option = 'mu';
				} else if (name.match(/_battleship$/)) {
					option.option = 'battleship';
				}
				name = name.replace(/(_vanguard|_main)$/, '').replace(/(_retrofit|_mu|_battleship)$/, '');
				option.name = name;

				const info = KanSen.kansen[affiliation];
				if (info && info[name]) {
					const kansen = info[name];
					const retrofit = kansen.retrofit;
					if (!retrofit) {
						option.retrofit = false;
					} else if (!option.retrofit) {
						option.retrofit = this.retrofit;
					}

					option.type = option.retrofit && typeof retrofit === 'string' ? retrofit : kansen.type;
					if (!option.fleet) {
						if (option.type === 'ddg') {
							option.fleet = this.fleet === 'vanguard' ? 'vanguard' : 'main';
							option.option = option.fleet;
						} else {
							option.fleet = KANSEN_FLEET_MAIN.includes(kansen.type)
								? 'main'
								: KANSEN_FLEET_SUBMARINE.includes(kansen.type)
								? 'submarine'
								: 'vanguard';
						}
					}
					return Object.assign(option, {
						affiliation: affiliation,
						info: kansen,
					});
				}

				return null;
			}
			protected search(name: string, affiliation?: AFFILIATION_TYPE) {
				if (name.match(/.+:.+/)) {
					let aff: string;
					[aff, name] = name.split(':');
					if (!affiliation) {
						affiliation = <AFFILIATION_TYPE> aff;
					}
				}

				if (affiliation) {
					const result = this.searchFromAffiliation(name, affiliation);
					return result;
				}

				const affiliations = <AFFILIATION_TYPE[]> Object.keys(KanSen.kansen);
				for (const affiliation of affiliations) {
					const result = this.searchFromAffiliation(name, affiliation);
					if (result) {
						return result;
					}
				}

				return null;
			}

			get fleet() {
				const type = <KANSEN_FLEET_TYPE> this.getAttribute('fleet') || '';
				return KANSEN_FLEET_TYPES.includes(type) ? type : '';
			}
			set fleet(value) {
				if (KANSEN_FLEET_TYPES.includes(<any> value)) {
					this.setAttribute('fleet', value);
				} else {
					this.removeAttribute('fleet');
				}
			}

			get affiliation() {
				const affiliation = <AFFILIATION_TYPE> this.getAttribute('affiliation') || '';
				return AFFILIATION_TYPES.includes(affiliation) ? affiliation : '';
			}
			set affiliation(value) {
				if (AFFILIATION_TYPES.includes(<AFFILIATION_TYPE> value)) {
					this.setAttribute('affiliation', value);
				} else {
					this.removeAttribute('affiliation');
				}
			}

			get name() {
				return this.getAttribute('name') || '';
			}
			set name(value) {
				if (value) {
					this.setAttribute('name', value);
				} else {
					this.removeAttribute('name');
				}
			}

			get retrofit() {
				return this.hasAttribute('retrofit');
			}
			set retrofit(value) {
				if (!value) {
					this.removeAttribute('retrofit');
				} else {
					this.setAttribute('retrofit', '');
				}
			}

			get option() {
				const option = <KANSEN_OPTION> this.getAttribute('option') || '';
				return KANSEN_OPTIONS.includes(option) ? option : '';
			}
			set option(value) {
				if (KANSEN_OPTIONS.includes(<KANSEN_OPTION> value)) {
					this.setAttribute('option', value);
				} else {
					this.removeAttribute('option');
				}
			}

			get fullkey() {
				return KanSen.createFullKey(this.name, this.affiliation, { retrofit: this.retrofit, option: <KANSEN_OPTION> this.option });
			}

			get icon() {
				return KanSen.createURL(this.name, <AFFILIATION_TYPE> this.affiliation, { retrofit: this.retrofit, option: <KANSEN_OPTION> this.option });
			}

			static get observedAttributes() {
				return ['name'];
			}

			public attributeChangedCallback(attrName: string, oldVal: any, newVal: any) {
				if (oldVal === newVal) {
					return;
				}

				this.update();
			}
		},
		script.dataset.tagname,
	);
});
