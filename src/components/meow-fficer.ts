/* */

type MEOWFFICER_NAME =
	| 'antenna'
	| 'ark'
	| 'asamaru'
	| 'beer'
	| 'bishamaru'
	| 'bugles'
	| 'bunny'
	| 'eagle'
	| 'katsumaru'
	| 'lady'
	| 'rose'
	| 'sg'
	| 'tofu'
	| 'edelweiss'
	| 'gral'
	| 'jiromaru'
	| 'marble'
	| 'pepper'
	| 'potato'
	| 'soup'
	| 'yoshimaru'
	| 'justice'
	| 'lime'
	| 'oscar'
	| 'pound'
	| 'steel'
	| 'takemaru';

interface MEOWFFICER_INFO {
	fullname: string;
	url: string;
	rarity: 'R' | 'SR' | 'SSR';
}

interface MEOWFFICER_INFO_DETAIL extends MEOWFFICER_INFO {
	name: string;
}

interface MeowfficerElementClass {
	new (): MeowfficerElement;
	readonly meowfficers: { [key in MEOWFFICER_NAME]: MEOWFFICER_INFO };
	list(): MEOWFFICER_INFO_DETAIL[];
}
interface MeowfficerElement extends HTMLElement {
	name: MEOWFFICER_NAME | '';
	readonly icon: string;
}

((script, init) => {
	const baseDir = script.dataset.meowfficer || new URL('./meowfficer', script.src).toString();
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

	const MEOWFFICER_NAMES: MEOWFFICER_NAME[] = [
		'justice',
		'antenna',
		'lime',
		'pound',
		'takemaru',
		'bishamaru',
		'steel',
		'oscar',

		'bunny',
		'eagle',
		'pepper',
		'soup',
		'marble',
		'ark',
		'jiromaru',
		'yoshimaru',
		'potato',
		'edelweiss',
		'gral',

		'lady',
		'sg',
		'rose',
		'bugles',
		'asamaru',
		'katsumaru',
		'tofu',
		'beer',
	];

	((component, tagname = 'meow-fficer') => {
		if (customElements.get(tagname)) {
			return;
		}
		customElements.define(tagname, component);
	})(
		class extends HTMLElement implements MeowfficerElement {
			static meowfficers: { [key in MEOWFFICER_NAME]: MEOWFFICER_INFO } = {
				asamaru: {
					fullname: 'アサマル',
					url: `${baseDir}/asamaru.png`,
					rarity: 'R',
				},
				beer: {
					fullname: 'びーる',
					url: `${baseDir}/beer.png`,
					rarity: 'R',
				},
				bugles: {
					fullname: 'ビューグルス',
					url: `${baseDir}/bugles.png`,
					rarity: 'R',
				},
				katsumaru: {
					fullname: 'カツマル',
					url: `${baseDir}/katsumaru.png`,
					rarity: 'R',
				},
				lady: {
					fullname: 'レディ',
					url: `${baseDir}/lady.png`,
					rarity: 'R',
				},
				rose: {
					fullname: 'ローズ',
					url: `${baseDir}/rose.png`,
					rarity: 'R',
				},
				sg: {
					fullname: 'エスジー',
					url: `${baseDir}/sg.png`,
					rarity: 'R',
				},
				tofu: {
					fullname: 'とうふ',
					url: `${baseDir}/tofu.png`,
					rarity: 'R',
				},

				ark: {
					fullname: 'アーク	',
					url: `${baseDir}/ark.png`,
					rarity: 'SR',
				},
				bunny: {
					fullname: 'バニー',
					url: `${baseDir}/bunny.png`,
					rarity: 'SR',
				},
				eagle: {
					fullname: 'イーグル',
					url: `${baseDir}/eagle.png`,
					rarity: 'SR',
				},
				edelweiss: {
					fullname: 'うすゆきそう',
					url: `${baseDir}/edelweiss.png`,
					rarity: 'SR',
				},
				gral: {
					fullname: 'ぐらーる',
					url: `${baseDir}/gral.png`,
					rarity: 'SR',
				},
				jiromaru: {
					fullname: 'ジロマル',
					url: `${baseDir}/jiromaru.png`,
					rarity: 'SR',
				},
				marble: {
					fullname: 'マーボー',
					url: `${baseDir}/marble.png`,
					rarity: 'SR',
				},
				pepper: {
					fullname: 'ペッパー',
					url: `${baseDir}/pepper.png`,
					rarity: 'SR',
				},
				potato: {
					fullname: 'じゃがいも',
					url: `${baseDir}/potato.png`,
					rarity: 'SR',
				},
				soup: {
					fullname: 'スープ',
					url: `${baseDir}/soup.png`,
					rarity: 'SR',
				},
				yoshimaru: {
					fullname: 'ヨシマル',
					url: `${baseDir}/yoshimaru.png`,
					rarity: 'SR',
				},
				antenna: {
					fullname: 'アンテナ',
					url: `${baseDir}/antenna.png`,
					rarity: 'SSR',
				},
				bishamaru: {
					fullname: 'ビシャマル',
					url: `${baseDir}/bishamaru.png`,
					rarity: 'SSR',
				},
				justice: {
					fullname: 'ジャスティス',
					url: `${baseDir}/justice.png`,
					rarity: 'SSR',
				},
				lime: {
					fullname: 'ライム',
					url: `${baseDir}/lime.png`,
					rarity: 'SSR',
				},
				oscar: {
					fullname: 'おすかー',
					url: `${baseDir}/oscar.png`,
					rarity: 'SSR',
				},
				pound: {
					fullname: 'パウンド',
					url: `${baseDir}/pound.png`,
					rarity: 'SSR',
				},
				steel: {
					fullname: 'しゅている',
					url: `${baseDir}/steel.png`,
					rarity: 'SSR',
				},
				takemaru: {
					fullname: 'タケマル',
					url: `${baseDir}/takemaru.png`,
					rarity: 'SSR',
				},
			};

			static list(): MEOWFFICER_INFO_DETAIL[] {
				return MEOWFFICER_NAMES.map((key) => {
					return Object.assign({ name: key }, this.meowfficers[key]);
				});
			}

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
				].join('');

				shadow.appendChild(style);
			}

			get name() {
				const type = <MEOWFFICER_NAME> this.getAttribute('name') || '';
				return MEOWFFICER_NAMES.includes(type) ? type : '';
			}
			set name(value) {
				if (value) {
					this.setAttribute('name', value);
				} else {
					this.removeAttribute('name');
				}
			}

			get icon() {
				const name = this.name;
				return name ? `${baseDir}/${name}.png` : '';
			}
		},
		script.dataset.tagname,
	);
});
