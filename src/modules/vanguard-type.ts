/* */
type VANGUARD_EFFECT_TYPE = 'area' | 'diffusion';

interface VanguardEffectTypeElement extends HTMLElement {
	type: VANGUARD_EFFECT_TYPE | '';
}

((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const VANGUARD_EFFECT_TYPES = ['area', 'diffusion'];
	const NAMES: { [key in VANGUARD_EFFECT_TYPE]: string } = {
		area: '領域',
		diffusion: '拡散',
	};
	((component, tagname = 'vanguard-type') => {
		if (customElements.get(tagname)) {
			return;
		}
		customElements.define(tagname, component);
	})(
		class extends HTMLElement implements VanguardEffectTypeElement {
			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: inline-block; --front: #000; width: 2rem; vertical-align: middle; }',
					':host > svg { display: block; width: 100%; height: auto; }',
					// Visible
					':host( :not([type="area"]) ) path.area { display: none; }',
					':host( :not([type="diffusion"]) ) path.diffusion { display: none; }',
				].join('');

				if (this.hasAttribute('type')) {
					this.type = this.type;
				}

				const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
				svg.setAttributeNS(null, 'width', '26px');
				svg.setAttributeNS(null, 'height', '16px');
				svg.setAttributeNS(null, 'viewBox', '0 0 26 16');

				const createPath = (d: string, color: string, cls?: string | string[]) => {
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
				// area
				svg.appendChild(
					createPath(
						'M 13,0 A 13,8 0 0 0 0,8 13,8 0 0 0 13,16 13,8 0 0 0 26,8 13,8 0 0 0 13,0 Z m 0,1 A 11,7.0000005 0 0 1 24,8 11,7.0000005 0 0 1 13,15 11,7.0000005 0 0 1 2,8 11,7.0000005 0 0 1 13,1 Z m 0,1.5 A 9,5.5 0 0 0 4,8 9,5.5 0 0 0 13,13.5 9,5.5 0 0 0 22,8 9,5.5 0 0 0 13,2.5 Z M 13,3 a 8,4.999999 0 0 1 8,5 8,4.999999 0 0 1 -8,5 8,4.999999 0 0 1 -8,-5 8,4.999999 0 0 1 8,-5 z m 0,2 a 5,3 0 0 0 -5,3 5,3 0 0 0 5,3 5,3 0 0 0 5,-3 5,3 0 0 0 -5,-3 z m 0,0.5 A 4.5,2.5000002 0 0 1 17.5,8 4.5,2.5000002 0 0 1 13,10.5 4.5,2.5000002 0 0 1 8.5,8 4.5,2.5000002 0 0 1 13,5.5 Z',
						'--front',
						'area',
					),
				);
				// diffusion
				svg.appendChild(
					createPath(
						'M 7,0 A 15,8 0 0 1 22,8 15,8 0 0 1 7,16 19,8 0 0 0 26,8 19,8 0 0 0 7,0 Z M 0,1 A 15,7 0 0 1 15,8 15,7 0 0 1 0,15 19,7 0 0 0 19,8 19,7 0 0 0 0,1 Z M 0.68359375,3.9589844 A 8.6842108,4.0526314 0 0 1 8.6835938,8 8.6842108,4.0526314 0 0 1 0.68359375,12.041016 11,4.0526314 0 0 0 11,8 11,4.0526314 0 0 0 0.68359375,3.9589844 Z',
						'--front',
						'diffusion',
					),
				);

				shadow.appendChild(style);
				shadow.appendChild(svg);
			}

			get type() {
				return <VANGUARD_EFFECT_TYPE> this.getAttribute('type') || '';
			}
			set type(value) {
				if (VANGUARD_EFFECT_TYPES.includes(value)) {
					this.setAttribute('type', value);
					this.title = NAMES[value];
				} else {
					this.removeAttribute('type');
					this.title = '';
				}
			}
		},
		script.dataset.tagname,
	);
});
