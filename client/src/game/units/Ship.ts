import { DEFAULT_SIDE_COLOR } from "../../utils/constants";
import Aircraft from "./Aircraft";
import Weapon from "./Weapon";

interface IShip {
  id: string;
  name: string;
  sideName: string;
  className: string;
  latitude: number;
  longitude: number;
  altitude: number;
  heading: number;
  speed: number;
  currentFuel: number;
  maxFuel: number;
  fuelRate: number; // lbs/hr
  range: number;
  route?: number[][];
  selected?: boolean;
  sideColor?: string;
  weapons?: Weapon[];
  aircraft?: Aircraft[];
}

export default class Ship {
  id: string;
  name: string;
  sideName: string;
  className: string;
  latitude: number;
  longitude: number;
  altitude: number; // FT ASL -- currently default -- need to reference from database
  heading: number;
  speed: number; // KTS -- currently default -- need to reference from database
  currentFuel: number;
  maxFuel: number;
  fuelRate: number; // lbs/hr
  range: number; // NM -- currently default -- need to reference from database
  route: number[][];
  selected: boolean;
  sideColor: string;
  weapons: Weapon[];
  aircraft: Aircraft[];

  constructor(parameters: IShip) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.sideName = parameters.sideName;
    this.className = parameters.className;
    this.latitude = parameters.latitude;
    this.longitude = parameters.longitude;
    this.altitude = parameters.altitude;
    this.heading = parameters.heading;
    this.speed = parameters.speed;
    this.currentFuel = parameters.currentFuel;
    this.maxFuel = parameters.maxFuel;
    this.fuelRate = parameters.fuelRate;
    this.range = parameters.range;
    this.route = parameters.route ?? [];
    this.selected = parameters.selected ?? false;
    this.sideColor = parameters.sideColor ?? DEFAULT_SIDE_COLOR;
    this.weapons = parameters.weapons ?? [];
    this.aircraft = parameters.aircraft ?? [];
  }

  getTotalWeaponQuantity(): number {
    let sum = 0;
    this.weapons.forEach((weapon) => {
      sum += weapon.currentQuantity;
    });
    return sum;
  }
}
