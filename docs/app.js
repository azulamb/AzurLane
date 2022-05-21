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
            td.appendChild(content);
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
((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => {
        init(script);
    });
})(document.currentScript, (script) => {
    ((component, tagname = 'input-slider') => {
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
                ':host { display: inline-block; --input-size: 3rem; }',
                ':host > div { display: grid; grid-template-columns: 1fr var(--input-size); width: 100%; height: 100%; }',
                ':host > div > input { font-size: 1em; }',
            ].join('');
            this.slider = document.createElement('input');
            this.slider.type = 'range';
            this.input = document.createElement('input');
            this.input.type = 'number';
            if (this.hasAttribute('min')) {
                this.input.min = this.getAttribute('min');
                this.slider.min = this.input.min;
            }
            if (this.hasAttribute('max')) {
                this.input.max = this.getAttribute('max');
                this.slider.max = this.input.max;
            }
            if (this.hasAttribute('step')) {
                this.input.step = this.getAttribute('step');
                this.slider.step = this.input.step;
            }
            if (this.hasAttribute('value')) {
                this.input.value = this.getAttribute('value');
                this.slider.value = this.input.value;
            }
            else {
                this.input.value = this.slider.value;
            }
            if (this.hasAttribute('disabled')) {
                this.input.disabled = true;
                this.slider.disabled = true;
            }
            (() => {
                let timer = 0;
                const onChange = () => {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(() => {
                        timer = 0;
                        this.dispatchEvent(new CustomEvent('change'));
                    }, 0);
                };
                this.slider.addEventListener('change', () => {
                    this.value = this.slider.value;
                    onChange();
                });
                this.input.addEventListener('change', () => {
                    this.value = this.input.value;
                    onChange();
                });
            })();
            const contents = document.createElement('div');
            contents.appendChild(this.slider);
            contents.appendChild(this.input);
            shadow.appendChild(style);
            shadow.appendChild(contents);
        }
        get min() {
            return parseFloat(this.input.min || '') || 1;
        }
        set min(value) {
            const setValue = value + '';
            let change = false;
            if (this.input.min !== setValue) {
                this.input.min = setValue;
                change = true;
            }
            if (this.slider.min !== setValue) {
                this.slider.min = setValue;
                change = true;
            }
            if (change) {
                this.setAttribute('min', setValue);
            }
        }
        get max() {
            return parseFloat(this.input.max || '') || 1;
        }
        set max(value) {
            const setValue = value + '';
            let change = false;
            if (this.input.max !== setValue) {
                this.input.max = setValue;
                change = true;
            }
            if (this.slider.max !== setValue) {
                this.slider.max = setValue;
                change = true;
            }
            if (change) {
                this.setAttribute('max', setValue);
            }
        }
        get step() {
            return parseFloat(this.input.value || '') || 1;
        }
        set step(value) {
            const setValue = value + '';
            let change = false;
            if (this.input.step !== setValue) {
                this.input.step = setValue;
                change = true;
            }
            if (this.slider.step !== setValue) {
                this.slider.step = setValue;
                change = true;
            }
            if (change) {
                this.setAttribute('step', setValue);
            }
        }
        get value() {
            return parseFloat(this.input.value || '') || 1;
        }
        set value(value) {
            const setValue = value + '';
            let change = false;
            if (this.input.value !== setValue) {
                this.input.value = setValue;
                change = true;
            }
            if (this.slider.value !== setValue) {
                this.slider.value = setValue;
                change = true;
            }
            if (change) {
                this.setAttribute('value', setValue);
            }
        }
        get disabled() {
            return this.hasAttribute('disabled');
        }
        set disabled(value) {
            if (!value) {
                this.input.disabled = false;
                this.slider.disabled = false;
                this.removeAttribute('disabled');
            }
            else {
                this.input.disabled = true;
                this.slider.disabled = true;
                this.setAttribute('disabled', '');
            }
        }
        static get observedAttributes() {
            return ['min', 'max', 'step', 'disabled', 'value'];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) {
                return;
            }
            switch (name) {
                case 'min':
                    this.min = newValue;
                    break;
                case 'max':
                    this.max = newValue;
                    break;
                case 'step':
                    this.step = newValue;
                    break;
                case 'value':
                    this.value = newValue;
                    break;
                case 'disabled':
                    this.disabled = this.hasAttribute('disabled');
                    break;
            }
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
    ((component, tagname = 'date-time') => {
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
                ':host { display: inline-block; }',
                ':host > div { display: grid; grid-template-columns: 5fr 1fr 3fr 1fr 3fr 1fr 3fr 1fr 3fr 1fr 3fr; text-align: center; position: relative; }',
                ':host([year][second]) > div { grid-template-columns: 3fr 1fr 3fr 1fr 3fr 1fr 3fr; }',
                ':host([year]:not([second])) > div { grid-template-columns: 3fr 1fr 3fr 1fr 3fr 1fr 3fr 1fr 3fr; }',
                ':host([second]:not([year])) > div { grid-template-columns: 5fr 1fr 3fr 1fr 3fr 1fr 3fr 1fr 3fr; }',
                ':host([year]) > div > .year { display: none; position: absolute; }',
                ':host([second]) > div > .second { display: none; position: absolute; }',
            ].join('');
            this.showYear = document.createElement('div');
            this.showYear.classList.add('year');
            this.showMonth = document.createElement('div');
            this.showDay = document.createElement('div');
            this.showHour = document.createElement('div');
            this.showMinute = document.createElement('div');
            this.showSecond = document.createElement('div');
            this.showSecond.classList.add('second');
            this.separates = [
                document.createElement('span'),
                document.createElement('span'),
                document.createElement('span'),
                document.createElement('span'),
            ];
            for (let i = 0; i < 2; ++i) {
                this.separates[i].textContent = '/';
                this.separates[i + 2].textContent = ':';
            }
            this.separates[0].classList.add('year');
            this.separates[3].classList.add('second');
            const space = document.createElement('span');
            space.textContent = ' ';
            const contents = document.createElement('div');
            contents.appendChild(this.showYear);
            contents.appendChild(this.separates[0]);
            contents.appendChild(this.showMonth);
            contents.appendChild(this.separates[1]);
            contents.appendChild(this.showDay);
            contents.appendChild(space);
            contents.appendChild(this.showHour);
            contents.appendChild(this.separates[2]);
            contents.appendChild(this.showMinute);
            contents.appendChild(this.separates[3]);
            contents.appendChild(this.showSecond);
            this.datetime = new Date();
            this.updateDatetime();
            shadow.appendChild(style);
            shadow.appendChild(contents);
        }
        updateDatetime() {
            const pad = this.fillzero ? 2 : 1;
            this.showYear.textContent = this.datetime.getFullYear() + '';
            this.showMonth.textContent = `${this.datetime.getMonth() + 1}`.padStart(pad, '0');
            this.showDay.textContent = `${this.datetime.getDate()}`.padStart(pad, '0');
            this.showHour.textContent = `${this.datetime.getHours()}`.padStart(pad, '0');
            this.showMinute.textContent = `${this.datetime.getMinutes()}`.padStart(pad, '0');
            this.showSecond.textContent = `${this.datetime.getSeconds()}`.padStart(pad, '0');
        }
        get value() {
            return this.datetime;
        }
        set value(value) {
            this.datetime = new Date(value);
            this.updateDatetime();
        }
        get fillzero() {
            return this.hasAttribute('fillzero');
        }
        set fillzero(value) {
            if (!value) {
                this.removeAttribute('fillzero');
            }
            else {
                this.setAttribute('fillzero', '');
            }
        }
        get year() {
            return this.hasAttribute('year');
        }
        set year(value) {
            if (!value) {
                this.removeAttribute('year');
            }
            else {
                this.setAttribute('year', '');
            }
        }
        get second() {
            return this.hasAttribute('second');
        }
        set second(value) {
            if (!value) {
                this.removeAttribute('second');
            }
            else {
                this.setAttribute('second', '');
            }
        }
        static get observedAttributes() {
            return ['value', 'fillzero'];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) {
                return;
            }
            if (name === 'value') {
                this.value = newValue;
            }
            else {
                this.updateDatetime();
            }
        }
    }, script.dataset.tagname);
});
((script, init) => {
    Promise.all([
        customElements.whenDefined('input-slider'),
        customElements.whenDefined('date-time'),
    ]).then(() => {
        init(script);
    });
})(document.currentScript, (script) => {
    ((component, tagname = 'calc-time') => {
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
                ':host { display: block; }',
                ':host > div { display: grid; grid-template-columns: 7rem 1fr 5rem 7rem; }',
                ':host > div > input-slider { --input-size: 5rem; }',
            ].join('');
            const label = document.createElement('div');
            label.appendChild(document.createElement('slot'));
            this.slider = new (customElements.get('input-slider'))();
            this.slider.step = 1;
            this.slider.value = 0;
            if (this.hasAttribute('value')) {
                this.slider.value = parseInt(this.getAttribute('value') || '') || 0;
            }
            if (this.hasAttribute('max')) {
                this.slider.max = parseInt(this.getAttribute('max') || '') || 1;
            }
            this.complete = new (customElements.get('date-time'))();
            this.complete.fillzero = true;
            this.complete.year = true;
            this.complete.second = true;
            const timelimit = document.createElement('div');
            timelimit.style.textAlign = 'center';
            timelimit.textContent = '到達時間';
            this.updateTime();
            this.slider.addEventListener('change', () => {
                this.updateTime();
            });
            const contents = document.createElement('div');
            contents.appendChild(label);
            contents.appendChild(this.slider);
            contents.appendChild(timelimit);
            contents.appendChild(this.complete);
            shadow.appendChild(style);
            shadow.appendChild(contents);
        }
        updateTime() {
            const date = new Date();
            const value = this.max - this.value;
            if (0 < value) {
                const mins = value / this.add * this.mins;
                date.setMinutes(date.getMinutes() + mins);
            }
            this.complete.value = date;
            this.dispatchEvent(new CustomEvent('change', { detail: new Date(date) }));
        }
        get max() {
            return this.slider.max;
        }
        set max(value) {
            this.slider.max = value;
        }
        get mins() {
            return parseInt(this.getAttribute('mins') || '') || 1;
        }
        set mins(value) {
            this.setAttribute('mins', value + '');
        }
        get add() {
            return parseInt(this.getAttribute('add') || '') || 1;
        }
        set add(value) {
            this.setAttribute('add', value + '');
        }
        get value() {
            return this.slider.value;
        }
        set value(value) {
            this.slider.value = value;
        }
        get date() {
            return this.complete.value;
        }
        static get observedAttributes() {
            return ['max', 'value', 'add'];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) {
                return;
            }
            switch (name) {
                case 'max':
                    this.max = newValue;
                    break;
                case 'add':
                    this.add = newValue;
                    break;
                case 'value':
                    this.value = newValue;
                    break;
            }
            this.updateTime();
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
    ((component, tagname = 'skill-book') => {
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
                ':host { display: block; }',
                ':host > div { display: grid; grid-template-columns: 1.5em 1fr 2em 4em 1em 3em 1em 4em 1em 3em 1em; }',
                ':host > div > div:nth-child(n+3) { text-align: right; }',
                '#icon { width: 1em; height: 1em; }',
                ':host([rarelity="2"]) #name::after { content: "2"; }',
                ':host([rarelity="3"]) #name::after { content: "3"; }',
                ':host([rarelity="4"]) #name::after { content: "4"; }',
                ':host #name::after { content: "1"; }',
                '#hours::after { content: "h"; }',
                '.sub::after { content: "-"; }',
                '.add::after { content: "+"; }',
            ].join('');
            const icon = document.createElement('div');
            icon.id = 'icon';
            const name = document.createElement('div');
            name.id = 'name';
            name.textContent = '教科書T';
            this.hoursArea = document.createElement('div');
            this.hoursArea.id = 'hours';
            this.expArea = document.createElement('div');
            this.bonusArea = document.createElement('div');
            this.books = document.createElement('input');
            this.books.type = 'number';
            this.books.min = '0';
            this.books.max = '185';
            this.books.value = '0';
            this.books.addEventListener('change', (event) => {
                this.onChange(event);
            });
            const subBook = document.createElement('button');
            subBook.classList.add('sub');
            subBook.addEventListener('click', (event) => {
                const count = parseInt(this.books.value);
                if (parseInt(this.books.min) < count) {
                    this.books.value = `${count - 1}`;
                }
                this.onChange(event);
            });
            const addBook = document.createElement('button');
            addBook.classList.add('add');
            addBook.addEventListener('click', (event) => {
                const count = parseInt(this.books.value);
                if (count < parseInt(this.books.max)) {
                    this.books.value = `${count + 1}`;
                }
                this.onChange(event);
            });
            this.booksBonus = document.createElement('input');
            this.booksBonus.type = 'number';
            this.booksBonus.min = '0';
            this.booksBonus.max = '124';
            this.booksBonus.value = '0';
            this.booksBonus.addEventListener('change', (event) => {
                this.onChange(event);
            });
            const subBookBonus = document.createElement('button');
            subBookBonus.classList.add('sub');
            subBookBonus.addEventListener('click', (event) => {
                const count = parseInt(this.booksBonus.value);
                if (parseInt(this.booksBonus.min) < count) {
                    this.booksBonus.value = `${count - 1}`;
                }
                this.onChange(event);
            });
            const addBookBonus = document.createElement('button');
            addBookBonus.classList.add('add');
            addBookBonus.addEventListener('click', (event) => {
                const count = parseInt(this.booksBonus.value);
                if (count < parseInt(this.booksBonus.max)) {
                    this.booksBonus.value = `${count + 1}`;
                }
                this.onChange(event);
            });
            const contents = document.createElement('div');
            contents.appendChild(icon);
            contents.appendChild(name);
            contents.appendChild(this.hoursArea);
            contents.appendChild(this.expArea);
            contents.appendChild(subBook);
            contents.appendChild(this.books);
            contents.appendChild(addBook);
            contents.appendChild(this.bonusArea);
            contents.appendChild(subBookBonus);
            contents.appendChild(this.booksBonus);
            contents.appendChild(addBookBonus);
            shadow.appendChild(style);
            shadow.appendChild(contents);
        }
        onChange(event) {
            event.stopPropagation();
            this.dispatchEvent(new CustomEvent('change'));
        }
        get rarelity() {
            return parseInt(this.getAttribute('rarelity') || '') || 1;
        }
        set rarelity(value) {
            this.setAttribute('rarelity', value + '');
        }
        get hours() {
            return parseInt(this.getAttribute('hours') || '') || 1;
        }
        set hours(value) {
            this.setAttribute('hours', value + '');
            this.hoursArea.textContent = value + '';
        }
        get exp() {
            return parseInt(this.getAttribute('exp') || '') || 100;
        }
        set exp(value) {
            this.setAttribute('exp', value + '');
            this.expArea.textContent = value + '';
        }
        get bonus() {
            return parseInt(this.getAttribute('bonus') || '') || 100;
        }
        set bonus(value) {
            this.setAttribute('bonus', value + '');
            this.bonusArea.textContent = value + '';
        }
        get totalHours() {
            const total = parseInt(this.books.value) + parseInt(this.booksBonus.value);
            return total * this.hours;
        }
        get totalExp() {
            return parseInt(this.books.value) * this.exp + parseInt(this.booksBonus.value) * this.bonus;
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
    class MyNotification {
        constructor() {
            this.second = 60;
            this.list = [];
        }
        request() {
            return Notification.requestPermission().then((result) => {
                if (result === 'denied' || result === 'default') {
                    throw new Error('Denied');
                }
            });
        }
        notification() {
            const notification = new Notification('title', {
                icon: location.href + 'favicon.svg',
                body: 'test',
                vibrate: 5,
            });
            notification.addEventListener('click', () => {
                window.open(location.href);
            });
        }
        add(input, time) {
            this.list.push({
                input: input,
                time: time,
            });
            input.addEventListener('change', () => {
                this.onChange();
            });
            time.addEventListener('change', () => {
                this.onChange();
            });
        }
        onChange() {
        }
        onUpdate() {
            console.log('timer');
        }
        start(worker) {
            if (!worker) {
                throw new Error('No worker.');
            }
            this.worker = new Worker(worker);
            this.worker.onmessage = (e) => {
                this.onUpdate();
            };
            this.worker.postMessage({ second: this.second });
        }
        stop() {
            if (!this.worker) {
                return;
            }
            this.worker.terminate();
            this.worker = null;
        }
    }
    ((component, tagname = 'notification-like') => {
        if (customElements.get(tagname)) {
            return;
        }
        customElements.define(tagname, component);
    })(class extends HTMLElement {
        constructor() {
            super();
            this.lists = [];
            this.notification = new MyNotification();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML = [
                ':host { display: block; }',
                ':host > div > div#ui.ready > div:first-child{ display: none; }',
                ':host > div > div#ui:not(.ready) > div:last-child { display: none; }',
                'label { user-select: none; }',
                'button { cursor: pointer; }',
                '.title::before { content: "通知設定:"; }',
                '#notification::before { content: "Start"; }',
                '#notification.on::before { content: "Stop"; }',
            ].join('');
            const open = (() => {
                const button = document.createElement('button');
                button.textContent = '通知';
                button.addEventListener('click', () => {
                    this.requestNotification().then(() => {
                        ui.classList.add('ready');
                    }).catch((error) => {
                        console.error(error);
                    });
                });
                const contents = document.createElement('div');
                contents.appendChild(button);
                return contents;
            })();
            open.style.display = 'none';
            const config = (() => {
                for (const item of this.querySelectorAll('calc-time')) {
                    this.lists.push(item);
                }
                const list = document.createElement('div');
                this.lists.forEach((item) => {
                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    const label = document.createElement('label');
                    label.appendChild(input);
                    label.appendChild(document.createTextNode(item.textContent || ''));
                    this.notification.add(input, item);
                    list.appendChild(label);
                });
                const title = document.createElement('div');
                title.classList.add('title');
                const button = document.createElement('button');
                button.id = 'notification';
                button.addEventListener('click', () => {
                    button.classList.toggle('on');
                    if (button.classList.contains('on')) {
                        this.notification.start(this.getAttribute('worker') || '');
                    }
                    else {
                        this.notification.stop();
                    }
                });
                const contents = document.createElement('div');
                contents.appendChild(title);
                contents.appendChild(list);
                contents.appendChild(button);
                return contents;
            })();
            const ui = document.createElement('div');
            ui.id = 'ui';
            ui.appendChild(open);
            ui.appendChild(config);
            const slot = document.createElement('div');
            slot.appendChild(document.createElement('slot'));
            const contents = document.createElement('div');
            contents.appendChild(slot);
            contents.appendChild(ui);
            shadow.appendChild(style);
            shadow.appendChild(contents);
        }
        requestNotification() {
            return this.notification.request();
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
    ((component, tagname = 'skill-exp') => {
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
                ':host { display: block; --bar-0: hsl(90, 50%, 50%); --bar-1: hsl(80, 50%, 50%); --bar-2: hsl(70, 50%, 50%); --bar-3: hsl(60, 50%, 50%); --bar-4: hsl(50, 50%, 50%); --bar-5: hsl(40, 50%, 50%); --bar-6: hsl(30, 50%, 50%); --bar-7: hsl(20, 50%, 50%); --bar-8: hsl(10, 50%, 50%); --bar-9: hsl(0, 50%, 50%); }',
                ':host > div {}',
                '#values { display: grid; grid-template-columns: 10em 10em 3em 1em 4em 1fr 3.5em; }',
                '#hours::before { content: "合計教育時間:"; }',
                '#hours::after { content: "h"; }',
                '.text.skill::before { content: "現在のスキル経験値："; }',
                '.text.skilladd::before { content: "+"; }',
                '[data-status="equal"] { color: blue; }',
                '[data-status="over"] { color: red; }',
                '#exp { text-align: right; }',
                '#exp::before { content: "獲得経験値:"; }',
                '#total::before { content: "/"; }',
                '#bar { display: grid; width: 100%; height: 1em; position: relative; --gauge: 100%; }',
                '#bar::after { content: ""; display: block; width: var(--gauge); height: 100%; position: absolute; right: 0; background: rgba(0, 0, 0, 0.5); transition: width 0.1s; }',
            ].join('');
            this.hours = document.createElement('div');
            this.hours.id = 'hours';
            this.hours.textContent = '0';
            this.lv = document.createElement('select');
            this.lv.addEventListener('change', () => {
                this.update();
            });
            this.nowExp = document.createElement('input');
            this.nowExp.type = 'number';
            this.nowExp.min = '0';
            this.nowExp.max = '5800';
            this.nowExp.step = '1';
            this.nowExp.value = '0';
            this.nowExp.addEventListener('change', () => {
                this.update();
            });
            this.expArea = document.createElement('div');
            this.expArea.id = 'exp';
            this.totalArea = document.createElement('div');
            this.totalArea.id = 'total';
            this.totalArea.textContent = '1';
            const skillTitle = document.createElement('div');
            skillTitle.classList.add('text', 'skill');
            const skillAdd = document.createElement('div');
            skillAdd.classList.add('text', 'skilladd');
            const values = document.createElement('div');
            values.id = 'values';
            values.appendChild(this.hours);
            values.appendChild(skillTitle);
            values.appendChild(this.lv);
            values.appendChild(skillAdd);
            values.appendChild(this.nowExp);
            values.appendChild(this.expArea);
            values.appendChild(this.totalArea);
            this.bar = document.createElement('div');
            this.bar.id = 'bar';
            const slot = document.createElement('slot');
            slot.addEventListener('slotchange', (event) => {
                for (const child of this.children) {
                    child.removeEventListener('change', onChange);
                    child.addEventListener('change', onChange);
                }
            });
            const books = document.createElement('div');
            books.appendChild(slot);
            const contents = document.createElement('div');
            contents.appendChild(values);
            contents.appendChild(this.bar);
            contents.appendChild(books);
            const onChange = () => {
                this.update();
            };
            shadow.appendChild(style);
            shadow.appendChild(contents);
        }
        update() {
            let hours = 0;
            let exp = parseInt(this.lv.options[this.lv.selectedIndex].value) + parseInt(this.nowExp.value);
            const total = parseInt(this.totalArea.textContent || '');
            for (const child of this.children) {
                const book = child;
                if (!book.totalHours) {
                    continue;
                }
                hours += book.totalHours;
                exp += book.totalExp;
            }
            this.bar.style.setProperty('--gauge', `calc(100% * ${total - exp} / ${total})`);
            if (exp === total) {
                this.expArea.dataset.status = 'equal';
            }
            else if (total < exp) {
                this.expArea.dataset.status = 'over';
            }
            else {
                this.expArea.dataset.status = '';
            }
            this.hours.textContent = hours + '';
            this.expArea.textContent = exp + '';
        }
        updateBaseExp(exps) {
            let total = 0;
            this.lv.innerHTML = '';
            const lv = document.createElement('option');
            lv.value = '0';
            lv.textContent = 'LV 1';
            this.lv.appendChild(lv);
            this.bar.innerHTML = '';
            this.bar.style.gridTemplateColumns = exps.split(',').map((str, index) => {
                const exp = parseInt(str);
                total += exp;
                const bar = document.createElement('div');
                bar.style.background = `var(--bar-${index})`;
                this.bar.appendChild(bar);
                const lv = document.createElement('option');
                lv.value = total + '';
                lv.textContent = `LV ${index + 2}`;
                this.lv.appendChild(lv);
                return `${exp}fr`;
            }).join(' ');
            this.totalArea.textContent = total + '';
        }
        get exp() {
            return (this.getAttribute('exp') || '').split(',').map((v) => {
                return parseInt(v);
            });
        }
        set exp(value) {
            this.setAttribute('exp', value.join(','));
        }
        static get observedAttributes() {
            return ['exp'];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) {
                return;
            }
            if (name === 'exp') {
                this.updateBaseExp(newValue);
            }
            this.update();
        }
    }, script.dataset.tagname);
});
function DrawSkillLvUp(parent) {
    setTimeout(() => {
        parent.exp = SKILL_EXP;
        BOOKS.forEach((item) => {
            const book = new (customElements.get('skill-book'))();
            book.rarelity = item.rarelity;
            book.hours = item.hours;
            book.exp = item.exp;
            book.bonus = item.bonus;
            parent.appendChild(book);
        });
    }, 0);
}
const RARELITY_LIST = ['N', 'R', 'SR', 'SSR', 'UR'];
function DrawAwaking(parent) {
    setTimeout(() => {
        const total = {};
        const tbody = document.createElement('tbody');
        const theadLine = Common.tr({}, Common.td('', { colSpan: 2 }), ...RARELITY_LIST.map((rarelity) => {
            return Common.td(rarelity);
        }));
        AWAKING.forEach((item, index) => {
            const chips = Common.tr({});
            const arrays = 4 <= index ? Common.tr({}) : null;
            const money = Common.tr({});
            chips.appendChild(Common.td(`LV ${100 + (index + 1) * 5}`, { rowSpan: 4 <= index ? 3 : 2 }));
            chips.appendChild(Common.td('Ⅰ'));
            chips.classList.add('chips');
            if (arrays) {
                arrays.appendChild(Common.td('Ⅱ'));
                arrays.classList.add('arrays');
            }
            money.appendChild(Common.td('資金'));
            money.classList.add('money');
            RARELITY_LIST.forEach((rarelity) => {
                const data = item[rarelity];
                chips.appendChild(Common.td(data.chips + '', { class: ['rarelity', `back_${rarelity}`] }));
                if (arrays) {
                    arrays.appendChild(Common.td(data.arrays + '', { class: ['rarelity', `back_${rarelity}`] }));
                }
                money.appendChild(Common.td(data.money + '', { class: ['rarelity', `back_${rarelity}`] }));
                if (!total[rarelity]) {
                    total[rarelity] = {
                        chips: 0,
                        arrays: 0,
                        money: 0,
                    };
                }
                total[rarelity].chips += data.chips;
                total[rarelity].arrays += data.arrays || 0;
                total[rarelity].money += data.money;
            });
            tbody.appendChild(chips);
            if (arrays) {
                tbody.appendChild(arrays);
            }
            tbody.appendChild(money);
            tbody.appendChild(Common.tr({ class: 'line' }, Common.td('', { colSpan: 2 + RARELITY_LIST.length })));
        });
        const chips = Common.tr({ class: 'chips' }, Common.td('累計', { rowSpan: 3 }), Common.td('Ⅰ'));
        const arrays = Common.tr({ class: 'arrays' }, Common.td('Ⅱ'));
        const money = Common.tr({ class: 'money' }, Common.td('資金'));
        tbody.appendChild(chips);
        tbody.appendChild(arrays);
        tbody.appendChild(money);
        RARELITY_LIST.forEach((rarelity) => {
            const data = total[rarelity];
            chips.appendChild(Common.td(data.chips + '', { class: ['rarelity', `back_${rarelity}`] }));
            arrays.appendChild(Common.td(data.arrays + '', { class: ['rarelity', `back_${rarelity}`] }));
            money.appendChild(Common.td(data.money + '', { class: ['rarelity', `back_${rarelity}`] }));
        });
        const thead = document.createElement('thead');
        thead.appendChild(theadLine);
        const table = document.createElement('table');
        table.classList.add('awaking');
        table.appendChild(thead);
        table.appendChild(tbody);
        parent.appendChild(table);
    }, 0);
}
function DrawPartsLvUp(parent) {
    setTimeout(() => {
        PARTS_LVUP.forEach((item, index) => {
            const table = document.createElement('table');
            table.classList.add('parts');
            const caption = document.createElement('caption');
            caption.classList.add(`rarelity${item.rarelity}`);
            caption.textContent = (0 < index && item.rarelity + 1 !== PARTS_LVUP[index - 1].rarelity)
                ? `★${item.rarelity}～★${PARTS_LVUP[index - 1].rarelity - 1} 装備`
                : `★${item.rarelity} 装備`;
            table.appendChild(caption);
            const tr = Common.tr({}, ...[
                'LV',
                'パーツ',
                '個数',
                '資金',
                '累計',
            ].map((title) => {
                return Common.td(title);
            }));
            const thead = document.createElement('thead');
            thead.appendChild(tr);
            table.appendChild(thead);
            const tbody = document.createElement('tbody');
            table.appendChild(tbody);
            let lv = 0;
            let total = 0;
            item.list.forEach((item) => {
                total += item.money;
                const tr = Common.tr({ class: `rarelity${item.rarelity}` }, ...[
                    `+${++lv}`,
                    PARTS_NAMES[item.rarelity - 1],
                    item.num,
                    item.money,
                    total,
                ].map((data) => {
                    return Common.td(data + '');
                }));
                tr.children[1].classList.add('parts');
                tbody.appendChild(tr);
                if (item.ex) {
                    tr.children[0].rowSpan = 2;
                    tr.children[3].rowSpan = 2;
                    tr.children[4].rowSpan = 2;
                    const trEx = Common.tr({ class: `rarelity${item.ex.rarelity}` }, ...[
                        PARTS_NAMES[item.ex.rarelity],
                        item.ex.num,
                    ].map((data) => {
                        return Common.td(data + '');
                    }));
                    trEx.children[0].classList.add('parts', 'ex');
                    tbody.appendChild(trEx);
                }
            });
            parent.appendChild(table);
        });
    }, 0);
}
Promise.all([
    customElements.whenDefined('section-pages'),
    customElements.whenDefined('skill-book'),
    customElements.whenDefined('skill-exp'),
]).then(() => {
    ((parent) => {
        setTimeout(() => {
            const condition = parent.querySelector('calc-time');
            let nowPlace = 2;
            let nowMarriage = 0;
            const Update = () => {
                condition.max = nowPlace <= 2 ? 119 : 150;
                if (condition.max < condition.value) {
                    condition.value = condition.max;
                }
                condition.add = nowPlace + nowMarriage;
            };
            for (const place of parent.querySelectorAll('input[name="place"]')) {
                place.addEventListener('change', () => {
                    nowPlace = parseInt(place.value);
                    Update();
                });
            }
            for (const marriage of parent.querySelectorAll('input[name="marriage"]')) {
                marriage.addEventListener('change', () => {
                    nowMarriage = parseInt(marriage.value);
                    Update();
                });
            }
        }, 0);
    })(document.getElementById('condition'));
    DrawSkillLvUp(document.getElementById('skill_lvup'));
    DrawAwaking(document.getElementById('awaking'));
    DrawPartsLvUp(document.getElementById('parts_lvup'));
});
