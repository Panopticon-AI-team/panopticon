import { DEFAULT_SIDE_COLOR } from "@/utils/constants";
import Aircraft from "@/game/units/Aircraft";
import Weapon from "@/game/units/Weapon";

interface IShip {
  id: string;
  name: string;
  sideId: string;
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
  desiredRoute?: number[][];
}

export default class Ship {
  id: string;
  name: string;
  sideId: string;
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
  desiredRoute: number[][] = [];

  constructor(parameters: IShip) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.sideId = parameters.sideId;
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
    this.desiredRoute = parameters.desiredRoute ?? [];
  }

  getTotalWeaponQuantity(): number {
    let sum = 0;
    this.weapons.forEach((weapon) => {
      sum += weapon.currentQuantity;
    });
    return sum;
  }

  getWeaponWithHighestRange(): Weapon | undefined {
    if (this.weapons.length === 0) return;
    return this.weapons.reduce((a, b) => (a.range > b.range ? a : b));
  }
}
