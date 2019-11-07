/// <reference path="./calendar-box.ts" />
/// <reference path="./calendar-input.ts" />

interface AppPointCalcConfig
{
	begin: CalendarInputElement;
	end: CalendarInputElement;
	target: HTMLInputElement;
	points: HTMLInputElement;
	dailypt: HTMLInputElement;
	earnpt: HTMLInputElement;

	result_dailypt: HTMLElement;
	result_dailylaps: HTMLElement;
}

class AppPointCalc
{
	private config: AppPointCalcConfig;

	constructor( config: AppPointCalcConfig )
	{
		this.config = config;

		config.begin.addEventListener( 'change', () => { this.calc(); } );
		config.end.addEventListener( 'change', () => { this.calc(); } );
		config.target.addEventListener( 'change', () => { this.calc(); } );
		config.points.addEventListener( 'change', () => { this.calc(); } );
		config.dailypt.addEventListener( 'change', () => { this.calc(); } );
		config.earnpt.addEventListener( 'change', () => { this.calc(); } );
	}

	public begin() { return new Date( this.config.begin.value ); }

	public end() { return new Date( this.config.end.value ); }

	public targetPoints() { return PositiveNumber( this.config.target.value ); }

	public nowPoints(){ return PositiveNumber( this.config.points.value ); }

	public dailyPoints(){ return PositiveNumber( this.config.dailypt.value ); }

	public earnPoints(){ return PositiveNumber( this.config.earnpt.value ); }

	//private minDate( a: Date, b: Date ) { return a.getTime() < b.getTime() ? a : b; }
	private maxDate( a: Date, b: Date ) { return a.getTime() < b.getTime() ? b : a; }
	private getDays( a: Date, b: Date )
	{
		const secs = Math.floor( Math.abs( a.getTime() - b.getTime() ) / 1000 );
console.log(secs,a.getTime(), b.getTime());
		const days = Math.floor( secs / ( 60 * 60 * 24 ) );
		return days + ( secs % ( 60 * 60 * 24 ) ? 1 : 0 );
	}

	public calc()
	{
		console.log(this.config.begin.value,this.config.end.value);
		const target = this.targetPoints();
		if ( target <= 0 ) { return; }

		const now = new Date();
		const end = this.end();
		const begin = now.getTime() < end.getTime() ? this.maxDate( this.begin(), now ) : this.begin();

		const days = this.getDays( begin, end );
		console.log( days, begin, end );
		if ( days <= 0 ) { return; }

		const nowpoint = this.nowPoints();

		if ( days == 1 )
		{
			this.config.result_dailypt.textContent = ( target - nowpoint ) + '';
			return;
		}

		const mission = this.dailyPoints();

		const needdaily = ( target - nowpoint - mission * ( days - 1 ) ) / days;

		this.config.result_dailypt.textContent = needdaily + '';

		const earn = this.earnPoints();
		if ( earn <= 0 ) { return; }

		this.config.result_dailylaps.textContent = ( needdaily / earn ) + '';

	}
}
