import Aircraft from "@/game/units/Aircraft";
import Airbase from "@/game/units/Airbase";
import Facility from "@/game/units/Facility";
import Side from "@/game/Side";
import Weapon from "@/game/units/Weapon";
import Ship from "@/game/units/Ship";
import { getDistanceBetweenTwoPoints } from "@/utils/mapFunctions";
import ReferencePoint from "@/game/units/ReferencePoint";
import PatrolMission from "@/game/mission/PatrolMission";
import { Target } from "@/game/engine/weaponEngagement";
import StrikeMission from "@/game/mission/StrikeMission";
import { Mission } from "@/game/Game";
import { SIDE_COLOR } from "@/utils/colors";
import Relationships from "@/game/Relationships";
import { randomUUID } from "@/utils/generateUUID";

type HomeBase = Airbase | Ship;

interface IScenario {
  id: string;
  name: string;
  startTime: number;
  currentTime?: number;
  duration: number;
  sides?: Side[];
  timeCompression?: number;
  aircraft?: Aircraft[];
  ships?: Ship[];
  facilities?: Facility[];
  airbases?: Airbase[];
  weapons?: Weapon[];
  referencePoints?: ReferencePoint[];
  missions?: PatrolMission[];
  relationships?: Relationships;
}

export default class Scenario {
  id: string;
  name: string;
  startTime: number;
  currentTime: number;
  duration: number;
  sides: Side[];
  timeCompression: number;
  aircraft: Aircraft[];
  ships: Ship[];
  facilities: Facility[];
  airbases: Airbase[];
  weapons: Weapon[];
  referencePoints: ReferencePoint[];
  missions: Mission[];
  relationships: Relationships;

  constructor(parameters: IScenario) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.startTime = parameters.startTime;
    this.currentTime = parameters.currentTime ?? parameters.startTime;
    this.duration = parameters.duration;
    this.sides = parameters.sides ?? [];
    this.timeCompression = parameters.timeCompression ?? 1;
    this.aircraft = parameters.aircraft ?? [];
    this.facilities = parameters.facilities ?? [];
    this.airbases = parameters.airbases ?? [];
    this.weapons = parameters.weapons ?? [];
    this.ships = parameters.ships ?? [];
    this.referencePoints = parameters.referencePoints ?? [];
    this.missions = parameters.missions ?? [];
    this.relationships = parameters.relationships ?? new Relationships({});
  }

  getSide(sideId: string | null | undefined): Side | undefined {
    return this.sides.find((side) => side.id === sideId);
  }

  getSideName(sideId: string | null | undefined): string {
    const side = this.getSide(sideId);
    if (side) {
      return side.name;
    }
    return "N/A";
  }

  getSideColor(sideId: string | null | undefined): SIDE_COLOR {
    const side = this.getSide(sideId);
    if (side) {
      return side.color;
    }
    return SIDE_COLOR.BLACK;
  }

  getAircraft(aircraftId: string | null): Aircraft | undefined {
    return this.aircraft.find((aircraft) => aircraft.id === aircraftId);
  }

  getFacility(facilityId: string | null): Facility | undefined {
    return this.facilities.find((facility) => facility.id === facilityId);
  }

  getAirbase(airbaseId: string | null): Airbase | undefined {
    return this.airbases.find((airbase) => airbase.id === airbaseId);
  }

  getWeapon(weaponId: string | null): Weapon | undefined {
    return this.weapons.find((weapon) => weapon.id === weaponId);
  }

  getShip(shipId: string | null): Ship | undefined {
    return this.ships.find((ship) => ship.id === shipId);
  }

  getReferencePoint(
    referencePointId: string | null
  ): ReferencePoint | undefined {
    return this.referencePoints.find(
      (referencePoint) => referencePoint.id === referencePointId
    );
  }

  getPatrolMission(missionId: string | null): PatrolMission | undefined {
    return this.missions.find(
      (mission) => mission.id === missionId && mission instanceof PatrolMission
    ) as PatrolMission;
  }

  getStrikeMission(missionId: string | null): StrikeMission | undefined {
    return this.missions.find(
      (mission) => mission.id === missionId && mission instanceof StrikeMission
    ) as StrikeMission;
  }

  getAllPatrolMissions(): PatrolMission[] {
    return this.missions.filter(
      (mission) => mission instanceof PatrolMission
    ) as PatrolMission[];
  }

  getAllStrikeMissions(): StrikeMission[] {
    return this.missions.filter(
      (mission) => mission instanceof StrikeMission
    ) as StrikeMission[];
  }

  getMissionByAssignedUnitId(unitId: string): Mission | undefined {
    return this.missions.find((mission) =>
      mission.assignedUnitIds.includes(unitId)
    );
  }

  updateScenarioName(name: string): void {
    this.name = name;
  }

  deleteWeaponFromAircraft(aircraftId: string, weaponId: string): Weapon[] {
    const aircraft = this.getAircraft(aircraftId);
    let aircraftWeapons: Weapon[] = [];
    if (aircraft) {
      const weaponIndex = aircraft.weapons.findIndex(
        (weapon) => weapon.id === weaponId
      );
      if (weaponIndex !== -1) {
        aircraft.weapons.splice(weaponIndex, 1);
      }
      aircraftWeapons = aircraft.weapons;
    }
    return aircraftWeapons;
  }

  updateAircraftWeaponQuantity(
    aircraftId: string,
    weaponId: string,
    increment: number
  ) {
    const aircraft = this.getAircraft(aircraftId);
    let aircraftWeapons: Weapon[] = [];
    if (aircraft) {
      const weapon = aircraft.weapons.find((weapon) => weapon.id === weaponId);
      if (weapon) {
        weapon.currentQuantity += increment;
        if (weapon.currentQuantity < 0) {
          weapon.currentQuantity = 0;
        }
      }
      aircraftWeapons = aircraft.weapons;
    }
    return aircraftWeapons;
  }

  addWeaponToAircraft(
    aircraftId: string,
    weaponClassName?: string,
    weaponSpeed?: number,
    weaponMaxFuel?: number,
    weaponFuelRate?: number,
    weaponLethality?: number
  ): Weapon[] {
    const aircraft = this.getAircraft(aircraftId);
    let aircraftWeapons: Weapon[] = [];
    if (aircraft) {
      aircraftWeapons = aircraft.weapons;
      if (
        !(
          weaponClassName &&
          weaponSpeed &&
          weaponMaxFuel &&
          weaponFuelRate &&
          weaponLethality
        )
      ) {
        return aircraftWeapons;
      }
      if (
        aircraft.weapons.find((weapon) => weapon.className === weaponClassName)
      ) {
        return aircraftWeapons;
      }
      const weapon = new Weapon({
        id: randomUUID(),
        name: weaponClassName,
        sideId: aircraft.sideId,
        className: weaponClassName,
        latitude: 0.0,
        longitude: 0.0,
        altitude: 10000.0,
        heading: 90.0,
        speed: weaponSpeed,
        currentFuel: weaponMaxFuel,
        maxFuel: weaponMaxFuel,
        fuelRate: weaponFuelRate,
        range: 100,
        sideColor: aircraft.sideColor,
        targetId: null,
        lethality: weaponLethality,
        maxQuantity: 1,
        currentQuantity: 1,
      });
      aircraftWeapons.push(weapon);
    }
    return aircraftWeapons;
  }

  deleteWeaponFromFacility(facilityId: string, weaponId: string): Weapon[] {
    const facility = this.getFacility(facilityId);
    let facilityWeapons: Weapon[] = [];
    if (facility) {
      const weaponIndex = facility.weapons.findIndex(
        (weapon) => weapon.id === weaponId
      );
      if (weaponIndex !== -1) {
        facility.weapons.splice(weaponIndex, 1);
      }
      facilityWeapons = facility.weapons;
    }
    return facilityWeapons;
  }

  updateFacilityWeaponQuantity(
    facilityId: string,
    weaponId: string,
    increment: number
  ) {
    const facility = this.getFacility(facilityId);
    let facilityWeapons: Weapon[] = [];
    if (facility) {
      const weapon = facility.weapons.find((weapon) => weapon.id === weaponId);
      if (weapon) {
        weapon.currentQuantity += increment;
        if (weapon.currentQuantity < 0) {
          weapon.currentQuantity = 0;
        }
      }
      facilityWeapons = facility.weapons;
    }
    return facilityWeapons;
  }

  addWeaponToFacility(
    facilityId: string,
    weaponClassName?: string,
    weaponSpeed?: number,
    weaponMaxFuel?: number,
    weaponFuelRate?: number,
    weaponLethality?: number
  ): Weapon[] {
    const facility = this.getFacility(facilityId);
    let facilityWeapons: Weapon[] = [];
    if (facility) {
      facilityWeapons = facility.weapons;
      if (
        !(
          weaponClassName &&
          weaponSpeed &&
          weaponMaxFuel &&
          weaponFuelRate &&
          weaponLethality
        )
      ) {
        return facilityWeapons;
      }
      if (
        facility.weapons.find((weapon) => weapon.className === weaponClassName)
      ) {
        return facilityWeapons;
      }
      const weapon = new Weapon({
        id: randomUUID(),
        name: weaponClassName,
        sideId: facility.sideId,
        className: weaponClassName,
        latitude: 0.0,
        longitude: 0.0,
        altitude: 10000.0,
        heading: 90.0,
        speed: weaponSpeed,
        currentFuel: weaponMaxFuel,
        maxFuel: weaponMaxFuel,
        fuelRate: weaponFuelRate,
        range: 100,
        sideColor: facility.sideColor,
        targetId: null,
        lethality: weaponLethality,
        maxQuantity: 1,
        currentQuantity: 1,
      });
      facilityWeapons.push(weapon);
    }
    return facilityWeapons;
  }

  updateAircraft(
    aircraftId: string,
    aircraftName: string,
    aircraftClassName: string,
    aircraftSpeed: number,
    aircraftCurrentFuel: number,
    aircraftFuelRate: number
  ) {
    const aircraft = this.getAircraft(aircraftId);
    if (aircraft) {
      aircraft.name = aircraftName;
      aircraft.className = aircraftClassName;
      aircraft.speed = aircraftSpeed;
      aircraft.currentFuel = aircraftCurrentFuel;
      aircraft.fuelRate = aircraftFuelRate;
    }
  }

  updateFacility(
    facilityId: string,
    facilityName: string,
    facilityClassName: string,
    facilityRange: number
  ) {
    const facility = this.getFacility(facilityId);
    if (facility) {
      facility.name = facilityName;
      facility.className = facilityClassName;
      facility.range = facilityRange;
    }
  }

  updateAirbase(airbaseId: string, airbaseName: string) {
    const airbase = this.getAirbase(airbaseId);
    if (airbase) {
      airbase.name = airbaseName;
    }
  }

  updateShip(
    shipId: string,
    shipName: string,
    shipClassName: string,
    shipSpeed: number,
    shipCurrentFuel: number,
    shipWeaponQuantity: number,
    shipRange: number
  ) {
    const ship = this.getShip(shipId);
    if (ship) {
      ship.name = shipName;
      ship.className = shipClassName;
      ship.speed = shipSpeed;
      ship.currentFuel = shipCurrentFuel;
      ship.range = shipRange;
      ship.weapons.forEach((weapon) => {
        weapon.currentQuantity = shipWeaponQuantity;
      });
    }
  }

  updateReferencePoint(referencePointId: string, referencePointName: string) {
    const referencePoint = this.getReferencePoint(referencePointId);
    if (referencePoint) {
      referencePoint.name = referencePointName;
    }
  }

  getAircraftHomeBase(aircraftId: string): HomeBase | undefined {
    const aircraft = this.getAircraft(aircraftId);
    if (aircraft) {
      return (
        this.getAirbase(aircraft.homeBaseId) ??
        this.getShip(aircraft.homeBaseId)
      );
    }
  }

  getClosestBaseToAircraft(aircraftId: string): HomeBase | undefined {
    const aircraft = this.getAircraft(aircraftId);
    if (aircraft) {
      let closestBase: HomeBase | undefined;
      let closestDistance = Number.MAX_VALUE;
      this.airbases.forEach((airbase) => {
        if (airbase.sideId !== aircraft.sideId) return;
        const distance = getDistanceBetweenTwoPoints(
          aircraft.latitude,
          aircraft.longitude,
          airbase.latitude,
          airbase.longitude
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestBase = airbase;
        }
      });
      this.ships.forEach((ship) => {
        if (ship.sideId !== aircraft.sideId) return;
        const distance = getDistanceBetweenTwoPoints(
          aircraft.latitude,
          aircraft.longitude,
          ship.latitude,
          ship.longitude
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestBase = ship;
        }
      });
      return closestBase;
    }
  }

  getAllTargetsFromEnemySides(sideId: string): Target[] {
    const targets: Target[] = [];
    this.aircraft.forEach((aircraft) => {
      if (this.isHostile(aircraft.sideId, sideId)) {
        targets.push(aircraft);
      }
    });
    this.facilities.forEach((facility) => {
      if (this.isHostile(facility.sideId, sideId)) {
        targets.push(facility);
      }
    });
    this.ships.forEach((ship) => {
      if (this.isHostile(ship.sideId, sideId)) {
        targets.push(ship);
      }
    });
    this.airbases.forEach((airbase) => {
      if (this.isHostile(airbase.sideId, sideId)) {
        targets.push(airbase);
      }
    });
    return targets;
  }

  isHostile(sideId: string, targetId: string): boolean {
    return this.relationships.isHostile(sideId, targetId);
  }
}
