import { randomUUID } from "@/utils/generateUUID";
import Aircraft from "@/game/units/Aircraft";
import Facility from "@/game/units/Facility";
import Scenario from "@/game/Scenario";

import {
  getBearingBetweenTwoPoints,
  getNextCoordinates,
  getDistanceBetweenTwoPoints,
} from "@/utils/mapFunctions";
import {
  aircraftPursuit,
  isThreatDetected,
  checkTargetTrackedByCount,
  launchWeapon,
  routeAircraftToStrikePosition,
  weaponEngagement,
  weaponCanEngageTarget,
} from "@/game/engine/weaponEngagement";
import Airbase from "@/game/units/Airbase";
import Side from "@/game/Side";
import Weapon from "@/game/units/Weapon";
import {
  GAME_SPEED_DELAY_MS,
  NAUTICAL_MILES_TO_METERS,
} from "@/utils/constants";
import Ship from "@/game/units/Ship";
import ReferencePoint from "@/game/units/ReferencePoint";
import PatrolMission from "@/game/mission/PatrolMission";
import StrikeMission from "@/game/mission/StrikeMission";
import PlaybackRecorder from "@/game/playback/PlaybackRecorder";
import RecordingPlayer from "@/game/playback/RecordingPlayer";
import { SIDE_COLOR } from "@/utils/colors";
import Relationships from "@/game/Relationships";

const MAX_HISTORY_SIZE = 20;

interface IMapView {
  defaultCenter: number[];
  currentCameraCenter: number[];
  defaultZoom: number;
  currentCameraZoom: number;
}

interface IAttackParams {
  currentAttackerId: string;
  currentWeaponId: string;
  currentWeaponQuantity: number;
}

export type Mission = PatrolMission | StrikeMission;

export default class Game {
  mapView: IMapView = {
    defaultCenter: [0, 0],
    currentCameraCenter: [0, 0],
    defaultZoom: 0,
    currentCameraZoom: 0,
  };
  currentScenario: Scenario;
  currentSideId: string = "";
  scenarioPaused: boolean = true;
  recordingScenario: boolean = false;
  playbackRecorder: PlaybackRecorder = new PlaybackRecorder(10);
  recordingPlayer: RecordingPlayer = new RecordingPlayer();
  addingAircraft: boolean = false;
  addingAirbase: boolean = false;
  addingFacility: boolean = false;
  addingReferencePoint: boolean = false;
  addingShip: boolean = false;
  selectingTarget: boolean = false;
  currentAttackParams: IAttackParams = {
    currentAttackerId: "",
    currentWeaponId: "",
    currentWeaponQuantity: 0,
  };
  selectedUnitId: string = "";
  selectedUnitClassName: string | null = null;
  numberOfWaypoints: number = 50;
  godMode: boolean = true;
  eraserMode: boolean = false;
  history: string[] = [];

  constructor(currentScenario: Scenario) {
    this.currentScenario = currentScenario;
  }

  addSide(
    sideName: string,
    sideColor: SIDE_COLOR,
    sideHostiles: string[],
    sideAllies: string[]
  ) {
    const side = new Side({
      id: randomUUID(),
      name: sideName,
      color: sideColor,
    });
    this.currentScenario.sides.push(side);
    this.currentScenario.relationships.updateRelationship(
      side.id,
      sideHostiles,
      sideAllies
    );
  }

  updateSide(
    sideId: string,
    sideName: string,
    sideColor: SIDE_COLOR,
    sideHostiles: string[],
    sideAllies: string[]
  ) {
    const side = this.currentScenario.getSide(sideId);
    if (side) {
      this.recordHistory();
      side.name = sideName;
      side.color = sideColor;
      this.currentScenario.airbases.forEach((airbase) => {
        if (airbase.sideId === sideId) {
          airbase.sideColor = sideColor;
          airbase.aircraft.forEach((aircraft) => {
            aircraft.sideColor = sideColor;
            aircraft.weapons.forEach((weapon) => {
              weapon.sideColor = sideColor;
            });
          });
        }
      });
      this.currentScenario.ships.forEach((ship) => {
        if (ship.sideId === sideId) {
          ship.sideColor = sideColor;
          ship.aircraft.forEach((aircraft) => {
            aircraft.sideColor = sideColor;
            aircraft.weapons.forEach((weapon) => {
              weapon.sideColor = sideColor;
            });
          });
          ship.weapons.forEach((weapon) => {
            weapon.sideColor = sideColor;
          });
        }
      });
      this.currentScenario.facilities.forEach((facility) => {
        if (facility.sideId === sideId) {
          facility.sideColor = sideColor;
          facility.weapons.forEach((weapon) => {
            weapon.sideColor = sideColor;
          });
        }
      });
      this.currentScenario.aircraft.forEach((aircraft) => {
        if (aircraft.sideId === sideId) {
          aircraft.sideColor = sideColor;
          aircraft.weapons.forEach((weapon) => {
            weapon.sideColor = sideColor;
          });
        }
      });
      this.currentScenario.weapons.forEach((weapon) => {
        if (weapon.sideId === sideId) {
          weapon.sideColor = sideColor;
        }
      });
      this.currentScenario.referencePoints.forEach((referencePoint) => {
        if (referencePoint.sideId === sideId) {
          referencePoint.sideColor = sideColor;
        }
      });
      this.currentScenario.missions.forEach((mission) => {
        if (mission instanceof PatrolMission) {
          mission.assignedArea.forEach((point) => {
            if (point.sideId === sideId) {
              point.sideColor = sideColor;
            }
          });
        }
      });
      this.currentScenario.relationships.updateRelationship(
        sideId,
        sideHostiles,
        sideAllies
      );
    }
  }

  deleteSide(sideId: string) {
    this.recordHistory();
    this.currentScenario.sides = this.currentScenario.sides.filter(
      (side) => side.id !== sideId
    );
    this.currentScenario.aircraft = this.currentScenario.aircraft.filter(
      (aircraft) => aircraft.sideId !== sideId
    );
    this.currentScenario.airbases = this.currentScenario.airbases.filter(
      (airbase) => airbase.sideId !== sideId
    );
    this.currentScenario.facilities = this.currentScenario.facilities.filter(
      (facility) => facility.sideId !== sideId
    );
    this.currentScenario.ships = this.currentScenario.ships.filter(
      (ship) => ship.sideId !== sideId
    );
    this.currentScenario.missions = this.currentScenario.missions.filter(
      (mission) => mission.sideId !== sideId
    );
    this.currentScenario.weapons = this.currentScenario.weapons.filter(
      (weapon) => weapon.sideId !== sideId
    );
    this.currentScenario.referencePoints =
      this.currentScenario.referencePoints.filter(
        (referencePoint) => referencePoint.sideId !== sideId
      );
    this.currentScenario.relationships.deleteSide(sideId);
    if (this.currentSideId === sideId) {
      this.currentSideId = this.currentScenario.sides[0]?.id ?? "";
    }
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
    if (!this.currentSideId) {
      return;
    }
    this.recordHistory();
    const aircraft = new Aircraft({
      id: randomUUID(),
      name: aircraftName,
      sideId: this.currentSideId,
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
      sideColor: this.currentScenario.getSideColor(this.currentSideId),
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
    if (!this.currentSideId) {
      return;
    }
    const airbase = this.currentScenario.getAirbase(airbaseId);
    if (airbase) {
      this.recordHistory();
      const aircraft = new Aircraft({
        id: randomUUID(),
        name: aircraftName,
        sideId: airbase.sideId,
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
        weapons: [this.getSampleWeapon(10, 0.25)],
        homeBaseId: airbase.id,
        rtb: false,
        sideColor: airbase.sideColor,
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
    if (!this.currentSideId) {
      return;
    }
    this.recordHistory();
    const airbase = new Airbase({
      id: randomUUID(),
      name: airbaseName,
      sideId: this.currentSideId,
      className: className,
      latitude: latitude,
      longitude: longitude,
      altitude: 0.0,
      sideColor: this.currentScenario.getSideColor(this.currentSideId),
    });
    this.currentScenario.airbases.push(airbase);
    return airbase;
  }

  addReferencePoint(
    referencePointName: string,
    latitude: number,
    longitude: number
  ) {
    if (!this.currentSideId) {
      return;
    }
    this.recordHistory();
    const referencePoint = new ReferencePoint({
      id: randomUUID(),
      name: referencePointName,
      sideId: this.currentSideId,
      latitude: latitude,
      longitude: longitude,
      altitude: 0.0,
      sideColor: this.currentScenario.getSideColor(this.currentSideId),
    });
    this.currentScenario.referencePoints.push(referencePoint);
    return referencePoint;
  }

  removeReferencePoint(referencePointId: string) {
    this.recordHistory();
    this.currentScenario.referencePoints =
      this.currentScenario.referencePoints.filter(
        (referencePoint) => referencePoint.id !== referencePointId
      );
  }

  removeAirbase(airbaseId: string) {
    this.recordHistory();
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
    this.recordHistory();
    this.currentScenario.facilities = this.currentScenario.facilities.filter(
      (facility) => facility.id !== facilityId
    );
  }

  removeAircraft(aircraftId: string) {
    this.recordHistory();
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
    if (!this.currentSideId) {
      return;
    }
    this.recordHistory();
    const facility = new Facility({
      id: randomUUID(),
      name: facilityName,
      sideId: this.currentSideId,
      className: className,
      latitude: latitude,
      longitude: longitude,
      altitude: 0.0,
      range: range ?? 250,
      sideColor: this.currentScenario.getSideColor(this.currentSideId),
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
    if (!this.currentSideId) {
      return;
    }
    this.recordHistory();
    const ship = new Ship({
      id: randomUUID(),
      name: shipName,
      sideId: this.currentSideId,
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
      sideColor: this.currentScenario.getSideColor(this.currentSideId),
      weapons: [this.getSampleWeapon(300, 0.15, this.currentSideId)],
      aircraft: [],
    });
    this.currentScenario.ships.push(ship);
    return ship;
  }

  duplicateUnit(unitId: string, unitType: string) {
    if (unitType === "aircraft") {
      const aircraft = this.currentScenario.getAircraft(unitId);
      if (aircraft) {
        this.recordHistory();
        const newAircraft = new Aircraft({
          id: randomUUID(),
          name: aircraft.name,
          sideId: aircraft.sideId,
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
          weapons: aircraft.weapons,
          homeBaseId: aircraft.homeBaseId,
          rtb: false,
          targetId: aircraft.targetId,
          sideColor: aircraft.sideColor,
        });
        this.currentScenario.aircraft.push(newAircraft);
        return newAircraft;
      }
    }
  }

  addAircraftToShip(aircraftName: string, className: string, shipId: string) {
    if (!this.currentSideId) {
      return;
    }
    const ship = this.currentScenario.getShip(shipId);
    if (ship) {
      this.recordHistory();
      const aircraft = new Aircraft({
        id: randomUUID(),
        name: aircraftName,
        sideId: ship.sideId,
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
        weapons: [this.getSampleWeapon(10, 0.25)],
        homeBaseId: ship.id,
        rtb: false,
        sideColor: ship.sideColor,
      });
      ship.aircraft.push(aircraft);
    }
  }

  launchAircraftFromShip(shipId: string) {
    if (!this.currentSideId) {
      return;
    }
    const ship = this.currentScenario.getShip(shipId);
    if (ship && ship.aircraft.length > 0) {
      const aircraft = ship.aircraft.pop();
      if (aircraft) {
        this.recordHistory();
        this.currentScenario.aircraft.push(aircraft);
        return aircraft;
      }
    }
  }

  removeShip(shipId: string) {
    this.recordHistory();
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
    assignedArea: ReferencePoint[]
  ) {
    if (assignedArea.length < 3) return;
    this.recordHistory();
    const currentSideId = this.currentScenario.getSide(this.currentSideId)?.id;
    const patrolMission = new PatrolMission({
      id: randomUUID(),
      name: missionName,
      sideId: currentSideId ?? this.currentSideId,
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
    assignedArea?: ReferencePoint[]
  ) {
    const patrolMission = this.currentScenario.getPatrolMission(missionId);
    if (patrolMission) {
      this.recordHistory();
      if (missionName && missionName !== "") patrolMission.name = missionName;
      if (assignedUnits && assignedUnits.length > 0)
        patrolMission.assignedUnitIds = assignedUnits;
      if (assignedArea && assignedArea.length > 2) {
        patrolMission.assignedArea = assignedArea;
        patrolMission.updatePatrolAreaGeometry();
      }
    }
  }

  createStrikeMission(
    missionName: string,
    assignedAttackers: string[],
    assignedTargets: string[]
  ) {
    this.recordHistory();
    const currentSideId = this.currentScenario.getSide(this.currentSideId)?.id;
    const strikeMission = new StrikeMission({
      id: randomUUID(),
      name: missionName,
      sideId: currentSideId ?? this.currentSideId,
      assignedUnitIds: assignedAttackers,
      assignedTargetIds: assignedTargets,
      active: true,
    });
    this.currentScenario.missions.push(strikeMission);
  }

  updateStrikeMission(
    missionId: string,
    missionName?: string,
    assignedAttackers?: string[],
    assignedTargets?: string[]
  ) {
    const strikeMission = this.currentScenario.getStrikeMission(missionId);
    if (strikeMission) {
      this.recordHistory();
      if (missionName && missionName !== "") strikeMission.name = missionName;
      if (assignedAttackers && assignedAttackers.length > 0)
        strikeMission.assignedUnitIds = assignedAttackers;
      if (assignedTargets && assignedTargets.length > 0)
        strikeMission.assignedTargetIds = assignedTargets;
    }
  }

  deleteMission(missionId: string) {
    this.recordHistory();
    this.currentScenario.missions = this.currentScenario.missions.filter(
      (mission) => mission.id !== missionId
    );
  }

  getSampleWeapon(
    quantity: number,
    lethality: number,
    sideId: string = this.currentSideId
  ) {
    const weapon = new Weapon({
      id: randomUUID(),
      name: "Sample Weapon",
      sideId: sideId,
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
      sideColor: this.currentScenario.getSideColor(sideId),
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
      aircraft.desiredRoute.push([newLatitude, newLongitude]);
      if (aircraft.desiredRoute.length === 1) {
        aircraft.heading = getBearingBetweenTwoPoints(
          aircraft.latitude,
          aircraft.longitude,
          newLatitude,
          newLongitude
        );
      }
      return aircraft;
    }
  }

  moveShip(shipId: string, newLatitude: number, newLongitude: number) {
    const ship = this.currentScenario.getShip(shipId);
    if (ship) {
      ship.desiredRoute.push([newLatitude, newLongitude]);
      if (ship.desiredRoute.length === 1) {
        ship.heading = getBearingBetweenTwoPoints(
          ship.latitude,
          ship.longitude,
          newLatitude,
          newLongitude
        );
      }
      return ship;
    }
  }

  commitRoute(unitId: string) {
    const aircraft = this.currentScenario.getAircraft(unitId);
    if (aircraft) {
      this.recordHistory();
      aircraft.route = aircraft.desiredRoute;
      aircraft.desiredRoute = [];
      return aircraft;
    }
    const ship = this.currentScenario.getShip(unitId);
    if (ship) {
      this.recordHistory();
      ship.route = ship.desiredRoute;
      ship.desiredRoute = [];
      return ship;
    }
  }

  teleportUnit(unitId: string, newLatitude: number, newLongitude: number) {
    const aircraft = this.currentScenario.getAircraft(unitId);
    if (aircraft) {
      this.recordHistory();
      aircraft.latitude = newLatitude;
      aircraft.longitude = newLongitude;
      return aircraft;
    }
    const airbase = this.currentScenario.getAirbase(unitId);
    if (airbase) {
      this.recordHistory();
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
      this.recordHistory();
      facility.latitude = newLatitude;
      facility.longitude = newLongitude;
      return facility;
    }
    const ship = this.currentScenario.getShip(unitId);
    if (ship) {
      this.recordHistory();
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
      this.recordHistory();
      referencePoint.latitude = newLatitude;
      referencePoint.longitude = newLongitude;
      this.currentScenario.missions.forEach((mission) => {
        if (
          mission instanceof PatrolMission &&
          mission.assignedArea.some((point) => point.id === referencePoint.id)
        ) {
          mission.assignedArea = mission.assignedArea.map((point) =>
            point.id === referencePoint.id ? referencePoint : point
          );
          mission.updatePatrolAreaGeometry();
        }
      });
      return referencePoint;
    }
  }

  launchAircraftFromAirbase(airbaseId: string) {
    if (!this.currentSideId) {
      return;
    }
    const airbase = this.currentScenario.getAirbase(airbaseId);
    if (airbase && airbase.aircraft.length > 0) {
      this.recordHistory();
      const aircraft = airbase.aircraft.pop();
      if (aircraft) {
        this.currentScenario.aircraft.push(aircraft);
        return aircraft;
      }
    }
  }

  handleAircraftAttack(
    aircraftId: string,
    targetId: string,
    weaponId: string,
    weaponQuantity: number
  ) {
    if (weaponQuantity <= 0) return;
    const target =
      this.currentScenario.getAircraft(targetId) ??
      this.currentScenario.getFacility(targetId) ??
      this.currentScenario.getWeapon(targetId) ??
      this.currentScenario.getShip(targetId) ??
      this.currentScenario.getAirbase(targetId);
    const aircraft = this.currentScenario.getAircraft(aircraftId);
    const weapon = aircraft?.weapons.find((weapon) => weapon.id === weaponId);
    if (
      target &&
      aircraft &&
      weapon &&
      target?.sideId !== aircraft?.sideId &&
      target?.id !== aircraft?.id
    ) {
      this.recordHistory();
      launchWeapon(
        this.currentScenario,
        aircraft,
        target,
        weapon,
        weaponQuantity
      );
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
    const weapon = ship?.weapons[0];
    if (
      target &&
      ship &&
      weapon &&
      target?.sideId !== ship?.sideId &&
      target?.id !== ship?.id
    ) {
      this.recordHistory();
      launchWeapon(this.currentScenario, ship, target, weapon, 1);
    }
  }

  aircraftReturnToBase(aircraftId: string) {
    const aircraft = this.currentScenario.getAircraft(aircraftId);
    if (aircraft) {
      this.recordHistory();
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
          this.moveAircraft(aircraftId, homeBase.latitude, homeBase.longitude);
          return this.commitRoute(aircraftId);
        }
      }
    }
  }

  getFuelNeededToReturnToBase(aircraft: Aircraft) {
    if (aircraft.speed === 0) return 0;
    const homeBase =
      aircraft.homeBaseId !== ""
        ? this.currentScenario.getAircraftHomeBase(aircraft.id)
        : this.currentScenario.getClosestBaseToAircraft(aircraft.id);
    if (homeBase) {
      const distanceBetweenAircraftAndBaseNm =
        (getDistanceBetweenTwoPoints(
          aircraft.latitude,
          aircraft.longitude,
          homeBase.latitude,
          homeBase.longitude
        ) *
          1000) /
        NAUTICAL_MILES_TO_METERS;
      const timeNeededToReturnToBaseHr =
        distanceBetweenAircraftAndBaseNm / aircraft.speed;
      const fuelNeededToReturnToBase =
        timeNeededToReturnToBaseHr * aircraft.fuelRate;
      return fuelNeededToReturnToBase;
    }
    return 0;
  }

  landAircraft(aircraftId: string) {
    const aircraft = this.currentScenario.getAircraft(aircraftId);
    if (aircraft && aircraft.rtb) {
      const homeBase = this.currentScenario.getAircraftHomeBase(aircraftId);
      if (homeBase) {
        const newAircraft = new Aircraft({
          id: aircraft.id,
          name: aircraft.name,
          sideId: aircraft.sideId,
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

  switchCurrentSide(sideId: string) {
    if (this.currentScenario.getSide(sideId)) {
      this.currentSideId = sideId;
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
      currentScenario: this.currentScenario, // TODO clean up some parameters that are not needed before export, e.g. PatrolMission patrolAreaGeometry
      currentSideId: this.currentSideId,
      selectedUnitId: this.selectedUnitId,
      mapView: this.mapView,
    };
    return JSON.stringify(exportObject);
  }

  loadScenario(scenarioString: string) {
    const importObject = JSON.parse(scenarioString);
    this.currentSideId = importObject.currentSideId;
    this.selectedUnitId = importObject.selectedUnitId;
    this.mapView = importObject.mapView;

    const savedScenario = importObject.currentScenario;
    const savedSides = savedScenario.sides.map((side: Side) => {
      const newSide = new Side({
        id: side.id,
        name: side.name,
        totalScore: side.totalScore,
        color: side.color,
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
      relationships: new Relationships({
        hostiles: savedScenario.relationships?.hostiles ?? {},
        allies: savedScenario.relationships?.allies ?? {},
      }),
    });
    savedScenario.aircraft.forEach((aircraft: Aircraft) => {
      const aircraftWeapons: Weapon[] = aircraft.weapons?.map(
        (weapon: Weapon) => {
          return new Weapon({
            id: weapon.id,
            name: weapon.name,
            sideId: weapon.sideId,
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
            targetId: weapon.targetId,
            lethality: weapon.lethality,
            maxQuantity: weapon.maxQuantity,
            currentQuantity: weapon.currentQuantity,
            sideColor: weapon.sideColor,
          });
        }
      );
      const newAircraft = new Aircraft({
        id: aircraft.id,
        name: aircraft.name,
        sideId: aircraft.sideId,
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
        weapons: aircraftWeapons,
        homeBaseId: aircraft.homeBaseId,
        rtb: aircraft.rtb,
        targetId: aircraft.targetId ?? "",
        sideColor: aircraft.sideColor,
      });
      loadedScenario.aircraft.push(newAircraft);
    });
    savedScenario.airbases.forEach((airbase: Airbase) => {
      const airbaseAircraft: Aircraft[] = [];
      airbase.aircraft.forEach((aircraft: Aircraft) => {
        const aircraftWeapons: Weapon[] = aircraft.weapons?.map(
          (weapon: Weapon) => {
            return new Weapon({
              id: weapon.id,
              name: weapon.name,
              sideId: weapon.sideId,
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
              targetId: weapon.targetId,
              lethality: weapon.lethality,
              maxQuantity: weapon.maxQuantity,
              currentQuantity: weapon.currentQuantity,
              sideColor: weapon.sideColor,
            });
          }
        );
        const newAircraft = new Aircraft({
          id: aircraft.id,
          name: aircraft.name,
          sideId: aircraft.sideId,
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
          weapons: aircraftWeapons,
          homeBaseId: aircraft.homeBaseId,
          rtb: aircraft.rtb,
          targetId: aircraft.targetId ?? "",
          sideColor: aircraft.sideColor,
        });
        airbaseAircraft.push(newAircraft);
      });
      const newAirbase = new Airbase({
        id: airbase.id,
        name: airbase.name,
        sideId: airbase.sideId,
        className: airbase.className,
        latitude: airbase.latitude,
        longitude: airbase.longitude,
        altitude: airbase.altitude,
        sideColor: airbase.sideColor,
        aircraft: airbaseAircraft,
      });
      loadedScenario.airbases.push(newAirbase);
    });
    savedScenario.facilities.forEach((facility: Facility) => {
      const facilityWeapons: Weapon[] = facility.weapons?.map(
        (weapon: Weapon) => {
          return new Weapon({
            id: weapon.id,
            name: weapon.name,
            sideId: weapon.sideId,
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
            targetId: weapon.targetId,
            lethality: weapon.lethality,
            maxQuantity: weapon.maxQuantity,
            currentQuantity: weapon.currentQuantity,
            sideColor: weapon.sideColor,
          });
        }
      );
      const newFacility = new Facility({
        id: facility.id,
        name: facility.name,
        sideId: facility.sideId,
        className: facility.className,
        latitude: facility.latitude,
        longitude: facility.longitude,
        altitude: facility.altitude,
        range: facility.range,
        weapons: facilityWeapons,
        sideColor: facility.sideColor,
      });
      loadedScenario.facilities.push(newFacility);
    });
    savedScenario.weapons.forEach((weapon: Weapon) => {
      const newWeapon = new Weapon({
        id: weapon.id,
        name: weapon.name,
        sideId: weapon.sideId,
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
        targetId: weapon.targetId,
        lethality: weapon.lethality,
        maxQuantity: weapon.maxQuantity,
        currentQuantity: weapon.currentQuantity,
        sideColor: weapon.sideColor,
      });
      loadedScenario.weapons.push(newWeapon);
    });
    savedScenario.ships?.forEach((ship: Ship) => {
      const shipAircraft: Aircraft[] = [];
      ship.aircraft.forEach((aircraft: Aircraft) => {
        const aircraftWeapons: Weapon[] = aircraft.weapons?.map(
          (weapon: Weapon) => {
            return new Weapon({
              id: weapon.id,
              name: weapon.name,
              sideId: weapon.sideId,
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
              targetId: weapon.targetId,
              lethality: weapon.lethality,
              maxQuantity: weapon.maxQuantity,
              currentQuantity: weapon.currentQuantity,
              sideColor: weapon.sideColor,
            });
          }
        );
        const newAircraft = new Aircraft({
          id: aircraft.id,
          name: aircraft.name,
          sideId: aircraft.sideId,
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
          weapons: aircraftWeapons,
          homeBaseId: aircraft.homeBaseId,
          rtb: aircraft.rtb,
          targetId: aircraft.targetId ?? "",
          sideColor: aircraft.sideColor,
        });
        shipAircraft.push(newAircraft);
      });
      const shipWeapons: Weapon[] = ship.weapons?.map((weapon: Weapon) => {
        return new Weapon({
          id: weapon.id,
          name: weapon.name,
          sideId: weapon.sideId,
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
          targetId: weapon.targetId,
          lethality: weapon.lethality,
          maxQuantity: weapon.maxQuantity,
          currentQuantity: weapon.currentQuantity,
          sideColor: weapon.sideColor,
        });
      });
      const newShip = new Ship({
        id: ship.id,
        name: ship.name,
        sideId: ship.sideId,
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
        weapons: shipWeapons,
        aircraft: shipAircraft,
      });
      loadedScenario.ships.push(newShip);
    });
    savedScenario.referencePoints?.forEach((referencePoint: ReferencePoint) => {
      const newReferencePoint = new ReferencePoint({
        id: referencePoint.id,
        name: referencePoint.name,
        sideId: referencePoint.sideId,
        latitude: referencePoint.latitude,
        longitude: referencePoint.longitude,
        altitude: referencePoint.altitude,
        sideColor: referencePoint.sideColor,
      });
      loadedScenario.referencePoints.push(newReferencePoint);
    });
    savedScenario.missions?.forEach((mission: Mission) => {
      const baseProps = {
        id: mission.id,
        name: mission.name,
        sideId: mission.sideId,
        assignedUnitIds: mission.assignedUnitIds,
        active: mission.active,
      };
      if ("assignedArea" in mission) {
        const assignedArea: ReferencePoint[] = [];
        mission.assignedArea.forEach((point) => {
          const referencePoint = new ReferencePoint({
            id: point.id,
            name: point.name,
            sideId: point.sideId,
            latitude: point.latitude,
            longitude: point.longitude,
            altitude: point.altitude,
            sideColor: point.sideColor,
          });
          assignedArea.push(referencePoint);
        });
        loadedScenario.missions.push(
          new PatrolMission({
            ...baseProps,
            assignedArea: assignedArea,
          })
        );
      } else {
        loadedScenario.missions.push(
          new StrikeMission({
            ...baseProps,
            assignedTargetIds: mission.assignedTargetIds,
          })
        );
      }
    });

    this.currentScenario = loadedScenario;
  }

  toggleGodMode(enabled: boolean = !this.godMode) {
    this.godMode = enabled;
  }

  toggleEraserMode(enabled: boolean = !this.eraserMode) {
    this.eraserMode = enabled;
  }

  facilityAutoDefense() {
    this.currentScenario.facilities.forEach((facility) => {
      this.currentScenario.aircraft.forEach((aircraft) => {
        if (this.currentScenario.isHostile(facility.sideId, aircraft.sideId)) {
          const facilityWeapon = facility.getWeaponWithHighestRange();
          if (!facilityWeapon) return;
          if (
            isThreatDetected(aircraft, facility) &&
            weaponCanEngageTarget(aircraft, facilityWeapon) &&
            checkTargetTrackedByCount(this.currentScenario, aircraft) < 10
          ) {
            launchWeapon(
              this.currentScenario,
              facility,
              aircraft,
              facilityWeapon,
              1
            );
          }
        }
      });
      this.currentScenario.weapons.forEach((weapon) => {
        if (this.currentScenario.isHostile(facility.sideId, weapon.sideId)) {
          const facilityWeapon = facility.getWeaponWithHighestRange();
          if (!facilityWeapon) return;
          if (
            weapon.targetId === facility.id &&
            isThreatDetected(weapon, facility) &&
            weaponCanEngageTarget(weapon, facilityWeapon) &&
            checkTargetTrackedByCount(this.currentScenario, weapon) < 5
          ) {
            launchWeapon(
              this.currentScenario,
              facility,
              weapon,
              facilityWeapon,
              1
            );
          }
        }
      });
    });
  }

  shipAutoDefense() {
    this.currentScenario.ships.forEach((ship) => {
      this.currentScenario.aircraft.forEach((aircraft) => {
        if (this.currentScenario.isHostile(ship.sideId, aircraft.sideId)) {
          const shipWeapon = ship.getWeaponWithHighestRange();
          if (!shipWeapon) return;
          if (
            isThreatDetected(aircraft, ship) &&
            weaponCanEngageTarget(aircraft, shipWeapon) &&
            checkTargetTrackedByCount(this.currentScenario, aircraft) < 10
          ) {
            launchWeapon(this.currentScenario, ship, aircraft, shipWeapon, 1);
          }
        }
      });
      this.currentScenario.weapons.forEach((weapon) => {
        if (this.currentScenario.isHostile(ship.sideId, weapon.sideId)) {
          const shipWeapon = ship.getWeaponWithHighestRange();
          if (!shipWeapon) return;
          if (
            weapon.targetId === ship.id &&
            isThreatDetected(weapon, ship) &&
            weaponCanEngageTarget(weapon, shipWeapon) &&
            checkTargetTrackedByCount(this.currentScenario, weapon) < 5
          ) {
            launchWeapon(this.currentScenario, ship, weapon, shipWeapon, 1);
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
          this.currentScenario.isHostile(
            aircraft.sideId,
            enemyAircraft.sideId
          ) &&
          (aircraft.targetId === "" || aircraft.targetId === enemyAircraft.id)
        ) {
          if (
            isThreatDetected(enemyAircraft, aircraft) &&
            weaponCanEngageTarget(enemyAircraft, aircraftWeaponWithMaxRange) &&
            checkTargetTrackedByCount(this.currentScenario, enemyAircraft) < 1
          ) {
            launchWeapon(
              this.currentScenario,
              aircraft,
              enemyAircraft,
              aircraftWeaponWithMaxRange,
              1
            );
            aircraft.targetId = enemyAircraft.id;
          }
        }
      });
      this.currentScenario.weapons.forEach((enemyWeapon) => {
        if (
          this.currentScenario.isHostile(aircraft.sideId, enemyWeapon.sideId)
        ) {
          if (
            enemyWeapon.targetId === aircraft.id &&
            isThreatDetected(enemyWeapon, aircraft) &&
            weaponCanEngageTarget(enemyWeapon, aircraftWeaponWithMaxRange) &&
            checkTargetTrackedByCount(this.currentScenario, enemyWeapon) < 1
          ) {
            launchWeapon(
              this.currentScenario,
              aircraft,
              enemyWeapon,
              aircraftWeaponWithMaxRange,
              1
            );
          }
        }
      });
      if (aircraft.targetId && aircraft.targetId !== "")
        aircraftPursuit(this.currentScenario, aircraft);
    });
  }

  updateUnitsOnPatrolMission() {
    const activePatrolMissions = this.currentScenario
      .getAllPatrolMissions()
      .filter((mission) => mission.active);
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
            if (!mission.checkIfCoordinatesIsWithinPatrolArea(unit.route[0])) {
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

  clearCompletedStrikeMissions() {
    this.currentScenario.missions = this.currentScenario.missions.filter(
      (mission) => {
        if (mission instanceof StrikeMission) {
          let isMissionOngoing = true;
          const target =
            this.currentScenario.getFacility(mission.assignedTargetIds[0]) ||
            this.currentScenario.getShip(mission.assignedTargetIds[0]) ||
            this.currentScenario.getAirbase(mission.assignedTargetIds[0]) ||
            this.currentScenario.getAircraft(mission.assignedTargetIds[0]);
          if (!target) isMissionOngoing = false;
          const attackers = mission.assignedUnitIds
            .map((attackerId) => this.currentScenario.getAircraft(attackerId))
            .filter((attacker) => attacker !== undefined);
          if (attackers.length < 1) isMissionOngoing = false;
          const allAttackersHaveExpendedWeapons = attackers.every(
            (attacker) => attacker.getTotalWeaponQuantity() === 0
          );
          if (allAttackersHaveExpendedWeapons) isMissionOngoing = false;
          if (!isMissionOngoing) {
            attackers.forEach(
              (attacker) => attacker && this.aircraftReturnToBase(attacker.id)
            );
          }
          return isMissionOngoing;
        } else {
          return true;
        }
      }
    );
  }

  updateUnitsOnStrikeMission() {
    const activeStrikeMissions = this.currentScenario
      .getAllStrikeMissions()
      .filter((mission) => mission.active);
    if (activeStrikeMissions.length < 1) return;

    activeStrikeMissions.forEach((mission) => {
      if (mission.assignedTargetIds.length < 1) return;
      mission.assignedUnitIds.forEach((attackerId) => {
        const attacker = this.currentScenario.getAircraft(attackerId);
        if (attacker) {
          const target =
            this.currentScenario.getFacility(mission.assignedTargetIds[0]) ||
            this.currentScenario.getShip(mission.assignedTargetIds[0]) ||
            this.currentScenario.getAirbase(mission.assignedTargetIds[0]) ||
            this.currentScenario.getAircraft(mission.assignedTargetIds[0]);
          if (!target) return;
          let distanceBetweenWeaponLaunchPositionAndTargetNm = null;
          if (attacker.route.length > 0) {
            distanceBetweenWeaponLaunchPositionAndTargetNm =
              (getDistanceBetweenTwoPoints(
                attacker.route[attacker.route.length - 1][0],
                attacker.route[attacker.route.length - 1][1],
                target.latitude,
                target.longitude
              ) *
                1000) /
              NAUTICAL_MILES_TO_METERS;
          }
          const distanceBetweenAttackerAndTargetNm =
            (getDistanceBetweenTwoPoints(
              attacker.latitude,
              attacker.longitude,
              target.latitude,
              target.longitude
            ) *
              1000) /
            NAUTICAL_MILES_TO_METERS;
          const aircraftWeaponWithMaxRange =
            attacker.getWeaponWithHighestRange();
          if (!aircraftWeaponWithMaxRange) return;
          if (
            (distanceBetweenWeaponLaunchPositionAndTargetNm !== null &&
              (distanceBetweenWeaponLaunchPositionAndTargetNm >
                attacker.getDetectionRange() * 1.1 ||
                distanceBetweenWeaponLaunchPositionAndTargetNm >
                  aircraftWeaponWithMaxRange.getEngagementRange() * 1.1)) ||
            (distanceBetweenWeaponLaunchPositionAndTargetNm === null &&
              (distanceBetweenAttackerAndTargetNm >
                attacker.getDetectionRange() * 1.1 ||
                distanceBetweenAttackerAndTargetNm >
                  aircraftWeaponWithMaxRange.getEngagementRange() * 1.1))
          ) {
            routeAircraftToStrikePosition(
              this.currentScenario,
              attacker,
              mission.assignedTargetIds[0],
              Math.min(
                attacker.getDetectionRange(),
                aircraftWeaponWithMaxRange.getEngagementRange()
              )
            );
          } else if (
            distanceBetweenAttackerAndTargetNm <=
              attacker.getDetectionRange() * 1.1 &&
            distanceBetweenAttackerAndTargetNm <=
              aircraftWeaponWithMaxRange.getEngagementRange() * 1.1
          ) {
            const aircraftWeapon = attacker.getWeaponWithHighestRange();
            if (!aircraftWeapon) return;
            launchWeapon(
              this.currentScenario,
              attacker,
              target,
              aircraftWeapon,
              1
            );
            attacker.targetId = target.id;
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
        const nextWaypoint = route[0];
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
      }
      aircraft.currentFuel -= aircraft.fuelRate / 3600;
      const fuelNeededToReturnToBase =
        this.getFuelNeededToReturnToBase(aircraft);
      if (aircraft.currentFuel <= 0) {
        this.removeAircraft(aircraft.id);
      } else if (
        aircraft.currentFuel < fuelNeededToReturnToBase * 1.1 &&
        !aircraft.rtb
      ) {
        this.aircraftReturnToBase(aircraft.id);
      }
    });
  }

  updateAllShipPosition() {
    this.currentScenario.ships.forEach((ship) => {
      const route = ship.route;
      if (route.length > 0) {
        const nextWaypoint = route[0];
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
    this.clearCompletedStrikeMissions();
    this.updateUnitsOnStrikeMission();

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

  step(): [Scenario, number, boolean, boolean, null] {
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

  startRecording() {
    this.playbackRecorder.startRecording(this.currentScenario);
  }

  recordStep(force: boolean = false) {
    if (
      this.recordingScenario &&
      (this.playbackRecorder.shouldRecord(this.currentScenario.currentTime) ||
        force)
    ) {
      this.playbackRecorder.recordStep(
        this.exportCurrentScenario(),
        this.currentScenario.currentTime
      );
    }
  }

  exportRecording() {
    this.playbackRecorder.exportRecording(this.currentScenario.currentTime);
  }

  recordHistory() {
    if (this.history.length > MAX_HISTORY_SIZE) {
      this.history.shift();
    }
    this.history.push(this.exportCurrentScenario());
  }

  undo(): boolean {
    if (this.history.length > 0) {
      const lastScenario = this.history.pop();
      if (lastScenario) {
        this.loadScenario(lastScenario);
        return true;
      }
    }
    return false;
  }
}
