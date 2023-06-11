/// <reference path="../modules/calc-time.ts" />

interface DateNotificationElement extends HTMLElement {
	readonly date: Date;
	enable: boolean;
	update(): void;
}

class WebWorkerNotification {
	protected audio: HTMLAudioElement;
	protected worker: Worker;
	public second = 60;
	public icon = '';
	public tag: string;
	public sound = false;
	protected active = true;
	protected list: DateNotificationElement[] = [];

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
			icon: this.icon,
			body: '時間が来ました',
			vibrate: [200, 200, 400],
			renotify: true,
			//requireInteraction: true,
			tag: this.tag,
		});
		this.play();
		notification.addEventListener('click', () => {
			if (this.active) {
				return;
			}
			//window.open(location.href);
		});
	}

	public add(input: HTMLInputElement, time: CalcTimeElement) {
		this.list.push(time);
		time.enable = input.checked;
		input.addEventListener('change', () => {
			time.enable = input.checked;
		});
	}

	protected onUpdate() {
		const now = Date.now();
		let list: DateNotificationElement[] = [];
		for (const item of this.list) {
			if (item.enable) {
				const time = item.date.getTime();
				if (now <= time && time <= now + (this.second) * 1000) {
					list.push(item);
				}
				item.update();
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
		this.worker.onmessage = (event) => {
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

	public play() {
		if (!this.sound) {
			return;
		}
		this.audio.currentTime = 0;
		this.audio.play();
	}
}
