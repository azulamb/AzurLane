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
declare type KANSEN_RARITY = 'N' | 'R' | 'SR' | 'SSR' | 'UR';
declare type KANSEN_ALL_RARITY = KANSEN_RARITY | 'PR' | 'DR';
declare type KANSEN_TYPE =
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
	| 'submarine_carrier'
	| 'sailing_frigate';
declare type KANSEN_FLEET_TYPE = 'main' | 'vanguard' | 'submarine';
declare type AFFILIATION_TYPE = 'uss' | 'hms' | 'ijn' | 'kms' | 'pran' | 'rn' | 'sn' | 'ffnf' | 'mnf' | 'mot' | 'meta' | 'other';
declare type ALL_AFFILIATION_TYPE =
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
	| 'mot'
	| 'tempesta'
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
declare type KANSEN_OPTION = 'mu' | 'battleship' | 'main' | 'vanguard';
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
