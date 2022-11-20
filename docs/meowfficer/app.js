const Common = {
    tr: (option, ...columns) => {
        const tr = document.createElement('tr');
        if (option) {
            if (option.id) {
                tr.id = option.id;
            }
            if (option.class) {
                const list = typeof option.class === 'string' ? [option.class] : option.class;
                tr.classList.add(...list);
            }
        }
        columns.forEach((td) => {
            tr.appendChild(td);
        });
        return tr;
    },
    td: (content, option) => {
        const td = document.createElement('td');
        if (typeof content === 'string') {
            if (option && option.isHTML) {
                td.innerHTML = content;
            }
            else {
                td.textContent = content;
            }
        }
        else {
            if (Array.isArray(content)) {
                for (const element of content) {
                    td.appendChild(element);
                }
            }
            else {
                td.appendChild(content);
            }
        }
        if (option) {
            if (option.class) {
                const list = typeof option.class === 'string' ? [option.class] : option.class;
                td.classList.add(...list);
            }
            if (option.colSpan) {
                td.colSpan = option.colSpan;
            }
            if (option.rowSpan) {
                td.rowSpan = option.rowSpan;
            }
        }
        return td;
    },
};
((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => {
        init(script);
    });
})(document.currentScript, (script) => {
    ((component, tagname = 'section-pages') => {
        if (customElements.get(tagname)) {
            return;
        }
        customElements.define(tagname, component);
    })(class extends HTMLElement {
        home;
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML = [
                ':host { --header: 2rem; --front-color: black; --back-color: white; --tab-back: lightgray; --tab-active: white; --tab-inactive: gray; --home-size: 2rem; --home-icon: ""; display: block; width: 100%; height: 100%; }',
                ':host > div { display: grid; grid-template-rows: var(--header) 1fr; width: 100%; height: 100%; background: var(--back-color); color: var(--front-color); }',
                ':host > div > header { display: flex; background: var(--tab-back); }',
                ':host > div > header > a#home { display: block; width: var(--home-size); height: 100%; background-image: var(--home-icon); background-size: cover; }',
                ':host > div > header > a:not(#home) { text-decoration: none; color: var(--front-color); }',
                ':host > div > header > button, :host > div > header > a:not(#home) { display: block; cursor: pointer; border: 0; border-radius: 0.5em 0.5em 0 0; padding: 0 1em; background:var(--tab-inactive); font-size: 1em; line-height: var(--header); }',
                ':host > div > header > button.show, :host > div > header > a:not(#home).show { background: var(--tab-active); }',
                ':host > div > div { overflow: auto; }',
                '::slotted(*) { display: none; }',
                '::slotted(section.show) { display: block; }',
            ].join('');
            this.home = document.createElement('a');
            this.home.id = 'home';
            this.home.href = this.getAttribute('home') || '/';
            const header = document.createElement('header');
            header.appendChild(this.home);
            if (location.hash) {
                this.setAttribute('main', location.hash.substring(1));
                history.replaceState('', document.title, location.pathname + location.search);
            }
            const slot = document.createElement('slot');
            slot.addEventListener('slotchange', () => {
                header.querySelectorAll('button').forEach((button) => {
                    header.removeChild(button);
                });
                header.querySelectorAll('a:not(#home)').forEach((button) => {
                    header.removeChild(button);
                });
                const main = this.getAttribute('main') || '';
                for (const page of this.children) {
                    if (page.tagName === 'A') {
                        const link = document.createElement('a');
                        link.href = page.href;
                        link.innerHTML = page.innerHTML;
                        header.appendChild(link);
                        if (page.id && page.id === main) {
                            link.classList.add('show');
                        }
                        continue;
                    }
                    else if (page.tagName !== 'SECTION') {
                    }
                    const tab = document.createElement('button');
                    tab.textContent = page.dataset.name || '';
                    if (!tab.textContent) {
                        continue;
                    }
                    tab.addEventListener('click', (event) => {
                        event.stopPropagation();
                        for (const page of this.children) {
                            page.classList.remove('show');
                        }
                        page.classList.add('show');
                        for (const tab of header.children) {
                            tab.classList.remove('show');
                        }
                        tab.classList.add('show');
                    });
                    header.appendChild(tab);
                    if (page.id && page.id === main) {
                        page.classList.add('show');
                        tab.classList.add('show');
                    }
                }
            });
            const pages = document.createElement('div');
            pages.appendChild(slot);
            const contents = document.createElement('div');
            contents.appendChild(header);
            contents.appendChild(pages);
            shadow.appendChild(style);
            shadow.appendChild(contents);
        }
        static get observedAttributes() {
            return ['home'];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) {
                return;
            }
            this.home.href = newValue || '/';
        }
    }, script.dataset.tagname);
});
class Meowfficer {
    static LV = ['Rookie', 'Adept', 'Elite', 'Ace', 'Chief'];
    static LV1 = ['Rookie', 'Adept', 'Ace'];
    static LV2 = ['Rookie', 'Elite', 'Chief'];
    static TARGETS = [
        'Vanguard',
        'Small',
        'Destroyer',
        'Medium',
        'Cruiser',
        'Large',
        'Main',
        'Battleship',
        'Carrier',
        'Special',
        'SS',
        'Submarine',
        'Union',
        'Royal',
        'Sakura',
        'IronBlood',
    ];
    static TYPES = [
        'Sonar',
        'HeartOfTheTorpedo',
        'Officer',
        'Artillery',
        'Torpedo',
        'Aviation',
        'Mechanic',
        'AcePilot',
        'AntiAir',
        'Loading',
        'Lookout',
        'Engineer',
        'Helmsman',
        'TirelessWarrior',
        'SoulfulWarrior',
        'AlphaWolf',
        'WindsAlacrity',
        'ForestsSerenity',
        'FlamesAggression',
        'MountainsTenacity',
        'BestFriend',
        'RisingStar',
        'Miracle',
        'Destiny',
    ];
    static MEOWFFICERS_SKILL = {
        SilentHunter: {
            name: '静寂のシュトース',
            info: [
                '装備艦隊の潜水艦の雷装を上昇させる（効果小・効果は指揮・兵站補助ステータスによる）',
                '支援範囲Lv+1',
                '漸減作戦で敵に与えるダメージを上昇させる（効果は戦術補助ステータスによる）',
            ],
            siren: [
                '',
                '指揮ニャとして装備されている場合、装備艦隊の潜水艦の潜航力が15アップ',
                '指揮ニャとして装備されている場合、装備艦隊の潜水艦隊旗艦が洗浄に到達した場合、特殊魚雷攻撃を行う',
            ],
        },
        IronbottomTailSwipe: {
            name: '鉄底尻尾突',
            info: [
                '指揮ニャとして装備されている場合、艦隊の軽巡・重巡・超甲巡の火力・雷槍がアップ（効果中・効果は戦術補助ステータスによる）',
                '指揮ニャとして装備されている場合、艦隊周囲2マス内に敵主力艦隊が存在している場合、旗艦の受けるダメージを軽減する（効果は指揮補助ステータスによる）',
                '指揮ニャとして装備されている場合、主力艦隊との戦闘開始後30秒間、艦隊の軽巡・重巡・超甲巡の命中・回避がアップ（効果大・効果は戦術補助ステータスによる）',
            ],
        },
        PawsOfFury: {
            name: '反撃毛玉拳',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の軽空母・空母の航空・装填を上昇させる（効果小、効果は指揮補助ステータスによる）',
                '装備艦隊の待ち伏せ艦隊遭遇率を低下させる（効果は兵站補助ステータスによる）',
                '戦闘開始時、装備艦隊の主力艦隊が空母（もしくは軽空母）一隻のみである場合、最初の航空攻撃の装填が8%アップし、一度だけ航空攻撃隊に雷撃機を追加する',
            ],
            siren: ['', '参謀ニャとして装備されている場合、装備艦隊の空母・軽空母の回避を上昇させる（効果小・効果は兵站補助ステータスによる）'],
        },
        UnsinkableOscar: {
            name: '根性のぐりゅっく',
            info: [
                '参謀ニャとして装備されている場合、艦隊の戦艦・巡洋戦艦・航空戦艦の火力・命中がアップ（効果中・効果は指揮補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊に戦艦・巡洋戦艦・航空戦艦が編成されており、敵護衛艦隊と接敵時、15%で先制砲撃を行う（Lv2で有効・ダメージは指揮補助ステータスとお互いの艦隊の強さによる）',
                '参謀ニャとして装備されている場合、主力艦隊と交戦時、艦隊の戦艦・巡洋戦艦・航空戦艦の受けるダメージを軽減し（Lv3で有効・効果は兵站補助ステータスによる）、装填をアップさせる（Lv3で有効・効果中・効果は兵站補助ステータスによる）',
            ],
            siren: ['', '参謀ニャとして装備され、装備艦隊の旗艦が戦艦・巡洋戦艦・航空戦艦である場合、戦闘開始後20秒のとき50%で特殊弾幕を展開する'],
        },
        ChurchillsBlessing: {
            name: 'ロイヤルタッチ',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の戦艦・巡洋戦艦・航空戦艦の火力・対空を上昇させる（効果中・効果は指揮補助ステータスによる）',
                '参謀ニャとして装備されている場合、沿岸戦闘（海域マップの戦闘不可マスに隣接するマスにおける戦闘）での装備艦隊全員の火力を上昇させる（効果中・効果は戦術補助ステータスによる）',
                '装備艦隊の戦艦・巡洋戦艦・航空戦艦に与えるダメージを上昇させる（効果は戦術補助ステータスによる）',
            ],
            siren: ['', '参謀ニャとして装備されている場合、装備艦隊の全員の火力を戦闘開始後30秒間上昇させる（効果中・効果は戦術補助ステータスによる）'],
        },
        '31KnotsOfJustice': {
            name: '31ぶんぶん',
            info: [
                '装備艦隊に駆逐艦が3隻ある場合、海域マップでの移動力+1',
                '	指揮ニャとして装備され、海域マップで中枢艦隊以外の敵艦隊に接触し、かつ装備艦隊に駆逐艦が編成されている場合、15%で先制魚雷攻撃を行う',
                '指揮ニャとして装備され、装備艦隊に駆逐艦が編成されており、かつ装備艦隊が戦闘状態ではなく、隣のマスに交戦中の味方艦隊が存在する場合、海域マップの指令ボタンで発動可能。装備艦隊と交戦中の味方艦隊と入れ替える',
            ],
            siren: [
                '装備艦隊に駆逐艦が3隻存在している場合、前衛艦隊のら位相を上昇させる（効果中・効果は戦術補助ステータスによる）',
                '指揮ニャとして装備され、戦闘開始時に前衛艦隊の2番目の艦船が駆逐艦である場合、1度だけ特殊弾幕Ⅰを展開する',
                '特殊弾幕Ⅰを特殊弾幕Ⅱに強化する',
            ],
        },
        RuleBritannya: {
            name: 'ロイヤルケーキ',
            info: [
                '指揮ニャとして装備されている場合、艦隊の戦艦・巡洋戦艦・航空戦艦の火力・対空がアップ（効果中・効果は指揮補助ステータスによる）',
                '指揮ニャとして装備され、艦隊にロイヤル所属艦船が4隻以上ある場合、戦闘開始時発動：30秒間味方前衛艦隊の受けるダメージを軽減する（効果は兵站補助ステータスによる）',
                '指揮ニャとして装備されている場合、味方ロイヤル艦船の回避がアップ（効果大・効果は兵站補助ステータスによる）',
            ],
        },
        Snipurr: {
            name: 'RDぼこぼこ',
            info: [
                '敵主力艦隊もしくは偵察艦隊と交戦時、艦隊の戦艦・巡洋戦艦・航空戦艦の命中がアップ（効果大・効果は戦術補助ステータスによる）',
                '所属艦隊の旗艦が戦艦・巡洋戦艦・航空戦艦である場合、旗艦の与えるダメージがアップ（Lv2で有効・効果は指揮補助ステータスによる）',
                '艦隊の戦艦・巡洋戦艦・航空戦艦の回避・対空がアップ（効果中・Lv3で有効・効果は指揮補助ステータスによる）',
            ],
        },
        BiteTheirFingers: {
            name: 'SELFりみたー',
            info: [
                '指揮ニャとして装備され、海域マップで中枢艦隊以外の敵艦隊に接触し、かつ装備艦隊に駆逐艦が編成されている場合、15%で先制魚雷攻撃を行う',
                '前衛艦隊の先頭が駆逐艦である場合、戦闘開始時に戦闘可能な先頭駆逐艦が敵艦に接近した時、一度だけオフニャ弾幕-Ⅰを発動する',
                'オフニャ弾幕Ⅰをオフニャ弾幕Ⅱに強化する',
            ],
            siren: [
                '指揮ニャとして装備されている場合、装備艦隊の駆逐艦の雷槍を上昇させる（効果小・効果は指揮補助ステータスによる）',
            ],
        },
        NineLives: {
            name: 'LUCKばたばた',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の軽空母・空母の装填を上昇させる（効果小・効果は戦術補助ステータスによる）',
                '装備艦隊が敵空襲に遭遇した場合、確率で回避する（効果は戦術補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の軽空母・空母の航空を上昇させる（効果中・効果は戦術補助ステータスによる）',
            ],
            siren: [
                '',
                '参謀ニャとして装備されている場合、装備艦隊の軽空母・空母の回避・対空を上昇させる（効果小・効果は戦術補助ステータスによる）',
            ],
        },
        CommercePurrsuiter: {
            name: 'マネーキャッチ',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡の回避を上昇させる（効果小・効果は兵站補助ステータスによる）',
                '参謀ニャとして装備されている場合、輸送艦隊との戦闘で装備艦隊の軽巡・重巡の火力を上昇させる（効果大・効果は戦術補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡の雷装を上昇させる（効果中・効果は指揮補助ステータスによる）',
            ],
        },
        Purrceptive: {
            name: 'スカウトキャッチ',
            info: [
                '参謀ニャとして装備されている場合、偵察艦隊との戦闘で装備艦隊の駆逐艦の命中率を上昇させる（効果中・効果は戦術補助のステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の駆逐艦の回避を上昇させる（効果小・効果は兵站補助ステータスによる）',
                '敵偵察艦隊が装備艦隊周辺3マス以内に存在する場合、海域マップでの移動力+1',
            ],
            siren: [
                '',
                '',
                '敵偵察艦隊が装備艦隊周辺3マス以内に存在する場合、装備艦隊の駆逐艦の回避を上昇させる（効果小・効果は指揮補助ステータスによる）',
            ],
        },
        Sophissticated: {
            name: 'ドッジキャッチ',
            info: [
                '待ち伏せ攻撃を受ける確率を軽減する（兵站補助のステータスによる）',
                '参謀ニャとして装備されている場合、戦艦、巡洋戦艦、航空戦艦の装填がアップ（効果小、指揮補助のステータスによる）',
                '参謀ニャとして装備されている場合、艦隊のロイヤル艦船の火力がアップ（効果小、戦術補助のステータスによる）',
            ],
            siren: [
                '参謀ニャとして装備されている場合、装備艦隊の戦艦・巡洋戦艦・航空戦艦の回避を上昇させる（効果小・効果は兵站補助ステータスによる）',
            ],
        },
        TiddlesLegacy: {
            name: 'ウォッチキャッチ',
            info: [
                '参謀ニャとして装備されている場合、艦隊の軽空母・空母の命中アップ（効果小・効果は戦術補助ステータスによる）',
                '艦隊周囲2マス以内に敵偵察艦隊が存在している場合、艦隊の移動力+1',
                '参謀ニャとして装備されている場合、艦隊の軽空母・空母の航空アップ（効果中・効果は指揮補助ステータスによる）',
            ],
            siren: [
                '',
                '敵偵察艦隊が装備艦隊周辺2マス以内に存在する場合、装備艦隊の駆逐艦の回避を上昇させる（効果小・効果は兵站補助ステータスによる）',
            ],
        },
        BellyFlopBombardment: {
            name: '必殺三段腹',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の軽空母・空母の命中を上昇させる（効果小・効果は戦術補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の軽空母・空母の航空を上昇させる（効果中・効果は指揮補助ステータスによる）',
                '装備艦隊に空母・軽空母が編成されており、海域マップで中枢艦隊以外の敵艦隊に接触した場合、15%で先制航空攻撃を行う（ダメージは戦術補助ステータスとお互いの艦隊の強さによる）',
            ],
            siren: [
                '',
                '',
                '装備艦隊の旗艦が軽空母・空母である場合、戦闘開始15秒後特殊先制航空攻撃を行う',
            ],
        },
        FeralInstincts: {
            name: '直感野生勘',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の駆逐艦の回避を上昇させる（効果小・効果は指揮補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の駆逐艦の雷装を上昇させる（効果中・効果は兵站補助ステータスによる）',
                '参謀ニャとして装備されていており、前衛艦隊が駆逐艦一隻のみで編成されている場合、装備艦隊の駆逐艦の雷装を上昇させる（効果大・効果は指揮補助ステータスによる）',
            ],
        },
        PaladinOfTheSea: {
            name: '海のリッター',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の戦艦・巡洋戦艦・航空戦艦の回避を上昇させる（効果小・効果は戦術補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の戦艦・巡洋戦艦・航空戦艦の命中を上昇させる（効果中・効果は戦術補助ステータスによる）',
                '敵主力艦隊と戦闘時、味方旗艦が受けるダメージを軽減させる（効果は戦術補助ステータスによる）',
            ],
        },
        ChampionOfTheSea: {
            name: '海のエードゥル',
            info: [
                '参謀ニャとして装備されている場合、艦隊の潜水艦・潜水空母の雷装を上昇させる（効果小・効果は指揮補助ステータスによる）',
                '参謀ニャとして装備されている場合、艦隊の潜水艦・潜水空母の命中を上昇させる（効果中・効果は指揮補助ステータスによる）',
                '支援範囲Lv+1',
            ],
            siren: [
                '',
                '',
                '指揮ニャとして装備されている場合、装備艦隊の潜水艦の潜航力が5アップ',
            ],
        },
        SentinelOfTheSea: {
            name: '海のヴェヒター',
            info: [
                '参謀ニャとして装備されている場合、艦隊の潜水艦・潜水空母の雷装がアップ（効果小・効果は指揮補助ステータスによる）',
                '参謀ニャとして装備されている場合、艦隊の潜水艦・潜水空母の回避がアップ（効果中・効果は指揮補助ステータスによる）',
                '潜水艦隊の参謀ニャとして装備されている場合、旗艦が戦艦・巡洋戦艦・航空戦の艦隊が装備艦隊の潜水支援を発動したとき、味方潜水艦・潜水空母の命中がアップ（効果中・効果は指揮補助ステータスによる）',
            ],
        },
        CarrierBoost: {
            name: '空母補給にゃ',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の軽空母・空母の装填を上昇させる（効果小・効果は兵站補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の軽空母・空母の航空を上昇させる（効果小・効果は指揮補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の軽空母・空母の命中を上昇させる（効果小・効果は戦術補助ステータスによる）',
            ],
        },
        ReconBoost: {
            name: '電探偵察にゃ',
            info: [
                '装備艦隊の待ち伏せ艦隊遭遇率を低下させる（効果は兵站補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡・超巡の命中を上昇させる（効果小・効果は戦術補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡・超巡の火力を上昇させる（効果小・効果は指揮補助ステータスによる）',
            ],
            siren: [
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡・超巡の回避を上昇させる（効果小・効果は兵站補助ステータスによる）',
            ],
        },
        BattleshipBoost: {
            name: '戦艦補給にゃ',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の戦艦・巡洋戦艦・航空戦艦の装填を上昇させる（効果小・効果は兵站補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の戦艦・巡洋戦艦・航空戦艦の命中を上昇させる（効果小・効果は兵站補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の戦艦・巡洋戦艦・航空戦艦の火力を上昇させる（効果小・効果は兵站補助ステータスによる）',
            ],
        },
        CruiserTactics: {
            name: '巡洋戦術にゃ',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡・超巡の火力を上昇させる（効果小・効果は戦術補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡・超巡の命中を上昇させる（効果小・効果は戦術補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡・超巡の回避を上昇させる（効果小・効果は戦術補助ステータスによる）',
            ],
        },
        CruiserDirectives: {
            name: '巡洋指揮にゃ',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡・超巡の火力を上昇させる（効果小・効果は指揮補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡・超巡の雷装を上昇させる（効果小・効果は兵站補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡・超巡の雷装を上昇させる（効果小・効果は指揮補助ステータスによる）',
            ],
        },
        BattleshipSupport: {
            name: '戦艦補給にゃ',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の戦艦・巡洋戦艦・航空戦艦の命中を上昇させる（効果小・効果は兵站補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の戦艦・巡洋戦艦・航空戦艦の対空を上昇させる（効果小・効果は指揮補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の戦艦・巡洋戦艦・航空戦艦の火力を上昇させる（効果小・効果は戦術補助ステータスによる）',
            ],
        },
        CruiserBoost: {
            name: '巡洋補給にゃ',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡の回避を上昇させる（効果小・効果は兵站補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡の火力を上昇させる（効果小・効果は兵站補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の軽巡・重巡の火力を上昇させる（効果小・効果は指揮補助ステータスによる）',
            ],
        },
        DestroyerDirectives: {
            name: '駆逐指揮にゃ',
            info: [
                '参謀ニャとして装備されている場合、装備艦隊の駆逐艦の回避を上昇させる（効果小・効果は指揮補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の駆逐艦の命中を上昇させる（効果小・効果は戦術補助ステータスによる）',
                '参謀ニャとして装備されている場合、装備艦隊の駆逐艦の雷装を上昇させる（効果小・効果は兵站補助ステータスによる）',
            ],
        },
    };
    static ABILITIES = [
        { type: 'Sonar', target: 'Vanguard', name: 'TLS', name_ja: 'lT・S', lv: 3 },
        { type: 'AntiAir', target: 'Vanguard', name: 'TLS', name_ja: 'T・S', lv: 3 },
        { type: 'Lookout', target: 'Vanguard', name: 'LTS', name_ja: 'lT・S', lv: 3 },
        { type: 'Helmsman', target: 'Small', name: 'LTS', name_ja: 'T・S', lv: 3 },
        { type: 'Officer', target: 'Destroyer', name: 'lTS', name_ja: 'OT・S', lv: 3 },
        { type: 'Artillery', target: 'Destroyer', name: 'TLS', name_ja: 'LT・S', lv: 3 },
        { type: 'Torpedo', target: 'Destroyer', name: 'TLS', name_ja: 'LT・S', lv: 3 },
        { type: 'Loading', target: 'Destroyer', name: 'TLS', name_ja: 'rT・S', lv: 3 },
        { type: 'Engineer', target: 'Destroyer', name: 'LTS', name_ja: 'LT・S', lv: 3 },
        { type: 'HeartOfTheTorpedo', target: 'Medium', name: 'T', name_ja: 'T', lv: 0 },
        { type: 'Helmsman', target: 'Medium', name: 'LTS', name_ja: 'T・S', lv: 3 },
        { type: 'Officer', target: 'Cruiser', name: 'lTS', name_ja: 'OT・S', lv: 3 },
        { type: 'Artillery', target: 'Cruiser', name: 'TLS', name_ja: 'LT・S', lv: 3 },
        { type: 'Torpedo', target: 'Cruiser', name: 'TLS', name_ja: 'LT・S', lv: 3 },
        { type: 'Loading', target: 'Cruiser', name: 'TLS', name_ja: 'rT・S', lv: 3 },
        { type: 'Engineer', target: 'Cruiser', name: 'LTS', name_ja: 'LT・S', lv: 3 },
        { type: 'Torpedo', target: 'SS', name: 'TLS', name_ja: 'LT・S', lv: 3 },
        { type: 'Engineer', target: 'SS', name: 'LTS', name_ja: 'LT・S', lv: 3 },
        { type: 'TirelessWarrior', target: 'Cruiser', name: 'T', name_ja: 'T', lv: 0 },
        { type: 'Officer', target: 'Submarine', name: 'lTS', name_ja: 'OT・S', lv: 3 },
        { type: 'Loading', target: 'Submarine', name: 'TLS', name_ja: 'rT・S', lv: 3 },
        { type: 'Lookout', target: 'Submarine', name: 'LTS', name_ja: 'lT・S', lv: 3 },
        { type: 'AlphaWolf', target: 'Submarine', name: 'T', name_ja: 'T', lv: 0 },
        { type: 'Helmsman', target: 'Large', name: 'LTS', name_ja: 'T・S', lv: 3 },
        { type: 'Sonar', target: 'Main', name: 'TLS', name_ja: 'lT・S', lv: 3 },
        { type: 'Artillery', target: 'Main', name: 'TLS', name_ja: 'LT・S', lv: 3 },
        { type: 'AntiAir', target: 'Main', name: 'TLS', name_ja: 'T・S', lv: 3 },
        { type: 'Lookout', target: 'Main', name: 'LTS', name_ja: 'lT・S', lv: 3 },
        { type: 'Officer', target: 'Battleship', name: 'lTS', name_ja: 'OT・S', lv: 3 },
        { type: 'Loading', target: 'Battleship', name: 'TLS', name_ja: 'rT・S', lv: 3 },
        { type: 'Engineer', target: 'Battleship', name: 'LTS', name_ja: 'LT・S', lv: 3 },
        { type: 'SoulfulWarrior', target: 'Battleship', name: 'T', name_ja: 'T', lv: 0 },
        { type: 'Officer', target: 'Carrier', name: 'lTS', name_ja: 'OT・S', lv: 3 },
        { type: 'Mechanic', target: 'Carrier', name: 'LT', name_ja: 'lT', lv: 3 },
        { type: 'Aviation', target: 'Carrier', name: 'TLS', name_ja: 'aT・S', lv: 3 },
        { type: 'Engineer', target: 'Carrier', name: 'LTS', name_ja: 'LT・S', lv: 3 },
        { type: 'AcePilot', target: 'Carrier', name: 'T', name_ja: 'T', lv: 0 },
        { type: 'Aviation', target: 'Special', name: 'TLS', name_ja: 'aT・S', lv: 3 },
        { type: 'Loading', target: 'Special', name: 'TLS', name_ja: 'lT・S', lv: 3 },
        { type: 'Engineer', target: 'Special', name: 'LTS', name_ja: 'LT・S', lv: 3 },
        { type: 'Officer', target: 'Union', name: 'lTS', name_ja: 'OT・S', lv: 3 },
        { type: 'Officer', target: 'Royal', name: 'lTS', name_ja: 'OT・S', lv: 3 },
        { type: 'Officer', target: 'Sakura', name: 'lTS', name_ja: 'OT・S', lv: 3 },
        { type: 'Officer', target: 'IronBlood', name: 'lTS', name_ja: 'OT・S', lv: 3 },
        { type: 'WindsAlacrity', name: 'T', name_ja: 'T', lv: 0 },
        { type: 'ForestsSerenity', name: 'T', name_ja: 'T', lv: 0 },
        { type: 'FlamesAggression', name: 'T', name_ja: 'T', lv: 0 },
        { type: 'MountainsTenacity', name: 'T', name_ja: 'T', lv: 0 },
        { type: 'Destiny', name: 'T', name_ja: 'T', lv: 0 },
        { type: 'Miracle', name: 'T', name_ja: 'T', lv: 0 },
        { type: 'BestFriend', name: 'T', name_ja: 'T', lv: 0 },
        { type: 'RisingStar', name: 'T', name_ja: 'T', lv: 0 },
    ];
    static ABILITY_INFO = {
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
    static NAME_DATA = {
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
            WindsAlacrity: '疾きこと風の如く',
            ForestsSerenity: '徐かなること林の如く',
            FlamesAggression: '侵掠すること火の如く',
            MountainsTenacity: '動かざること山の如し',
            Miracle: 'ミラクル',
            Destiny: 'デスティニー',
            BestFriend: 'ベストフレンド',
            RisingStar: 'ニュースター',
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
    static search(typeTarget) {
        for (const ability of this.ABILITIES) {
            if (ability.type + (ability.target || '') === typeTarget || ability.type === typeTarget) {
                return ability;
            }
        }
        return null;
    }
    static convertName(ability, lv = 0) {
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
    static getAbilityName(type, lv) {
        const base = this.NAME_DATA.T[type];
        if (typeof base === 'string') {
            return base;
        }
        if (base.length === 2) {
            return base[lv < 2 ? 0 : 1];
        }
        return base[lv];
    }
    static convertNameJa(ability, lv = 0) {
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
    static getSkillInfo(ability, lv) {
        const info = this.ABILITY_INFO[ability.type + (ability.target || '')] || this.ABILITY_INFO[ability.type];
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
    static sort(parent, option) {
        const list = [];
        for (const child of parent.children) {
            const ma = (child.querySelector('meowfficer-ability') || child);
            if (!ma) {
                continue;
            }
            const order = ma.order;
            if (typeof order === 'number' && 0 < order) {
                list.push({ order: order, element: child });
            }
        }
        if (option) {
            if (option.reverse) {
                list.sort((a, b) => {
                    return b.order - a.order;
                });
            }
        }
        else {
            list.sort((a, b) => {
                return a.order - b.order;
            });
        }
        for (const item of list) {
            parent.appendChild(item.element);
        }
    }
}
((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => {
        init(script);
    });
})(document.currentScript, (script) => {
    const STYLE = document.createElement('style');
    ((component, tagname = 'meowfficer-ability') => {
        if (customElements.get(tagname)) {
            return;
        }
        STYLE.dataset.name = tagname;
        customElements.define(tagname, component);
        document.head.insertBefore(STYLE, document.head.children[0]);
    })(class extends HTMLElement {
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
        update() {
            const base = this.base;
            if (STYLE.dataset.base === base) {
                return;
            }
            STYLE.dataset.base = base;
            const name = STYLE.dataset.name;
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
                        return `${name}[type="${ability.type}"]${ability.target ? `[target="${ability.target}"]` : ''}${ability.lv && 1 < lv ? `[lv="${lv}"]` : ''} { --icon: url( ${base}${Meowfficer.convertName(ability, lv)}.png ); }`;
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
            }
            else {
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
            return lv;
        }
        set lv(value) {
            let lv = typeof value === 'number' ? Math.floor(value) : parseInt(value);
            if (lv < 0) {
                lv = 0;
            }
            else if (3 < lv) {
                lv = 3;
            }
            this.setAttribute('lv', lv + '');
        }
        get type() {
            const type = (this.getAttribute('type') || '');
            if (!Meowfficer.TYPES.includes(type)) {
                return '';
            }
            return type;
        }
        set type(value) {
            if (Meowfficer.TYPES.includes(value)) {
                this.setAttribute('type', value);
            }
        }
        get target() {
            const target = (this.getAttribute('target') || '');
            if (!Meowfficer.TARGETS.includes(target)) {
                return '';
            }
            return target;
        }
        set target(value) {
            if (Meowfficer.TARGETS.includes(value)) {
                this.setAttribute('target', value);
            }
        }
        get order() {
            const target = this.target ? Meowfficer.TARGETS.indexOf(this.target) + 1 : Meowfficer.TARGETS.length;
            const type = this.type ? Meowfficer.TYPES.indexOf(this.type) : 0;
            return target * 1000 + type * 10 + this.lv;
        }
        static get observedAttributes() {
            return ['base'];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) {
                return;
            }
            this.base = newValue;
        }
    }, script.dataset.tagname);
});
((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => {
        init(script);
    });
})(document.currentScript, (script) => {
    const SHIP_TYPES = [
        'Destroyer',
        'Cruiser',
        'LightCruiser',
        'HeavyCruiser',
        'LargeCruiser',
        'BattleCruiser',
        'Battleship',
        'LightCarrier',
        'Carrier',
        'LightAircraftCarrier',
        'AircraftCarrier',
        'AviationBattleship',
        'SubmarineCarrier',
        'Monitor',
        'Submarine',
        'Repair',
        'Munition',
        'SailingFrigate',
    ];
    const NAMES = {
        Destroyer: '駆逐艦',
        Cruiser: '巡洋艦',
        LightCruiser: '軽巡洋艦',
        HeavyCruiser: '重巡洋艦',
        LargeCruiser: '超巡洋艦',
        BattleCruiser: '巡洋戦艦',
        Battleship: '戦艦',
        LightCarrier: '軽空母',
        Carrier: '空母',
        LightAircraftCarrier: '軽空母',
        AircraftCarrier: '空母',
        AviationBattleship: '航空戦艦',
        SubmarineCarrier: '潜水母艦',
        Monitor: 'モニター艦',
        Submarine: '潜水艦',
        Repair: '工作艦',
        Munition: '運送艦',
        SailingFrigate: '風帆',
    };
    ((component, tagname = 'ship-type') => {
        if (customElements.get(tagname)) {
            return;
        }
        customElements.define(tagname, component);
    })(class extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML = [
                ':host { display: inline-block; --frame: gray; --back:#666; --front: #fff; --border: #000; width: 2rem; vertical-align: middle; }',
                ':host > svg { display: block; width: 100%; height: auto; }',
                ':host([type="Destroyer"]) { --back: #4781BA; }',
                ':host([type="Cruiser"]) { --back: #D9AB59; }',
                ':host([type="LightCruiser"]) { --back: #D9AB59; }',
                ':host([type="HeavyCruiser"]) { --back: #D9AB59; }',
                ':host([type="LargeCruiser"]) { --back: #EF8748; }',
                ':host([type="BattleCruiser"]) { --back: #EC645E; }',
                ':host([type="Battleship"]) { --back: #EC645E; }',
                ':host([type="LightCarrier"]) { --back: #375285; }',
                ':host([type="Carrier"]) { --back: #375285; }',
                ':host([type="LightAircraftCarrier"]) { --back: #375285; }',
                ':host([type="AircraftCarrier"]) { --back: #375285; }',
                ':host([type="AviationBattleship"]) { --back: #EC645E; }',
                ':host([type="SubmarineCarrier"]) { --back: #90B253; }',
                ':host([type="Monitor"]) { --back: #EC645E; }',
                ':host([type="Submarine"]) { --back: #90B253; }',
                ':host([type="Repair"]) { --back: #90B253; }',
                ':host([type="Munition"]) { --back: #90B253; }',
                ':host([type="SailingFrigate"]) { --back: #705744; }',
                ':host(:not([type="Destroyer"]):not([type="Submarine"])) path.Destroyer { display: none; }',
                ':host(:not([type="Cruiser"]):not([type="LightCruiser"]):not([type="HeavyCruiser"])) path.Cruiser { display: none; }',
                ':host(:not([type="HeavyCruiser"])) path.HeavyCruiser { display: none; }',
                ':host(:not([type="Battleship"]):not([type="BattleCruiser"]):not([type="LargeCruiser"]):not([type="Monitor"])) path.Battleship { display: none; }',
                ':host(:not([type="LightCarrier"]):not([type="Carrier"]):not([type="LightAircraftCarrier"]):not([type="AircraftCarrier"]):not([type="AviationBattleship"]):not([type="SubmarineCarrier"])) path.Carrier { display: none; }',
                ':host(:not([type="Munition"])) path.Munition { display: none; }',
                ':host(:not([type="Repair"])) path.Repair { display: none; }',
                ':host(:not([type="SailingFrigate"])) path.SailingFrigate { display: none; }',
            ].join('');
            if (this.hasAttribute('type')) {
                this.type = this.type;
            }
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttributeNS(null, 'width', '26px');
            svg.setAttributeNS(null, 'height', '16px');
            svg.setAttributeNS(null, 'viewBox', '0 0 26 16');
            const createPath = (d, color, cls) => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttributeNS(null, 'd', d);
                path.style.fill = `var(${color})`;
                if (cls) {
                    (typeof cls === 'string' ? [cls] : cls).forEach((cls) => {
                        path.classList.add(cls);
                    });
                }
                return path;
            };
            svg.appendChild(createPath('m0 0h26v16h-22l-4-4z', '--frame'));
            svg.appendChild(createPath('m1 1v10.586l3.4141 3.4141h20.586v-14z', '--back'));
            svg.appendChild(createPath('m10.477 0.27344c-6.53e-4 6.4924e-4 -0.0013 0.0013-2e-3 0.001953-0.53355 0.001119-1.0729 0.20374-1.4785 0.60938-0.2771 0.27714-0.32767 0.65294-0.41597 1.0098-0.4134 0.0699-0.82268 0.22698-1.1406 0.54492-0.27806 0.27806-0.32805 0.65554-0.41602 1.0137-0.41336 0.07095-0.82283 0.22712-1.1387 0.54297-0.81347 0.81347-0.81347 2.1494 0 2.9629l6.6328 6.6328c0.08873 0.08797 0.20718 0.13953 0.33203 0.14453l1.2344 0.05664 0.05274 0.33203c0.01582 0.0972 0.05998 0.18757 0.12695 0.25977l1.0938 1.1816c0.29256 0.3141 0.81886 0.13788 0.86328-0.28906l0.08789-0.85938 0.85742-0.08594c0.1741-0.03217 0.31822-0.15399 0.37891-0.32031 0.11206-0.06346 0.19531-0.1677 0.23242-0.29102l0.08789-0.85938 0.85742-0.08594c0.17456-0.03253 0.31878-0.15519 0.37891-0.32227 0.11054-0.06291 0.19296-0.16558 0.23047-0.28711l0.08594-0.85938 0.85938-0.08594c0.42694-0.04443 0.60316-0.57073 0.28906-0.86328l-1.1816-1.0937c-0.072199-0.066973-0.16256-0.11114-0.25977-0.12695l-0.33203-0.052734-0.05664-1.2344c-5e-3 -0.12485-0.05656-0.2433-0.14453-0.33203l-6.6328-6.6309-2e-3 -0.001953c-0.40517-0.40516-0.9416-0.60779-1.4746-0.60938-0.0015-4.32e-6 -0.0025-0.001952-0.0039-0.001953z', '--border', 'Destroyer'));
            svg.appendChild(createPath('m10.478 0.77247c-0.40788 0-0.81575 0.15559-1.127 0.46679-0.6224 0.6224-0.6224 1.6315 0 2.2539l1.1074 1.1094 2.2539-2.2539-1.1075-1.1094c-0.3112-0.31119-0.71908-0.46679-1.127-0.46679zm-1.7266 1.5644c-0.34971 0.0372-0.68899 0.18899-0.95703 0.45703-0.6224 0.6224-0.6224 1.6315 0 2.2539l1.1093 1.1094 1.4141-1.4141-1.1074-1.1094c-0.3544-0.35439-0.50817-0.8345-0.45898-1.2969zm4.1035 0.15234-2.2539 2.2539 5.3828 5.3828 1.6406 0.0742 0.11719 0.73438 1.0938 1.1816 0.09961-0.98438-0.5918-0.90039 0.90039 0.5918 0.98438-0.0996-1.1816-1.0938-0.73438-0.11719-0.07422-1.6406zm-5.6582 1.4024c-0.3502 0.0369-0.68863 0.19058-0.95703 0.45898-0.6224 0.6224-0.6224 1.6315 0 2.2539l1.1074 1.1094 1.416-1.416-1.1094-1.1094c-0.35435-0.35435-0.50617-0.83454-0.45703-1.2969zm3.2637 0.99414-1.4141 1.4141 5.3828 5.3809 1.6406 0.0742 0.11719 0.73437 1.0938 1.1816 0.09961-0.98243-0.5918-0.90039 0.90039 0.58985 0.98438-0.0996-1.1836-1.0938-0.73242-0.11719-0.03516-0.75977-0.87891-0.041zm-1.5547 1.5547-1.416 1.4141 5.3828 5.3828 1.6406 0.0742 0.11719 0.73438 1.0938 1.1816 0.09961-0.98243-0.5918-0.90039 0.90039 0.58985 0.98438-0.0996-1.1836-1.0938-0.73242-0.11719-0.03516-0.76367-0.87695-0.0391z', '--front', 'Destroyer'));
            svg.appendChild(createPath('m7.2246 1.2832c-0.38117 0.018756-0.74182 0.19453-0.99023 0.49023-0.48705 0.57952-0.41134 1.46 0.16797 1.9473l5.2793 4.4316c-0.53924 1.0819-0.86565 2.26-0.87109 3.4727a0.50005 0.50005 0 0 0 0 0.001953v1.0625a0.50005 0.50005 0 0 0 0.25 0.25 0.50005 0.50005 0 0 0-0.25 0.25v1.0293a0.50005 0.50005 0 0 0 0.5 0.5h10.184a0.50005 0.50005 0 0 0 0.5-0.5v-1.0293a0.50005 0.50005 0 0 0-0.25-0.25 0.50005 0.50005 0 0 0 0.25-0.25v-8.4375a0.50005 0.50005 0 0 0-0.52148-0.5c-0.89969 0.038762-1.7573 0.29214-2.5781 0.62109v-0.12109a0.50005 0.50005 0 0 0-0.52539-0.5c-1.1733 0.057824-2.2865 0.46133-3.3184 1.0156l-3.7715-3.1641a0.50005 0.50005 0 0 0-0.001953 0c-0.2231-0.18651-0.49898-0.29801-0.78906-0.31836-0.4403-0.030592-0.8704 0.15034-1.1543 0.48828-0.15295 0.18199-0.15548 0.41307-0.19922 0.63281l-0.95508-0.80273a0.50005 0.50005 0 0 0-0.0019531 0c-0.2231-0.18651-0.49898-0.29801-0.78906-0.31836-0.055038-0.003824-0.10961-0.0046326-0.16406-0.0019531z', '--border', 'Cruiser'));
            svg.appendChild(createPath('m7.3535 1.7833a0.88184 0.88184 0 0 0-0.73633 0.3125 0.88184 0.88184 0 0 0 0.10742 1.2422l5.5547 4.6621a7.3984 7.3984 0 0 0-0.96875 3.627v1.0625h2.5v-1.0625a7.3984 7.3984 0 0 1 0.96875-3.627l-5.5547-4.6621a0.88184 0.88184 0 0 1-0.2793-0.4375l-1.0879-0.91407a0.88184 0.88184 0 0 0-0.50391-0.20312zm3.0996 0a0.88184 0.88184 0 0 0-0.73633 0.3125 0.88184 0.88184 0 0 0 0.10742 1.2422l5.5547 4.6621a7.3984 7.3984 0 0 0-0.96875 3.627v1.0625h7.084v-8.4375a7.3984 7.3984 0 0 0-5.0703 2.3223l-0.31836-0.26757a7.3984 7.3984 0 0 1 2.2891-1.4902v-0.56445a7.3984 7.3984 0 0 0-3.4707 1.0625l-3.9668-3.3281a0.88184 0.88184 0 0 0-0.50391-0.20312zm0.85742 11.406v1.0293h10.184v-1.0293z', '--front', 'Cruiser'));
            svg.appendChild(createPath('m6.0957 8.5098a0.50005 0.50005 0 0 0-0.5 0.5v1.0898h-1.0898a0.50005 0.50005 0 0 0-0.5 0.5v1.4492a0.50005 0.50005 0 0 0 0.5 0.5h1.0898v1.0898a0.50005 0.50005 0 0 0 0.5 0.5h1.4492a0.50005 0.50005 0 0 0 0.5-0.5v-1.0898h1.0898a0.50005 0.50005 0 0 0 0.5-0.5v-1.4492a0.50005 0.50005 0 0 0-0.5-0.5h-1.0898v-1.0898a0.50005 0.50005 0 0 0-0.5-0.5z', '--border', 'HeavyCruiser'));
            svg.appendChild(createPath('m6.0957 9.0098v1.5898h-1.5898v1.4492h1.5898v1.5898h1.4492v-1.5898h1.5898v-1.4492h-1.5898v-1.5898z', '--front', 'HeavyCruiser'));
            svg.appendChild(createPath('m8.0059 2.4336c-0.4935-0.0077946-0.97786 0.25039-1.2363 0.70703-0.22877 0.40474-0.16855 0.84476 0.015625 1.2402l-2.418-1.3672c-0.20682-0.11691-0.43628-0.17588-0.66016-0.17969-0.49354-0.007795-0.97899 0.24893-1.2383 0.70703-0.37564 0.66458-0.13675 1.5225 0.52734 1.8984l4.3164 2.4375-0.3125 3.3359c-0.064284 0.68623 0.47657 0.94336 1.0703 0.94336h2.2012c-0.0078 0.05048-0.0078 0.10186 0 0.15234 0.30477 0.52313 0.8705 0.75018 1.5918 0.94726 0.7213 0.19708 1.6254 0.31055 2.6348 0.31055 1.1834 0 2.7624-0.2833 4.0898-0.65234 0.66374-0.18452 1.2599-0.38897 1.7188-0.60742 0.22943-0.10923 0.42449-0.21847 0.5918-0.35547 0.16731-0.137 0.36133-0.32071 0.36133-0.65625v-1.2266l1.3008-0.54297c0.45185-0.18844 0.64062-0.54862 0.64062-0.93359v-1.832c0.28262-0.14497 0.50976-0.38483 0.50977-0.71875v-0.89062c0-0.43453-0.34838-0.77095-0.76953-0.82812-0.13684-0.23311-0.23777-0.52344-0.52344-0.52344h-9.1934c-0.20851 0-0.41344 0.072495-0.58203 0.15039l-0.90039 0.41602-3.0723-1.75-0.00195-0.00195c-0.20863-0.11794-0.43831-0.17588-0.66211-0.17969z', '--border', 'Battleship'));
            svg.appendChild(createPath('m7.9982 2.9337c-0.31657-5e-3 -0.62604 0.15821-0.79297 0.45313-0.24253 0.42909-0.09105 0.97398 0.33789 1.2168l6.8477 3.8965 0.87891-1.5527-0.51758-0.29492 0.24805-0.4414h0.95703l0.19726 0.63671-0.99805 1.7754v0.9375h-1.1074l-0.4043-0.49024v-0.44726l0.09961-0.17579-2.2734-1.293-0.82422 1.4688v0.9375h-0.96875l-0.37109-0.44922 0.0078-0.56446-1.4844-0.83984-0.33203 3.5527c0.07811 0.32983 0.35609 0.37759 0.57227 0.39649h7.8457c0.18254 5e-3 0.35914-0.0857 0.54102-0.12891l5.9102-2.4629c0.23643-0.17229 0.29267-0.23789 0.33398-0.47266v-1.9844c-0.01901 3e-3 -0.03868 4e-3 -0.05859 4e-3h-1.9863c-0.20447 0-0.36914-0.16468-0.36914-0.36914v-0.89063c0-0.15335 0.09205-0.28592 0.22461-0.3418h2e-3c-0.0018 4e-3 -0.0023 9e-3 -0.0039 0.0137-0.0062 0.017-0.01195 0.0347-0.01563 0.0527v2e-3c-0.0023 0.0114-0.0027 0.0234-0.0039 0.0352-0.0011 0.0124-2e-3 0.0244-2e-3 0.0371v0.89062c0 0.0767 0.02278 0.14815 0.0625 0.20704 0.01324 0.0196 0.02824 0.038 0.04492 0.0547s0.03506 0.0317 0.05469 0.0449 0.04041 0.0239 0.0625 0.0332c0.02209 9e-3 0.04429 0.0166 0.06836 0.0215h2e-3c0.02349 5e-3 0.04932 8e-3 0.07422 8e-3h1.9844c0.20447 0 0.36914-0.16467 0.36914-0.36914v-0.89062c0-0.20447-0.16467-0.36914-0.36914-0.36914h-0.14062v-0.19727c0-0.15739-0.12581-0.28515-0.2832-0.28515h-9.1934c-0.19382 9e-3 -0.21484 0.0268-0.36524 0.0996l-1.1406 0.52734-3.2969-1.877c-0.13409-0.0758-0.27993-0.11279-0.42383-0.11524zm-4.2988 0.40039c-0.31657-5e-3 -0.628 0.15821-0.79492 0.45313-0.24253 0.42909-0.09105 0.97398 0.33789 1.2168l6.4238 3.6289 0.87891-1.5527-6.4238-3.6309c-0.13409-0.0758-0.27798-0.11279-0.42188-0.11524zm17.061 6.8008-4.3027 1.793c-0.18187 0.0432-0.35848 0.13391-0.54102 0.12891h-5.2129c0.3302 0.56678 1.8521 1.0098 3.7949 1.0098 2.2005 0 6.2617-1.0984 6.2617-1.7715z', '--front', 'Battleship'));
            svg.appendChild(createPath('m18.551 0.72852c-0.4485 0.023962-0.81188 0.29458-1.1309 0.6543-0.26373 0.29742-0.53489 0.73532-0.82227 1.2109-0.21266-0.032312-0.42753-0.099456-0.63867-0.041016-0.17209 0.047632-0.35326 0.14764-0.48047 0.31055-0.12721 0.16291-0.18563 0.37082-0.1875 0.5625-0.002833 0.28779 0.063927 0.53603 0.099609 0.79688-0.86728 0.13768-1.7826 0.3025-2.748 0.5-1.489-1.2531-3.0422-2.2196-4.3555-2.7656-0.69162-0.28752-1.316-0.47484-1.8535-0.55273-0.53755-0.077895-1.0063-0.087996-1.4062 0.20508-0.20198 0.14799-0.34409 0.37663-0.39844 0.60742-0.054343 0.23079-0.03773 0.45975 0.0097657 0.68945 0.069666 0.33692 0.27629 0.71294 0.47461 1.0898-0.057745 0.053173-0.13191 0.08467-0.18164 0.15039-0.14597 0.19291-0.23937 0.49576-0.16602 0.76953 0.09483 0.35391 0.44026 0.56776 0.72461 0.63086 0.1848 0.041008 0.38429 0.018858 0.58008 0.0097656 0.10535 0.14355 0.21291 0.28844 0.32617 0.43555-0.12823 0.25458-0.33057 0.49177-0.25195 0.78516 0.055014 0.20532 0.24747 0.30494 0.41211 0.42773-0.44973 0.33304-0.97052 0.6575-1.252 1.0098-0.45617 0.57098-0.71595 1.2328-0.46094 1.8496 0.2291 0.55414 0.74349 0.87532 1.2832 1.0254 0.53971 0.15007 1.141 0.16405 1.7422 0.11523 1.0307-0.083688 1.9029-0.37905 2.5664-0.69336 0.026552 0.026936 0.050747 0.052699 0.078125 0.080078 0.027642 0.027642 0.051596 0.050233 0.078125 0.076172-0.16647 0.31082-0.42303 0.61053-0.33594 0.93555 0.063505 0.23701 0.24402 0.42679 0.42578 0.52734 0.18176 0.10055 0.36902 0.14194 0.5625 0.16406 0.31017 0.03546 0.66897-0.010354 1.0332-0.058594 0.21499 0.18839 0.42686 0.36758 0.63672 0.54102-0.075675 0.22975-0.21447 0.45083-0.14844 0.69726 0.061804 0.23066 0.23184 0.41571 0.40625 0.51953s0.35633 0.15137 0.54492 0.17969c0.32506 0.048816 0.69717 0.016648 1.084-0.029297 0.77075 0.491 1.4813 0.87041 2.1074 1.0312 0.67649 0.17378 1.3547 0.13164 1.8047-0.31836 0.35982-0.35982 0.45309-0.88634 0.37891-1.4004s-0.29278-1.0663-0.61914-1.6836c-0.58668-1.1097-1.6356-2.4827-2.8535-3.9453 0.010718-0.0078593 0.02047-0.013505 0.03125-0.021484 0.64916-0.48054 1.3973-0.82949 2.0996-1.1113 0.84996 0.38668 1.6269 0.6521 2.2441 0.65039 0.34521-9.563e-4 0.66678-0.064006 0.93945-0.25195s0.45221-0.52419 0.46875-0.85938c0.01665-0.33745-0.11331-0.66628-0.30469-0.90234-0.13912-0.17161-0.32292-0.29833-0.50195-0.43359-9.65e-4 -0.10148 0.055347-0.19515 0.015625-0.29297-0.04812-0.1185-0.15666-0.16002-0.24023-0.24023-0.074723-0.61967-0.13984-1.2898-0.26172-1.8828-0.13035-0.63419-0.2648-1.2361-0.83008-1.5625-0.2168-0.12517-0.46796-0.20533-0.72852-0.19141z', '--border', 'Carrier'));
            svg.appendChild(createPath('m18.577 1.2274c-0.51076 0.027288-1.0033 0.64798-1.7188 1.873-0.62685-0.1853-1.0622-0.099712-1.0664 0.33008-0.0047 0.47748 0.02 0.86249 0.14258 1.2012-1.0345 0.15279-2.1876 0.36709-3.3867 0.61523-3.0381-2.6439-6.4244-3.8207-7.2246-3.2344-0.42975 0.31487-0.2223 1.0918 0.39258 2.125-0.34297 0.19798-0.52979 0.41333-0.4668 0.64844 0.077932 0.29085 0.49618 0.34512 1.0762 0.27734 0.18126 0.25471 0.38149 0.51885 0.59375 0.79102-0.24647 0.27832-0.3524 0.56389-0.29102 0.79297 0.080303 0.2997 0.42962 0.39751 0.95703 0.36328-1.6861 0.98173-2.5924 2.1059-2.2793 2.8633 0.62378 1.5088 4.3408 0.68119 5.2969 0.095703 0.08889 0.089872 0.17619 0.1801 0.26562 0.26953 0.08687 0.08687 0.1716 0.16728 0.25781 0.25195-0.34894 0.32398-0.4661 0.68615-0.38672 0.98242 0.10145 0.37865 0.82524 0.40137 1.7129 0.25586 0.33738 0.29887 0.66792 0.58178 0.98828 0.83984-0.17974 0.28773-0.24662 0.56931-0.19141 0.77539 0.09931 0.37063 0.79437 0.42296 1.6562 0.30078 1.6357 1.0763 2.8883 1.4262 3.4551 0.85938 0.89681-0.89681-0.62826-3.4998-3.4434-6.7949 0.14236-0.095441 0.28673-0.19453 0.43555-0.30469 0.74041-0.54809 1.5799-0.94464 2.3418-1.2422 0.0041 0.00202 0.0076 0.00384 0.01172 0.00586 1.8749 0.92186 3.1564 0.86843 3.1973 0.041016 0.021539-0.43652-0.27845-0.70671-0.78516-1.0684 0.1218-0.27144 0.032074-0.46149-0.22461-0.58398-0.16499-1.3281-0.27661-2.8664-0.86328-3.2051-0.15694-0.09061-0.30534-0.1329-0.45312-0.125z', '--front', 'Carrier'));
            svg.appendChild(createPath('m11.641 1.2812c-0.27613 2.76e-5 -0.49997 0.22387-0.5 0.5v1.4238c-0.071825 0.028639-0.14242 0.059966-0.21289 0.091797l-1.0098-1.0098c-0.19526-0.19518-0.51177-0.19518-0.70703 0l-1.9238 1.9238c-0.19518 0.19526-0.19518 0.51177 0 0.70703l1.0098 1.0098c-0.031831 0.070468-0.063157 0.14107-0.091797 0.21289h-1.4238c-0.27613 2.76e-5 -0.49997 0.22387-0.5 0.5v2.7188c2.76e-5 0.27613 0.22387 0.49997 0.5 0.5h1.4238c0.02864 0.071825 0.059966 0.14242 0.091797 0.21289l-1.0098 1.0098c-0.19518 0.19526-0.19518 0.51177 0 0.70703l1.9238 1.9238c0.19526 0.19518 0.51177 0.19518 0.70703 0l1.0098-1.0098c0.070468 0.03183 0.14107 0.063158 0.21289 0.091797v1.4238c2.8e-5 0.27613 0.22387 0.49997 0.5 0.5h2.7188c0.27613-2.8e-5 0.49997-0.22387 0.5-0.5v-1.418c0.074215-0.028581 0.14788-0.057871 0.2207-0.089843l1.002 1.002c0.19526 0.19518 0.51177 0.19518 0.70703 0l1.9238-1.9238c0.19518-0.19526 0.19518-0.51177 0-0.70703l-1.002-1.002c0.031972-0.072818 0.061263-0.14649 0.089843-0.2207h1.418c0.27613-2.76e-5 0.49997-0.22387 0.5-0.5v-2.7188c-2.8e-5 -0.27613-0.22387-0.49997-0.5-0.5h-1.4238c-0.02864-0.071825-0.059966-0.14242-0.091797-0.21289l1.0098-1.0098c0.19518-0.19526 0.19518-0.51177 0-0.70703l-1.9238-1.9238c-0.19526-0.19518-0.51177-0.19518-0.70703 0l-1.0098 1.0098c-0.070468-0.03183-0.14107-0.063158-0.21289-0.091797v-1.4238c-2.8e-5 -0.27613-0.22387-0.49997-0.5-0.5z', '--border', 'Repair'));
            svg.appendChild(createPath('m11.641 1.7812v1.752a4.6719 4.6719 0 0 0-0.83008 0.35351l-1.2461-1.2461-1.9238 1.9238 1.2461 1.2461a4.6719 4.6719 0 0 0-0.35352 0.83008h-1.752v2.7188h1.752a4.6719 4.6719 0 0 0 0.35352 0.83008l-1.2461 1.2461 1.9238 1.9238 1.2461-1.2461a4.6719 4.6719 0 0 0 0.83008 0.35351v1.752h2.7188v-1.75a4.6719 4.6719 0 0 0 0.83984-0.34571l1.2363 1.2363 1.9238-1.9238-1.2363-1.2363a4.6719 4.6719 0 0 0 0.3457-0.83984h1.75v-2.7188h-1.752a4.6719 4.6719 0 0 0-0.35352-0.83008l1.2461-1.2461-1.9238-1.9238-1.2461 1.2461a4.6719 4.6719 0 0 0-0.83008-0.35351v-1.752zm1.3594 4.3594a1.8594 1.8594 0 0 1 1.8594 1.8594 1.8594 1.8594 0 0 1-1.8594 1.8594 1.8594 1.8594 0 0 1-1.8594-1.8594 1.8594 1.8594 0 0 1 1.8594-1.8594z', '--front', 'Repair'));
            svg.appendChild(createPath('m11.641 1.2812c-0.27613 2.76e-5 -0.49997 0.22387-0.5 0.5v1.4238c-0.071825 0.028639-0.14242 0.059966-0.21289 0.091797l-1.0098-1.0098c-0.19526-0.19518-0.51177-0.19518-0.70703 0l-1.9238 1.9238c-0.19518 0.19526-0.19518 0.51177 0 0.70703l1.0098 1.0098c-0.031831 0.070468-0.063157 0.14107-0.091797 0.21289h-1.4238c-0.27613 2.76e-5 -0.49997 0.22387-0.5 0.5v2.7188c2.76e-5 0.27613 0.22387 0.49997 0.5 0.5h1.4238c0.02864 0.071825 0.059966 0.14242 0.091797 0.21289l-1.0098 1.0098c-0.19518 0.19526-0.19518 0.51177 0 0.70703l1.9238 1.9238c0.19526 0.19518 0.51177 0.19518 0.70703 0l1.0098-1.0098c0.070468 0.03183 0.14107 0.063158 0.21289 0.091797v1.4238c2.8e-5 0.27613 0.22387 0.49997 0.5 0.5h2.7188c0.27613-2.8e-5 0.49997-0.22387 0.5-0.5v-1.418c0.074215-0.028581 0.14788-0.057871 0.2207-0.089843l1.002 1.002c0.19526 0.19518 0.51177 0.19518 0.70703 0l1.9238-1.9238c0.19518-0.19526 0.19518-0.51177 0-0.70703l-1.002-1.002c0.031972-0.072818 0.061263-0.14649 0.089843-0.2207h1.418c0.27613-2.76e-5 0.49997-0.22387 0.5-0.5v-2.7188c-2.8e-5 -0.27613-0.22387-0.49997-0.5-0.5h-1.4238c-0.02864-0.071825-0.059966-0.14242-0.091797-0.21289l1.0098-1.0098c0.19518-0.19526 0.19518-0.51177 0-0.70703l-1.9238-1.9238c-0.19526-0.19518-0.51177-0.19518-0.70703 0l-1.0098 1.0098c-0.070468-0.03183-0.14107-0.063158-0.21289-0.091797v-1.4238c-2.8e-5 -0.27613-0.22387-0.49997-0.5-0.5z', '--border', 'Repair'));
            svg.appendChild(createPath('m11.641 1.7812v1.752a4.6719 4.6719 0 0 0-0.83008 0.35351l-1.2461-1.2461-1.9238 1.9238 1.2461 1.2461a4.6719 4.6719 0 0 0-0.35352 0.83008h-1.752v2.7188h1.752a4.6719 4.6719 0 0 0 0.35352 0.83008l-1.2461 1.2461 1.9238 1.9238 1.2461-1.2461a4.6719 4.6719 0 0 0 0.83008 0.35351v1.752h2.7188v-1.75a4.6719 4.6719 0 0 0 0.83984-0.34571l1.2363 1.2363 1.9238-1.9238-1.2363-1.2363a4.6719 4.6719 0 0 0 0.3457-0.83984h1.75v-2.7188h-1.752a4.6719 4.6719 0 0 0-0.35352-0.83008l1.2461-1.2461-1.9238-1.9238-1.2461 1.2461a4.6719 4.6719 0 0 0-0.83008-0.35351v-1.752zm1.3594 4.3594a1.8594 1.8594 0 0 1 1.8594 1.8594 1.8594 1.8594 0 0 1-1.8594 1.8594 1.8594 1.8594 0 0 1-1.8594-1.8594 1.8594 1.8594 0 0 1 1.8594-1.8594z', '--front', 'Repair'));
            svg.appendChild(createPath('m8.4727 2.4512a0.50005 0.50005 0 0 0-0.29492 0.095703l-3.3301 2.4316a0.50005 0.50005 0 0 0-0.16797 0.56641 0.50005 0.50005 0 0 0-0.037109 0.037109v7.4687a0.50005 0.50005 0 0 0 0.5 0.49805h12.184a0.50005 0.50005 0 0 0 0.060547-0.060547 0.50005 0.50005 0 0 0 0.43555-0.035156l3.3301-2.4316a0.50005 0.50005 0 0 0 0.20508-0.40234v-7.4688a0.50005 0.50005 0 0 0-0.30078-0.44531 0.50005 0.50005 0 0 0-0.40039-0.25391z', '--border', 'Munition'));
            svg.appendChild(createPath('m8.4727 2.9502-3.3301 2.4316h12.184l3.3301-2.4316zm12.385 0.19922-3.3301 2.4316v7.4688l3.3301-2.4316zm-15.715 2.4316v7.4688h12.184v-7.4688zm1.1953 1.3242h0.99414v4.7734h-0.99414zm2.1992 0h0.99414v4.7734h-0.99414zm2.2012 0h0.99414v4.7734h-0.99414zm2.1992 0h0.99414v4.7734h-0.99414zm2.1992 0h0.99609v4.7734h-0.99609z', '--front', 'Munition'));
            svg.appendChild(createPath('m 13.203125,1.433594 c -0.442302,0.0014 -0.810016,0.372151 -0.808594,0.814453 l -0.002,0.04102 H 9.9414062 C 9.5606435,2.28857 9.2255622,2.601381 9.2246094,2.996098 a 0.50005,0.50005 0 0 0 0,0.0039 C 9.2250146,3.167839 9.4300974,3.180187 9.5292969,3.300775 9.2030436,3.649902 8.9995881,4.118615 9,4.632807 c 2.636e-4,1.022751 0.804827,1.85829 1.808594,1.898437 l -0.382813,0.664063 c -0.116917,0.202027 0.08187,0.382576 0.15625,0.59375 H 7.9296875 c -0.4598783,0 -0.8593099,0.376377 -0.859375,0.847656 4.87e-5,0.351224 0.2493486,0.59338 0.5527344,0.722656 C 7.3103211,9.753681 7.0620663,10.218305 7.0625,10.75976 c 2.16e-5,0.602091 0.283078,1.130317 0.6875,1.552734 L 7.1699219,13.3164 c -0.2111442,0.367205 -0.095861,0.861079 0.28125,1.080078 a 0.50005,0.50005 0 0 0 0.00195,0 c 0.3792849,0.219969 0.8678073,0.07429 1.0800781,-0.294922 l 0.625,-1.082031 c 0.034813,0.0021 0.068606,0.01327 0.1035157,0.01367 a 0.50005,0.50005 0 0 0 0.00586,0 h 2.7597663 l -0.0332,0.951172 a 0.50005,0.50005 0 0 0 0,0.01758 c 9.63e-4,0.662911 0.547127,1.214316 1.210937,1.214844 0.664188,2.37e-4 1.211928,-0.551327 1.212891,-1.214844 a 0.50005,0.50005 0 0 0 0,-0.002 0.50005,0.50005 0 0 0 0,-0.002 0.50005,0.50005 0 0 0 0,-0.002 0.50005,0.50005 0 0 0 0,-0.002 0.50005,0.50005 0 0 0 0,-0.002 0.50005,0.50005 0 0 0 0,-0.002 0.50005,0.50005 0 0 0 0,-0.002 0.50005,0.50005 0 0 0 0,-0.002 c -3.91e-4,-0.01258 -0.0012,-0.02455 -0.002,-0.03711 l -0.03125,-0.916016 h 3.277343 l 0.617188,1.070313 a 0.50005,0.50005 0 0 0 0.002,0.0039 c 0.21382,0.364504 0.699258,0.508321 1.076172,0.291016 a 0.50005,0.50005 0 0 0 0.002,-0.002 c 0.37711,-0.218999 0.492395,-0.712874 0.28125,-1.080078 l -0.287109,-0.496094 a 0.50005,0.50005 0 0 0 -0.0039,-0.617187 C 18.693224,11.454549 18.476992,10.868 18.435602,10.206597 18.416362,9.899168 18.469652,9.756071 18.529352,9.673394 18.586872,9.594074 18.6807,9.527621 18.875,9.47265 19.286896,9.41862 19.62494,9.070058 19.625,8.636713 19.624935,8.165434 19.225504,7.789057 18.765625,7.789057 h -2.9375 c 0.07367,-0.211446 0.271898,-0.39406 0.154297,-0.595704 L 15.617188,6.558588 h 1.566406 a 0.50005,0.50005 0 0 0 0.375,-0.830072 C 17.251986,5.379077 16.929033,5.071463 16.697266,4.798828 16.465497,4.526193 16.355255,4.303073 16.347656,4.181641 c -0.01458,-0.23291 0.02495,-0.323242 0.05664,-0.367188 0.03169,-0.04394 0.08539,-0.08739 0.240234,-0.128906 a 0.50005,0.50005 0 0 0 0.322266,-0.445313 c 0.05826,-0.09999 0.21669,-0.111354 0.21875,-0.234375 a 0.50005,0.50005 0 0 0 0,-0.0019 0.50005,0.50005 0 0 0 0,-0.002 0.50005,0.50005 0 0 0 0,-0.002 0.50005,0.50005 0 0 0 0,-0.0019 0.50005,0.50005 0 0 0 0,-0.002 C 17.184595,2.601321 16.849513,2.288516 16.46875,2.289013 h -2.449219 l -0.002,-0.04102 c 0.0014,-0.444174 -0.370279,-0.815882 -0.814453,-0.814454 z m -0.976563,5.730469 -0.02148,0.625 h -0.33789 z m 1.958985,0.0019 0.359375,0.623047 h -0.337891 z', '--border', 'SailingFrigate'));
            svg.appendChild(createPath('m 13.205078,1.933594 a 0.31150001,0.31150001 0 0 0 -0.310547,0.3125 l -0.01758,0.542969 H 9.9414062 A 0.21650577,0.20947384 0 0 0 9.7246094,2.998047 0.21650577,0.20947384 0 0 0 9.9414062,3.207031 H 10.800781 C 10.075313,3.245291 9.4993878,3.868514 9.5,4.632813 c 2.032e-4,0.788339 0.61337,1.425806 1.371094,1.425781 h 0.789062 l -0.800781,1.386719 a 0.27090429,0.27999841 30 0 0 0.0957,0.378906 0.27090429,0.27999841 30 0 0 0.375,-0.107422 l 0.957031,-1.658203 h 0.478516 L 12.703125,7.875 h 1.005859 l -0.0625,-1.816406 h 0.476563 l 0.958984,1.658203 a 0.27999841,0.27090429 60 0 0 0.375,0.107422 0.27999841,0.27090429 60 0 0 0.09375,-0.378906 L 14.75,6.058594 h 2.433594 C 16.611791,5.406914 15.886116,4.827484 15.847656,4.212891 15.809194,3.598296 16.067895,3.323166 16.515625,3.203125 h -0.02539 A 0.21650577,0.20947384 0 0 0 16.685547,2.998047 0.21650577,0.20947384 0 0 0 16.46875,2.789063 h -2.933594 l -0.01758,-0.542969 a 0.31150001,0.31150001 0 0 0 -0.3125,-0.3125 z M 7.9296875,8.289063 a 0.359375,0.3477028 0 0 0 -0.359375,0.347656 0.359375,0.3477028 0 0 0 0.359375,0.347656 H 9.2675781 A 1.7050229,1.7739128 0 0 0 7.5625,10.759766 a 1.7050229,1.7739128 0 0 0 0.7949219,1.5 l -0.7539063,1.30664 a 0.28618485,0.29579193 30 0 0 0.099609,0.398438 0.28618485,0.29579193 30 0 0 0.3964844,-0.113282 l 0.7890625,-1.367187 a 1.7050229,1.7739128 0 0 0 0.3789062,0.04883 h 3.2773443 l -0.05078,1.46875 a 0.71149999,0.71589065 0 0 0 0.710937,0.714844 0.71149999,0.71589065 0 0 0 0.712891,-0.714844 0.71149999,0.71589065 0 0 0 -0.002,-0.03516 l -0.04883,-1.433594 h 4.083984 l 0.761719,1.320313 a 0.29579193,0.28618485 60 0 0 0.394531,0.111328 0.29579193,0.28618485 60 0 0 0.09961,-0.398438 l -0.595703,-1.033203 h 0.363281 c -0.710439,-0.809735 -0.991226,-1.531264 -1.039015,-2.29492 -0.04779,-0.763656 0.273758,-1.10475 0.830078,-1.253906 A 0.359375,0.3477028 0 0 0 19.125,8.636719 0.359375,0.3477028 0 0 0 18.765625,8.289063 Z', '--front', 'SailingFrigate'));
            shadow.appendChild(style);
            shadow.appendChild(svg);
        }
        get type() {
            return this.getAttribute('type') || '';
        }
        set type(value) {
            if (SHIP_TYPES.includes(value)) {
                this.setAttribute('type', value);
                this.title = NAMES[value];
            }
            else {
                this.removeAttribute('type');
                this.title = '';
            }
        }
    }, script.dataset.tagname);
});
function DrawMeowfficers(parent) {
    const createMeowfficerAbility = (ability, lv = 0) => {
        const meowfficerAbility = new (customElements.get('meowfficer-ability'))();
        meowfficerAbility.type = ability.type;
        if (ability.target) {
            meowfficerAbility.target = ability.target;
        }
        if (0 < lv) {
            meowfficerAbility.lv = lv;
        }
        return meowfficerAbility;
    };
    Promise.all([
        customElements.whenDefined('meowfficer-ability'),
        customElements.whenDefined('ship-type'),
    ]).then(() => {
        const tbody = document.createElement('tbody');
        const SP = [
            'WindsAlacrity',
            'ForestsSerenity',
            'FlamesAggression',
            'MountainsTenacity',
            'Destiny',
        ];
        Object.keys(MEOWFFICERS).forEach((name) => {
            const data = MEOWFFICERS[name];
            const sp = Common.td('', { class: ['abilities', 'sp'] });
            const abilities = Common.td('', { class: 'abilities' });
            const shipType = new (customElements.get('ship-type'))();
            shipType.type = data.target;
            const tr = Common.tr({ class: ['rarity', `back_${data.rarity}`] }, Common.td('', { class: ['icon', name] }), Common.td(data.name), Common.td('', { class: data.nation }), Common.td('', { class: `type${data.type}` }), Common.td(shipType), sp, abilities);
            data.abilities.forEach((ability) => {
                const data = Meowfficer.search(ability);
                if (!data) {
                    return;
                }
                const button = createMeowfficerAbility(data);
                button.title = Meowfficer.convertNameJa(data, data.lv ? 1 : 0);
                button.option = true;
                const name = Meowfficer.convertName(data, data.lv ? 1 : 0);
                button.addEventListener('click', () => {
                    document.getElementById(name).scrollIntoView({ behavior: 'smooth' });
                });
                abilities.appendChild(button);
            });
            if (data.abilities2) {
                data.abilities2.forEach((ability) => {
                    const data = Meowfficer.search(ability);
                    if (!data) {
                        return;
                    }
                    const button = createMeowfficerAbility(data, 2);
                    button.title = Meowfficer.convertNameJa(data, 2);
                    button.option = true;
                    const name = Meowfficer.convertName(data, 2);
                    button.addEventListener('click', () => {
                        document.getElementById(name).scrollIntoView({ behavior: 'smooth' });
                    });
                    abilities.appendChild(button);
                });
            }
            Meowfficer.sort(abilities);
            const list = [];
            for (const ability of abilities.children) {
                if (SP.includes(ability.type)) {
                    list.push(ability);
                }
            }
            for (const button of list) {
                sp.appendChild(button);
            }
            tbody.appendChild(tr);
        });
        const header = Common.tr({}, Common.td(''), Common.td('名前', { class: 'name' }), Common.td('所属', { class: 'nation' }), Common.td('タイプ', { class: 'type' }), Common.td('艦種', { class: 'ship' }), Common.td('初期アビリティ', { colSpan: 2 }));
        const thead = document.createElement('thead');
        thead.appendChild(header);
        const table = document.createElement('table');
        table.classList.add('meowfficers');
        table.appendChild(thead);
        table.appendChild(tbody);
        parent.appendChild(table);
        const abilities = document.createElement('table');
        abilities.classList.add('abilities');
        Meowfficer.ABILITIES.forEach((ability) => {
            const max = 0 < ability.lv ? 3 : 1;
            for (let lv = 1; lv <= max; ++lv) {
                const icon = createMeowfficerAbility(ability, max === 1 ? 0 : lv);
                const name = Meowfficer.convertName(ability, lv);
                abilities.appendChild(Common.tr({ id: name, class: name }, Common.td(icon), Common.td(Meowfficer.convertNameJa(ability, lv)), Common.td(Meowfficer.getSkillInfo(ability, lv), { isHTML: true })));
            }
        });
        Meowfficer.sort(abilities);
        parent.appendChild(abilities);
    });
}
Promise.all([
    customElements.whenDefined('section-pages'),
]).then(() => {
    setTimeout(() => {
        DrawMeowfficers(document.getElementById('meowfficers'));
    }, 100);
});
