import { BaseUnit, IUnit } from "@/game/units/BaseUnit";

interface IWeapon extends IUnit {
  className: string;
  heading: number;
  speed: number;
  currentFuel: number;
  maxFuel: number;
  fuelRate: number; // lbs/hr
  range: number;
  route?: number[][];
  targetId: string | null;
  lethality: number;
  maxQuantity: number;
  currentQuantity: number;
}

export default class Weapon extends BaseUnit {
  className: string;
  heading: number;
  speed: number; // KTS -- currently default -- need to reference from database
  currentFuel: number;
  maxFuel: number;
  fuelRate: number; // lbs/hr
  range: number; // NM -- currently default -- need to reference from database
  route: number[][];
  targetId: string | null;
  lethality: number; // currently default -- need to reference from database
  maxQuantity: number;
  currentQuantity: number;

  constructor(parameters: IWeapon) {
    super(parameters);
    this.className = parameters.className;
    this.heading = parameters.heading;
    this.speed = parameters.speed;
    this.currentFuel = parameters.currentFuel;
    this.maxFuel = parameters.maxFuel;
    this.fuelRate = parameters.fuelRate;
    this.range = parameters.range;
    this.route = parameters.route ?? [];
    this.targetId = parameters.targetId;
    this.lethality = parameters.lethality;
    this.maxQuantity = parameters.maxQuantity;
    this.currentQuantity = parameters.currentQuantity;
  }
}
