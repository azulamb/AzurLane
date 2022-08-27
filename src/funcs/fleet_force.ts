/// <reference path="../modules/check-box.ts" />

declare const FLEET_FORCE: { id: string; name: string }[];

function DrawFleetForce(parent: HTMLElement) {
	customElements.whenDefined('check-box').then(() => {
		FLEET_FORCE.forEach((chara) => {
			const checkbox = new (<{ new (): CheckBoxElement }> customElements.get('check-box'))();
			checkbox.name = chara.id;
			checkbox.innerHTML = chara.name;
			checkbox.id = `freet_force_${chara.id}`;
			checkbox.save = true;

			parent.appendChild(checkbox);
		});
	});
}
