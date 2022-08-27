/// <reference path="../types.d.ts" />
/// <reference path="../components/fleet-formation.d.ts" />

function DrawFleet(parent: HTMLElement) {
	Promise.all([
		customElements.whenDefined('fleet-formation'),
	]).then(() => {
	});
}
