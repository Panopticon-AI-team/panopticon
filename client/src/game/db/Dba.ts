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

  exportToJson() {
    return JSON.stringify({
      airbaseDb: this.airbaseDb,
      aircraftDb: this.aircraftDb,
      facilityDb: this.facilityDb,
      shipDb: this.shipDb,
    });
  }

  importFromJson(json: string) {
    const data = JSON.parse(json);

    const importAirbaseDb = data.airbaseDb as any[];
    if (Array.isArray(importAirbaseDb) && importAirbaseDb.length > 0) {
      const finalImportedAirbaseDb: IAirbaseModel[] = [];
      importAirbaseDb.forEach(({ name, latitude, longitude, country }) => {
        if (!(name && latitude != null && longitude != null && country)) return;
        finalImportedAirbaseDb.push({ name, latitude, longitude, country });
      });
      this.airbaseDb = finalImportedAirbaseDb.filter(
        (unit, idx, all) => all.findIndex((u) => u.name === unit.name) === idx
      );
    }

    const importAircraftDb = data.aircraftDb as any[];
    if (Array.isArray(importAircraftDb) && importAircraftDb.length > 0) {
      const finalImportedAircraftDb: IAircraftModel[] = [];
      importAircraftDb.forEach((aircraft) => {
        const {
          className,
          speed,
          maxFuel,
          fuelRate,
          range,
          dataSource,
          units,
        } = aircraft;
        if (
          !(
            className &&
            speed != null &&
            maxFuel != null &&
            fuelRate != null &&
            range != null
          )
        )
          return;

        finalImportedAircraftDb.push({
          className,
          speed,
          maxFuel,
          fuelRate,
          range,
          dataSource: {
            speedSrc: dataSource?.speedSrc ?? "",
            maxFuelSrc: dataSource?.maxFuelSrc ?? "",
            fuelRateSrc: dataSource?.fuelRateSrc ?? "",
            rangeSrc: dataSource?.rangeSrc ?? "",
          },
          units: {
            speedUnit: units?.speedUnit ?? "",
            maxFuelUnit: units?.maxFuelUnit ?? "",
            fuelRateUnit: units?.fuelRateUnit ?? "",
            rangeUnit: units?.rangeUnit ?? "",
          },
        });
      });
      this.aircraftDb = finalImportedAircraftDb.filter(
        (unit, idx, all) =>
          all.findIndex((u) => u.className === unit.className) === idx
      );
    }

    const importFacilityDb = data.facilityDb as any[];
    if (Array.isArray(importFacilityDb) && importFacilityDb.length > 0) {
      const finalImportedFacilityDb: IFacilityModel[] = [];
      importFacilityDb.forEach(({ className, range }) => {
        if (!(className && range != null)) return;
        finalImportedFacilityDb.push({ className, range });
      });
      this.facilityDb = finalImportedFacilityDb.filter(
        (unit, idx, all) =>
          all.findIndex((u) => u.className === unit.className) === idx
      );
    }

    const importShipDb = data.shipDb as any[];
    if (Array.isArray(importShipDb) && importShipDb.length > 0) {
      const finalImportedShipDb: IShipModel[] = [];
      importShipDb.forEach((ship) => {
        const {
          className,
          speed,
          maxFuel,
          fuelRate,
          range,
          dataSource,
          units,
        } = ship;
        if (
          !(
            className &&
            speed != null &&
            maxFuel != null &&
            fuelRate != null &&
            range != null
          )
        )
          return;

        const model: IShipModel = {
          className,
          speed,
          maxFuel,
          fuelRate,
          range,
        };

        if (
          dataSource &&
          typeof dataSource.speedSrc === "string" &&
          typeof dataSource.maxFuelSrc === "string"
        ) {
          model.dataSource = {
            speedSrc: dataSource.speedSrc,
            maxFuelSrc: dataSource.maxFuelSrc,
            fuelRateSrc: dataSource.fuelRateSrc,
            rangeSrc: dataSource.rangeSrc,
          };
        }

        if (
          units &&
          typeof units.speedUnit === "string" &&
          typeof units.maxFuelUnit === "string"
        ) {
          model.units = {
            speedUnit: units.speedUnit,
            maxFuelUnit: units.maxFuelUnit,
            fuelRateUnit: units.fuelRateUnit,
            rangeUnit: units.rangeUnit,
          };
        }

        finalImportedShipDb.push(model);
      });
      this.shipDb = finalImportedShipDb.filter(
        (unit, idx, all) =>
          all.findIndex((u) => u.className === unit.className) === idx
      );
    }
  }

  importFromCsv(csv: string) {}
}
