/* */
/// <reference path="./kan-sen.ts" />
/// <reference path="./meow-fficer.ts" />

type FLEET_TYPE = 'surface' | 'submarine';

interface FleetFormationElement extends HTMLElement {
	edit: boolean;
	submarine: boolean;
}

((script, init) => {
	const kansenTagName = script.dataset.tagname || 'kan-sen';
	const meowfficerTagName = script.dataset.meowfficer || 'meow-fficer';
	Promise.all([
		customElements.whenDefined(kansenTagName),
		customElements.whenDefined(meowfficerTagName),
	]).then((result) => {
		init(script, kansenTagName, meowfficerTagName);
	});
})(
	<HTMLScriptElement> document.currentScript,
	(script: HTMLScriptElement, kansenTagName: string, meowfficerTagName: string) => {
		const tagName = script.dataset.tagname || 'fleet-formation';
		const FLEET_TYPES = ['surface', 'submarine'];

		const kansenConstructor = <KansenElementClass> customElements.get(kansenTagName);
		const meowfficerConstructor = <MeowfficerElementClass> customElements.get(meowfficerTagName);

		kansenTagName = kansenTagName.replace(/[a-z]/g, (c: string) => {
			return String.fromCharCode(c.charCodeAt(0) & ~32);
		});

		meowfficerTagName = meowfficerTagName.replace(/[a-z]/g, (c: string) => {
			return String.fromCharCode(c.charCodeAt(0) & ~32);
		});

		((component) => {
			if (customElements.get(tagName)) {
				return;
			}
			customElements.define(tagName, component);
		})(
			class extends HTMLElement implements FleetFormationElement {
				protected contents: HTMLElement;
				protected dialog: HTMLDialogElement;
				protected filter: HTMLElement;
				protected meowfficers: SVGImageElement[] = [];
				protected kansens: SVGImageElement[] = [];
				protected fleetTitle: SVGTextContentElement;
				protected canvas: HTMLCanvasElement;
				protected svg: SVGSVGElement;
				protected member: string[] = [];

				constructor() {
					super();

					const shadow = this.attachShadow({ mode: 'open' });

					const style = document.createElement('style');
					style.innerHTML = [
						':host { display: block; width: 100%; max-width: 800px; }',
						':host > div { display: block; position: relative; overflow: hidden; }',
						':host > div > button { display: none; }',
						':host > div > input { position: absolute; margin: auto; top: 0; bottom: 0; left: 1%; width: 15%; height: 1rem; display: block; background: transparent; color: transparent; display: none; outline: none; }',
						':host([edit]) > div.editmode > input { display: block; }',
						':host([edit]) > div > button { display: block; position: absolute; left: -1.1rem; width: 1rem; height: 1rem; padding: 0; border: 0; border-radius: 0.2rem; transition: left 0.5s 0.2s; cursor: pointer; }',
						':host([edit]) > div > button#edit { top: 0; }',
						':host([edit]) > div.editmode > button#change { top: 0; left: 1rem; }',
						':host([edit]) > div > button#copy { bottom: 0; }',
						':host([edit]:hover) > div > button, :host([edit]) > div.editmode > button { display: block; left: 0; }',
						':host > div > canvas { display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; }',
						':host > div > svg { display: block; width: 100%; height: auto; position: relative; --frame: #f8dd49; --back-side: 223, 146, 45; --back-bar: 228, 167, 55; --separate: #bb8f5b7b; }',
						':host > div:not(.editmode) > svg { pointer-events: none; }',
						':host([submarine]) > div > svg { --frame: #49a1f8; --back-side: 45, 142, 223; --back-bar: 55, 94, 228; --separate: #2d8ee97b }',
						':host([submarine]) .surface { display: none; }',
						':host > div > svg image { pointer-events: none; }',
						':host > div:not(.editmode) .editable { pointer-events: none; }',
						':host > div.editmode .editable { cursor: pointer; }',
						'dialog { border: none; padding: 5vh 5vw; background: transparent; height: 90vh; box-sizing: border-box; }',
						'dialog > div { background: #efefef; border-radius: 0.5rem; padding: 2vw; box-sizing: border-box; width: 80vw; height: 100%; overflow-x: hidden; overflow-y: auto; position: relative; display: flex; gap: 1vw; flex-wrap: wrap; align-content: flex-start; scrollbar-width: none; }',
						'dialog > div::-webkit-scrollbar { display: none; }',
						'dialog > div > button { display: block; width: 10vw; height: 10vw; outline: none; background-size: cover; position: relative; padding: 0; position: relative; }',
						'dialog > div > button.selected::before { content: ""; background: rgba(0, 0, 0, 0.7); display: block; position: absolute; width: 100%; height: 100%; top: 0; left: 0; }',
						'dialog > div > button > span { background: rgba(0,0,0,0.6); display: block; width: 100%; height: 1rem; color: #fff; position: absolute; bottom: 0; overflow: auto; white-space: nowrap; scrollbar-width: none; }',
						'dialog > div > button > span::-webkit-scrollbar { display: none; }',
						'dialog > button { position: absolute; left: calc(100% - 5vw - 1rem); top: calc(5vh - 1rem); width: 2rem; height: 2rem; border-radius: 50%; padding: 0; border: none; outline: none; font-size: 2rem; box-sizing: border-box; }',
						'dialog > button.filter { left: calc(5vw + 1rem); background: #2d344b; color: #efefef; border: 1px solid #efefef; font-size: 1rem; width: auto; height: auto; line-height: 1.5rem; border-radius: 1px; display: block; padding: 0.25rem 0.5rem; }',
						'dialog > button.filter::before { content: "Filter"; font-size: 1rem; }',
						'dialog::backdrop { background: rgba(0, 0, 0, 0.7); }',
						'#filter { width: 100%; height: 0; overflow: hidden; }',
						'#filter.open { height: auto; }',
						'button { cursor: pointer; }',
					].join('');

					if (this.hasAttribute('edit')) {
						this.edit = this.edit;
					}

					if (this.hasAttribute('submarine')) {
						this.submarine = this.submarine;
					}

					this.canvas = document.createElement('canvas');

					this.svg = this.createFrame(
						(index) => {
							const list = this.createKansenList(this.submarine ? 'submarine' : index < 3 ? 'main' : 'vanguard');

							this.renderDialogContents(
								dialog,
								list.map((kansen) => {
									const span = document.createElement('span');
									span.textContent = kansen.name;

									const button = document.createElement('button');
									button.style.backgroundImage = `url(${kansen.url})`;
									button.dataset.url = kansen.url;
									button.dataset.name = kansen.fullkey;
									button.title = kansen.name;
									button.appendChild(span);
									if (this.member.includes(button.dataset.name)) {
										button.classList.add('selected');
									}
									return button;
								}),
								(button) => {
									this.selectKansen(button, index);
									this.update();
								},
							);
						},
						(index) => {
							const list = this.createMeowfficerList();

							this.renderDialogContents(
								dialog,
								list.map((meowfficer) => {
									const span = document.createElement('span');
									span.textContent = meowfficer.fullname;

									const button = document.createElement('button');
									button.style.backgroundImage = `url(${meowfficer.url})`;
									button.dataset.url = meowfficer.url;
									button.dataset.name = meowfficer.name;
									button.title = meowfficer.fullname;
									button.appendChild(span);
									if (this.member.includes(button.dataset.name)) {
										button.classList.add('selected');
									}
									return button;
								}),
								(button) => {
									this.selectMeowfficer(button, index);
									this.update();
								},
							);
						},
					);

					const edit = document.createElement('button');
					edit.id = 'edit';
					edit.textContent = '+';
					edit.addEventListener('click', () => {
						this.contents.classList.toggle('editmode');
					});

					const change = document.createElement('button');
					change.id = 'change';
					change.textContent = '↻';
					change.addEventListener('click', () => {
						this.submarine = !this.submarine;
					});

					const copy = document.createElement('button');
					copy.id = 'copy';
					copy.textContent = '🗎';
					copy.addEventListener('click', () => {
						const source = this.outerHTML
							.replace(/ edit=""/, '')
							.replace(/\t+/g, '')
							.replace(/><([^/])/g, '>\n<$1')
							.replace(/>(<\/[^/]+>)$/, '>\n$1');
						navigator.clipboard.writeText(source).then(() => {
							alert('コピーしました');
						}).catch(() => {
							alert('コピーに失敗しました');
						});
					});

					const title = document.createElement('input');
					title.type = 'text';
					title.addEventListener('input', () => {
						this.title = title.value;
						this.fleetTitle.textContent = this.title;
					});

					const close = document.createElement('button');
					close.textContent = '×';
					close.addEventListener('click', (event) => {
						event.stopPropagation();
						this.dialog.close();
					});
					const openFilter = document.createElement('button');
					openFilter.classList.add('filter');
					openFilter.addEventListener('click', (event) => {
						event.stopPropagation();
						this.filter.classList.toggle('open');
					});
					const dialog = document.createElement('div');
					dialog.addEventListener('click', (event) => {
						event.stopPropagation();
					});
					this.dialog = document.createElement('dialog');
					this.dialog.appendChild(dialog);
					this.dialog.appendChild(openFilter);
					this.dialog.appendChild(close);
					this.dialog.addEventListener('click', (event) => {
						event.stopPropagation();
						this.dialog.close();
					});

					this.filter = document.createElement('div');
					this.filter.id = 'filter';

					this.contents = document.createElement('div');
					this.contents.appendChild(this.canvas);
					this.contents.appendChild(this.svg);
					this.contents.appendChild(this.dialog);
					this.contents.appendChild(edit);
					this.contents.appendChild(change);
					this.contents.appendChild(copy);
					this.contents.appendChild(title);

					shadow.appendChild(style);
					shadow.appendChild(this.contents);

					this.update();
				}

				protected createKansenList(type: KANSEN_FLEET_TYPE) {
					return kansenConstructor.list(type);
				}

				protected createMeowfficerList() {
					return meowfficerConstructor.list();
				}

				protected renderDialogContents(contents: HTMLElement, buttons: HTMLButtonElement[], callback: (button: HTMLButtonElement) => unknown) {
					contents.innerHTML = '';
					contents.appendChild(this.filter);
					const button = document.createElement('button');
					contents.appendChild(button);
					button.addEventListener('click', () => {
						callback(button);
						this.dialog.close();
					});
					for (const button of buttons) {
						contents.appendChild(button);
						button.addEventListener('click', () => {
							callback(button);
							this.dialog.close();
						});
					}
				}

				protected parseChildren() {
					const result: {
						kansen: KanSenElement[];
						mains: KanSenElement[];
						vanguards: KanSenElement[];
						submarines: KanSenElement[];
						meowfficers: MeowfficerElement[];
						sorted: boolean;
					} = {
						kansen: [],
						mains: [],
						vanguards: [],
						submarines: [],
						meowfficers: [],
						sorted: true,
					};

					const check: { mains: number[]; vanguards: number[] } = {
						mains: [],
						vanguards: [],
					};

					let i = 0;
					for (const child of this.children) {
						if (child.tagName === kansenTagName) {
							switch ((<KanSenElement> child).fleet) {
								case 'main':
									result.mains.push(<KanSenElement> child);
									check.mains.push(i);
									break;
								case 'vanguard':
									result.vanguards.push(<KanSenElement> child);
									check.vanguards.push(i);
									break;
								case 'submarine':
									result.submarines.push(<KanSenElement> child);
									check.mains.push(i);
									break;
							}
							result.kansen.push(<KanSenElement> child);
							++i;
						} else if (child.tagName === meowfficerTagName) {
							result.meowfficers.push(<MeowfficerElement> child);
						}
					}

					// check
					const merge = check.mains.concat(check.vanguards);
					for (let i = 0; i < merge.length; ++i) {
						if (merge[i] !== i) {
							result.sorted = false;
							break;
						}
					}

					return result;
				}

				protected update() {
					const children = this.parseChildren();

					let timer = 0;
					const updateCanvas = (img: SVGImageElement, url: string) => {
						fetch(url.replace(/png$/, 'json')).then((response) => {
							return response.json();
						}).then((result: { i: string }) => {
							img.onload = () => {
								if (timer) {
									clearTimeout(timer);
								}
								timer = setTimeout(() => {
									timer = 0;
									this.updateCanvas();
								}, 50);
							};
							img.setAttributeNS(null, 'href', result.i);
						});
					};

					// Sort children.
					if (!children.sorted) {
						for (const kansen of children.mains) {
							this.appendChild(kansen);
						}
						for (const kansen of children.vanguards) {
							this.appendChild(kansen);
						}
						for (const kansen of children.submarines) {
							this.appendChild(kansen);
						}
						for (const meowfficer of children.meowfficers) {
							this.appendChild(meowfficer);
						}
					}

					if (this.submarine) {
						for (let i = 0; i < 3; ++i) {
							const img = this.kansens[i];
							const kansen = children.submarines[i];
							const url = kansen?.icon;

							if (url) {
								updateCanvas(img, url);
							} else {
								img.removeAttributeNS(null, 'href');
							}
						}
					} else {
						for (let i = 0; i < 3; ++i) {
							const img = this.kansens[i];
							const kansen = children.mains[i];
							const url = kansen?.icon;

							if (url) {
								updateCanvas(img, url);
							} else {
								img.removeAttributeNS(null, 'href');
							}
						}

						for (let i = 0; i < 3; ++i) {
							const img = this.kansens[3 + i];
							const kansen = children.vanguards[i];
							const url = kansen?.icon;

							if (url) {
								updateCanvas(img, url);
							} else {
								img.removeAttributeNS(null, 'href');
							}
						}
					}

					for (let i = 0; i < 2; ++i) {
						const img = this.meowfficers[i];
						const meowfficer = children.meowfficers[i];
						const url = meowfficer?.icon;

						if (url) {
							updateCanvas(img, url);
						} else {
							img.removeAttributeNS(null, 'href');
						}
					}

					this.fleetTitle.textContent = this.title;

					this.member = [
						...children.kansen.map((kansen) => {
							return kansen.fullkey;
						}),
						...children.meowfficers.map((meowfficer) => {
							return meowfficer.name;
						}),
					];
					this.updateCanvas();
				}

				protected updateCanvas() {
					this.canvas.width = parseInt((this.svg.getAttribute('width') || '').replace('px', '')) / 2;
					this.canvas.height = parseInt((this.svg.getAttribute('height') || '').replace('px', '')) / 2;

					const context = <CanvasRenderingContext2D> this.canvas.getContext('2d');
					context.clearRect(0, 0, this.canvas.width, this.canvas.height);

					const img = new Image();
					img.onload = () => {
						context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
					};
					img.onerror = (error) => {
						console.error(error);
					};

					const style = getComputedStyle(this.svg);
					const inStyle = ['--frame', '--back-side', '--back-bar', '--separate'].map((key) => {
						return `${key}:${style.getPropertyValue(key)}`;
					}).join(';');
					img.src = 'data:image/svg+xml;base64,' +
						btoa(unescape(encodeURIComponent(
							this.svg.outerHTML.replace(/<svg/, `<svg xmlns="http://www.w3.org/2000/svg" style="${inStyle}"`),
						)));
				}

				get edit() {
					return this.hasAttribute('edit') && 0 < Object.keys(kansenConstructor.kansen).length;
				}
				set edit(value) {
					if (!value || Object.keys(kansenConstructor.kansen).length === 0) {
						this.removeAttribute('edit');
					} else {
						this.setAttribute('edit', '');
					}
				}

				get submarine() {
					return this.hasAttribute('submarine');
				}
				set submarine(value) {
					if (!value) {
						this.removeAttribute('submarine');
					} else {
						this.setAttribute('submarine', '');
					}
				}

				protected createFrame(
					openKansenModal: (index: number) => unknown,
					openMeowfficerModal: (index: number) => unknown,
				) {
					const back = document.createElementNS('http://www.w3.org/2000/svg', 'path');
					back.setAttributeNS(
						null,
						'd',
						'm 20,5 h 1295 c 2.77,0 5,2.23 5,5 v 180 c 0,2.77 -2.23,5 -5,5 H 20 c -2.77,0 -5,-2.23 -5,-5 V 10 c 0,-2.77 2.23,-5 5,-5 z',
					);
					back.style.fill = '#1a1a1a9a';

					const sideBack = document.createElementNS('http://www.w3.org/2000/svg', 'path');
					sideBack.setAttributeNS(null, 'd', 'M 385,5 195,195 H 20 l -5,-5 V 10 l 5,-5 z');
					sideBack.setAttributeNS(null, 'fill', 'url(#linearGradient14970)');

					const sideBar = document.createElementNS('http://www.w3.org/2000/svg', 'path');
					sideBar.setAttributeNS(null, 'd', 'm 15,75 v 50 h 210 l 50,-50 z m 270,0 -50,50 h 30 l 50,-50 z');
					sideBar.setAttributeNS(null, 'fill', 'url(#linearGradient10761)');

					this.fleetTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
					this.fleetTitle.setAttributeNS(null, 'x', '142');
					this.fleetTitle.setAttributeNS(null, 'y', '110');
					this.fleetTitle.style.fontWeight = 'bold';
					this.fleetTitle.style.fontSize = '33.5465px';
					this.fleetTitle.style.fontFamily = 'YuGothic';
					this.fleetTitle.style.textAlign = 'center';
					this.fleetTitle.style.textAnchor = 'middle';
					this.fleetTitle.style.fill = '#ffffff';
					this.fleetTitle.textContent = this.title;

					const separate = document.createElementNS('http://www.w3.org/2000/svg', 'path');
					separate.setAttributeNS(
						null,
						'd',
						'm 470,5 15,15 15,-15 z m 160,0 15,15 15,-15 z m 345,0 15,15 15,-15 z m 160,0 15,15 15,-15 z M 817.5,30 c -1.38071,0 -2.5,1.119288 -2.5,2.5 v 35 c 0,1.380712 1.11929,2.5 2.5,2.5 1.38071,0 2.5,-1.119288 2.5,-2.5 v -35 c 0,-1.380712 -1.11929,-2.5 -2.5,-2.5 z m 0,100 c -1.38071,0 -2.5,1.11929 -2.5,2.5 v 35 c 0,1.38071 1.11929,2.5 2.5,2.5 1.38071,0 2.5,-1.11929 2.5,-2.5 v -35 c 0,-1.38071 -1.11929,-2.5 -2.5,-2.5 z M 485,180 470,195 h 30 z m 160,0 -15,15 h 30 z m 345,0 -15,15 h 30 z m 160,0 -15,15 h 30 z',
					);
					separate.style.fill = 'var(--separate)';

					const frame = document.createElementNS('http://www.w3.org/2000/svg', 'path');
					frame.setAttributeNS(
						null,
						'd',
						'm 20,3 c -3.843402,0 -7,3.1565983 -7,7 v 180 c 0,3.8434 3.156598,7 7,7 h 1295 c 3.8434,0 7,-3.1566 7,-7 V 10 c 0,-3.8434017 -3.1566,-7 -7,-7 z m 0,4 h 1295 c 1.6966,0 3,1.3034072 3,3 v 180 c 0,1.69659 -1.3034,3 -3,3 H 20 c -1.696593,0 -3,-1.30341 -3,-3 V 10 c 0,-1.6965928 1.303407,-3 3,-3 z',
					);
					frame.style.fill = 'var(--frame)';

					const mBack1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					mBack1.setAttributeNS(null, 'x', '1331');
					mBack1.setAttributeNS(null, 'y', '11');
					mBack1.setAttributeNS(null, 'width', '258');
					mBack1.setAttributeNS(null, 'height', '78');
					mBack1.style.fill = '#1a1a1a80';
					const mImg1 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
					mImg1.setAttributeNS(null, 'x', '1330');
					mImg1.setAttributeNS(null, 'y', '-80');
					mImg1.setAttributeNS(null, 'width', '260');
					mImg1.setAttributeNS(null, 'height', '260');
					mImg1.setAttributeNS(null, 'clip-path', 'url(#clipPath27603)');
					const mFrame1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
					mFrame1.setAttributeNS(null, 'd', 'm 1330,10 v 80 h 260 V 10 Z m 2,2 h 256 v 76 h -256 z');
					mFrame1.style.fill = 'var(--frame)';

					const mBack2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					mBack2.setAttributeNS(null, 'x', '1331');
					mBack2.setAttributeNS(null, 'y', '111');
					mBack2.setAttributeNS(null, 'width', '258');
					mBack2.setAttributeNS(null, 'height', '78');
					mBack2.style.fill = '#1a1a1a80';
					const mImg2 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
					mImg2.setAttributeNS(null, 'x', '1330');
					mImg2.setAttributeNS(null, 'y', '20');
					mImg2.setAttributeNS(null, 'width', '260');
					mImg2.setAttributeNS(null, 'height', '260');
					mImg2.setAttributeNS(null, 'clip-path', 'url(#clipPath27607)');
					const mFrame2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
					mFrame2.setAttributeNS(null, 'd', 'm 1330,110 v 80 h 260 v -80 z m 2,2 h 256 v 76 h -256 z');
					mFrame2.style.fill = 'var(--frame)';

					const mainBack1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					mainBack1.setAttributeNS(null, 'x', '335');
					mainBack1.setAttributeNS(null, 'y', '30');
					mainBack1.setAttributeNS(null, 'width', '140');
					mainBack1.setAttributeNS(null, 'height', '140');
					mainBack1.style.fill = '#1a1a1a80';

					const mainBack2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					mainBack2.setAttributeNS(null, 'x', '495');
					mainBack2.setAttributeNS(null, 'y', '30');
					mainBack2.setAttributeNS(null, 'width', '140');
					mainBack2.setAttributeNS(null, 'height', '140');
					mainBack2.style.fill = '#1a1a1a80';

					const mainBack3 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					mainBack3.setAttributeNS(null, 'x', '655');
					mainBack3.setAttributeNS(null, 'y', '30');
					mainBack3.setAttributeNS(null, 'width', '140');
					mainBack3.setAttributeNS(null, 'height', '140');
					mainBack3.style.fill = '#1a1a1a80';

					const vanguardBack1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					vanguardBack1.setAttributeNS(null, 'x', '840');
					vanguardBack1.setAttributeNS(null, 'y', '30');
					vanguardBack1.setAttributeNS(null, 'width', '140');
					vanguardBack1.setAttributeNS(null, 'height', '140');
					vanguardBack1.style.fill = '#1a1a1a80';
					vanguardBack1.classList.add('surface');

					const vanguardBack2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					vanguardBack2.setAttributeNS(null, 'x', '1000');
					vanguardBack2.setAttributeNS(null, 'y', '30');
					vanguardBack2.setAttributeNS(null, 'width', '140');
					vanguardBack2.setAttributeNS(null, 'height', '140');
					vanguardBack2.style.fill = '#1a1a1a80';
					vanguardBack2.classList.add('surface');

					const vanguardBack3 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					vanguardBack3.setAttributeNS(null, 'x', '1160');
					vanguardBack3.setAttributeNS(null, 'y', '30');
					vanguardBack3.setAttributeNS(null, 'width', '140');
					vanguardBack3.setAttributeNS(null, 'height', '140');
					vanguardBack3.style.fill = '#1a1a1a80';
					vanguardBack3.classList.add('surface');

					const main1 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
					main1.setAttributeNS(null, 'x', '335');
					main1.setAttributeNS(null, 'y', '30');
					main1.setAttributeNS(null, 'width', '140');
					main1.setAttributeNS(null, 'height', '140');

					const main2 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
					main2.setAttributeNS(null, 'x', '495');
					main2.setAttributeNS(null, 'y', '30');
					main2.setAttributeNS(null, 'width', '140');
					main2.setAttributeNS(null, 'height', '140');

					const main3 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
					main3.setAttributeNS(null, 'x', '655');
					main3.setAttributeNS(null, 'y', '30');
					main3.setAttributeNS(null, 'width', '140');
					main3.setAttributeNS(null, 'height', '140');

					const vanguard1 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
					vanguard1.setAttributeNS(null, 'x', '840');
					vanguard1.setAttributeNS(null, 'y', '30');
					vanguard1.setAttributeNS(null, 'width', '140');
					vanguard1.setAttributeNS(null, 'height', '140');
					vanguard1.classList.add('surface');

					const vanguard2 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
					vanguard2.setAttributeNS(null, 'x', '1000');
					vanguard2.setAttributeNS(null, 'y', '30');
					vanguard2.setAttributeNS(null, 'width', '140');
					vanguard2.setAttributeNS(null, 'height', '140');
					vanguard2.classList.add('surface');

					const vanguard3 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
					vanguard3.setAttributeNS(null, 'x', '1160');
					vanguard3.setAttributeNS(null, 'y', '30');
					vanguard3.setAttributeNS(null, 'width', '140');
					vanguard3.setAttributeNS(null, 'height', '140');
					vanguard3.classList.add('surface');

					// defs
					const sideBack1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
					sideBack1.setAttributeNS(null, 'offset', '0');
					sideBack1.setAttributeNS(null, 'stop-color', 'rgba(var(--back-side), 0.13)');
					const sideBack2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
					sideBack2.setAttributeNS(null, 'offset', '1');
					sideBack2.setAttributeNS(null, 'stop-color', 'rgba(var(--back-side), 0.4)');
					const sideBackGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
					sideBackGrad.id = 'linearGradient14970';
					sideBackGrad.setAttributeNS(null, 'x1', '130');
					sideBackGrad.setAttributeNS(null, 'y1', '120');
					sideBackGrad.setAttributeNS(null, 'x2', '200');
					sideBackGrad.setAttributeNS(null, 'y2', '190');
					sideBackGrad.setAttributeNS(null, 'gradientUnits', 'userSpaceOnUse');
					sideBackGrad.appendChild(sideBack1);
					sideBackGrad.appendChild(sideBack2);

					const sideBar1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
					sideBar1.setAttributeNS(null, 'offset', '0');
					sideBar1.setAttributeNS(null, 'stop-color', 'rgba(var(--back-bar), 0.15)');
					const sideBar2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
					sideBar2.setAttributeNS(null, 'offset', '1');
					sideBar2.setAttributeNS(null, 'stop-color', 'rgba(var(--back-bar), 0.55)');
					const sideBarGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
					sideBarGrad.id = 'linearGradient10761';
					sideBarGrad.setAttributeNS(null, 'x1', '135');
					sideBarGrad.setAttributeNS(null, 'y1', '85');
					sideBarGrad.setAttributeNS(null, 'x2', '295');
					sideBarGrad.setAttributeNS(null, 'y2', '85');
					sideBarGrad.setAttributeNS(null, 'gradientUnits', 'userSpaceOnUse');
					sideBarGrad.appendChild(sideBar1);
					sideBarGrad.appendChild(sideBar2);

					const meowfficerRect1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					meowfficerRect1.setAttributeNS(null, 'x', '1330');
					meowfficerRect1.setAttributeNS(null, 'y', '10');
					meowfficerRect1.setAttributeNS(null, 'width', '260');
					meowfficerRect1.setAttributeNS(null, 'height', '80');
					const meowfficerClip1 = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
					meowfficerClip1.id = 'clipPath27603';
					meowfficerClip1.setAttributeNS(null, 'clipPathUnits', 'userSpaceOnUse');
					meowfficerClip1.appendChild(meowfficerRect1);

					const meowfficerRect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					meowfficerRect2.setAttributeNS(null, 'x', '1330');
					meowfficerRect2.setAttributeNS(null, 'y', '110');
					meowfficerRect2.setAttributeNS(null, 'width', '260');
					meowfficerRect2.setAttributeNS(null, 'height', '80');
					const meowfficerClip2 = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
					meowfficerClip2.id = 'clipPath27607';
					meowfficerClip2.setAttributeNS(null, 'clipPathUnits', 'userSpaceOnUse');
					meowfficerClip2.appendChild(meowfficerRect2);

					const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
					defs.appendChild(sideBackGrad);
					defs.appendChild(sideBarGrad);
					defs.appendChild(meowfficerClip1);
					defs.appendChild(meowfficerClip2);

					const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					svg.setAttributeNS(null, 'width', '1600px');
					svg.setAttributeNS(null, 'height', '200px');
					svg.setAttributeNS(null, 'viewBox', '0 0 1600 200');
					svg.appendChild(defs);
					svg.appendChild(back);
					svg.appendChild(sideBack);
					svg.appendChild(sideBar);
					svg.appendChild(this.fleetTitle);
					svg.appendChild(separate);
					svg.appendChild(frame);
					svg.appendChild(mainBack1);
					svg.appendChild(mainBack2);
					svg.appendChild(mainBack3);
					svg.appendChild(vanguardBack1);
					svg.appendChild(vanguardBack2);
					svg.appendChild(vanguardBack3);
					svg.appendChild(main1);
					svg.appendChild(main2);
					svg.appendChild(main3);
					svg.appendChild(vanguard1);
					svg.appendChild(vanguard2);
					svg.appendChild(vanguard3);
					svg.appendChild(mBack1);
					svg.appendChild(mImg1);
					svg.appendChild(mFrame1);
					svg.appendChild(mBack2);
					svg.appendChild(mImg2);
					svg.appendChild(mFrame2);

					this.kansens.push(main1);
					this.kansens.push(main2);
					this.kansens.push(main3);
					this.kansens.push(vanguard1);
					this.kansens.push(vanguard2);
					this.kansens.push(vanguard3);
					this.meowfficers.push(mImg1);
					this.meowfficers.push(mImg2);

					[mainBack1, mainBack2, mainBack3, vanguardBack1, vanguardBack2, vanguardBack3].forEach((button, index) => {
						button.classList.add('editable');
						button.addEventListener('click', () => {
							openKansenModal(index);
							this.dialog.showModal();
						});
					});

					[mBack1, mBack2].forEach((button, index) => {
						button.classList.add('editable');
						button.addEventListener('click', () => {
							openMeowfficerModal(index);
							this.dialog.showModal();
						});
					});

					return svg;
				}

				protected selectKansen(button: HTMLButtonElement, index: number) {
					const children = this.parseChildren();
					const name = button.dataset.name || '';

					if (index < 3) {
						if (this.submarine) {
							// submarine
							while (!children.submarines[index]) {
								const kansen = new kansenConstructor();
								kansen.fleet = 'submarine';
								children.submarines.push(kansen);
								this.appendChild(kansen);
							}
							children.submarines[index].reset();
							children.submarines[index].fleet = 'submarine';
							children.submarines[index].name = name;
						} else {
							// main
							while (!children.mains[index]) {
								const kansen = new kansenConstructor();
								kansen.fleet = 'main';
								children.mains.push(kansen);
								this.appendChild(kansen);
							}
							children.mains[index].reset();
							children.mains[index].fleet = 'main';
							children.mains[index].name = name;
						}
					} else {
						// vanguard
						if (!this.submarine) {
							const vIndex = index - 3;
							while (!children.vanguards[vIndex]) {
								const kansen = new kansenConstructor();
								kansen.fleet = 'vanguard';
								children.vanguards.push(kansen);
								this.appendChild(kansen);
							}
							children.vanguards[vIndex].reset();
							children.vanguards[vIndex].fleet = 'vanguard';
							children.vanguards[vIndex].name = name;
						}
					}
				}

				protected selectMeowfficer(button: HTMLButtonElement, index: number) {
					const children = this.parseChildren();
					const name = button.dataset.name || '';

					while (!children.meowfficers[index]) {
						const meowfficer = new meowfficerConstructor();
						children.meowfficers.push(meowfficer);
						this.appendChild(meowfficer);
					}
					children.meowfficers[index].name = <''> name;
				}
			},
		);
	},
);
