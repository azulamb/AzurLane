interface KansenCampsElement extends HTMLElement
{
	value: CAMPS;
}

( () =>
{
	class KansenCampsSymbol extends HTMLElement implements KansenCampsElement
	{
		public static Init( tagname = 'kansen-camps' ) { if ( customElements.get( tagname ) ) { return; } customElements.define( tagname, this ); }

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

		private convertCamps( value: string | null )
		{
			if ( KansenCamps[ <CAMPS>value ] !== undefined ) { return <CAMPS>value; }
			return 'OTHER';
		}

		get value() { return this.convertCamps( this.getAttribute( 'value' ) ); }
		set value( value ) { this.setAttribute( 'value', this.convertCamps( value ) ); }

		static get observedAttributes() { return [ 'value' ]; }

		public attributeChangedCallback( attrName: string, oldVal: any , newVal: any )
		{
			if ( oldVal === newVal ) { return; }

			this.update();
		}
	}

	KansenCampsSymbol.Init();
} )();
