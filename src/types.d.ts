type RARITY = 'N' | 'R' | 'SR' | 'SSR' | 'UR';
type SHIP_TYPE =
	| 'Destroyer'
	| 'LightCruiser'
	| 'HeavyCruiser'
	| 'LargeCruiser'
	| 'BattleCruiser'
	| 'Battleship'
	| 'LightAircraftCarrier'
	| 'AircraftCarrier'
	| 'AviationBattleship'
	| 'SubmarineCarrier'
	| 'Monitor'
	| 'Submarine'
	| 'Repair'
	| 'Munition'
	| 'SailingFrigate';
type ALL_SHIP_TYPE = SHIP_TYPE | 'Cruiser' | 'LightCarrier' | 'Carrier';
