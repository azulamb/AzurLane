/// <reference path="./KansenData.ts" />
/// <reference path="./kansen-list.ts" />
//// <reference path="./ex-select.ts" />

interface AppConfig
{
	list: HTMLElement;
	output: HTMLTextAreaElement;
}

class App
{
	private data: KansenData;
	constructor( config: AppConfig, kansen: Kansen[] )
	{
		this.data = new KansenData( kansen );

		this.data.render( config.list );

		config.list.addEventListener( 'add', ( event: AddKansenEvent ) =>
		{
			this.data.add( event.detail );
			const data = this.data.output();
			config.output.textContent = 'const KANSEN = ' + JSON.stringify( data.list ).replace( /(\[|\}\,)/g, '$1\n' ).replace( /\"([^\"]*?)\"\:/g, "$1:" ) + ';';
		} );
	}
}
