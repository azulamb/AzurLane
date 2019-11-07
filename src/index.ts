/// <reference path="./App.ts" />

document.addEventListener( 'DOMContentLoaded', () =>
{
	Promise.all(
	[
		customElements.whenDefined( 'calendar-input' ),
	] ).then( () =>
	{
		const app = new App(
		{
			//list: <HTMLElement>document.getElementById( 'list' ),
			//output: <HTMLTextAreaElement>document.getElementById( 'output' ),
			pc:
			{
				begin: <CalendarInputElement>document.getElementById( 'pc_begin' ),
				end: <CalendarInputElement>document.getElementById( 'pc_end' ),
				target: <HTMLInputElement>document.getElementById( 'pc_target' ),
				points: <HTMLInputElement>document.getElementById( 'pc_points' ),
				dailypt: <HTMLInputElement>document.getElementById( 'pc_dailypt' ),
				earnpt: <HTMLInputElement>document.getElementById( 'pc_earnpt' ),
				result_dailypt: <HTMLInputElement>document.getElementById( 'pc_result_dailypt' ),
				result_dailylaps: <HTMLInputElement>document.getElementById( 'pc_result_dailylaps' ),
			},
		} );
	} );
	document.body.lang = ( ( nav ) => { return nav.userLanguage || nav.language || nav.browserLanguage; } )( <any>window.navigator );
} );
