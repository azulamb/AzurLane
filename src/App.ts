/// <reference path="./section-pages.ts" />
/// <reference path="./AppPointCalc.ts" />

interface AppConfig
{
	pc: AppPointCalcConfig;
}

function PositiveNumber( value: number|string|null )
{
	if ( !value ) { return 0; }
	value = typeof value === 'string' ? parseInt( value ) : Math.floor( value );
	if ( value < 0 ) { return 0; }
	return value;
}

class App
{
	constructor( config: AppConfig )
	{
		const pc = new AppPointCalc( config.pc );
	}
}
