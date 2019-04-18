/// <reference path="./kansen-item.ts" />

interface KansenListElement extends HTMLElement
{

}

interface AddKansenEvent extends CustomEvent<Kansen> {}

( () =>
{
	function ToLower( value: string )
	{
		return value.replace( /[A-Z]/g, ( c ) => { return String.fromCharCode( c.charCodeAt( 0 ) | 32 ); } );
	}
	
	class SortHeader extends ListItem
	{
		public static Init( tagname = 'sort-header' ) { if ( customElements.get( tagname ) ) { return; } customElements.define( tagname, this ); }

		private colmuns: { [ K in keyof Kansen ]: HTMLElement };

		private createButton( key: string )
		{
			const button = document.createElement( 'button' );
			button.classList.add( key );
			button.addEventListener( 'click', () =>
			{
				this.dispatchEvent( new Event( 'sort_' + key ) );
			} );

			return button;
		}

		protected init( shadow: ShadowRoot )
		{
			const style = <HTMLStyleElement>shadow.querySelector( 'style' );
			style.textContent = style.textContent +
			[
				':host { height: 1rem; }',
				'button { display: block; cursor: pointer; border: none; background: transparent; width: 100%; padding: 0; overflow: hidden; line-height: 1rem; }',
				'button.id:before { content: var( --label-id ); }',
				'button.name:before { content: var( --label-name ); }',
				'button.rarity:before { content: var( --label-rarity ); }',
				'button.camps:before { content: var( --label-camps ); }',
				'button.lv:before { content: var( --label-lv ); }',
				'button.star:before { content: var( --label-star ); }',
			].join( '' );

			const contents: NodeListOf<HTMLElement> = shadow.querySelectorAll( 'div > div' );
			contents[ 0 ].appendChild( this.createButton( 'id' ) );
			contents[ 1 ].appendChild( this.createButton( 'camps' ) );
			contents[ 2 ].appendChild( this.createButton( 'rarity' ) );
			contents[ 3 ].appendChild( this.createButton( 'name' ) );
			contents[ 4 ].appendChild( this.createButton( 'lv' ) );
			contents[ 5 ].appendChild( this.createButton( 'star' ) );
		}
	}

	class AddItem extends ListItem
	{
		public static Init( tagname = 'add-item' ) { if ( customElements.get( tagname ) ) { return; } customElements.define( tagname, this ); }

		private shadow: ShadowRoot;

		private numberInput( key: string )
		{
			const input = document.createElement( 'input' );
			input.id = key;
			input.type = 'number';

			return input;
		}

		private textInput( key: string )
		{
			const input = document.createElement( 'input' );
			input.id = key;
			input.type = 'text';

			return input;
		}

		private selectInput( key: string, values: string[] )
		{
			const select = document.createElement( 'select' );
			select.id = key;

			values.forEach( ( key ) =>
			{
				const option = document.createElement( 'option' );
				option.value = key;
				select.appendChild( option );
			} );

			return select;
		}

		protected init( shadow: ShadowRoot )
		{
			this.shadow = shadow;

			const style = <HTMLStyleElement>shadow.querySelector( 'style' );
			style.textContent = style.textContent +
			[
				':host { height: 1rem; }',
				'input, select { display: block; width: 100%; }',
				'select { height: 100%; }',
			].join( '' );

			const rarity = Object.keys( KansenRarity ).sort( ( a: RARITY, b: RARITY ) => { return KansenRarity[ a ] - KansenRarity[ b ]; } );
			const contents: NodeListOf<HTMLElement> = shadow.querySelectorAll( 'div > div' );
			contents[ 0 ].appendChild( this.numberInput( 'id' ) );
			contents[ 1 ].appendChild( this.selectInput( 'camps', Object.keys( KansenCamps ).sort( ( a: CAMPS, b: CAMPS ) => { return KansenCamps[ a ] - KansenCamps[ b ]; } ) ) );
			contents[ 2 ].appendChild( this.selectInput( 'rarity', rarity ) );
			contents[ 3 ].appendChild( this.textInput( 'name' ) );
			contents[ 4 ].appendChild( this.numberInput( 'lv' ) );
			contents[ 5 ].appendChild( this.selectInput( 'star', Array.from( { length: KansenRarity[ <RARITY>rarity[ rarity.length - 1 ] ] }, ( v, i ) => { return ( i + 1 ) + ''; } ) ) );

		}

		private getText( key: string )
		{
			return (<HTMLInputElement>this.shadow.getElementById( key )).value;
		}

		private selectedValue( key: string )
		{
			const select = <HTMLSelectElement>this.shadow.getElementById( key );
			return ( <HTMLOptionElement>select.children[ select.selectedIndex ] ).value;
		}

		public update( style: CSSStyleDeclaration )
		{
			this.shadow.querySelectorAll( 'select' ).forEach( ( select ) =>
			{
				for ( let option of select.children )
				{
					const value = (<HTMLOptionElement>option).value;
					option.textContent = style.getPropertyValue( '--' + select.id + '-' + ToLower( value ) ).replace( /\"/g, '' ) || value;
				}
			} );

		}

		public output()
		{
			const kansen: Kansen =
			{
				id: parseInt( this.getText( 'id' ) ),
				name: this.getText( 'name' ),
				rarity: <RARITY>this.selectedValue( 'rarity' ),
				camps: <CAMPS>this.selectedValue( 'camps' ),
				lv: parseInt( this.getText( 'lv' ) ),
				star: parseInt( this.selectedValue( 'star' ) ),
				convert: 0,
			};

			if ( !Number.isFinite( kansen.id ) ) { kansen.id = 0; }
			if ( !Number.isFinite( kansen.lv ) ) { kansen.lv = 1; }

			return kansen;
		}

	}

	class KansenList extends HTMLElement implements KansenListElement
	{
		public static Init( tagname = 'kansen-list' ) { if ( customElements.get( tagname ) ) { return; } customElements.define( tagname, this ); }

		private additem: AddItem;

		constructor()
		{
			super();

			const shadow = this.attachShadow( { mode: 'open' } );

			const style = document.createElement( 'style' );
			style.textContent =
			[
				':host { display: block; }',
				':host { --label-id: "ID"; --label-name: "Name"; --label-rarity: "Rarity"; --label-camps: "Camps"; --label-lv: "Lv"; --label-star: "Star"; }',
				this.selectStyle( 'rarity', Object.keys( KansenRarity ) ),
				this.selectStyle( 'camps', Object.keys( KansenCamps ) ),
			].join( '' );

			console.log(getComputedStyle(document.body).getPropertyValue('--rarity-unknown'));
			console.log('[--rarity-unknown]',getComputedStyle(this).getPropertyValue('--rarity-unknown'));
			console.log('[--rarity-unknown]',this.style.getPropertyValue('--rarity-unknown'));

			const header = new ( customElements.get( 'sort-header' ) )();

			this.additem = <AddItem>new ( customElements.get( 'add-item' ) )();

			const button = document.createElement( 'button' );
			button.textContent = 'Add';
			button.addEventListener( 'click', () =>
			{
				this.dispatchEvent( new CustomEvent( 'add', { detail: this.additem.output() } ) );
			} );

			shadow.appendChild( style );
			shadow.appendChild( header );
			shadow.appendChild( document.createElement( 'slot' ) );
			shadow.appendChild( this.additem );
			shadow.appendChild( button );

			this.update();
		}

		private selectStyle( base: string, values: string[] )
		{
			return ':host { ' + values.map( ( value ) =>
			{
				return '--' + base + '-' + ToLower( value ) + ': "' + ( value === 'UNKNOWN' ? '--' : value ) + '"';
			} ).join( '; ' ) + '; }';
		}

		public update()
		{
			this.additem.update( getComputedStyle(this) );
		}
	}

	SortHeader.Init();
	AddItem.Init();
	Promise.all(
	[
		customElements.whenDefined( 'kansen-item' ),
		customElements.whenDefined( 'sort-header' ),
		customElements.whenDefined( 'add-item' ),
	] ).then( () => { KansenList.Init(); } );
} )();
