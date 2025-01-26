import Airbase from "@/game/units/Airbase";
import Aircraft from "@/game/units/Aircraft";
import Facility from "@/game/units/Facility";
import ReferencePoint from "@/game/units/ReferencePoint";
import Ship from "@/game/units/Ship";
import Weapon from "@/game/units/Weapon";
import { DEFAULT_SIDE_COLOR } from "@/utils/constants";

export interface IUnit {
  id: string;
  name: string;
  sideName: string;
  latitude: number;
  longitude: number;
  altitude: number;
  sideColor?: string;
}

export type Unit =
  | Airbase
  | Aircraft
  | Facility
  | ReferencePoint
  | Ship
  | Weapon;

export abstract class BaseUnit {
  id: string;
  name: string;
  sideName: string;
  latitude: number;
  longitude: number;
  altitude: number; // FT ASL -- currently default -- need to reference from database
  sideColor: string;

  constructor(parameters: IUnit) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.sideName = parameters.sideName;
    this.latitude = parameters.latitude;
    this.longitude = parameters.longitude;
    this.altitude = parameters.altitude;
    this.sideColor = parameters.sideColor ?? DEFAULT_SIDE_COLOR;
  }
}
