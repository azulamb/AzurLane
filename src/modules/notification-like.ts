/// <reference path="./calc-time.ts" />

interface NotificationLikeElement extends HTMLElement {
}

((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	((component, tagname = 'notification-like') => {
		if (customElements.get(tagname)) {
			return;
		}
		customElements.define(tagname, component);
	})(
		class extends HTMLElement implements NotificationLikeElement {
			protected notification: WebWorkerNotification;
			protected list: CalcTimeElement[] = [];

			constructor() {
				super();

				const audio = new Audio(this.getAttribute('alarm') || '');
				this.notification = new WebWorkerNotification(audio);
				this.notification.icon = this.getAttribute('icon') || '';

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; --start-color: #0c860c; --end-color: #d25f5f; }',
					':host > div > div#ui:not(.ready) > div:first-child { display: flex; gap: 0.5rem; }',
					':host > div > div#ui.ready > div:first-child { display: none; }',
					':host > div > div#ui.ready > div:last-child { display: flex; gap: 0.5rem; }',
					':host > div > div#ui:not(.ready) > div:last-child { display: none; }',
					'label { user-select: none; }',
					'button { cursor: pointer; --back-color: var( --end-color ); background: var( --back-color ); border: none; border-radius: 0.1rem; color: #fff; padding: 0.2rem 0.6rem; }',
					'button:not(.on) { --back-color: var( --start-color ); }',
					'.title::before { content: "通知設定:"; }',
					'#notification::before { content: "通知の開始"; }',
					'#notification.on::before { content: "通知の停止"; }',
					'#sound::before { content: "音声:有効"; }',
					'#sound:not(.on)::before { content: "音声:無効"; }',
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

					const info = document.createElement('span');
					info.textContent = '通知はこのページを開いたままにしておくことで機能します。またいつでも停止することが可能です。';

					const contents = document.createElement('div');
					contents.appendChild(button);
					contents.appendChild(info);

					return contents;
				})();

				const config = (() => {
					for (const item of this.querySelectorAll('calc-time')) {
						this.list.push(<CalcTimeElement> item);
					}

					const list = document.createElement('div');
					this.list.forEach((item) => {
						const input = document.createElement('input');
						input.type = 'checkbox';

						item.enable = false;

						const label = document.createElement('label');
						label.appendChild(input);
						label.appendChild(document.createTextNode(item.textContent || ''));

						this.notification.add(input, item);

						list.appendChild(label);
					});

					const title = document.createElement('div');
					title.classList.add('title');

					const sound = document.createElement('button');
					sound.id = 'sound';
					sound.classList[this.notification.sound ? 'add' : 'remove']('on');
					sound.addEventListener('click', () => {
						sound.classList.toggle('on');
						this.notification.sound = sound.classList.contains('on');
						if (this.notification.sound) {
							this.notification.play();
						}
					});

					const button = document.createElement('button');
					button.id = 'notification';
					button.addEventListener('click', () => {
						if (!button.classList.contains('on')) {
							// Start
							const checked = this.list.filter((item) => {
								return item.enable;
							});
							if (checked.length <= 0) {
								alert('通知設定が未選択です');
								return;
							}
							this.notification.start(this.getAttribute('worker') || '');
						} else {
							// Stop
							this.notification.stop();
						}
						button.classList.toggle('on');
					});

					const contents = document.createElement('div');
					contents.appendChild(title);
					contents.appendChild(list);
					contents.appendChild(sound);
					contents.appendChild(button);
					contents.appendChild(audio);

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
				contents.appendChild(document.createElement('hr'));
				contents.appendChild(ui);

				shadow.appendChild(style);
				shadow.appendChild(contents);
			}

			protected requestNotification() {
				return this.notification.request();
			}
		},
		script.dataset.tagname,
	);
});
