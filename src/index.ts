/// <reference path="./App.ts" />

declare const KANSEN: Kansen[];
const KansenRarity: RARITY_STAR =
{
	UNKNOWN: 0,
	N: 4,
	R: 5,
	SR: 5,
	SSR: 6,
	UR: 6,
	PR: 6,
	DR: 6,
};
const KansenCamps: CAMPS_ORDER =
{
	OTHER: 0,
	UNION: 1,
	ROYAL: 2,
}

document.addEventListener( 'DOMContentLoaded', () =>
{
	customElements.whenDefined( 'kansen-list' ).then( () =>
	{
		const app = new App(
		{
			list: <HTMLElement>document.getElementById( 'list' ),
			output: <HTMLTextAreaElement>document.getElementById( 'output' ),
		}, KANSEN );
	} );
} );
