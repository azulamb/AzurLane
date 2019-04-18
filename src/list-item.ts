class ListItem extends HTMLElement
{
	
	constructor()
	{
		super();

		const shadow = this.attachShadow( { mode: 'open' } );

		const style = document.createElement( 'style' );
		style.textContent =
		[
			':host { display: block; }',
			':host > div { display: grid; grid-template-rows: 1fr; grid-template-columns: 2rem 2rem 2rem 1fr 2rem 4rem; }',
			':host > div > div { grid-row: 1 / 2; }',
			':host > div > div:nth-child( 1 ) { grid-column: 1 / 2; }',
			':host > div > div:nth-child( 2 ) { grid-column: 2 / 3; }',
			':host > div > div:nth-child( 3 ) { grid-column: 3 / 4; }',
			':host > div > div:nth-child( 4 ) { grid-column: 4 / 5; }',
			':host > div > div:nth-child( 5 ) { grid-column: 5 / 6; }',
			':host > div > div:nth-child( 6 ) { grid-column: 6 / 7; }',
		].join( '' );

		const id = document.createElement( 'div' );
		const camps = document.createElement( 'div' );
		const rarity = document.createElement( 'div' );
		const name = document.createElement( 'div' );

		const lv = document.createElement( 'div' );
		const star = document.createElement( 'div' );

		const contents = document.createElement( 'div' );
		contents.appendChild( id );
		contents.appendChild( camps );
		contents.appendChild( rarity );
		contents.appendChild( name );
		contents.appendChild( lv );
		contents.appendChild( star );

		shadow.appendChild( style );
		shadow.appendChild( contents );

		this.init( shadow );
	}

	protected init( shadow: ShadowRoot ) {}
}