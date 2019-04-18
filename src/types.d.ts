interface RARITY_STAR
{
	UNKNOWN: 0;
	N: 4;
	R: 5;
	SR: 5;
	SSR: 6;
	UR: 6;
	PR: 6;
	DR: 6;
}
type RARITY = keyof RARITY_STAR;

interface CAMPS_ORDER
{
	OTHER: 0;
	UNION: 1;
	ROYAL: 2;
}
type CAMPS = keyof CAMPS_ORDER;

interface Kansen
{
	// Game:
	id: number;
	name: string;
	rarity: RARITY;
	camps: CAMPS;

	// User:
	lv: number;
	star: number;
	convert: number;
}
