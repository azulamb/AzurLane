/* */

type MEOWFFICERS_LV = MEOWFFICERS_LV1 | MEOWFFICERS_LV2;
type MEOWFFICERS_LV1 = 'Rookie' | 'Adept' | 'Ace';
type MEOWFFICERS_LV2 = 'Rookie' | 'Elite' | 'Chief';
type MEOWFFICERS_TYPE =
	| 'Artillery'
	| 'Torpedo'
	| 'Aviation'
	| 'AntiAir'
	| 'Sonar'
	| 'Loading'
	| 'Mechanic'
	| 'Engineer'
	| 'Lookout'
	| 'Helmsman'
	| 'Officer'
	| 'TirelessWarrior'
	| 'SoulfulWarrior'
	| 'HeartOfTheTorpedo'
	| 'AcePilot'
	| 'AlphaWolf'
	| 'RisingStar'
	| 'BestFriend'
	| 'WindsAlacrity'
	| 'ForestsSerenity'
	| 'FlamesAggression'
	| 'MountainsTenacity'
	| 'Miracle'
	| 'Destiny';
type MEOWFFICERS_TARGET =
	| 'Vanguard'
	| 'Small'
	| 'Destroyer'
	| 'Medium'
	| 'Cruiser'
	| 'Main'
	| 'Large'
	| 'Battleship'
	| 'Carrier'
	| 'Submarine'
	| 'SS'
	| 'Special'
	| 'Union'
	| 'Royal'
	| 'Sakura'
	| 'IronBlood';
interface MEOWFFICERS_ABILITY {
	type: MEOWFFICERS_TYPE;
	target?: MEOWFFICERS_TARGET;
	name: string;
	name_ja: string;
	lv: number;
}

class Meowfficer {
	static LV: MEOWFFICERS_LV[] = ['Rookie', 'Adept', 'Elite', 'Ace', 'Chief'];
	static LV1: MEOWFFICERS_LV1[] = ['Rookie', 'Adept', 'Ace'];
	static LV2: MEOWFFICERS_LV2[] = ['Rookie', 'Elite', 'Chief'];
	static TYPES: MEOWFFICERS_TYPE[] = [
		'BestFriend',
		'RisingStar',
		'Miracle',
		'Destiny',
		'WindsAlacrity',
		'ForestsSerenity',
		'FlamesAggression',
		'MountainsTenacity',
		'Officer',
		'Artillery',
		'Torpedo',
		'Aviation',
		'Mechanic',
		'AntiAir',
		'Sonar',
		'Loading',
		'Lookout',
		'Helmsman',
		'Engineer',
		'TirelessWarrior',
		'SoulfulWarrior',
		'HeartOfTheTorpedo',
		'AcePilot',
		'AlphaWolf',
	];
	static TARGETS: MEOWFFICERS_TARGET[] = [
		'Vanguard',
		'Small',
		'Destroyer',
		'Medium',
		'Cruiser',

		'SS',
		'Submarine',

		'Main',
		'Large',
		'Battleship',
		'Carrier',
		'Special',

		'Union',
		'Royal',
		'Sakura',
		'IronBlood',
	];
	static ABILITIES: MEOWFFICERS_ABILITY[] = [
		{ type: 'BestFriend', name: 'T', name_ja: 'T', lv: 0 },
		{ type: 'RisingStar', name: 'T', name_ja: 'T', lv: 0 },
		{ type: 'Miracle', name: 'T', name_ja: 'T', lv: 0 },
		{ type: 'Destiny', name: 'T', name_ja: 'T', lv: 0 },
		{ type: 'WindsAlacrity', name: 'T', name_ja: 'T', lv: 0 },
		{ type: 'ForestsSerenity', name: 'T', name_ja: 'T', lv: 0 },
		{ type: 'FlamesAggression', name: 'T', name_ja: 'T', lv: 0 },
		{ type: 'MountainsTenacity', name: 'T', name_ja: 'T', lv: 0 },
		{ type: 'AntiAir', target: 'Vanguard', name: 'TLS', name_ja: 'T・S', lv: 3 },
		{ type: 'Sonar', target: 'Vanguard', name: 'TLS', name_ja: 'lT・S', lv: 3 },
		{ type: 'Lookout', target: 'Vanguard', name: 'LTS', name_ja: 'lT・S', lv: 3 },
		{ type: 'Helmsman', target: 'Small', name: 'LTS', name_ja: 'T・S', lv: 3 },
		{ type: 'Officer', target: 'Destroyer', name: 'lTS', name_ja: 'OT・S', lv: 3 },
		{ type: 'Artillery', target: 'Destroyer', name: 'TLS', name_ja: 'LT・S', lv: 3 },
		{ type: 'Torpedo', target: 'Destroyer', name: 'TLS', name_ja: 'LT・S', lv: 3 },
		{ type: 'Loading', target: 'Destroyer', name: 'TLS', name_ja: 'rT・S', lv: 3 },
		{ type: 'Engineer', target: 'Destroyer', name: 'LTS', name_ja: 'LT・S', lv: 3 },
		{ type: 'Helmsman', target: 'Medium', name: 'LTS', name_ja: 'T・S', lv: 3 },
		{ type: 'Officer', target: 'Cruiser', name: 'lTS', name_ja: 'OT・S', lv: 3 },
		{ type: 'Artillery', target: 'Cruiser', name: 'TLS', name_ja: 'LT・S', lv: 3 },
		{ type: 'Torpedo', target: 'Cruiser', name: 'TLS', name_ja: 'LT・S', lv: 3 },
		{ type: 'Loading', target: 'Cruiser', name: 'TLS', name_ja: 'rT・S', lv: 3 },
		{ type: 'Engineer', target: 'Cruiser', name: 'LTS', name_ja: 'LT・S', lv: 3 },
		{ type: 'Torpedo', target: 'SS', name: 'TLS', name_ja: 'LT・S', lv: 3 },
		{ type: 'Engineer', target: 'SS', name: 'LTS', name_ja: 'LT・S', lv: 3 },
		{ type: 'Officer', target: 'Submarine', name: 'lTS', name_ja: 'OT・S', lv: 3 },
		{ type: 'Loading', target: 'Submarine', name: 'TLS', name_ja: 'rT・S', lv: 3 },
		{ type: 'Lookout', target: 'Submarine', name: 'LTS', name_ja: 'lT・S', lv: 3 },
		{ type: 'Artillery', target: 'Main', name: 'TLS', name_ja: 'LT・S', lv: 3 },
		{ type: 'AntiAir', target: 'Main', name: 'TLS', name_ja: 'T・S', lv: 3 },
		{ type: 'Sonar', target: 'Main', name: 'TLS', name_ja: 'lT・S', lv: 3 },
		{ type: 'Lookout', target: 'Main', name: 'LTS', name_ja: 'lT・S', lv: 3 },
		{ type: 'Helmsman', target: 'Large', name: 'LTS', name_ja: 'T・S', lv: 3 },
		{ type: 'Officer', target: 'Battleship', name: 'lTS', name_ja: 'OT・S', lv: 3 },
		{ type: 'Loading', target: 'Battleship', name: 'TLS', name_ja: 'rT・S', lv: 3 },
		{ type: 'Engineer', target: 'Battleship', name: 'LTS', name_ja: 'LT・S', lv: 3 },
		{ type: 'Officer', target: 'Carrier', name: 'lTS', name_ja: 'OT・S', lv: 3 },
		{ type: 'Mechanic', name: 'LT', name_ja: 'lT', lv: 3 },
		{ type: 'Aviation', target: 'Carrier', name: 'TLS', name_ja: 'aT・S', lv: 3 },
		{ type: 'Engineer', target: 'Carrier', name: 'LTS', name_ja: 'LT・S', lv: 3 },
		{ type: 'Aviation', target: 'Special', name: 'TLS', name_ja: 'aT・S', lv: 3 },
		{ type: 'Loading', target: 'Special', name: 'TLS', name_ja: 'lT・S', lv: 3 },
		{ type: 'Engineer', target: 'Special', name: 'LTS', name_ja: 'LT・S', lv: 3 },
		{ type: 'Officer', target: 'Union', name: 'lTS', name_ja: 'OT・S', lv: 3 },
		{ type: 'Officer', target: 'Royal', name: 'lTS', name_ja: 'OT・S', lv: 3 },
		{ type: 'Officer', target: 'Sakura', name: 'lTS', name_ja: 'OT・S', lv: 3 },
		{ type: 'Officer', target: 'IronBlood', name: 'lTS', name_ja: 'OT・S', lv: 3 },
		{ type: 'TirelessWarrior', name: 'T', name_ja: 'T', lv: 0 },
		{ type: 'SoulfulWarrior', name: 'T', name_ja: 'T', lv: 0 },
		{ type: 'HeartOfTheTorpedo', name: 'T', name_ja: 'T', lv: 0 },
		{ type: 'AcePilot', name: 'T', name_ja: 'T', lv: 0 },
		{ type: 'AlphaWolf', name: 'T', name_ja: 'T', lv: 0 },
	];
	static ABILITY_INFO: {
		[keys: string]: {
			text: string;
			values?: number[];
		};
	} = {
		OfficerDestroyer: { text: '<span>駆逐</span>の雷装がXアップ、装填がYアップ', values: [8, 11, 16, 4, 5, 8] },
		OfficerCruiser: { text: '<span>軽巡</span>、<span>重巡</span>、<span>超巡</span>の火力がXアップ、<span>軽巡</span>、<span>重巡</span>の雷装がXアップ', values: [5, 7, 10] },
		OfficerBattleship: { text: '<span>巡戦</span>、<span>戦艦</span>の耐久がXアップ、火力がYアップ', values: [50, 70, 100, 8, 11, 16] },
		OfficerCarrier: { text: '</span>空母</span>の航空がXアップ、装填がYアップ', values: [10, 14, 20, 3, 4, 6] },
		OfficerSubmarine: { text: '<span>潜水艦</span>、<span>潜水空母</span>の雷装がXアップ、装填がYアップ', values: [10, 14, 20, 3, 4, 6] },
		OfficerUnion: { text: '<span>ユニオン</span>の対空がXアップ、航空がYアップ、装填がZアップ', values: [8, 11, 16, 8, 11, 16, 3, 4, 6] },
		OfficerRoyal: { text: '<span>ロイヤル</span>の火力がXアップ、対空がYアップ、回避がZアップ', values: [7, 10, 14, 8, 11, 16, 1, 2, 3] },
		OfficerSakura: { text: '<span>重桜</span>の雷装がXアップ、航空がYアップ、回避がZアップ', values: [8, 11, 16, 6, 8, 12, 1, 2, 3] },
		OfficerIronBlood: { text: '<span>鉄血</span>の火力がXアップ、雷装がYアップ、命中がZアップ', values: [6, 8, 12, 7, 10, 14, 1, 2, 3] },
		ArtilleryDestroyer: { text: '<span>駆逐</span>の火力がXアップ', values: [3, 4, 6] },
		ArtilleryCruiser: { text: '<span>軽巡</span>、<span>重巡</span>、<span>超巡</span>の火力がXアップ', values: [5, 7, 10] },
		ArtilleryMain: { text: '<span>巡戦</span>、<span>戦艦</span>、<span>航戦</span>、モニターの火力がXアップ', values: [8, 11, 16] },
		TorpedoDestroyer: { text: '<span>駆逐</span>の雷装がXアップ', values: [10, 14, 20] },
		TorpedoCruiser: { text: '<span>軽巡</span>、<span>重巡</span>の雷装がXアップ', values: [6, 8, 12] },
		TorpedoSS: { text: '<span>潜水艦</span>、<span>潜水空母</span>の雷装がXアップ', values: [10, 14, 20] },
		AviationCarrier: { text: '<span>軽母</span>、<span>空母</span>の航空がXアップ', values: [10, 14, 20] },
		AviationSpecial: { text: '<span>航戦</span>の航空がXアップ', values: [5, 7, 10] },
		AntiAirVanguard: { text: '<span>前衛</span>の対空がXアップ', values: [8, 11, 16] },
		AntiAirMain: { text: '<span>主力</span>の対空がXアップ', values: [10, 14, 20] },
		SonarVanguard: { text: '<span>前衛</span>の対潜がXアップ', values: [4, 5, 8] },
		SonarMain: { text: '<span>主力</span>の対潜がXアップ', values: [3, 4, 6] },
		LoadingDestroyer: { text: '	<span>駆逐</span>の装填がXアップ', values: [5, 7, 10] },
		LoadingCruiser: { text: '<span>軽巡</span>、<span>重巡</span>、<span>超巡</span>の装填がXアップ', values: [4, 5, 8] },
		LoadingBattleship: { text: '<span>戦艦</span>、<span>巡戦</span>、<span>航戦</span>の装填がXアップ', values: [3, 4, 6] },
		LoadingSubmarine: { text: '<span>潜水艦</span>、<span>潜水空母</span>の装填がXアップ', values: [3, 4, 6] },
		LoadingSpecial: { text: '<span>モニター</span>、<span>工作艦</span>の装填がXアップ', values: [3, 4, 6] },
		Mechanic: { text: '<span>軽母</span>、<span>空母</span>の装填がXアップ', values: [3, 4, 6] },
		LookoutVanguard: { text: '<span>前衛</span>の命中がXアップ', values: [3, 4, 6] },
		LookoutMain: { text: '<span>主力</span>の命中がXアップ', values: [1, 2, 3] },
		LookoutSubmarine: { text: '<span>潜水艦</span>、<span>潜水空母</span>の命中がXアップ', values: [2, 3, 5] },
		HelmsmanSmall: { text: '<span>潜水艦</span>、<span>潜水空母</span>、<span>駆逐</span>の回避がXアップ', values: [5, 7, 10] },
		HelmsmanMedium: { text: '<span>軽巡</span>、<span>重巡</span>、<span>軽母</span>、<span>モニター</span>、<span>工作艦</span>の回避がXアップ', values: [3, 4, 6] },
		HelmsmanLarge: { text: '<span>戦艦</span>、<span>巡戦</span>、<span>空母</span>、<span>航戦</span>、<span>超巡</span>の回避がXアップ', values: [1, 2, 3] },
		EngineerDestroyer: { text: '<span>駆逐</span>の耐久がXアップ', values: [30, 42, 60] },
		EngineerCruiser: { text: '<span>軽巡</span>、<span>重巡</span>、<span>超巡</span>の耐久がXアップ', values: [50, 70, 100] },
		EngineerBattleship: { text: '<span>巡戦</span>、<span>戦艦</span>、<span>航戦</span>の耐久がXアップ', values: [60, 84, 120] },
		EngineerCarrier: { text: '<span>軽母</span>、<span>空母</span>の耐久がXアップ', values: [50, 70, 100] },
		EngineerSS: { text: '<span>潜水艦</span>、<span>潜水空母</span>の耐久がXアップ', values: [25, 35, 50] },
		EngineerSpecial: { text: '<span>モニター</span>、<span>工作艦</span>の耐久がXアップ', values: [40, 56, 80] },
		TirelessWarrior: { text: '<span>軽巡</span>、<span>重巡</span>の火力が10アップ、装填が12アップ' },
		SoulfulWarrior: { text: '<span>巡戦</span>、<span>戦艦</span>の火力が15アップ、クリティカル率が3%アップ' },
		HeartOfTheTorpedo: { text: '<span>駆逐</span>、<span>軽巡</span>の雷装が15アップ、魚雷クリティカル率が3%アップ' },
		AcePilot: { text: '<span>空母</span>の航空が15アップ、装填が8アップ' },
		AlphaWolf: { text: '<span>潜水艦</span>、<span>潜水空母</span>の雷装が15アップ、装填が8アップ' },
		BestFriend: { text: 'オフニャ強化素材として使われる時に獲得する経験値+10%' },
		RisingStar: { text: '自分が戦闘で入手する経験値+10%' },
		Miracle: { text: '<span>艦隊全員</span>の運が5アップ' },
		Destiny: { text: '<span>艦隊全員</span>の火力・雷装・航空が10アップ。運が3ダウン' },
		WindsAlacrity: { text: '<span>艦隊</span>の速力が3アップ' },
		ForestsSerenity: { text: '<span>艦隊全員</span>の対空・対潜が15アップ。命中・回避が3アップ' },
		FlamesAggression: { text: '<span>艦隊全員</span>の与えるダメージが3%アップ' },
		MountainsTenacity: { text: '<span>艦隊全員</span>の被ダメージが3%ダウン' },
	};

	static NAME_DATA: {
		L: string[];
		l: string[];
		r: string[];
		O: string[];
		a: string[];
		T: { [K in MEOWFFICERS_TYPE]: (string | string[]) };
		S: { [K in MEOWFFICERS_TARGET]: string };
	} = {
		L: ['新人', '熟練'],
		l: ['新人', '熟練', '達人'],
		r: ['新人', '熟練', '高速'],
		O: ['新人', '熟練', '歴戦'],
		a: ['ルーキー', 'ベテラン', 'エース'],
		T: {
			Artillery: ['砲術士', '砲術長'],
			Torpedo: ['水雷士', '水雷長'],
			Aviation: 'P',
			AntiAir: ['対空砲手', '熟練対空砲手', '対空砲達人'],
			Sonar: '聴音手',
			Loading: '装填手',
			Mechanic: '整備士',
			Engineer: ['機関士', '機関長'],
			Lookout: '見張員',
			Helmsman: ['操舵手', '熟練操舵手', '航海長'],
			Officer: '参謀',
			TirelessWarrior: '見敵必戦',
			SoulfulWarrior: '一発入魂',
			HeartOfTheTorpedo: '水雷魂',
			AcePilot: 'エースパイロット',
			AlphaWolf: 'ウルフハウンド',
			BestFriend: 'ベストフレンド',
			RisingStar: 'ニュースター',
			Miracle: 'ミラクル',
			Destiny: 'デスティニー',
			WindsAlacrity: '疾きこと風の如く',
			ForestsSerenity: '徐かなること林の如く',
			FlamesAggression: '侵掠すること火の如く',
			MountainsTenacity: '動かざること山の如し',
		},
		S: {
			Vanguard: '前衛',
			Small: '小型艦',
			Destroyer: '駆逐',
			Medium: '中型艦',
			Cruiser: '巡洋',
			Main: '主力',
			Large: '大型艦',
			Battleship: '戦艦',
			Carrier: '空母',
			Submarine: '潜水',
			SS: '潜水',
			Special: '特殊',
			Union: 'ユニオン',
			Royal: 'ロイヤル',
			Sakura: '重桜',
			IronBlood: '鉄血',
		},
	};

	static search(typeTarget: string) {
		for (const ability of this.ABILITIES) {
			if (ability.type + (ability.target || '') === typeTarget) {
				return ability;
			}
		}
		return null;
	}

	static convertName(ability: MEOWFFICERS_ABILITY, lv: 0 | 1 | 2 | 3 = 0) {
		return ability.name.split('').map((type) => {
			switch (type) {
				case 'L':
					return this.LV1[0 < lv ? lv - 1 : lv];
				case 'l':
					return this.LV2[0 < lv ? lv - 1 : lv];
				case 'T':
					return ability.type;
				case 'S':
					return ability.target || '';
			}
			return '';
		}).join('');
	}

	static getAbilityName(type: MEOWFFICERS_TYPE, lv: number) {
		const base = this.NAME_DATA.T[type];
		if (typeof base === 'string') {
			return base;
		}
		if (base.length === 2) {
			return base[lv < 2 ? 0 : 1];
		}
		return base[lv];
	}

	static convertNameJa(ability: MEOWFFICERS_ABILITY, lv: 0 | 1 | 2 | 3 = 0) {
		if (0 < lv) {
			--lv;
		}

		return ability.name_ja
			.replace('L', this.NAME_DATA.L[lv] || '')
			.replace('l', this.NAME_DATA.l[lv] || '')
			.replace('r', this.NAME_DATA.r[lv] || '')
			.replace('O', this.NAME_DATA.O[lv] || '')
			.replace('a', this.NAME_DATA.a[lv] || '')
			.replace('T', this.getAbilityName(ability.type, lv))
			.replace('S', ability.target ? this.NAME_DATA.S[ability.target] : '');
	}

	static getSkillInfo(ability: MEOWFFICERS_ABILITY, lv: 0 | 1 | 2 | 3) {
		const info = this.ABILITY_INFO[ability.type + (ability.target || '')];
		if (!info) {
			return '';
		}
		if (lv <= 0) {
			return info.text;
		}
		const values = info.values || [];
		--lv;

		return info.text
			.replace('X', `<span>${values[lv]}</span>`)
			.replace('Y', `<span>${values[3 + lv]}</span>`)
			.replace('Z', `<span>${values[6 + lv]}</span>`);
	}

	static sort(parent: HTMLElement, option?: { reverse?: boolean }) {
		const list: { order: number; element: HTMLElement }[] = [];
		for (const child of parent.children) {
			const ma = <MeowfficerAbilityElement> (child.querySelector('meowfficer-ability') || child);
			if (!ma) {
				continue;
			}
			const order = ma.order;
			if (typeof order === 'number' && 0 < order) {
				list.push({ order: order, element: <MeowfficerAbilityElement> child });
			}
		}
		if (option) {
			if (option.reverse) {
				list.sort((a, b) => {
					return b.order - a.order;
				});
			}
		} else {
			list.sort((a, b) => {
				return a.order - b.order;
			});
		}
		for (const item of list) {
			parent.appendChild(item.element);
		}
	}
}

interface MeowfficerAbilityElement extends HTMLElement {
	base: string;
	option: boolean;
	lv: 0 | 1 | 2 | 3;
	type: MEOWFFICERS_TYPE | '';
	target: MEOWFFICERS_TARGET | '';
	readonly order: number;
}

((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const STYLE = document.createElement('style');
	((component, tagname = 'meowfficer-ability') => {
		if (customElements.get(tagname)) {
			return;
		}
		STYLE.dataset.name = tagname;
		customElements.define(tagname, component);
		document.head.insertBefore(STYLE, document.head.children[0]);
	})(
		class extends HTMLElement implements MeowfficerAbilityElement {
			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { --size: 1.6em; --icon: url( Destiny.png ); display: inline-block; background: white; width: var(--size); height: var(--size); border-radius: calc( var(--size) / 8 ); }',
					':host > button { display: block; width: 100%; height: 100%; outline: none; border: none; background: transparent; box-sizing: border-box; padding: calc(var(--size) / 16); cursor: pointer; position: relative; overflow: hidden; border-radius: calc( var(--size) / 8 ); background-size: 87.5% 87.5%; background-repeat: no-repeat; background-position: center; background-image: var(--icon); }',
					':host([option][type]) > button::before { content: ""; display: block; position: absolute; width: calc( var(--size) * 0.75 ); height: calc( var(--size) * 0.75 ); right: -35%; bottom: -35%; background: var( --option-color ); transform: rotate(45deg); }',
					':host([option][type]) > button::after { content: var(--option-name); display: block; position: absolute; right: 0; bottom: 0; color: white; font-size: calc( var(--size) / 4 ); }',
				].join('');

				const button = document.createElement('button');

				this.update();
				shadow.appendChild(style);
				shadow.appendChild(button);
			}

			protected update() {
				const base = this.base;
				if (STYLE.dataset.base === base) {
					return;
				}
				STYLE.dataset.base = base;
				const name = <string> STYLE.dataset.name;
				STYLE.innerHTML = [
					`${name}[type="Loading"] { --option-name: "装"; --option-color: #5a5a5a; }`,
					`${name}[type="Lookout"] { --option-name: "見"; --option-color: #5a5a5a; }`,
					`${name}[type="Helmsman"] { --option-name: "操"; --option-color: #5a5a5a; }`,
					`${name}[type="Officer"]:not([target="Union"]):not([target="Royal"]):not([target="Sakura"]):not([target="IronBlood"]) { --option-name: "参"; --option-color: #5a5a5a; }`,
					`${name}[type="BestFriend"] { --option-name: "友"; --option-color: #5a5a5a; }`,
					`${name}[type="RisingStar"] { --option-name: "星"; --option-color: #5a5a5a; }`,
					`${name}[type="Miracle"] { --option-name: "奇"; --option-color: #5a5a5a; }`,
					`${name}[type="Destiny"] { --option-name: "運"; --option-color: #5a5a5a; }`,
					`${name}[type="WindsAlacrity"] { --option-name: "風"; --option-color: #3b869a; }`,
					`${name}[type="ForestsSerenity"] { --option-name: "林"; --option-color: #46844b; }`,
					`${name}[type="FlamesAggression"] { --option-name: "火"; --option-color: #c46161; }`,
					`${name}[type="MountainsTenacity"] { --option-name: "山"; --option-color: #b89361; }`,
					...Meowfficer.ABILITIES.map((ability) => {
						return (ability.lv <= 0 ? [0] : [1, 2, 3]).map((lv) => {
							return `${name}[type="${ability.type}"]${ability.target ? `[target="${ability.target}"]` : ''}${
								ability.lv && 1 < lv ? `[lv="${lv}"]` : ''
							} { --icon: url( ${base}${Meowfficer.convertName(ability, <0 | 1 | 2 | 3> lv)}.png ); }`;
						}).join('\n');
					}),
				].join('\n');
			}

			get base() {
				return this.getAttribute('base') || '';
			}
			set base(value) {
				this.setAttribute('base', value);
				this.update();
			}

			get option() {
				return this.hasAttribute('option');
			}
			set option(value) {
				if (!value) {
					this.removeAttribute('option');
				} else {
					this.setAttribute('option', '');
				}
			}

			get lv() {
				const lv = parseInt(this.getAttribute('lv') || '') || 0;
				if (lv < 0) {
					return 0;
				}
				if (3 < lv) {
					return 3;
				}
				return <0 | 1 | 2 | 3> lv;
			}
			set lv(value) {
				let lv = typeof value === 'number' ? Math.floor(value) : parseInt(value);
				if (lv < 0) {
					lv = 0;
				} else if (3 < lv) {
					lv = 3;
				}
				this.setAttribute('lv', lv + '');
			}

			get type() {
				const type = <MEOWFFICERS_TYPE> (this.getAttribute('type') || '');
				if (!Meowfficer.TYPES.includes(type)) {
					return '';
				}
				return type;
			}
			set type(value) {
				if (Meowfficer.TYPES.includes(<MEOWFFICERS_TYPE> value)) {
					this.setAttribute('type', value);
				}
			}

			get target() {
				const target = <MEOWFFICERS_TARGET> (this.getAttribute('target') || '');
				if (!Meowfficer.TARGETS.includes(target)) {
					return '';
				}
				return target;
			}
			set target(value) {
				if (Meowfficer.TARGETS.includes(<MEOWFFICERS_TARGET> value)) {
					this.setAttribute('target', value);
				}
			}

			get order() {
				// [MEOWFFICERS_TARGET] [MEOWFFICERS_TYPE] [MEOWFFICERS_LV]
				// TT                   tt                 l
				const target = this.target ? Meowfficer.TARGETS.indexOf(this.target) + 1 : 0;
				const type = this.type ? Meowfficer.TYPES.indexOf(this.type) : 0;
				return target * 1000 + type * 10 + this.lv;
			}

			static get observedAttributes() {
				return ['base'];
			}

			attributeChangedCallback(name: string, oldValue: any, newValue: any) {
				if (oldValue === newValue) {
					return;
				}
				this.base = newValue;
			}
		},
		script.dataset.tagname,
	);
});
