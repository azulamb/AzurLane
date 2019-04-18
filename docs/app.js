class KansenData {
    constructor(kansen) {
        this.kansen = kansen;
    }
    search(kansen) {
        for (let k of this.target.children) {
            if (k.cid === kansen.id) {
                return k;
            }
        }
        return new (customElements.get('kansen-item'))();
    }
    add(kansen) {
        let add = false;
        if (this.kansen.filter((k) => { return kansen.id === k.id; }).length <= 0) {
            this.kansen.push(kansen);
            add = true;
            this.kansen.sort((a, b) => { return a.id - b.id; });
            this.calc();
        }
        const item = this.search(kansen);
        item.cid = kansen.id;
        item.cname = kansen.name;
        item.rarity = kansen.rarity;
        item.camps = kansen.camps;
        item.lv = kansen.lv;
        item.star = kansen.star;
        if (add) {
            this.target.appendChild(item);
        }
        return item;
    }
    render(target) {
        this.target = target;
        this.kansen.forEach((kansen) => {
            this.target.appendChild(this.add(kansen));
        });
        this.calc();
    }
    calc() {
        this.camps = Object.keys(KansenCamps).reduce((obj, key) => {
            const data = { all: 0, member: 0, limit: 0, lvmax: 0, point: 0 };
            obj[key] = data;
            return obj;
        }, {});
        this.kansen.forEach((kansen) => {
            const data = this.camps[kansen.camps];
            ++data.all;
            if (kansen.lv <= 0) {
                return;
            }
            ++data.member;
            if (MaxRarity(kansen.rarity, kansen.id) <= kansen.star) {
                ++data.limit;
            }
            if (kansen.lv < 120) {
                return;
            }
            ++data.lvmax;
        });
        Object.keys(this.camps).forEach((key) => {
            const camp = this.camps[key];
            camp.point = (camp.member + camp.limit + camp.limit) * 10;
        });
        console.log(this.camps);
    }
    output() {
        return { list: this.kansen };
    }
}
class ListItem extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent =
            [
                ':host { display: block; }',
                ':host > div { display: grid; grid-template-rows: 1fr; grid-template-columns: 2rem 2rem 2rem 1fr 2rem 4rem; }',
                ':host > div > div { grid-row: 1 / 2; }',
                ':host > div > div:nth-child( 1 ) { grid-column: 1 / 2; }',
                ':host > div > div:nth-child( 2 ) { grid-column: 2 / 3; }',
                ':host > div > div:nth-child( 3 ) { grid-column: 3 / 4; }',
                ':host > div > div:nth-child( 4 ) { grid-column: 4 / 5; }',
                ':host > div > div:nth-child( 5 ) { grid-column: 5 / 6; }',
                ':host > div > div:nth-child( 6 ) { grid-column: 6 / 7; }',
            ].join('');
        const id = document.createElement('div');
        const camps = document.createElement('div');
        const rarity = document.createElement('div');
        const name = document.createElement('div');
        const lv = document.createElement('div');
        const star = document.createElement('div');
        const contents = document.createElement('div');
        contents.appendChild(id);
        contents.appendChild(camps);
        contents.appendChild(rarity);
        contents.appendChild(name);
        contents.appendChild(lv);
        contents.appendChild(star);
        shadow.appendChild(style);
        shadow.appendChild(contents);
        this.init(shadow);
    }
    init(shadow) { }
}
(() => {
    class KansenCampsSymbol extends HTMLElement {
        static Init(tagname = 'kansen-camps') { if (customElements.get(tagname)) {
            return;
        } customElements.define(tagname, this); }
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.textContent =
                [
                    ':host { display: block; }',
                    ':host > span { display: block; opacity: 0; }',
                ].join('');
            const text = document.createElement('span');
            text.appendChild(document.createElement('slot'));
            shadow.appendChild(style);
            shadow.appendChild(text);
            this.update();
        }
        update() {
            this.textContent = this.getAttribute('value');
        }
        convertCamps(value) {
            if (KansenCamps[value] !== undefined) {
                return value;
            }
            return 'OTHER';
        }
        get value() { return this.convertCamps(this.getAttribute('value')); }
        set value(value) { this.setAttribute('value', this.convertCamps(value)); }
        static get observedAttributes() { return ['value']; }
        attributeChangedCallback(attrName, oldVal, newVal) {
            if (oldVal === newVal) {
                return;
            }
            this.update();
        }
    }
    KansenCampsSymbol.Init();
})();
(() => {
    class KansenRaritySymbol extends HTMLElement {
        static Init(tagname = 'kansen-rarity') { if (customElements.get(tagname)) {
            return;
        } customElements.define(tagname, this); }
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.textContent =
                [
                    ':host { display: block; }',
                    ':host > span { display: block; opacity: 0; }',
                ].join('');
            const text = document.createElement('span');
            text.appendChild(document.createElement('slot'));
            shadow.appendChild(style);
            shadow.appendChild(text);
            this.update();
        }
        update() {
            this.textContent = this.getAttribute('value');
        }
        convertRarity(value) {
            if (KansenRarity[value] !== undefined) {
                return value;
            }
            return 'UNKNOWN';
        }
        get value() { return this.convertRarity(this.getAttribute('rarity')); }
        set value(value) { this.setAttribute('value', this.convertRarity(value)); }
        static get observedAttributes() { return ['value']; }
        attributeChangedCallback(attrName, oldVal, newVal) {
            if (oldVal === newVal) {
                return;
            }
            this.update();
        }
    }
    KansenRaritySymbol.Init();
})();
function MaxRarity(rarity, id) {
    const r = KansenRarity[rarity];
    if (!r) {
        return 4;
    }
    if (id <= 2) {
        return r - 1;
    }
    return r;
}
(() => {
    class KansenStarSymbol extends HTMLElement {
        static Init(tagname = 'kansen-star') { if (customElements.get(tagname)) {
            return;
        } customElements.define(tagname, this); }
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.textContent =
                [
                    ':host { display: block; }',
                ].join('');
            const contents = document.createElement('div');
            contents.appendChild(document.createElement('slot'));
            shadow.appendChild(style);
            shadow.appendChild(contents);
            this.update();
        }
        maxRarity() {
            return MaxRarity(this.getAttribute('rarity'), parseInt(this.getAttribute('cid') || '0'));
        }
        renderStar(num, star) {
            if (num <= 0) {
                return '';
            }
            return star.repeat(num);
        }
        update() {
            const max = this.maxRarity();
            const star = this.value;
            this.textContent = this.renderStar(star, '★') + this.renderStar(max - star, '☆');
        }
        positiveNumber(value) {
            const num = typeof value === 'number' ? value : parseInt(value || '');
            return 0 < num ? num : 0;
        }
        get value() { return this.positiveNumber(this.getAttribute('value')); }
        set value(value) { this.setAttribute('value', this.positiveNumber(value) + ''); }
        static get observedAttributes() { return ['value', 'cid', 'camps']; }
        attributeChangedCallback(attrName, oldVal, newVal) {
            if (oldVal === newVal) {
                return;
            }
            this.update();
        }
    }
    KansenStarSymbol.Init();
})();
(() => {
    class KansenItem extends ListItem {
        static Init(tagname = 'kansen-item') { if (customElements.get(tagname)) {
            return;
        } customElements.define(tagname, this); }
        init(shadow) {
            const style = shadow.querySelector('style');
            style.textContent = style.textContent +
                [
                    ':host > div > div:first-child, :host > div > div:nth-child(5) { text-align: right; }',
                ].join('');
            const contents = shadow.querySelectorAll('div > div');
            this.colmuns =
                {
                    id: contents[0],
                    name: contents[3],
                    rarity: contents[2],
                    camps: contents[1],
                    lv: contents[4],
                    star: contents[5],
                    convert: null,
                };
            const camps = new (customElements.get('kansen-camps'))();
            this.colmuns.camps.appendChild(camps);
            this.colmuns.camps = camps;
            const rarity = new (customElements.get('kansen-rarity'))();
            this.colmuns.rarity.appendChild(rarity);
            this.colmuns.rarity = rarity;
            const star = new (customElements.get('kansen-star'))();
            this.colmuns.star.appendChild(star);
            this.colmuns.star = star;
            this.update();
        }
        update() {
            this.colmuns.id.textContent = this.getAttribute('cid');
            this.colmuns.name.textContent = this.getAttribute('cname');
            this.colmuns.rarity.value = this.getAttribute('rarity');
            this.colmuns.camps.value = this.getAttribute('camps');
            this.colmuns.lv.textContent = this.getAttribute('lv');
            this.colmuns.star.setAttribute('cid', this.getAttribute('cid') || '');
            this.colmuns.star.setAttribute('rarity', this.getAttribute('rarity') || '');
            this.colmuns.star.setAttribute('value', this.getAttribute('star') || '');
        }
        positiveNumber(value) {
            const num = typeof value === 'number' ? value : parseInt(value || '');
            return 0 < num ? num : 0;
        }
        get cid() { return this.positiveNumber(this.getAttribute('cid')); }
        set cid(value) { this.setAttribute('cid', this.positiveNumber(value) + ''); }
        get cname() { return this.getAttribute('cname') || ''; }
        set cname(value) { this.setAttribute('cname', value); }
        get rarity() { return this.colmuns.rarity.value; }
        set rarity(value) {
            this.colmuns.rarity.value = value;
            this.setAttribute('rarity', this.colmuns.rarity.value);
        }
        get camps() { return this.colmuns.camps.value; }
        set camps(value) {
            this.colmuns.camps.value = value;
            this.setAttribute('camps', this.colmuns.camps.value);
        }
        get lv() { return this.positiveNumber(this.getAttribute('lv')); }
        set lv(value) { this.setAttribute('lv', this.positiveNumber(value) + ''); }
        get star() { return this.colmuns.rarity.value; }
        set star(value) {
            this.colmuns.star.value = value;
            this.setAttribute('star', this.colmuns.star.value + '');
        }
        static get observedAttributes() { return ['cid', 'cname', 'rarity', 'camps', 'lv', 'star']; }
        attributeChangedCallback(attrName, oldVal, newVal) {
            if (oldVal === newVal) {
                return;
            }
            this.update();
        }
    }
    Promise.all([
        customElements.whenDefined('kansen-camps'),
        customElements.whenDefined('kansen-rarity'),
        customElements.whenDefined('kansen-star'),
    ]).then(() => { KansenItem.Init(); });
})();
(() => {
    function ToLower(value) {
        return value.replace(/[A-Z]/g, (c) => { return String.fromCharCode(c.charCodeAt(0) | 32); });
    }
    class SortHeader extends ListItem {
        static Init(tagname = 'sort-header') { if (customElements.get(tagname)) {
            return;
        } customElements.define(tagname, this); }
        createButton(key) {
            const button = document.createElement('button');
            button.classList.add(key);
            button.addEventListener('click', () => {
                this.dispatchEvent(new Event('sort_' + key));
            });
            return button;
        }
        init(shadow) {
            const style = shadow.querySelector('style');
            style.textContent = style.textContent +
                [
                    ':host { height: 1rem; }',
                    'button { display: block; cursor: pointer; border: none; background: transparent; width: 100%; padding: 0; overflow: hidden; line-height: 1rem; }',
                    'button.id:before { content: var( --label-id ); }',
                    'button.name:before { content: var( --label-name ); }',
                    'button.rarity:before { content: var( --label-rarity ); }',
                    'button.camps:before { content: var( --label-camps ); }',
                    'button.lv:before { content: var( --label-lv ); }',
                    'button.star:before { content: var( --label-star ); }',
                ].join('');
            const contents = shadow.querySelectorAll('div > div');
            contents[0].appendChild(this.createButton('id'));
            contents[1].appendChild(this.createButton('camps'));
            contents[2].appendChild(this.createButton('rarity'));
            contents[3].appendChild(this.createButton('name'));
            contents[4].appendChild(this.createButton('lv'));
            contents[5].appendChild(this.createButton('star'));
        }
    }
    class AddItem extends ListItem {
        static Init(tagname = 'add-item') { if (customElements.get(tagname)) {
            return;
        } customElements.define(tagname, this); }
        numberInput(key) {
            const input = document.createElement('input');
            input.id = key;
            input.type = 'number';
            return input;
        }
        textInput(key) {
            const input = document.createElement('input');
            input.id = key;
            input.type = 'text';
            return input;
        }
        selectInput(key, values) {
            const select = document.createElement('select');
            select.id = key;
            values.forEach((key) => {
                const option = document.createElement('option');
                option.value = key;
                select.appendChild(option);
            });
            return select;
        }
        init(shadow) {
            this.shadow = shadow;
            const style = shadow.querySelector('style');
            style.textContent = style.textContent +
                [
                    ':host { height: 1rem; }',
                    'input, select { display: block; width: 100%; }',
                    'select { height: 100%; }',
                ].join('');
            const rarity = Object.keys(KansenRarity).sort((a, b) => { return KansenRarity[a] - KansenRarity[b]; });
            const contents = shadow.querySelectorAll('div > div');
            contents[0].appendChild(this.numberInput('id'));
            contents[1].appendChild(this.selectInput('camps', Object.keys(KansenCamps).sort((a, b) => { return KansenCamps[a] - KansenCamps[b]; })));
            contents[2].appendChild(this.selectInput('rarity', rarity));
            contents[3].appendChild(this.textInput('name'));
            contents[4].appendChild(this.numberInput('lv'));
            contents[5].appendChild(this.selectInput('star', Array.from({ length: KansenRarity[rarity[rarity.length - 1]] }, (v, i) => { return (i + 1) + ''; })));
        }
        getText(key) {
            return this.shadow.getElementById(key).value;
        }
        selectedValue(key) {
            const select = this.shadow.getElementById(key);
            return select.children[select.selectedIndex].value;
        }
        update(style) {
            this.shadow.querySelectorAll('select').forEach((select) => {
                for (let option of select.children) {
                    const value = option.value;
                    option.textContent = style.getPropertyValue('--' + select.id + '-' + ToLower(value)).replace(/\"/g, '') || value;
                }
            });
        }
        output() {
            const kansen = {
                id: parseInt(this.getText('id')),
                name: this.getText('name'),
                rarity: this.selectedValue('rarity'),
                camps: this.selectedValue('camps'),
                lv: parseInt(this.getText('lv')),
                star: parseInt(this.selectedValue('star')),
                convert: 0,
            };
            if (!Number.isFinite(kansen.id)) {
                kansen.id = 0;
            }
            if (!Number.isFinite(kansen.lv)) {
                kansen.lv = 1;
            }
            return kansen;
        }
    }
    class KansenList extends HTMLElement {
        static Init(tagname = 'kansen-list') { if (customElements.get(tagname)) {
            return;
        } customElements.define(tagname, this); }
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.textContent =
                [
                    ':host { display: block; }',
                    ':host { --label-id: "ID"; --label-name: "Name"; --label-rarity: "Rarity"; --label-camps: "Camps"; --label-lv: "Lv"; --label-star: "Star"; }',
                    this.selectStyle('rarity', Object.keys(KansenRarity)),
                    this.selectStyle('camps', Object.keys(KansenCamps)),
                ].join('');
            console.log(getComputedStyle(document.body).getPropertyValue('--rarity-unknown'));
            console.log('[--rarity-unknown]', getComputedStyle(this).getPropertyValue('--rarity-unknown'));
            console.log('[--rarity-unknown]', this.style.getPropertyValue('--rarity-unknown'));
            const header = new (customElements.get('sort-header'))();
            this.additem = new (customElements.get('add-item'))();
            const button = document.createElement('button');
            button.textContent = 'Add';
            button.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('add', { detail: this.additem.output() }));
            });
            shadow.appendChild(style);
            shadow.appendChild(header);
            shadow.appendChild(document.createElement('slot'));
            shadow.appendChild(this.additem);
            shadow.appendChild(button);
            this.update();
        }
        selectStyle(base, values) {
            return ':host { ' + values.map((value) => {
                return '--' + base + '-' + ToLower(value) + ': "' + (value === 'UNKNOWN' ? '--' : value) + '"';
            }).join('; ') + '; }';
        }
        update() {
            this.additem.update(getComputedStyle(this));
        }
    }
    SortHeader.Init();
    AddItem.Init();
    Promise.all([
        customElements.whenDefined('kansen-item'),
        customElements.whenDefined('sort-header'),
        customElements.whenDefined('add-item'),
    ]).then(() => { KansenList.Init(); });
})();
class App {
    constructor(config, kansen) {
        this.data = new KansenData(kansen);
        this.data.render(config.list);
        config.list.addEventListener('add', (event) => {
            this.data.add(event.detail);
            const data = this.data.output();
            config.output.textContent = 'const KANSEN = ' + JSON.stringify(data.list).replace(/(\[|\}\,)/g, '$1\n').replace(/\"([^\"]*?)\"\:/g, "$1:") + ';';
        });
    }
}
const KansenRarity = {
    UNKNOWN: 0,
    N: 4,
    R: 5,
    SR: 5,
    SSR: 6,
    UR: 6,
    PR: 6,
    DR: 6,
};
const KansenCamps = {
    OTHER: 0,
    UNION: 1,
    ROYAL: 2,
};
document.addEventListener('DOMContentLoaded', () => {
    customElements.whenDefined('kansen-list').then(() => {
        const app = new App({
            list: document.getElementById('list'),
            output: document.getElementById('output'),
        }, KANSEN);
    });
});
