import { IAircraftModel } from "@/game/db/models/Aircraft";
import { AirbaseDb, AircraftDb, FacilityDb, ShipDb } from "@/game/db/UnitDb";
import { IAirbaseModel } from "@/game/db/models/Airbase";
import { IFacilityModel } from "@/game/db/models/Facility";
import { IShipModel } from "@/game/db/models/Ship";

export default class Dba {
  airbaseDb: IAirbaseModel[];
  aircraftDb: IAircraftModel[];
  facilityDb: IFacilityModel[];
  shipDb: IShipModel[];

  constructor() {
    this.airbaseDb = AirbaseDb;
    this.aircraftDb = AircraftDb;
    this.facilityDb = FacilityDb;
    this.shipDb = ShipDb;
  }

  getAircraftDb() {
    return this.aircraftDb;
  }

  getAirbaseDb() {
    return this.airbaseDb;
  }

  getFacilityDb() {
    return this.facilityDb;
  }

  getShipDb() {
    return this.shipDb;
  }
}
