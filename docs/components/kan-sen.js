((script, init) => {
    const baseDir = script.dataset.kansen || new URL('./kansen', script.src).toString();
    if (document.readyState !== 'loading') {
        return init(script, baseDir);
    }
    document.addEventListener('DOMContentLoaded', () => {
        init(script, baseDir);
    });
})(document.currentScript, (script, baseDir) => {
    try {
        new URL(baseDir);
    }
    catch (error) {
        baseDir = new URL(baseDir, script.src).toString();
    }
    const loader = fetch(`${baseDir}/list.json`).then((response) => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(`Error: ${response.statusText}(${response.status})`);
    }).catch((error) => {
        console.error(error);
        return {};
    });
    const KANSEN_RARITYS = ['N', 'R', 'SR', 'SSR', 'UR'];
    const KANSEN_TYPES = [
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
    const KANSEN_FLEET_TYPES = ['main', 'vanguard', 'submarine'];
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
    const KANSEN_OPTIONS = ['mu', 'battleship', 'main', 'vanguard'];
    const CONVERT_TABLE = {
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
    const AFFILIATION_TYPES = [
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
    })(class KanSen extends HTMLElement {
        static kansen = {};
        static list(fleet) {
            const list = [];
            const TYPES = fleet === 'submarine' ? KANSEN_FLEET_SUBMARINE : fleet === 'main' ? KANSEN_FLEET_MAIN : KANSEN_FLEET_VANGUARD;
            const create = (detail) => {
                detail.name = this.createName(detail.name, detail);
                const option = detail.type === 'ddg' ? detail.fleet : detail.mu ? 'mu' : detail.battleship ? 'battleship' : '';
                detail.fullkey = this.createFullKey(detail.key, detail.affiliation, {
                    retrofit: !!detail.retrofit,
                    option: option,
                });
                detail.url = this.createURL(detail.key, detail.affiliation, {
                    retrofit: !!detail.retrofit,
                    option: option,
                });
                return detail;
            };
            Object.keys(this.kansen).forEach((affiliation) => {
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
        static createName(name, option) {
            return `${name}${option.battleship ? '(戦艦)' : ''}${option.mu ? '(μ兵装)' : ''}${option.retrofit ? '改' : ''}`;
        }
        static createFullKey(name, affiliation, option) {
            if (!name) {
                return '';
            }
            const op = `${option.retrofit ? '_retrofit' : ''}${option.option ? '_' + option.option : ''}`;
            return `${affiliation ? affiliation + ':' : ''}${name}${op}`;
        }
        static createURL(name, affiliation, option) {
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
        reset() {
            this.removeAttribute('fleet');
            this.removeAttribute('name');
            this.removeAttribute('affiliation');
            this.removeAttribute('retrofit');
            this.removeAttribute('option');
            return this;
        }
        update() {
            const data = this.search(this.name, this.affiliation);
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
            }
            else if (data.info.type === 'ddg') {
                this.option = data.fleet === 'main' ? 'main' : 'vanguard';
            }
            if (data.type === 'ddg') {
                this.fleet = data.fleet;
            }
            else {
                const fleet = KANSEN_FLEET_MAIN.includes(data.info.type)
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
        searchFromAffiliation(name, affiliation) {
            const option = {
                name: name,
                type: '',
                retrofit: !!name.match(/_retrofit(_vanguard|_main){0,1}$/),
                option: '',
                fleet: name.replace(/^.+_(vanguard|main)$/, '$1'),
            };
            if (option.fleet === name) {
                option.fleet = '';
            }
            if (name.match(/_mu$/)) {
                option.option = 'mu';
            }
            else if (name.match(/_battleship$/)) {
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
                }
                else if (!option.retrofit) {
                    option.retrofit = this.retrofit;
                }
                option.type = option.retrofit && typeof retrofit === 'string' ? retrofit : kansen.type;
                if (!option.fleet) {
                    if (option.type === 'ddg') {
                        option.fleet = this.fleet === 'vanguard' ? 'vanguard' : 'main';
                        option.option = option.fleet;
                    }
                    else {
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
        search(name, affiliation) {
            if (name.match(/.+:.+/)) {
                let aff;
                [aff, name] = name.split(':');
                if (!affiliation) {
                    affiliation = aff;
                }
            }
            if (affiliation) {
                const result = this.searchFromAffiliation(name, affiliation);
                return result;
            }
            const affiliations = Object.keys(KanSen.kansen);
            for (const affiliation of affiliations) {
                const result = this.searchFromAffiliation(name, affiliation);
                if (result) {
                    return result;
                }
            }
            return null;
        }
        get fleet() {
            const type = this.getAttribute('fleet') || '';
            return KANSEN_FLEET_TYPES.includes(type) ? type : '';
        }
        set fleet(value) {
            if (KANSEN_FLEET_TYPES.includes(value)) {
                this.setAttribute('fleet', value);
            }
            else {
                this.removeAttribute('fleet');
            }
        }
        get affiliation() {
            const affiliation = this.getAttribute('affiliation') || '';
            return AFFILIATION_TYPES.includes(affiliation) ? affiliation : '';
        }
        set affiliation(value) {
            if (AFFILIATION_TYPES.includes(value)) {
                this.setAttribute('affiliation', value);
            }
            else {
                this.removeAttribute('affiliation');
            }
        }
        get name() {
            return this.getAttribute('name') || '';
        }
        set name(value) {
            if (value) {
                this.setAttribute('name', value);
            }
            else {
                this.removeAttribute('name');
            }
        }
        get retrofit() {
            return this.hasAttribute('retrofit');
        }
        set retrofit(value) {
            if (!value) {
                this.removeAttribute('retrofit');
            }
            else {
                this.setAttribute('retrofit', '');
            }
        }
        get option() {
            const option = this.getAttribute('option') || '';
            return KANSEN_OPTIONS.includes(option) ? option : '';
        }
        set option(value) {
            if (KANSEN_OPTIONS.includes(value)) {
                this.setAttribute('option', value);
            }
            else {
                this.removeAttribute('option');
            }
        }
        get fullkey() {
            return KanSen.createFullKey(this.name, this.affiliation, { retrofit: this.retrofit, option: this.option });
        }
        get icon() {
            return KanSen.createURL(this.name, this.affiliation, { retrofit: this.retrofit, option: this.option });
        }
        static get observedAttributes() {
            return ['name'];
        }
        attributeChangedCallback(attrName, oldVal, newVal) {
            if (oldVal === newVal) {
                return;
            }
            this.update();
        }
    }, script.dataset.tagname);
});
