interface CalendarInputElement extends HTMLElement
{
	show(): void;
	hide(): void;
	toggle(): void;

	value: string;
	disable: boolean;
	left: boolean;
	top: boolean;
}

( ( script, init ) =>
{
	const calname = script.dataset.tagname || 'calendar-box';
	customElements.whenDefined( calname ).then( () =>
	{
		init( script, calname );
	} );
} )( <HTMLScriptElement>document.currentScript, ( script: HTMLScriptElement, calname: string ) =>
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

	function CreateCalendar()
	{
		return <CalendarBoxElement>new (customElements.get( calname ))();
	}

	( ( component, tagname = 'calendar-input' ) =>
	{
		if ( customElements.get( tagname ) ) { return; }
		customElements.define( tagname, component );
	})(class extends HTMLElement implements CalendarInputElement
	{
		private datevalue: HTMLSpanElement;
		private calendar: CalendarBoxElement;

		constructor()
		{
			super();

			const style = document.createElement( 'style' );
			style.textContent = [
				':host{display:inline-block;--icon:"📅";--z-index:9999;}',
				':host > div{position:relative;padding-right:1.2rem;}',
				':host > div > button{position:absolute;top:0;right:0;cursor:pointer;padding:0;width:1.2rem;height:1.2rem;box-sizing:border-box;}',
				'button::after{content:var(--icon);display:inline;}',
				':host > div > div{position:absolute;z-index:var(--z-index);display:none;}',
				':host([show]) > div > div{display:block;}',
				':host(:not([left])) > div > div{right:0;}',
				':host([top]) > div > div{bottom:100%;}',
			].join( '' );

			this.datevalue = document.createElement( 'span' );

			const button = document.createElement( 'button' );
			button.addEventListener( 'click', () =>
			{
				this.toggle();
			} );

			this.calendar =  CreateCalendar();
			this.calendar.addEventListener( 'change', ( event ) =>
			{
				this.value = event.detail.date;
				this.hide();
			} );

			const cbox = document.createElement( 'div' );
			cbox.appendChild( this.calendar );

			const contents = document.createElement( 'div' );
			contents.appendChild( this.datevalue );
			contents.appendChild( cbox );
			contents.appendChild( button );

			const shadow = this.attachShadow( { mode: 'open' } );
			shadow.appendChild( style );
			shadow.appendChild( contents );

			this.value = this.getAttribute( 'value' ) || '';
		}

		private update( value: string | null )
		{
			const date = ValueToDateString( value );
			if ( this.datevalue.textContent === date ) { return; }
			this.datevalue.textContent = date;
			this.calendar.value = date;
			this.dispatchEvent( new Event( 'change' ) );
		}

		public show() { this.setAttribute( 'show', '' ); }

		public hide() { this.removeAttribute( 'show' ); }

		public toggle() { this[ this.hasAttribute( 'show' ) ? 'hide' : 'show' ](); }

		get value() { return this.calendar.value; }
		set value( value ) { this.update( value ); }

		get disable() { return this.hasAttribute( 'disable' ); }
		set disable( value ) { if ( value ) { this.setAttribute( 'disable', '' ); } else { this.removeAttribute( 'disable' ); } }

		get left() { return this.hasAttribute( 'left' ); }
		set left( value ) { if ( value ) { this.setAttribute( 'left', '' ); } else { this.removeAttribute( 'left' ); } }

		get top() { return this.hasAttribute( 'top' ); }
		set top( value ) { if ( value ) { this.setAttribute( 'top', '' ); } else { this.removeAttribute( 'top' ); } }

	}, script.dataset.tagname );
} );
