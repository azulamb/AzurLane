interface MY_CAMPS_DATA
{
	all: number;
	member: number;
	limit: number;
	lvmax: number;
	point: number;
}

class KansenData
{
	private kansen: Kansen[];
	private camps: { [ K in CAMPS ]: MY_CAMPS_DATA };
	private target: HTMLElement;

	constructor( kansen: Kansen[] )
	{
		this.kansen = kansen;
	}

	private search( kansen: Kansen )
	{
		for ( let k of this.target.children )
		{
			if ( (<KansenItemElement>k).cid === kansen.id ) { return <KansenItemElement>k; }
		}

		return <KansenItemElement>new (customElements.get( 'kansen-item' ))();
	}

	public add( kansen: Kansen )
	{
		let add = false;
		if ( this.kansen.filter( ( k ) => { return kansen.id === k.id; } ).length <= 0 )
		{
			this.kansen.push( kansen );
			add = true;
			this.kansen.sort( ( a, b ) => { return a.id - b.id; } );
			this.calc();
		}

		const item = this.search( kansen );

		item.cid = kansen.id;
		item.cname = kansen.name;
		item.rarity = kansen.rarity;
		item.camps = kansen.camps;
		item.lv = kansen.lv;
		item.star = kansen.star;

		if ( add ) { this.target.appendChild( item ); }

		return item;
	}

	public render( target: HTMLElement )
	{
		this.target = target;
		this.kansen.forEach( ( kansen ) =>
		{
			this.target.appendChild( this.add( kansen ) );
		} );
		this.calc();
	}

	public calc()
	{
		this.camps = Object.keys( KansenCamps ).reduce( ( obj, key ) =>
		{
			const data: MY_CAMPS_DATA = { all: 0, member: 0, limit: 0, lvmax: 0, point: 0; };
			obj[ key ] = data;
			return obj;
		}, <any>{} );

		this.kansen.forEach( ( kansen ) =>
		{
			const data = this.camps[ kansen.camps ];
			++data.all;
			if ( kansen.lv <= 0 ) { return; }
			++data.member;
			if ( MaxRarity( kansen.rarity, kansen.id ) <= kansen.star ) { ++data.limit; }
			if ( kansen.lv < 120 ) { return; }
			++data.lvmax;
		} );

		Object.keys( this.camps ).forEach( ( key: CAMPS ) =>
		{
			const camp = this.camps[ key ];
			camp.point = ( camp.member + camp.limit + camp.limit ) * 10;
		} );

		console.log( this.camps );
	}

	public output()
	{
		return { list: this.kansen };
	}
}
