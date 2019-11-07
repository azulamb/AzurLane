((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => { init(script); });
})(document.currentScript, (script) => {
    ((component, tagname = 'section-pages') => {
        if (customElements.get(tagname)) {
            return;
        }
        customElements.define(tagname, component);
    })(class extends HTMLElement {
        constructor() {
            super();
            const style = document.createElement('style');
            style.textContent = [
                ':host{--base-back:lightgray;--base-front:black;--select-back:white;--base-front:black;display:block;}',
                'button{background-color:var(--base-back);color:var(--base-front);border:none;outline:none;cursor:pointer;}',
                '.show{background-color:var(--select-back);color:var(--select-front);}',
            ].join('');
            this.list = document.createElement('div');
            const contents = document.createElement('div');
            contents.appendChild(this.list);
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.appendChild(style);
            shadow.appendChild(contents);
            this.update();
        }
        update() {
            const children = this.list.children;
            let selected = null;
            for (let i = children.length - 1; 0 <= i; --i) {
                if (children[i].classList.contains('show')) {
                    selected = children[i].textContent;
                }
                this.list.removeChild(children[i]);
            }
            const pages = [];
            document.querySelectorAll('section').forEach((section) => {
                const title = section.dataset.title;
                if (!title) {
                    return;
                }
                const button = document.createElement('button');
                button.textContent = title;
                button.addEventListener('click', () => {
                    for (let page of pages) {
                        if (page.page === section) {
                            button.classList.add('show');
                            section.classList.add('show');
                        }
                        else {
                            page.button.classList.remove('show');
                            page.page.classList.remove('show');
                        }
                    }
                });
                pages.push({ button: button, page: section });
                this.list.appendChild(button);
                if (title === selected) {
                    button.click();
                    selected = '';
                }
            });
            if (selected === null && 0 < pages.length) {
                pages[0].button.click();
            }
        }
    }, script.dataset.tagname);
});
((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => { init(script); });
})(document.currentScript, (script) => {
    function ValueToDate(value) {
        const date = new Date(value || '');
        return date.toString() === 'Invalid Date' ? new Date() : date;
    }
    function ValueToDateString(value) {
        const date = ValueToDate(value);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
    ((component, tagname = 'calendar-box') => {
        if (customElements.get(tagname)) {
            return;
        }
        customElements.define(tagname, component);
    })(class extends HTMLElement {
        constructor() {
            super();
            const style = document.createElement('style');
            style.textContent = [
                ':host{display:block;--size:1.5em;--back:white;--none-back:lightgray;--select-back:khaki;--sun:"Su";--mon:"Mo";--tue:"Tu";--wed:"We";--thu:"Th";--fri:"Fr";--sat:"Sa";}',
                ':host > div{background:var(--none-back);border:1px solid;gap:1px;display:grid;grid-template-columns:var(--size) var(--size) var(--size) var(--size) var(--size) var(--size) var(--size);}',
                ':host > div[data-week="4"]{grid-template-rows:var(--size) var(--size) var(--size) var(--size) var(--size) var(--size);}',
                ':host > div[data-week="5"]{grid-template-rows:var(--size) var(--size) var(--size) var(--size) var(--size) var(--size) var(--size);}',
                ':host > div[data-week="6"]{grid-template-rows:var(--size) var(--size) var(--size) var(--size) var(--size) var(--size) var(--size) var(--size);}',
                'button{border:none;box-sizing:content-box;padding:0;height:100%;width:100%;outline:none;cursor:pointer;}',
                'button,span{background:var(--back);font-size:calc(var(--size) * 0.5);}',
                'button:not([data-date]){border:none;margin:0;}',
                '.selected{background:var(--select-back);}',
                ':host > div > button:nth-child(2){grid-area:1 / 2 / 1 / 7;}',
                ':host > div > button:nth-child(1){grid-area:1 / 1;}',
                ':host > div > button:nth-child(1)::after{content:"◀";}',
                ':host > div > button:nth-child(3){grid-area:1 / 7;}',
                ':host > div > button:nth-child(3)::after{content:"▶";}',
                ':host > div > span{display:flex;align-items:center;justify-content:center;overflow:hidden;}',
                '.sun::after{content:var(--sun);display:inline;}',
                '.mon::after{content:var(--mon);display:inline;}',
                '.tue::after{content:var(--tue);display:inline;}',
                '.wed::after{content:var(--wed);display:inline;}',
                '.thu::after{content:var(--thu);display:inline;}',
                '.fri::after{content:var(--fri);display:inline;}',
                '.sat::after{content:var(--sat);display:inline;}',
            ].join('');
            this.dateview = document.createElement('button');
            const prev = document.createElement('button');
            prev.addEventListener('click', () => { this.prev(); });
            const next = document.createElement('button');
            next.addEventListener('click', () => { this.next(); });
            this.contents = document.createElement('div');
            this.contents.addEventListener('click', (event) => { event.stopPropagation(); });
            this.contents.appendChild(prev);
            this.contents.appendChild(this.dateview);
            this.contents.appendChild(next);
            ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].forEach((name) => {
                const week = document.createElement('span');
                week.classList.add(name);
                this.contents.appendChild(week);
            });
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.appendChild(style);
            shadow.appendChild(this.contents);
            this.update(this.getAttribute('value'), true);
        }
        selectDay(date, button) {
            this.contents.querySelectorAll('button.selected').forEach((button) => { button.classList.remove('selected'); });
            (button ? [button] : this.contents.querySelectorAll(`button[data-date="${date}"]`)).forEach((button) => {
                button.classList.add('selected');
            });
            if (!button) {
                return;
            }
            this.updateDate(date);
        }
        updateDate(date) {
            this.setAttribute('value', date);
            const data = { date: date };
            const event = new CustomEvent('change', { detail: data });
            this.dispatchEvent(event);
        }
        update(value, updatedate) {
            const date = ValueToDateString(value);
            if (date && this.showdate === date) {
                return;
            }
            const d = new Date(date);
            const ym = d.getFullYear() + '-' + (d.getMonth() + 1);
            if (this.dateview.textContent === ym) {
                this.selectDay(date);
            }
            else {
                this.dateview.textContent = ym;
                const base = this.dateview.textContent + '-';
                const children = this.contents.querySelectorAll('button[data-date]');
                children.forEach((day) => {
                    this.contents.removeChild(day);
                });
                let week = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
                const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
                let h = 3;
                const selectdate = updatedate ? date : this.value;
                for (let day = 1; day <= end; ++day) {
                    const button = document.createElement('button');
                    button.dataset.date = base + day;
                    if (button.dataset.date === selectdate) {
                        button.classList.add('selected');
                    }
                    button.textContent = day + '';
                    button.style.gridArea = h + ' / ' + (++week);
                    button.addEventListener('click', () => { this.selectDay(button.dataset.date, button); });
                    this.contents.appendChild(button);
                    if (7 <= week) {
                        if (day === end) {
                            break;
                        }
                        ++h;
                        week = 0;
                    }
                }
                this.contents.dataset.week = (h - 2) + '';
            }
            this.showdate = date;
            if (updatedate) {
                this.updateDate(date);
            }
        }
        change(diffmonth) {
            const month = typeof diffmonth === 'number' ? Math.floor(diffmonth) : parseInt(diffmonth + '');
            if (!month) {
                return;
            }
            const now = new Date(this.showdate);
            const date = new Date(now.getFullYear(), now.getMonth() + month, 1);
            const day = Math.min(now.getDate(), new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
            this.update(`${date.getFullYear()}-${date.getMonth() + 1}-${day}`, false);
        }
        prev() { return this.change(-1); }
        next() { return this.change(1); }
        get value() { return this.getAttribute('value') || ''; }
        set value(value) { this.update(value, true); }
        static get observedAttributes() { return ['value']; }
        attributeChangedCallback(attrName, oldVal, newVal) {
            if (oldVal === newVal) {
                return;
            }
            this.update(newVal, true);
        }
    }, script.dataset.tagname);
});
((script, init) => {
    const calname = script.dataset.tagname || 'calendar-box';
    customElements.whenDefined(calname).then(() => {
        init(script, calname);
    });
})(document.currentScript, (script, calname) => {
    function ValueToDate(value) {
        const date = new Date(value || '');
        return date.toString() === 'Invalid Date' ? new Date() : date;
    }
    function ValueToDateString(value) {
        const date = ValueToDate(value);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
    function CreateCalendar() {
        return new (customElements.get(calname))();
    }
    ((component, tagname = 'calendar-input') => {
        if (customElements.get(tagname)) {
            return;
        }
        customElements.define(tagname, component);
    })(class extends HTMLElement {
        constructor() {
            super();
            const style = document.createElement('style');
            style.textContent = [
                ':host{display:inline-block;--icon:"📅";--z-index:9999;}',
                ':host > div{position:relative;padding-right:1.2rem;}',
                ':host > div > button{position:absolute;top:0;right:0;cursor:pointer;padding:0;width:1.2rem;height:1.2rem;box-sizing:border-box;}',
                'button::after{content:var(--icon);display:inline;}',
                ':host > div > div{position:absolute;z-index:var(--z-index);display:none;}',
                ':host([show]) > div > div{display:block;}',
                ':host(:not([left])) > div > div{right:0;}',
                ':host([top]) > div > div{bottom:100%;}',
            ].join('');
            this.datevalue = document.createElement('span');
            const button = document.createElement('button');
            button.addEventListener('click', () => {
                this.toggle();
            });
            this.calendar = CreateCalendar();
            this.calendar.addEventListener('change', (event) => {
                this.value = event.detail.date;
                this.hide();
            });
            const cbox = document.createElement('div');
            cbox.appendChild(this.calendar);
            const contents = document.createElement('div');
            contents.appendChild(this.datevalue);
            contents.appendChild(cbox);
            contents.appendChild(button);
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.appendChild(style);
            shadow.appendChild(contents);
            this.value = this.getAttribute('value') || '';
        }
        update(value) {
            const date = ValueToDateString(value);
            if (this.datevalue.textContent === date) {
                return;
            }
            this.datevalue.textContent = date;
            this.calendar.value = date;
        }
        show() { this.setAttribute('show', ''); }
        hide() { this.removeAttribute('show'); }
        toggle() { this[this.hasAttribute('show') ? 'hide' : 'show'](); }
        get value() { return this.calendar.value; }
        set value(value) { this.update(value); }
        get disable() { return this.hasAttribute('disable'); }
        set disable(value) { if (value) {
            this.setAttribute('disable', '');
        }
        else {
            this.removeAttribute('disable');
        } }
        get left() { return this.hasAttribute('left'); }
        set left(value) { if (value) {
            this.setAttribute('left', '');
        }
        else {
            this.removeAttribute('left');
        } }
        get top() { return this.hasAttribute('top'); }
        set top(value) { if (value) {
            this.setAttribute('top', '');
        }
        else {
            this.removeAttribute('top');
        } }
    }, script.dataset.tagname);
});
class AppPointCalc {
    constructor(config) {
        this.config = config;
        config.begin.addEventListener('change', () => { this.calc(); });
        config.end.addEventListener('change', () => { this.calc(); });
        config.target.addEventListener('change', () => { this.calc(); });
        config.points.addEventListener('change', () => { this.calc(); });
        config.dailypt.addEventListener('change', () => { this.calc(); });
        config.earnpt.addEventListener('change', () => { this.calc(); });
    }
    begin() { return new Date(this.config.begin.value); }
    end() { return new Date(this.config.end.value); }
    targetPoints() { return PositiveNumber(this.config.target.value); }
    nowPoints() { return PositiveNumber(this.config.points.value); }
    dailyPoints() { return PositiveNumber(this.config.dailypt.value); }
    earnPoints() { return PositiveNumber(this.config.earnpt.value); }
    maxDate(a, b) { return a.getTime() < b.getTime() ? b : a; }
    getDays(a, b) {
        const secs = Math.floor(Math.abs(a.getTime() - b.getTime()) / 1000);
        console.log(secs, a.getTime(), b.getTime());
        const days = Math.floor(secs / (60 * 60 * 24));
        return days + (secs % (60 * 60 * 24) ? 1 : 0);
    }
    calc() {
        console.log(this.config.begin.value, this.config.end.value);
        const target = this.targetPoints();
        if (target <= 0) {
            return;
        }
        const now = new Date();
        const end = this.end();
        const begin = now.getTime() < end.getTime() ? this.maxDate(this.begin(), now) : this.begin();
        const days = this.getDays(begin, end);
        console.log(days, begin, end);
        if (days <= 0) {
            return;
        }
        const nowpoint = this.nowPoints();
        if (days == 1) {
            this.config.result_dailypt.textContent = (target - nowpoint) + '';
            return;
        }
        const mission = this.dailyPoints();
        const needdaily = (target - nowpoint - mission * (days - 1)) / days;
        this.config.result_dailypt.textContent = needdaily + '';
        const earn = this.earnPoints();
        if (earn <= 0) {
            return;
        }
        this.config.result_dailylaps.textContent = (needdaily / earn) + '';
    }
}
function PositiveNumber(value) {
    if (!value) {
        return 0;
    }
    value = typeof value === 'string' ? parseInt(value) : Math.floor(value);
    if (value < 0) {
        return 0;
    }
    return value;
}
class App {
    constructor(config) {
        const pc = new AppPointCalc(config.pc);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        customElements.whenDefined('calendar-input'),
    ]).then(() => {
        const app = new App({
            pc: {
                begin: document.getElementById('pc_begin'),
                end: document.getElementById('pc_end'),
                target: document.getElementById('pc_target'),
                points: document.getElementById('pc_points'),
                dailypt: document.getElementById('pc_dailypt'),
                earnpt: document.getElementById('pc_earnpt'),
                result_dailypt: document.getElementById('pc_result_dailypt'),
                result_dailylaps: document.getElementById('pc_result_dailylaps'),
            },
        });
    });
    document.body.lang = ((nav) => { return nav.userLanguage || nav.language || nav.browserLanguage; })(window.navigator);
});
