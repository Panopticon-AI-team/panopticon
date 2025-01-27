import Weapon from "@/game/units/Weapon";
import { BaseUnit, IUnit } from "@/game/units/BaseUnit";

interface IAircraft extends IUnit {
  className: string;
  heading: number;
  speed: number;
  currentFuel: number;
  maxFuel: number;
  fuelRate: number; // lbs/hr
  range: number;
  route?: number[][];
  selected?: boolean;
  weapons?: Weapon[];
  homeBaseId?: string;
  rtb?: boolean;
  targetId?: string;
  desiredRoute?: number[][];
}

export default class Aircraft extends BaseUnit {
  className: string;
  heading: number;
  speed: number; // KTS -- currently default -- need to reference from database
  currentFuel: number;
  maxFuel: number;
  fuelRate: number; // lbs/hr
  range: number; // NM -- currently default -- need to reference from database
  route: number[][];
  selected: boolean;
  weapons: Weapon[];
  homeBaseId: string;
  rtb: boolean;
  targetId: string;
  desiredRoute: number[][] = [];

  constructor(parameters: IAircraft) {
    super(parameters);
    this.className = parameters.className;
    this.heading = parameters.heading;
    this.speed = parameters.speed;
    this.currentFuel = parameters.currentFuel;
    this.maxFuel = parameters.maxFuel;
    this.fuelRate = parameters.fuelRate;
    this.range = parameters.range;
    this.route = parameters.route ?? [];
    this.selected = parameters.selected ?? false;
    this.weapons = parameters.weapons ?? [];
    this.homeBaseId = parameters.homeBaseId ?? "";
    this.rtb = parameters.rtb ?? false;
    this.targetId = parameters.targetId ?? "";
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
