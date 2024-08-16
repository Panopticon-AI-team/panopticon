import { v4 as uuidv4 } from "uuid";

import Aircraft from "./units/Aircraft";
import Facility from "./units/Facility";
import Scenario from "./Scenario";

import {
  getBearingBetweenTwoPoints,
  getNextCoordinates,
  getDistanceBetweenTwoPoints,
} from "../utils/utils";
import {
  aircraftPursuit,
  checkIfThreatIsWithinRange,
  checkTargetTrackedByCount,
  launchWeapon,
  weaponEngagement,
} from "./engine/weaponEngagement";
import Airbase from "./units/Airbase";
import Side from "./Side";
import Weapon from "./units/Weapon";
import { GAME_SPEED_DELAY_MS } from "../utils/constants";
import Ship from "./units/Ship";
import ReferencePoint from "./units/ReferencePoint";
import PatrolMission from "./mission/PatrolMission";

interface IMapView {
  defaultCenter: number[];
  currentCameraCenter: number[];
  defaultZoom: number;
  currentCameraZoom: number;
}

export default class Game {
  mapView: IMapView = {
    defaultCenter: [0, 0],
    currentCameraCenter: [0, 0],
    defaultZoom: 0,
    currentCameraZoom: 0,
  };
  currentScenario: Scenario;
  currentSideName: string = "";
  scenarioPaused: boolean = true;
  addingAircraft: boolean = false;
  addingAirbase: boolean = false;
  addingFacility: boolean = false;
  addingReferencePoint: boolean = false;
  addingShip: boolean = false;
  selectingTarget: boolean = false;
  currentAttackerId: string = "";
  selectedUnitId: string = "";
  numberOfWaypoints: number = 50;

  constructor(currentScenario: Scenario) {
    this.currentScenario = currentScenario;
  }

  addAircraft(
    aircraftName: string,
    className: string,
    latitude: number,
    longitude: number,
    speed?: number,
    maxFuel?: number,
    fuelRate?: number,
    range?: number
  ): Aircraft | undefined {
    if (!this.currentSideName) {
      return;
    }
    const aircraft = new Aircraft({
      id: uuidv4(),
      name: aircraftName,
      sideName: this.currentSideName,
      className: className,
      latitude: latitude,
      longitude: longitude,
      altitude: 10000.0,
      heading: 90.0,
      speed: speed ?? 300.0,
      currentFuel: maxFuel ?? 10000.0,
      maxFuel: maxFuel ?? 10000.0,
      fuelRate: fuelRate ?? 5000.0,
      range: range ?? 100,
      sideColor: this.currentScenario.getSideColor(this.currentSideName),
      weapons: [this.getSampleWeapon(10, 0.25)],
      homeBaseId: "",
      rtb: false,
      targetId: "",
    });
    this.currentScenario.aircraft.push(aircraft);
    return aircraft;
  }

  addAircraftToAirbase(
    aircraftName: string,
    className: string,
    airbaseId: string
  ) {
    if (!this.currentSideName) {
      return;
    }
    const airbase = this.currentScenario.getAirbase(airbaseId);
    if (airbase) {
      const aircraft = new Aircraft({
        id: uuidv4(),
        name: aircraftName,
        sideName: this.currentSideName,
        className: className,
        latitude: airbase.latitude - 0.5,
        longitude: airbase.longitude - 0.5,
        altitude: 10000.0,
        heading: 90.0,
        speed: 300.0,
        currentFuel: 10000.0,
        maxFuel: 10000.0,
        fuelRate: 5000.0,
        range: 100,
        sideColor: this.currentScenario.getSideColor(this.currentSideName),
        weapons: [this.getSampleWeapon(10, 0.25)],
        homeBaseId: airbase.id,
        rtb: false,
      });
      airbase.aircraft.push(aircraft);
    }
  }

  addAirbase(
    airbaseName: string,
    className: string,
    latitude: number,
    longitude: number
  ) {
    if (!this.currentSideName) {
      return;
    }
    const airbase = new Airbase({
      id: uuidv4(),
      name: airbaseName,
      sideName: this.currentSideName,
      className: className,
      latitude: latitude,
      longitude: longitude,
      altitude: 0.0,
      sideColor: this.currentScenario.getSideColor(this.currentSideName),
    });
    this.currentScenario.airbases.push(airbase);
    return airbase;
  }

  addReferencePoint(
    referencePointName: string,
    latitude: number,
    longitude: number
  ) {
    if (!this.currentSideName) {
      return;
    }
    const referencePoint = new ReferencePoint({
      id: uuidv4(),
      name: referencePointName,
      sideName: this.currentSideName,
      latitude: latitude,
      longitude: longitude,
      altitude: 0.0,
      sideColor: this.currentScenario.getSideColor(this.currentSideName),
    });
    this.currentScenario.referencePoints.push(referencePoint);
    return referencePoint;
  }

  removeReferencePoint(referencePointId: string) {
    this.currentScenario.referencePoints =
      this.currentScenario.referencePoints.filter(
        (referencePoint) => referencePoint.id !== referencePointId
      );
  }

  removeAirbase(airbaseId: string) {
    this.currentScenario.airbases = this.currentScenario.airbases.filter(
      (airbase) => airbase.id !== airbaseId
    );
    this.currentScenario.aircraft.forEach((aircraft) => {
      if (aircraft.homeBaseId === airbaseId) {
        aircraft.homeBaseId = "";
        if (aircraft.rtb) {
          aircraft.rtb = false;
          aircraft.route = [];
        }
      }
    });
  }

  removeFacility(facilityId: string) {
    this.currentScenario.facilities = this.currentScenario.facilities.filter(
      (facility) => facility.id !== facilityId
    );
  }

  removeAircraft(aircraftId: string) {
    this.currentScenario.aircraft = this.currentScenario.aircraft.filter(
      (aircraft) => aircraft.id !== aircraftId
    );
  }

  addFacility(
    facilityName: string,
    className: string,
    latitude: number,
    longitude: number,
    range?: number
  ) {
    if (!this.currentSideName) {
      return;
    }
    const facility = new Facility({
      id: uuidv4(),
      name: facilityName,
      sideName: this.currentSideName,
      className: className,
      latitude: latitude,
      longitude: longitude,
      altitude: 0.0,
      range: range ?? 250,
      sideColor: this.currentScenario.getSideColor(this.currentSideName),
      weapons: [this.getSampleWeapon(30, 0.1)],
    });
    this.currentScenario.facilities.push(facility);
    return facility;
  }

  addShip(
    shipName: string,
    className: string,
    latitude: number,
    longitude: number,
    speed?: number,
    maxFuel?: number,
    fuelRate?: number,
    range?: number
  ): Ship | undefined {
    if (!this.currentSideName) {
      return;
    }
    const ship = new Ship({
      id: uuidv4(),
      name: shipName,
      sideName: this.currentSideName,
      className: className,
      latitude: latitude,
      longitude: longitude,
      altitude: 0.0,
      heading: 0.0,
      speed: speed ?? 30.0,
      currentFuel: maxFuel ?? 32000000.0,
      maxFuel: maxFuel ?? 32000000.0,
      fuelRate: fuelRate ?? 7000.0,
      range: 250,
      route: [],
      selected: false,
      sideColor: this.currentScenario.getSideColor(this.currentSideName),
      weapons: [this.getSampleWeapon(300, 0.15, this.currentSideName)],
      aircraft: [],
    });
    this.currentScenario.ships.push(ship);
    return ship;
  }

  duplicateUnit(unitId: string, unitType: string) {
    if (unitType === "aircraft") {
      const aircraft = this.currentScenario.getAircraft(unitId);
      if (aircraft) {
        const newAircraft = new Aircraft({
          id: uuidv4(),
          name: aircraft.name,
          sideName: aircraft.sideName,
          className: aircraft.className,
          latitude: aircraft.latitude - 0.5,
          longitude: aircraft.longitude - 0.5,
          altitude: aircraft.altitude,
          heading: aircraft.heading,
          speed: aircraft.speed,
          currentFuel: aircraft.maxFuel,
          maxFuel: aircraft.maxFuel,
          fuelRate: aircraft.fuelRate,
          range: aircraft.range,
          route: [],
          selected: false,
          sideColor: aircraft.sideColor,
          weapons: aircraft.weapons,
          homeBaseId: aircraft.homeBaseId,
          rtb: false,
          targetId: aircraft.targetId,
        });
        this.currentScenario.aircraft.push(newAircraft);
        return newAircraft;
      }
    }
  }

  addAircraftToShip(aircraftName: string, className: string, shipId: string) {
    if (!this.currentSideName) {
      return;
    }
    const ship = this.currentScenario.getShip(shipId);
    if (ship) {
      const aircraft = new Aircraft({
        id: uuidv4(),
        name: aircraftName,
        sideName: this.currentSideName,
        className: className,
        latitude: ship.latitude - 0.5,
        longitude: ship.longitude - 0.5,
        altitude: 10000.0,
        heading: 90.0,
        speed: 300.0,
        currentFuel: 10000.0,
        maxFuel: 10000.0,
        fuelRate: 5000.0,
        range: 100,
        sideColor: this.currentScenario.getSideColor(this.currentSideName),
        weapons: [this.getSampleWeapon(10, 0.25)],
        homeBaseId: ship.id,
        rtb: false,
      });
      ship.aircraft.push(aircraft);
    }
  }

  launchAircraftFromShip(shipId: string) {
    if (!this.currentSideName) {
      return;
    }
    const ship = this.currentScenario.getShip(shipId);
    if (ship && ship.aircraft.length > 0) {
      const aircraft = ship.aircraft.pop();
      if (aircraft) {
        this.currentScenario.aircraft.push(aircraft);
        return aircraft;
      }
    }
  }

  removeShip(shipId: string) {
    this.currentScenario.ships = this.currentScenario.ships.filter(
      (ship) => ship.id !== shipId
    );
    this.currentScenario.aircraft.forEach((aircraft) => {
      if (aircraft.homeBaseId === shipId) {
        aircraft.homeBaseId = "";
        if (aircraft.rtb) {
          aircraft.rtb = false;
          aircraft.route = [];
        }
      }
    });
  }

  createPatrolMission(
    missionName: string,
    assignedUnits: string[],
    assignedArea: number[][]
  ) {
    if (assignedArea.length < 3) return;
    const patrolMission = new PatrolMission({
      id: uuidv4(),
      name: missionName,
      sideId: this.currentSideName,
      assignedUnitIds: assignedUnits,
      assignedArea: assignedArea,
      active: true,
    });
    this.currentScenario.missions.push(patrolMission);
  }

  updatePatrolMission(
    missionId: string,
    missionName?: string,
    assignedUnits?: string[],
    assignedArea?: number[][]
  ) {
    const patrolMission = this.currentScenario.getMission(missionId);
    if (patrolMission) {
      if (missionName && missionName !== "") patrolMission.name = missionName;
      if (assignedUnits && assignedUnits.length > 0)
        patrolMission.assignedUnitIds = assignedUnits;
      if (assignedArea && assignedArea.length > 2)
        patrolMission.assignedArea = assignedArea;
    }
  }

  deleteMission(missionId: string) {
    this.currentScenario.missions = this.currentScenario.missions.filter(
      (mission) => mission.id !== missionId
    );
  }

  getSampleWeapon(
    quantity: number,
    lethality: number,
    sideName: string = this.currentSideName
  ) {
    const weapon = new Weapon({
      id: uuidv4(),
      name: "Sample Weapon",
      sideName: sideName,
      className: "Sample Weapon",
      latitude: 0.0,
      longitude: 0.0,
      altitude: 10000.0,
      heading: 90.0,
      speed: 1000.0,
      currentFuel: 5000.0,
      maxFuel: 5000.0,
      fuelRate: 5000.0,
      range: 100,
      sideColor: this.currentScenario.getSideColor(sideName),
      targetId: null,
      lethality: lethality,
      maxQuantity: quantity,
      currentQuantity: quantity,
    });
    return weapon;
  }

  moveAircraft(aircraftId: string, newLatitude: number, newLongitude: number) {
    const aircraft = this.currentScenario.getAircraft(aircraftId);
    if (aircraft) {
      aircraft.route = [[newLatitude, newLongitude]];
      aircraft.heading = getBearingBetweenTwoPoints(
        aircraft.latitude,
        aircraft.longitude,
        newLatitude,
        newLongitude
      );
      return aircraft;
    }
  }

  moveShip(shipId: string, newLatitude: number, newLongitude: number) {
    const ship = this.currentScenario.getShip(shipId);
    if (ship) {
      ship.route = [[newLatitude, newLongitude]];
      ship.heading = getBearingBetweenTwoPoints(
        ship.latitude,
        ship.longitude,
        newLatitude,
        newLongitude
      );
      return ship;
    }
  }

  teleportUnit(unitId: string, newLatitude: number, newLongitude: number) {
    const aircraft = this.currentScenario.getAircraft(unitId);
    if (aircraft) {
      aircraft.latitude = newLatitude;
      aircraft.longitude = newLongitude;
      return aircraft;
    }
    const airbase = this.currentScenario.getAirbase(unitId);
    if (airbase) {
      airbase.latitude = newLatitude;
      airbase.longitude = newLongitude;
      airbase.aircraft.forEach((aircraft) => {
        aircraft.latitude = newLatitude - 0.5;
        aircraft.longitude = newLongitude - 0.5;
      });
      return airbase;
    }
    const facility = this.currentScenario.getFacility(unitId);
    if (facility) {
      facility.latitude = newLatitude;
      facility.longitude = newLongitude;
      return facility;
    }
    const ship = this.currentScenario.getShip(unitId);
    if (ship) {
      ship.latitude = newLatitude;
      ship.longitude = newLongitude;
      ship.aircraft.forEach((aircraft) => {
        aircraft.latitude = newLatitude - 0.5;
        aircraft.longitude = newLongitude - 0.5;
      });
      return ship;
    }
    const referencePoint = this.currentScenario.getReferencePoint(unitId);
    if (referencePoint) {
      referencePoint.latitude = newLatitude;
      referencePoint.longitude = newLongitude;
      return referencePoint;
    }
  }

  launchAircraftFromAirbase(airbaseId: string) {
    if (!this.currentSideName) {
      return;
    }
    const airbase = this.currentScenario.getAirbase(airbaseId);
    if (airbase && airbase.aircraft.length > 0) {
      const aircraft = airbase.aircraft.pop();
      if (aircraft) {
        this.currentScenario.aircraft.push(aircraft);
        return aircraft;
      }
    }
  }

  handleAircraftAttack(aircraftId: string, targetId: string) {
    const target =
      this.currentScenario.getAircraft(targetId) ??
      this.currentScenario.getFacility(targetId) ??
      this.currentScenario.getWeapon(targetId) ??
      this.currentScenario.getShip(targetId) ??
      this.currentScenario.getAirbase(targetId);
    const aircraft = this.currentScenario.getAircraft(aircraftId);
    if (
      target &&
      aircraft &&
      target?.sideName !== aircraft?.sideName &&
      target?.id !== aircraft?.id
    ) {
      launchWeapon(this.currentScenario, aircraft, target);
    }
  }

  handleShipAttack(shipId: string, targetId: string) {
    const target =
      this.currentScenario.getAircraft(targetId) ??
      this.currentScenario.getFacility(targetId) ??
      this.currentScenario.getWeapon(targetId) ??
      this.currentScenario.getShip(targetId) ??
      this.currentScenario.getAirbase(targetId);
    const ship = this.currentScenario.getShip(shipId);
    if (
      target &&
      ship &&
      target?.sideName !== ship?.sideName &&
      target?.id !== ship?.id
    ) {
      launchWeapon(this.currentScenario, ship, target);
    }
  }

  aircraftReturnToBase(aircraftId: string) {
    const aircraft = this.currentScenario.getAircraft(aircraftId);
    if (aircraft) {
      if (aircraft.rtb) {
        aircraft.rtb = false;
        aircraft.route = [];
        return aircraft;
      } else {
        aircraft.rtb = true;
        const homeBase =
          aircraft.homeBaseId !== ""
            ? this.currentScenario.getAircraftHomeBase(aircraftId)
            : this.currentScenario.getClosestBaseToAircraft(aircraftId);
        if (homeBase) {
          if (aircraft.homeBaseId !== homeBase.id)
            aircraft.homeBaseId = homeBase.id;
          return this.moveAircraft(
            aircraftId,
            homeBase.latitude,
            homeBase.longitude
          );
        }
      }
    }
  }

  landAircraft(aircraftId: string) {
    const aircraft = this.currentScenario.getAircraft(aircraftId);
    if (aircraft && aircraft.rtb) {
      const homeBase = this.currentScenario.getAircraftHomeBase(aircraftId);
      if (homeBase) {
        const newAircraft = new Aircraft({
          id: aircraft.id,
          name: aircraft.name,
          sideName: aircraft.sideName,
          className: aircraft.className,
          latitude: homeBase.latitude - 0.5,
          longitude: homeBase.longitude - 0.5,
          altitude: aircraft.altitude,
          heading: 90.0,
          speed: aircraft.speed,
          currentFuel: aircraft.maxFuel,
          maxFuel: aircraft.maxFuel,
          fuelRate: aircraft.fuelRate,
          range: aircraft.range,
          sideColor: aircraft.sideColor,
          weapons: aircraft.weapons,
          homeBaseId: homeBase.id,
          rtb: false,
          targetId: aircraft.targetId,
        });
        homeBase.aircraft.push(newAircraft);
        this.removeAircraft(aircraft.id);
      }
    }
  }

  switchCurrentSide() {
    for (let i = 0; i < this.currentScenario.sides.length; i++) {
      if (this.currentScenario.sides[i].name === this.currentSideName) {
        this.currentSideName =
          this.currentScenario.sides[
            (i + 1) % this.currentScenario.sides.length
          ].name;
        break;
      }
    }
  }

  switchScenarioTimeCompression() {
    const timeCompressions = Object.keys(GAME_SPEED_DELAY_MS).map((speed) =>
      parseInt(speed)
    );
    for (let i = 0; i < timeCompressions.length; i++) {
      if (this.currentScenario.timeCompression === timeCompressions[i]) {
        this.currentScenario.timeCompression =
          timeCompressions[(i + 1) % timeCompressions.length];
        break;
      }
    }
  }

  exportCurrentScenario(): string {
    const exportObject = {
      currentScenario: this.currentScenario,
      currentSideName: this.currentSideName,
      selectedUnitId: this.selectedUnitId,
      mapView: this.mapView,
    };
    return JSON.stringify(exportObject);
  }

  loadScenario(scenarioString: string) {
    const importObject = JSON.parse(scenarioString);
    this.currentSideName = importObject.currentSideName;
    this.selectedUnitId = importObject.selectedUnitId;
    this.mapView = importObject.mapView;

    const savedScenario = importObject.currentScenario;
    const savedSides = savedScenario.sides.map((side: any) => {
      const newSide = new Side({
        id: side.id,
        name: side.name,
        totalScore: side.totalScore,
        sideColor: side.sideColor,
      });
      return newSide;
    });
    const loadedScenario = new Scenario({
      id: savedScenario.id,
      name: savedScenario.name,
      startTime: savedScenario.startTime,
      currentTime: savedScenario.currentTime,
      duration: savedScenario.duration,
      sides: savedSides,
      timeCompression: savedScenario.timeCompression,
    });
    savedScenario.aircraft.forEach((aircraft: any) => {
      const newAircraft = new Aircraft({
        id: aircraft.id,
        name: aircraft.name,
        sideName: aircraft.sideName,
        className: aircraft.className,
        latitude: aircraft.latitude,
        longitude: aircraft.longitude,
        altitude: aircraft.altitude,
        heading: aircraft.heading,
        speed: aircraft.speed,
        currentFuel: aircraft.currentFuel,
        maxFuel: aircraft.maxFuel,
        fuelRate: aircraft.fuelRate,
        range: aircraft.range,
        route: aircraft.route,
        selected: aircraft.selected,
        sideColor: aircraft.sideColor,
        weapons: aircraft.weapons ?? [
          this.getSampleWeapon(10, 0.25, aircraft.sideName),
        ],
        homeBaseId: aircraft.homeBaseId,
        rtb: aircraft.rtb,
        targetId: aircraft.targetId ?? "",
      });
      loadedScenario.aircraft.push(newAircraft);
    });
    savedScenario.airbases.forEach((airbase: any) => {
      const airbaseAircraft: Aircraft[] = [];
      airbase.aircraft.forEach((aircraft: any) => {
        const newAircraft = new Aircraft({
          id: aircraft.id,
          name: aircraft.name,
          sideName: aircraft.sideName,
          className: aircraft.className,
          latitude: aircraft.latitude,
          longitude: aircraft.longitude,
          altitude: aircraft.altitude,
          heading: aircraft.heading,
          speed: aircraft.speed,
          currentFuel: aircraft.currentFuel,
          maxFuel: aircraft.maxFuel,
          fuelRate: aircraft.fuelRate,
          range: aircraft.range,
          route: aircraft.route,
          selected: aircraft.selected,
          sideColor: aircraft.sideColor,
          weapons: aircraft.weapons ?? [
            this.getSampleWeapon(10, 0.25, aircraft.sideName),
          ],
          homeBaseId: aircraft.homeBaseId,
          rtb: aircraft.rtb,
          targetId: aircraft.targetId ?? "",
        });
        airbaseAircraft.push(newAircraft);
      });
      const newAirbase = new Airbase({
        id: airbase.id,
        name: airbase.name,
        sideName: airbase.sideName,
        className: airbase.className,
        latitude: airbase.latitude,
        longitude: airbase.longitude,
        altitude: airbase.altitude,
        sideColor: airbase.sideColor,
        aircraft: airbaseAircraft,
      });
      loadedScenario.airbases.push(newAirbase);
    });
    savedScenario.facilities.forEach((facility: any) => {
      const newFacility = new Facility({
        id: facility.id,
        name: facility.name,
        sideName: facility.sideName,
        className: facility.className,
        latitude: facility.latitude,
        longitude: facility.longitude,
        altitude: facility.altitude,
        range: facility.range,
        sideColor: facility.sideColor,
        weapons: facility.weapons ?? [
          this.getSampleWeapon(30, 0.1, facility.sideName),
        ],
      });
      loadedScenario.facilities.push(newFacility);
    });
    savedScenario.weapons.forEach((weapon: any) => {
      const newWeapon = new Weapon({
        id: weapon.id,
        name: weapon.name,
        sideName: weapon.sideName,
        className: weapon.className,
        latitude: weapon.latitude,
        longitude: weapon.longitude,
        altitude: weapon.altitude,
        heading: weapon.heading,
        speed: weapon.speed,
        currentFuel: weapon.currentFuel,
        maxFuel: weapon.maxFuel,
        fuelRate: weapon.fuelRate,
        range: weapon.range,
        route: weapon.route,
        sideColor: weapon.sideColor,
        targetId: weapon.targetId,
        lethality: weapon.lethality,
        maxQuantity: weapon.maxQuantity,
        currentQuantity: weapon.currentQuantity,
      });
      loadedScenario.weapons.push(newWeapon);
    });
    savedScenario.ships?.forEach((ship: any) => {
      const shipAircraft: Aircraft[] = [];
      ship.aircraft.forEach((aircraft: any) => {
        const newAircraft = new Aircraft({
          id: aircraft.id,
          name: aircraft.name,
          sideName: aircraft.sideName,
          className: aircraft.className,
          latitude: aircraft.latitude,
          longitude: aircraft.longitude,
          altitude: aircraft.altitude,
          heading: aircraft.heading,
          speed: aircraft.speed,
          currentFuel: aircraft.currentFuel,
          maxFuel: aircraft.maxFuel,
          fuelRate: aircraft.fuelRate,
          range: aircraft.range,
          route: aircraft.route,
          selected: aircraft.selected,
          sideColor: aircraft.sideColor,
          weapons: aircraft.weapons ?? [
            this.getSampleWeapon(10, 0.25, aircraft.sideName),
          ],
          homeBaseId: aircraft.homeBaseId,
          rtb: aircraft.rtb,
          targetId: aircraft.targetId ?? "",
        });
        shipAircraft.push(newAircraft);
      });
      const newShip = new Ship({
        id: ship.id,
        name: ship.name,
        sideName: ship.sideName,
        className: ship.className,
        latitude: ship.latitude,
        longitude: ship.longitude,
        altitude: ship.altitude,
        heading: ship.heading,
        speed: ship.speed,
        currentFuel: ship.currentFuel,
        maxFuel: ship.maxFuel,
        fuelRate: ship.fuelRate,
        range: ship.range,
        route: ship.route,
        sideColor: ship.sideColor,
        weapons: ship.weapons ?? [
          this.getSampleWeapon(300, 0.15, ship.sideName),
        ],
        aircraft: shipAircraft,
      });
      loadedScenario.ships.push(newShip);
    });
    savedScenario.referencePoints?.forEach((referencePoint: any) => {
      const newReferencePoint = new ReferencePoint({
        id: referencePoint.id,
        name: referencePoint.name,
        sideName: referencePoint.sideName,
        latitude: referencePoint.latitude,
        longitude: referencePoint.longitude,
        altitude: referencePoint.altitude,
        sideColor: referencePoint.sideColor,
      });
      loadedScenario.referencePoints.push(newReferencePoint);
    });

    savedScenario.missions?.forEach((mission: PatrolMission) => {
      const newMission = new PatrolMission({
        id: mission.id,
        name: mission.name,
        sideId: mission.sideId,
        assignedUnitIds: mission.assignedUnitIds,
        assignedArea: mission.assignedArea,
        active: mission.active,
      });
      loadedScenario.missions.push(newMission);
    });

    this.currentScenario = loadedScenario;
  }

  facilityAutoDefense() {
    this.currentScenario.facilities.forEach((facility) => {
      this.currentScenario.aircraft.forEach((aircraft) => {
        if (facility.sideName !== aircraft.sideName) {
          if (
            checkIfThreatIsWithinRange(aircraft, facility) &&
            checkTargetTrackedByCount(this.currentScenario, aircraft) < 10
          ) {
            launchWeapon(this.currentScenario, facility, aircraft);
          }
        }
      });
      this.currentScenario.weapons.forEach((weapon) => {
        if (facility.sideName !== weapon.sideName) {
          if (
            weapon.targetId === facility.id &&
            checkIfThreatIsWithinRange(weapon, facility) &&
            checkTargetTrackedByCount(this.currentScenario, weapon) < 5
          ) {
            launchWeapon(this.currentScenario, facility, weapon);
          }
        }
      });
    });
  }

  shipAutoDefense() {
    this.currentScenario.ships.forEach((ship) => {
      this.currentScenario.aircraft.forEach((aircraft) => {
        if (ship.sideName !== aircraft.sideName) {
          if (
            checkIfThreatIsWithinRange(aircraft, ship) &&
            checkTargetTrackedByCount(this.currentScenario, aircraft) < 10
          ) {
            launchWeapon(this.currentScenario, ship, aircraft);
          }
        }
      });
      this.currentScenario.weapons.forEach((weapon) => {
        if (ship.sideName !== weapon.sideName) {
          if (
            weapon.targetId === ship.id &&
            checkIfThreatIsWithinRange(weapon, ship) &&
            checkTargetTrackedByCount(this.currentScenario, weapon) < 5
          ) {
            launchWeapon(this.currentScenario, ship, weapon);
          }
        }
      });
    });
  }

  aircraftAirToAirEngagement() {
    this.currentScenario.aircraft.forEach((aircraft) => {
      if (aircraft.weapons.length < 1) return;
      const aircraftWeaponWithMaxRange = aircraft.getWeaponWithHighestRange();
      if (!aircraftWeaponWithMaxRange) return;
      this.currentScenario.aircraft.forEach((enemyAircraft) => {
        if (
          aircraft.sideName !== enemyAircraft.sideName &&
          (aircraft.targetId === "" || aircraft.targetId === enemyAircraft.id)
        ) {
          if (
            checkIfThreatIsWithinRange(
              enemyAircraft,
              aircraftWeaponWithMaxRange
            ) &&
            checkTargetTrackedByCount(this.currentScenario, enemyAircraft) < 1
          ) {
            launchWeapon(this.currentScenario, aircraft, enemyAircraft);
            aircraft.targetId = enemyAircraft.id;
          }
        }
      });
      this.currentScenario.weapons.forEach((enemyWeapon) => {
        if (aircraft.sideName !== enemyWeapon.sideName) {
          if (
            enemyWeapon.targetId === aircraft.id &&
            checkIfThreatIsWithinRange(
              enemyWeapon,
              aircraftWeaponWithMaxRange
            ) &&
            checkTargetTrackedByCount(this.currentScenario, enemyWeapon) < 1
          ) {
            launchWeapon(this.currentScenario, aircraft, enemyWeapon);
          }
        }
      });
      if (aircraft.targetId && aircraft.targetId !== "")
        aircraftPursuit(this.currentScenario, aircraft);
    });
  }

  updateUnitsOnPatrolMission() {
    const activePatrolMissions = this.currentScenario.missions.filter(
      (mission) => mission.active
    );
    if (activePatrolMissions.length < 1) return;

    activePatrolMissions.forEach((mission) => {
      if (mission.assignedArea.length < 3) return;
      mission.assignedUnitIds.forEach((unitId) => {
        const unit = this.currentScenario.getAircraft(unitId);
        if (unit) {
          if (unit.route.length === 0) {
            const randomWaypointInPatrolArea =
              mission.generateRandomCoordinatesWithinPatrolArea();
            unit.route.push(randomWaypointInPatrolArea);
          } else if (unit.route.length > 0) {
            if (
              !mission.checkIfCoordinatesIsWithinPatrolArea(
                unit.route[unit.route.length - 1]
              )
            ) {
              unit.route = [];
              const randomWaypointInPatrolArea =
                mission.generateRandomCoordinatesWithinPatrolArea();
              unit.route.push(randomWaypointInPatrolArea);
            }
          }
        }
      });
    });
  }

  updateOnBoardWeaponPositions() {
    this.currentScenario.aircraft.forEach((aircraft) => {
      aircraft.weapons.forEach((weapon) => {
        weapon.latitude = aircraft.latitude;
        weapon.longitude = aircraft.longitude;
      });
    });
    this.currentScenario.facilities.forEach((facility) => {
      facility.weapons.forEach((weapon) => {
        weapon.latitude = facility.latitude;
        weapon.longitude = facility.longitude;
      });
    });
    this.currentScenario.ships.forEach((ship) => {
      ship.weapons.forEach((weapon) => {
        weapon.latitude = ship.latitude;
        weapon.longitude = ship.longitude;
      });
    });
  }

  updateAllAircraftPosition() {
    this.currentScenario.aircraft.forEach((aircraft) => {
      if (aircraft.rtb) {
        const aircraftHomeBase =
          aircraft.homeBaseId !== ""
            ? this.currentScenario.getAircraftHomeBase(aircraft.id)
            : this.currentScenario.getClosestBaseToAircraft(aircraft.id);
        if (
          aircraftHomeBase &&
          getDistanceBetweenTwoPoints(
            aircraft.latitude,
            aircraft.longitude,
            aircraftHomeBase.latitude,
            aircraftHomeBase.longitude
          ) < 0.5
        ) {
          this.landAircraft(aircraft.id);
          return;
        }
      }

      const route = aircraft.route;
      if (route.length > 0) {
        const nextWaypoint = route[route.length - 1];
        const nextWaypointLatitude = nextWaypoint[0];
        const nextWaypointLongitude = nextWaypoint[1];
        if (
          getDistanceBetweenTwoPoints(
            aircraft.latitude,
            aircraft.longitude,
            nextWaypointLatitude,
            nextWaypointLongitude
          ) < 0.5
        ) {
          aircraft.latitude = nextWaypointLatitude;
          aircraft.longitude = nextWaypointLongitude;
          aircraft.route.shift();
        } else {
          const nextAircraftCoordinates = getNextCoordinates(
            aircraft.latitude,
            aircraft.longitude,
            nextWaypointLatitude,
            nextWaypointLongitude,
            aircraft.speed
          );
          const nextAircraftLatitude = nextAircraftCoordinates[0];
          const nextAircraftLongitude = nextAircraftCoordinates[1];
          aircraft.latitude = nextAircraftLatitude;
          aircraft.longitude = nextAircraftLongitude;
          aircraft.heading = getBearingBetweenTwoPoints(
            aircraft.latitude,
            aircraft.longitude,
            nextWaypointLatitude,
            nextWaypointLongitude
          );
        }
        aircraft.currentFuel -= aircraft.fuelRate / 3600;
        if (aircraft.currentFuel <= 0) {
          this.removeAircraft(aircraft.id);
        }
      }
    });
  }

  updateAllShipPosition() {
    this.currentScenario.ships.forEach((ship) => {
      const route = ship.route;
      if (route.length > 0) {
        const nextWaypoint = route[route.length - 1];
        const nextWaypointLatitude = nextWaypoint[0];
        const nextWaypointLongitude = nextWaypoint[1];
        if (
          getDistanceBetweenTwoPoints(
            ship.latitude,
            ship.longitude,
            nextWaypointLatitude,
            nextWaypointLongitude
          ) < 0.5
        ) {
          ship.latitude = nextWaypointLatitude;
          ship.longitude = nextWaypointLongitude;
          ship.route.shift();
        } else {
          const nextShipCoordinates = getNextCoordinates(
            ship.latitude,
            ship.longitude,
            nextWaypointLatitude,
            nextWaypointLongitude,
            ship.speed
          );
          const nextShipLatitude = nextShipCoordinates[0];
          const nextShipLongitude = nextShipCoordinates[1];
          ship.latitude = nextShipLatitude;
          ship.longitude = nextShipLongitude;
          ship.heading = getBearingBetweenTwoPoints(
            ship.latitude,
            ship.longitude,
            nextWaypointLatitude,
            nextWaypointLongitude
          );
        }
        ship.currentFuel -= ship.fuelRate / 3600;
        if (ship.currentFuel <= 0) {
          this.removeShip(ship.id);
        }
      }
    });
  }

  updateGameState() {
    this.currentScenario.currentTime += 1;

    this.facilityAutoDefense();
    this.shipAutoDefense();
    this.aircraftAirToAirEngagement();

    this.updateUnitsOnPatrolMission();

    this.currentScenario.weapons.forEach((weapon) => {
      weaponEngagement(this.currentScenario, weapon);
    });

    this.updateAllAircraftPosition();
    this.updateAllShipPosition();
    this.updateOnBoardWeaponPositions();
  }

  _getObservation(): Scenario {
    return this.currentScenario;
  }

  _getInfo() {
    return null;
  }

  step(): [Scenario, number, boolean, boolean, any] {
    this.updateGameState();
    const terminated = false;
    const truncated = this.checkGameEnded();
    const reward = 0;
    const observation = this._getObservation();
    const info = this._getInfo();
    return [observation, reward, terminated, truncated, info];
  }

  reset() {}

  checkGameEnded(): boolean {
    return false;
  }
}
