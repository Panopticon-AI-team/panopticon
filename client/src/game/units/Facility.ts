import Weapon from "@/game/units/Weapon";
import { convertColorNameToSideColor, SIDE_COLOR } from "@/utils/colors";

interface IFacility {
  id: string;
  name: string;
  sideId: string;
  className: string;
  latitude: number;
  longitude: number;
  altitude: number;
  range: number;
  sideColor?: string | SIDE_COLOR;
  weapons?: Weapon[];
}

export default class Facility {
  id: string;
  name: string;
  sideId: string;
  className: string;
  latitude: number = 0.0;
  longitude: number = 0.0;
  altitude: number = 0.0; // FT ASL -- currently default -- need to reference from database
  range: number = 250; // NM -- currently default -- need to reference from database
  sideColor: SIDE_COLOR;
  weapons: Weapon[] = [];

  constructor(parameters: IFacility) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.sideId = parameters.sideId;
    this.className = parameters.className;
    this.latitude = parameters.latitude;
    this.longitude = parameters.longitude;
    this.altitude = parameters.altitude;
    this.range = parameters.range;
    this.sideColor = convertColorNameToSideColor(parameters.sideColor);
    this.weapons = parameters.weapons ?? [];
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
    return this.weapons.reduce((a, b) =>
      a.getCurrentRange() > b.getCurrentRange() ? a : b
    );
  }
}
