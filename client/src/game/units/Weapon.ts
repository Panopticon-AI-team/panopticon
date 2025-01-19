import { DEFAULT_SIDE_COLOR } from "@/utils/constants";

interface IWeapon {
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
  sideColor?: string;
  targetId: string | null;
  lethality: number;
  maxQuantity: number;
  currentQuantity: number;
}

export default class Weapon {
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
  sideColor: string;
  targetId: string | null;
  lethality: number; // currently default -- need to reference from database
  maxQuantity: number;
  currentQuantity: number;

  constructor(parameters: IWeapon) {
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
    this.sideColor = parameters.sideColor ?? DEFAULT_SIDE_COLOR;
    this.targetId = parameters.targetId;
    this.lethality = parameters.lethality;
    this.maxQuantity = parameters.maxQuantity;
    this.currentQuantity = parameters.currentQuantity;
  }
}
