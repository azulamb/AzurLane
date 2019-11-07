interface SectionPagesElement extends HTMLElement
{
	update(): void;
}

( ( script, init ) =>
{
	if ( document.readyState !== 'loading' ) { return init( script ); }
	document.addEventListener( 'DOMContentLoaded', () => { init( script ); } );
} )( <HTMLScriptElement>document.currentScript, ( script: HTMLScriptElement ) =>
{
	( ( component, tagname = 'section-pages' ) =>
	{
		if ( customElements.get( tagname ) ) { return; }
		customElements.define( tagname, component );
	})( class extends HTMLElement implements SectionPagesElement
	{
		private list: HTMLElement;

		constructor()
		{
			super();

			const style = document.createElement( 'style' );
			style.textContent = [
				':host{--base-back:lightgray;--base-front:black;--select-back:white;--base-front:black;display:block;}',
				'button{background-color:var(--base-back);color:var(--base-front);border:none;outline:none;cursor:pointer;}',
				'.show{background-color:var(--select-back);color:var(--select-front);}',
			].join( '' );

			this.list = document.createElement( 'div' );

			const contents = document.createElement( 'div' );
			contents.appendChild( this.list );

			const shadow = this.attachShadow( { mode: 'open' } );
			shadow.appendChild( style );
			shadow.appendChild( contents );

			this.update();
		}

		public update()
		{
			const children = this.list.children;
			let selected: string | null = null;
			for ( let i = children.length - 1 ; 0 <= i ; --i)
			{
				if ( children[ i ].classList.contains( 'show' ) )
				{
					selected = children[ i ].textContent;
				}
				this.list.removeChild( children[ i ] );
			}

			const pages:
			{
				button: HTMLButtonElement;
				page: HTMLElement;
			}[] = [];
			document.querySelectorAll( 'section' ).forEach( ( section ) =>
			{
				const title = section.dataset.title;
				if ( !title ) { return; }
				const button = document.createElement( 'button' );
				button.textContent = title;
				button.addEventListener( 'click', () =>
				{
					for ( let page of pages )
					{
						if ( page.page === section )
						{
							button.classList.add( 'show' );
							section.classList.add( 'show' );
						} else
						{
							page.button.classList.remove( 'show' );
							page.page.classList.remove( 'show' );
						}
					}
				} );
				pages.push( { button: button, page: section } );
				this.list.appendChild( button );
				if ( title === selected ) {
					button.click();
					selected = '';
				}
			} );

			if ( selected === null && 0 < pages.length )
			{
				pages[ 0 ].button.click();
			}
		}
	}, script.dataset.tagname );
} );
