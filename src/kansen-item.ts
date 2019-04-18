/// <reference path="./list-item.ts" />
/// <reference path="./kansen-camps.ts" />
/// <reference path="./kansen-rarity.ts" />
/// <reference path="./kansen-star.ts" />

interface KansenItemElement extends HTMLElement
{
	cid: number;
	cname: string;
	rarity: RARITY;
	camps: CAMPS;

	lv: number;
	star: number;
}

( () =>
{
	class KansenItem extends ListItem implements KansenItemElement
	{
		public static Init( tagname = 'kansen-item' ) { if ( customElements.get( tagname ) ) { return; } customElements.define( tagname, this ); }

		private colmuns: { [ K in keyof Kansen ]: HTMLElement };

		protected init( shadow: ShadowRoot )
		{
			const style = <HTMLStyleElement>shadow.querySelector( 'style' );
			style.textContent = style.textContent +
			[
				':host > div > div:first-child, :host > div > div:nth-child(5) { text-align: right; }',
			].join( '' );

			const contents: NodeListOf<HTMLElement> = shadow.querySelectorAll( 'div > div' );
			this.colmuns =
			{
				id:     contents[ 0 ],
				name:   contents[ 3 ],
				rarity: contents[ 2 ],
				camps:  contents[ 1 ],
				lv:     contents[ 4 ],
				star:   contents[ 5 ],
				convert: <any>null,
			};

			const camps = <KansenCampsElement>new ( customElements.get( 'kansen-camps' ) )();
			this.colmuns.camps.appendChild( camps );
			this.colmuns.camps = camps;

			const rarity = <KansenRarityElement>new ( customElements.get( 'kansen-rarity' ) )();
			this.colmuns.rarity.appendChild( rarity );
			this.colmuns.rarity = rarity;

			const star = <KansenStarElement>new ( customElements.get( 'kansen-star' ) )();
			this.colmuns.star.appendChild( star );
			this.colmuns.star = star;

			this.update();
		}

		public update()
		{
			this.colmuns.id.textContent     = this.getAttribute( 'cid' );
			this.colmuns.name.textContent   = this.getAttribute( 'cname' );
			(<KansenRarityElement>this.colmuns.rarity).value = <RARITY>this.getAttribute( 'rarity' );
			(<KansenCampsElement>this.colmuns.camps).value = <CAMPS>this.getAttribute( 'camps' );
			this.colmuns.lv.textContent     = this.getAttribute( 'lv' );
			this.colmuns.star.setAttribute( 'cid', this.getAttribute( 'cid' ) || '' );
			this.colmuns.star.setAttribute( 'rarity', this.getAttribute( 'rarity' ) || '' );
			this.colmuns.star.setAttribute( 'value', this.getAttribute( 'star' ) || '' );
		}

		private positiveNumber( value: number| string | null )
		{
			const num = typeof value === 'number' ? value : parseInt( value || '' );
			return 0 < num ? num : 0;
		}

		get cid() { return this.positiveNumber( this.getAttribute( 'cid' ) ); }
		set cid( value ) { this.setAttribute( 'cid', this.positiveNumber( value ) + '' ); }

		get cname() { return this.getAttribute( 'cname' ) || ''; }
		set cname( value ) { this.setAttribute( 'cname', value ); }

		get rarity() { return (<KansenRarityElement>this.colmuns.rarity).value; }
		set rarity( value ) {
			(<KansenRarityElement>this.colmuns.rarity).value = value;
			this.setAttribute( 'rarity', (<KansenRarityElement>this.colmuns.rarity).value );
		}

		get camps() { return (<KansenCampsElement>this.colmuns.camps).value; }
		set camps( value )
		{
			(<KansenCampsElement>this.colmuns.camps).value = value;
			this.setAttribute( 'camps', (<KansenCampsElement>this.colmuns.camps).value );
		}

		get lv() { return this.positiveNumber( this.getAttribute( 'lv' ) ); }
		set lv( value ) { this.setAttribute( 'lv', this.positiveNumber( value ) + '' ); }

		get star() { return (<KansenStarElement>this.colmuns.rarity).value; }
		set star( value ) {
			(<KansenStarElement>this.colmuns.star).value = value;
			this.setAttribute( 'star', (<KansenStarElement>this.colmuns.star).value + '' );
		}

		static get observedAttributes() { return [ 'cid', 'cname', 'rarity', 'camps', 'lv', 'star' ]; }

		public attributeChangedCallback( attrName: string, oldVal: any , newVal: any )
		{
			// 更新がない場合は何もしないことにします。
			if ( oldVal === newVal ) { return; }

			this.update();
		}
	}

	Promise.all(
	[
		customElements.whenDefined( 'kansen-camps' ),
		customElements.whenDefined( 'kansen-rarity' ),
		customElements.whenDefined( 'kansen-star' ),
	] ).then( () => { KansenItem.Init(); } );
} )();
