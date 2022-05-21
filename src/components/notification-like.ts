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
	class MyNotification {
		protected audio: HTMLAudioElement;
		protected worker: Worker;
		public second = 60;
		public tag: string;
		public sound = true;
		protected active = true;
		protected list: { input: HTMLInputElement; time: CalcTimeElement }[] = [];

		constructor(audio: HTMLAudioElement) {
			this.audio = audio;
			this.tag = [location.host, location.pathname].join('_').replace(/.+\/\/(.+)/, '$1').replace(/[\/\.]/g, '_').replace(/_$/, '');
			window.addEventListener('focus', () => {
				this.active = true;
			});
			window.addEventListener('blur', () => {
				this.active = false;
			});
		}

		public request() {
			return Notification.requestPermission().then((result) => {
				if (result === 'denied' || result === 'default') {
					throw new Error('Denied');
				}
			});
		}

		public notification() {
			const notification = new Notification('AzurLane Tools', {
				icon: location.href + 'favicon.svg',
				body: '時間が来ました',
				vibrate: [200, 200, 400],
				renotify: true,
				//requireInteraction: true,
				tag: this.tag,
			});
			if (this.sound) {
				this.audio.currentTime = 0;
				this.audio.play();
			}
			notification.addEventListener('click', () => {
				if (this.active) {
					return;
				}
				//window.open(location.href);
			});
		}

		public add(input: HTMLInputElement, time: CalcTimeElement) {
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

		protected onChange() {
		}

		protected onUpdate() {
			const now = Date.now();
			let list = [];
			for (const item of this.list) {
				if (item.input.checked) {
					const time = item.time.date.getTime();
					if (now <= time && time <= now + (this.second) * 1000) {
						list.push(item);
					}
				}
			}
			if (0 < list.length) {
				this.notification();
			}
		}

		public start(worker: string) {
			if (!worker) {
				throw new Error('No worker.');
			}
			this.worker = new Worker(worker);
			this.worker.onmessage = (e) => {
				this.onUpdate();
			};
			this.worker.postMessage({ second: this.second });
		}

		public stop() {
			if (!this.worker) {
				return;
			}
			this.worker.terminate();
			this.worker = <any> null;
		}
	}

	((component, tagname = 'notification-like') => {
		if (customElements.get(tagname)) {
			return;
		}
		customElements.define(tagname, component);
	})(
		class extends HTMLElement implements NotificationLikeElement {
			protected notification: MyNotification;
			protected lists: CalcTimeElement[] = [];

			constructor() {
				super();

				const audio = new Audio(this.getAttribute('alarm') || '');
				this.notification = new MyNotification(audio);

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
				//open.style.display = 'none';

				const config = (() => {
					for (const item of this.querySelectorAll('calc-time')) {
						this.lists.push(<CalcTimeElement> item);
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

					const sound = document.createElement('button');
					sound.id = 'sound';
					sound.classList[this.notification.sound ? 'add' : 'remove']('on');
					sound.addEventListener('click', () => {
						sound.classList.toggle('on');
						this.notification.sound = sound.classList.contains('on');
					});

					const button = document.createElement('button');
					button.id = 'notification';
					button.addEventListener('click', () => {
						button.classList.toggle('on');
						if (button.classList.contains('on')) {
							// Start
							this.notification.start(this.getAttribute('worker') || '');
						} else {
							// Stop
							this.notification.stop();
						}
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
