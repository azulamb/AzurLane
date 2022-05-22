type RARELITY = 'N' | 'R' | 'SR' | 'SSR' | 'UR';
type SHIP_TYPE =
	| 'Destroyer'
	| 'LightCruiser'
	| 'HeavyCruiser'
	| 'LargeCruiser'
	| 'Battlecruiser'
	| 'Battleship'
	| 'LightAircraftCarrier'
	| 'AircraftCarrier'
	| 'AviationBattleship'
	| 'SubmarineCarrier'
	| 'Monitor'
	| 'Submarine'
	| 'Repair'
	| 'Munition';

interface DateElement extends HTMLElement {
	readonly date: Date;
	enable: boolean;
	update(): void;
}
