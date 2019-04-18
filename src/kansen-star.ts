interface KansenStarElement extends HTMLElement
{
	value: number;
}

function MaxRarity( rarity: RARITY, id: number )
{
	const r = KansenRarity[ rarity ];
	if ( !r ) { return 4; }
	if ( id <= 2 ) { return r - 1; }
	return r;
}

( () =>
{
	class KansenStarSymbol extends HTMLElement implements KansenStarElement
	{
		public static Init( tagname = 'kansen-star' ) { if ( customElements.get( tagname ) ) { return; } customElements.define( tagname, this ); }

		constructor()
		{
			super();

			const shadow = this.attachShadow( { mode: 'open' } );

			const style = document.createElement( 'style' );
			style.textContent =
			[
				':host { display: block; }',
			].join( '' );

			const contents = document.createElement( 'div' );
			contents.appendChild( document.createElement( 'slot' ) );

			shadow.appendChild( style );
			shadow.appendChild( contents );

			this.update();
		}

		private maxRarity()
		{
			return MaxRarity( <RARITY>this.getAttribute( 'rarity' ), parseInt( this.getAttribute( 'cid' ) || '0' ) );
		}

		private renderStar( num: number, star: string )
		{
			if ( num <= 0  ) { return ''; }
			return star.repeat( num );
		}

		public update()
		{
			// Calc max.
			const max = this.maxRarity();
			const star = this.value;

			this.textContent = this.renderStar( star, '★' ) + this.renderStar( max - star, '☆' );
		}

		private positiveNumber( value: number| string | null )
		{
			const num = typeof value === 'number' ? value : parseInt( value || '' );
			return 0 < num ? num : 0;
		}

		get value() { return this.positiveNumber( this.getAttribute( 'value' ) ); }
		set value( value ) { this.setAttribute( 'value', this.positiveNumber( value ) + '' ); }

		static get observedAttributes() { return [ 'value', 'cid', 'camps' ]; }

		public attributeChangedCallback( attrName: string, oldVal: any , newVal: any )
		{
			if ( oldVal === newVal ) { return; }

			this.update();
		}
	}

	KansenStarSymbol.Init();
} )();
