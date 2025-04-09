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
  }

  getSide(sideName: string): Side | undefined {
    return this.sides.find((side) => side.name === sideName);
  }

  getSideColor(sideName: string): string {
    const side = this.getSide(sideName);
    if (side) {
      return side.sideColor;
    }
    return "black";
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

  updateAircraft(
    aircraftId: string,
    aircraftName: string,
    aircraftClassName: string,
    aircraftSpeed: number,
    aircraftWeaponQuantity: number,
    aircraftCurrentFuel: number,
    aircraftFuelRate: number,
    sampleWeapon: Weapon
  ) {
    const aircraft = this.getAircraft(aircraftId);
    if (aircraft) {
      aircraft.name = aircraftName;
      aircraft.className = aircraftClassName;
      aircraft.speed = aircraftSpeed;
      if (aircraft.weapons.length < 1) {
        aircraft.weapons = [sampleWeapon];
      } else {
        aircraft.weapons.forEach((weapon) => {
          weapon.currentQuantity = aircraftWeaponQuantity;
        });
      }
      aircraft.currentFuel = aircraftCurrentFuel;
      aircraft.fuelRate = aircraftFuelRate;
    }
  }

  updateFacility(
    facilityId: string,
    facilityName: string,
    facilityClassName: string,
    facilityRange: number,
    facilityWeaponQuantity: number
  ) {
    const facility = this.getFacility(facilityId);
    if (facility) {
      facility.name = facilityName;
      facility.className = facilityClassName;
      facility.range = facilityRange;
      facility.weapons.forEach((weapon) => {
        weapon.currentQuantity = facilityWeaponQuantity;
      });
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
        if (airbase.sideName !== aircraft.sideName) return;
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
        if (ship.sideName !== aircraft.sideName) return;
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

  getAllTargetsFromEnemySides(sideName: string): Target[] {
    const targets: Target[] = [];
    this.aircraft.forEach((aircraft) => {
      if (aircraft.sideName !== sideName) {
        targets.push(aircraft);
      }
    });
    this.facilities.forEach((facility) => {
      if (facility.sideName !== sideName) {
        targets.push(facility);
      }
    });
    this.ships.forEach((ship) => {
      if (ship.sideName !== sideName) {
        targets.push(ship);
      }
    });
    this.airbases.forEach((airbase) => {
      if (airbase.sideName !== sideName) {
        targets.push(airbase);
      }
    });
    return targets;
  }
}
