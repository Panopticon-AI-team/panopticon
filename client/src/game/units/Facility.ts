import Weapon from "@/game/units/Weapon";
import { BaseUnit, IUnit } from "@/game/units/BaseUnit";

interface IFacility extends IUnit {
  className: string;
  range: number;
  weapons?: Weapon[];
}

export default class Facility extends BaseUnit {
  className: string;
  latitude: number = 0.0;
  longitude: number = 0.0;
  altitude: number = 0.0; // FT ASL -- currently default -- need to reference from database
  range: number = 250; // NM -- currently default -- need to reference from database
  sideColor: string = "black";
  weapons: Weapon[] = [];

  constructor(parameters: IFacility) {
    super(parameters);
    this.className = parameters.className;
    this.latitude = parameters.latitude ?? this.latitude;
    this.longitude = parameters.longitude ?? this.longitude;
    this.altitude = parameters.altitude ?? this.altitude;
    this.range = parameters.range ?? this.range;
    this.sideColor = parameters.sideColor ?? this.sideColor;
    this.weapons = parameters.weapons ?? this.weapons;
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
