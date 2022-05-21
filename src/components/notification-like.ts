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
		protected worker: Worker;
		public second = 60;
		protected list: { input: HTMLInputElement; time: CalcTimeElement }[] = [];

		public request() {
			return Notification.requestPermission().then((result) => {
				if (result === 'denied' || result === 'default') {
					throw new Error('Denied');
				}
			});
		}

		public notification() {
			const notification = new Notification('title', {
				icon: location.href + 'favicon.svg',
				body: 'test',
				vibrate: 5,
			});
			notification.addEventListener('click', () => {
				window.open(location.href);
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
			console.log('timer');
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

			protected requestNotification() {
				return this.notification.request();
			}
		},
		script.dataset.tagname,
	);
});
