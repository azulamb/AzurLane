/// <reference path="kan-sen.d.ts" />
/// <reference path="meow-fficer.d.ts" />
type FLEET_TYPE = 'surface' | 'submarine';
interface FleetFormationElement extends HTMLElement {
    edit: boolean;
    submarine: boolean;
}
