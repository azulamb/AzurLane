interface KansenRarityElement extends HTMLElement
{
	value: RARITY;
}

( () =>
{
	class KansenRaritySymbol extends HTMLElement implements KansenRarityElement
	{
		public static Init( tagname = 'kansen-rarity' ) { if ( customElements.get( tagname ) ) { return; } customElements.define( tagname, this ); }

		constructor()
		{
			super();

			const shadow = this.attachShadow( { mode: 'open' } );

			const style = document.createElement( 'style' );
			style.textContent =
			[
				':host { display: block; }',
				':host > span { display: block; opacity: 0; }',
			].join( '' );

			const text = document.createElement( 'span' );
			text.appendChild( document.createElement( 'slot' ) );

			shadow.appendChild( style );
			shadow.appendChild( text );

			this.update();
		}

		public update()
		{
			this.textContent = this.getAttribute( 'value' );
		}

		private convertRarity( value: string | null )
		{
			if ( KansenRarity[ <RARITY>value ] !== undefined ) { return <RARITY>value; }
			return 'UNKNOWN';
		}

		get value() { return this.convertRarity( this.getAttribute( 'rarity' ) ); }
		set value( value ) { this.setAttribute( 'value', this.convertRarity( value ) ); }

		static get observedAttributes() { return [ 'value' ]; }

		public attributeChangedCallback( attrName: string, oldVal: any , newVal: any )
		{
			if ( oldVal === newVal ) { return; }

			this.update();
		}
	}

	KansenRaritySymbol.Init();
} )();
