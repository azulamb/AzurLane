interface CalendarBoxChangeData { date: string; }
interface CalendarBoxChangeEvent extends Event{ detail: CalendarBoxChangeData; }
interface CalendarBoxElement extends HTMLElement
{
	addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
	addEventListener( type: 'change', listener: ( event: CalendarBoxChangeEvent ) => any, options?: boolean | AddEventListenerOptions ): void;
	addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

	value: string;

	prev(): void;
	next(): void;
}

( ( script, init ) =>
{
	if ( document.readyState !== 'loading' ) { return init( script ); }
	document.addEventListener( 'DOMContentLoaded', () => { init( script ); } );
} )( <HTMLScriptElement>document.currentScript, ( script: HTMLScriptElement ) =>
{
	function ValueToDate( value: string | null )
	{
		const date = new Date( value || '' );
		return date.toString() === 'Invalid Date' ? new Date() : date;
	}

	function ValueToDateString( value: string | null )
	{
		const date = ValueToDate( value );
		return `${ date.getFullYear() }-${ date.getMonth() + 1 }-${ date.getDate() }`;
	}

	( ( component, tagname = 'calendar-box' ) =>
	{
		if ( customElements.get( tagname ) ) { return; }
		customElements.define( tagname, component );
	})( class extends HTMLElement implements CalendarBoxElement
	{
		private dateview: HTMLButtonElement;
		private contents: HTMLElement;
		private showdate: string;

		constructor()
		{
			super();

			const style = document.createElement( 'style' );
			style.textContent = [
				':host{display:block;--size:1.5em;--back:white;--none-back:lightgray;--select-back:khaki;--sun:"Su";--mon:"Mo";--tue:"Tu";--wed:"We";--thu:"Th";--fri:"Fr";--sat:"Sa";}',
				':host > div{background:var(--none-back);border:1px solid;gap:1px;display:grid;grid-template-columns:var(--size) var(--size) var(--size) var(--size) var(--size) var(--size) var(--size);}',
				':host > div[data-week="4"]{grid-template-rows:var(--size) var(--size) var(--size) var(--size) var(--size) var(--size);}',
				':host > div[data-week="5"]{grid-template-rows:var(--size) var(--size) var(--size) var(--size) var(--size) var(--size) var(--size);}',
				':host > div[data-week="6"]{grid-template-rows:var(--size) var(--size) var(--size) var(--size) var(--size) var(--size) var(--size) var(--size);}',
				'button{border:none;box-sizing:content-box;padding:0;height:100%;width:100%;outline:none;cursor:pointer;}',//margin:-1px 0 0 -1px;border:1px solid;
				'button,span{background:var(--back);font-size:calc(var(--size) * 0.5);}',
				'button:not([data-date]){border:none;margin:0;}',
				'.selected{background:var(--select-back);}',
				':host > div > button:nth-child(2){grid-area:1 / 2 / 1 / 7;}',
				':host > div > button:nth-child(1){grid-area:1 / 1;}',
				':host > div > button:nth-child(1)::after{content:"◀";}',
				':host > div > button:nth-child(3){grid-area:1 / 7;}',
				':host > div > button:nth-child(3)::after{content:"▶";}',
				':host > div > span{display:flex;align-items:center;justify-content:center;overflow:hidden;}',
				'.sun::after{content:var(--sun);display:inline;}',
				'.mon::after{content:var(--mon);display:inline;}',
				'.tue::after{content:var(--tue);display:inline;}',
				'.wed::after{content:var(--wed);display:inline;}',
				'.thu::after{content:var(--thu);display:inline;}',
				'.fri::after{content:var(--fri);display:inline;}',
				'.sat::after{content:var(--sat);display:inline;}',
			].join( '' );

			this.dateview = document.createElement( 'button' );
			const prev = document.createElement( 'button' );
			prev.addEventListener( 'click', () => { this.prev(); } );
			const next = document.createElement( 'button' );
			next.addEventListener( 'click', () => { this.next(); } );

			this.contents = document.createElement( 'div' );
			this.contents.addEventListener( 'click', ( event ) => { event.stopPropagation(); } );
			this.contents.appendChild( prev );
			this.contents.appendChild( this.dateview );
			this.contents.appendChild( next );
			[ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ].forEach( ( name ) =>
			{
				const week = document.createElement( 'span' );
				week.classList.add( name );
				this.contents.appendChild( week );
			} );

			const shadow = this.attachShadow( { mode: 'open' } );
			shadow.appendChild( style );
			shadow.appendChild( this.contents );

			this.update( this.getAttribute( 'value' ), true );
		}

		private selectDay( date: string, button?: HTMLButtonElement )
		{
			this.contents.querySelectorAll( 'button.selected' ).forEach( ( button ) => { button.classList.remove( 'selected' ); } );

			( button ? [ button ] : this.contents.querySelectorAll( `button[data-date="${ date }"]` ) ).forEach( ( button: HTMLButtonElement ) =>
			{
				button.classList.add( 'selected' );
			} );
			if ( !button ) { return; }
			this.updateDate( date );
		}

		private updateDate( date: string )
		{
			this.setAttribute( 'value', date );
			const data: CalendarBoxChangeData = { date: date };
			const event = new CustomEvent( 'change', { detail: data } );
			this.dispatchEvent( event );
		}

		private update( value: string | null, updatedate: boolean )
		{
			const date = ValueToDateString( value );
			if ( date && this.showdate === date ) { return; }

			const d = new Date( date );
			const ym = d.getFullYear() + '-' + ( d.getMonth() + 1 );
			if ( this.dateview.textContent === ym )
			{
				// Update select.
				this.selectDay( date );
			} else
			{
				this.dateview.textContent = ym;
				const base = this.dateview.textContent + '-';

				const children = this.contents.querySelectorAll( 'button[data-date]' );
				children.forEach( ( day ) =>
				{
					this.contents.removeChild( day );
				} );
	
				let week = new Date( d.getFullYear(), d.getMonth(), 1 ).getDay();
				const end = new Date( d.getFullYear(), d.getMonth() + 1, 0 ).getDate();
				let h = 3;

				const selectdate = updatedate ? date : this.value;
	
				for ( let day = 1 ; day <= end ; ++day )
				{
					const button = document.createElement( 'button' );
					button.dataset.date = base + day;
					if ( button.dataset.date === selectdate ) { button.classList.add( 'selected' ); }
					button.textContent = day + '';
					button.style.gridArea = h + ' / ' + ( ++week );
					button.addEventListener( 'click', () => { this.selectDay( <string>button.dataset.date, button ); } );
					this.contents.appendChild( button );
					if ( 7 <= week ) {
						if ( day === end ) { break; }
						++h; week = 0;
					}
				}
				this.contents.dataset.week = ( h-2 ) + '';
			}

			this.showdate = date;
			if ( updatedate ) { this.updateDate( date ); }
		}

		public change( diffmonth: number )
		{
			const month = typeof diffmonth === 'number' ? Math.floor( diffmonth ) : parseInt( diffmonth + '' );
			if ( !month ) { return; }
			const now = new Date( this.showdate );
			const date = new Date( now.getFullYear(), now.getMonth() + month, 1 );
			const day = Math.min( now.getDate(), new Date( date.getFullYear(), date.getMonth() + 1, 0 ).getDate() );
			this.update(  `${ date.getFullYear() }-${ date.getMonth() + 1 }-${ day }`, false );
		}

		public prev() { return this.change( -1 ); }

		public next() { return this.change( 1 ); }

		get value() { return this.getAttribute( 'value' ) || ''; }
		set value( value ) { this.update( value, true ); }

		static get observedAttributes() { return [ 'value' ]; }

		public attributeChangedCallback( attrName: string, oldVal: any , newVal: any )
		{
			if ( oldVal === newVal ) { return; }

			this.update( newVal, true );
		}
	}, script.dataset.tagname );
} );
