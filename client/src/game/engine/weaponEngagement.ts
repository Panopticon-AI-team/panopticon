import { randomUUID } from "@/utils/generateUUID";
import { fromLonLat, get as getProjection } from "ol/proj";
import {
  DEFAULT_OL_PROJECTION_CODE,
  NAUTICAL_MILES_TO_METERS,
} from "@/utils/constants";
import Aircraft from "@/game/units/Aircraft";
import Facility from "@/game/units/Facility";
import { Circle } from "ol/geom";
import Scenario from "@/game/Scenario";
import Weapon from "@/game/units/Weapon";
import {
  getBearingBetweenTwoPoints,
  getDistanceBetweenTwoPoints,
  getNextCoordinates,
  getTerminalCoordinatesFromDistanceAndBearing,
  randomFloat,
  randomInt,
} from "@/utils/mapFunctions";
import Airbase from "@/game/units/Airbase";
import Ship from "@/game/units/Ship";
import SimulationLogs, { SimulationLogType } from "@/game/log/SimulationLogs";

export type Target = Aircraft | Facility | Weapon | Airbase | Ship;

export function isThreatDetected(
  threat: Aircraft | Weapon,
  detector: Facility | Ship | Aircraft
): boolean {
  const projection = getProjection(DEFAULT_OL_PROJECTION_CODE);
  const detectorRangeGeometry = new Circle(
    fromLonLat([detector.longitude, detector.latitude], projection!),
    detector.getDetectionRange() * NAUTICAL_MILES_TO_METERS
  );
  return detectorRangeGeometry.intersectsCoordinate(
    fromLonLat([threat.longitude, threat.latitude], projection!)
  );
}

export function weaponCanEngageTarget(target: Target, weapon: Weapon) {
  const weaponEngagementRangeNm = weapon.getEngagementRange();
  const distanceToTargetKm = getDistanceBetweenTwoPoints(
    weapon.latitude,
    weapon.longitude,
    target.latitude,
    target.longitude
  );
  const distanceToTargetNm =
    (distanceToTargetKm * 1000) / NAUTICAL_MILES_TO_METERS;
  if (distanceToTargetNm < weaponEngagementRangeNm) {
    return true;
  }
  return false;
}

export function checkTargetTrackedByCount(
  currentScenario: Scenario,
  target: Target
) {
  let count = 0;
  currentScenario.weapons.forEach((weapon) => {
    if (weapon.targetId === target.id) count += 1;
  });
  return count;
}

export function weaponEndgame(
  currentScenario: Scenario,
  weapon: Weapon,
  target: Target,
  simulationLogs: SimulationLogs
): boolean {
  currentScenario.weapons = currentScenario.weapons.filter(
    (currentScenarioWeapon) => currentScenarioWeapon.id !== weapon.id
  );
  if (randomFloat() <= weapon.lethality) {
    if (target instanceof Aircraft) {
      currentScenario.aircraft = currentScenario.aircraft.filter(
        (currentScenarioAircraft) => currentScenarioAircraft.id !== target.id
      );
    } else if (target instanceof Facility) {
      currentScenario.facilities = currentScenario.facilities.filter(
        (currentScenarioFacility) => currentScenarioFacility.id !== target.id
      );
    } else if (target instanceof Weapon) {
      currentScenario.weapons = currentScenario.weapons.filter(
        (currentScenarioWeapon) => currentScenarioWeapon.id !== target.id
      );
    } else if (target instanceof Airbase) {
      currentScenario.airbases = currentScenario.airbases.filter(
        (currentScenarioAirbase) => currentScenarioAirbase.id !== target.id
      );
    } else if (target instanceof Ship) {
      currentScenario.ships = currentScenario.ships.filter(
        (currentScenarioShip) => currentScenarioShip.id !== target.id
      );
    }
    simulationLogs.addLog(
      weapon.sideId,
      `${weapon.name} has hit and destroyed ${target.name}`,
      currentScenario.currentTime,
      SimulationLogType.WEAPON_HIT
    );
    return true;
  }
  simulationLogs.addLog(
    weapon.sideId,
    `${weapon.name} has missed ${target.name}`,
    currentScenario.currentTime,
    SimulationLogType.WEAPON_MISSED
  );
  return false;
}

export function launchWeapon(
  currentScenario: Scenario,
  origin: Aircraft | Facility | Ship,
  target: Target,
  launchedWeapon: Weapon,
  launchedWeaponQuantity: number,
  simulationLogs: SimulationLogs
) {
  if (
    origin.weapons.length === 0 ||
    launchedWeapon.currentQuantity < launchedWeaponQuantity
  )
    return;

  for (let i = 0; i < launchedWeaponQuantity; i++) {
    const nextWeaponCoordinates = getNextCoordinates(
      origin.latitude,
      origin.longitude,
      target.latitude,
      target.longitude,
      launchedWeapon.speed
    );
    const nextWeaponLatitude = nextWeaponCoordinates[0];
    const nextWeaponLongitude = nextWeaponCoordinates[1];
    const newWeapon = new Weapon({
      id: randomUUID(),
      name: `${launchedWeapon.name} #${randomInt(1000)}`,
      sideId: origin.sideId,
      className: launchedWeapon.className,
      latitude: nextWeaponLatitude,
      longitude: nextWeaponLongitude,
      altitude: launchedWeapon.altitude,
      heading: getBearingBetweenTwoPoints(
        nextWeaponLatitude,
        nextWeaponLongitude,
        target.latitude,
        target.longitude
      ),
      speed: launchedWeapon.speed,
      currentFuel: launchedWeapon.currentFuel,
      maxFuel: launchedWeapon.maxFuel,
      fuelRate: launchedWeapon.fuelRate,
      range: launchedWeapon.range,
      route: [[target.latitude, target.longitude]],
      sideColor: launchedWeapon.sideColor,
      targetId: target.id,
      lethality: launchedWeapon.lethality,
      maxQuantity: 1,
      currentQuantity: 1,
    });
    currentScenario.weapons.push(newWeapon);
  }
  launchedWeapon.currentQuantity -= launchedWeaponQuantity;
  simulationLogs.addLog(
    origin.sideId,
    `${origin.name} launched ${launchedWeaponQuantity}x ${launchedWeapon.name} at ${target.name}`,
    currentScenario.currentTime,
    SimulationLogType.WEAPON_LAUNCHED
  );
  if (launchedWeapon.currentQuantity < 1) {
    origin.weapons = origin.weapons.filter(
      (currentOriginWeapon) => currentOriginWeapon.id !== launchedWeapon.id
    );
    simulationLogs.addLog(
      origin.sideId,
      `${origin.name} has expended all stores of ${launchedWeapon.name}`,
      currentScenario.currentTime,
      SimulationLogType.WEAPON_EXPENDED
    );
  }
}

export function weaponEngagement(
  currentScenario: Scenario,
  weapon: Weapon,
  simulationLogs: SimulationLogs
) {
  const target =
    currentScenario.getAircraft(weapon.targetId) ??
    currentScenario.getFacility(weapon.targetId) ??
    currentScenario.getWeapon(weapon.targetId) ??
    currentScenario.getShip(weapon.targetId) ??
    currentScenario.getAirbase(weapon.targetId);
  if (target) {
    const weaponRoute = weapon.route;
    if (weaponRoute.length > 0) {
      // there is a weird bug where a weapon will be teleported a vast distance if it gets too close to the target but weaponEndgame is not called, current solution is to set threshold to 1 km
      if (
        getDistanceBetweenTwoPoints(
          weapon.latitude,
          weapon.longitude,
          target.latitude,
          target.longitude
        ) < 1
      ) {
        weaponEndgame(currentScenario, weapon, target, simulationLogs);
      } else {
        const nextWeaponCoordinates = getNextCoordinates(
          weapon.latitude,
          weapon.longitude,
          target.latitude,
          target.longitude,
          weapon.speed
        );
        const nextWeaponLatitude = nextWeaponCoordinates[0];
        const nextWeaponLongitude = nextWeaponCoordinates[1];
        weapon.heading = getBearingBetweenTwoPoints(
          nextWeaponLatitude,
          nextWeaponLongitude,
          target.latitude,
          target.longitude
        );
        weapon.latitude = nextWeaponLatitude;
        weapon.longitude = nextWeaponLongitude;
      }
      weapon.currentFuel -= weapon.fuelRate / 3600;
      if (weapon.currentFuel <= 0) {
        currentScenario.weapons = currentScenario.weapons.filter(
          (currentScenarioWeapon) => currentScenarioWeapon.id !== weapon.id
        );
        simulationLogs.addLog(
          weapon.sideId,
          `${weapon.name} has run out of fuel and is no longer operational`,
          currentScenario.currentTime,
          SimulationLogType.WEAPON_CRASHED
        );
      }
    }
  } else {
    currentScenario.weapons = currentScenario.weapons.filter(
      (currentScenarioWeapon) => currentScenarioWeapon.id !== weapon.id
    );
    simulationLogs.addLog(
      weapon.sideId,
      `${weapon.name} has lost its target and is no longer operational`,
      currentScenario.currentTime,
      SimulationLogType.WEAPON_CRASHED
    );
  }
}

export function aircraftPursuit(currentScenario: Scenario, aircraft: Aircraft) {
  const target = currentScenario.getAircraft(aircraft.targetId);
  if (!target) {
    aircraft.targetId = "";
    return;
  }
  if (aircraft.weapons.length < 1) return;
  aircraft.route = [
    [
      target.latitude - 0.1 < -90 ? target.latitude : target.latitude - 0.1,
      target.longitude - 0.1 < -180 ? target.longitude : target.longitude - 0.1,
    ],
  ];
  aircraft.heading = getBearingBetweenTwoPoints(
    aircraft.latitude,
    aircraft.longitude,
    target.latitude,
    target.longitude
  );
}

export function routeAircraftToStrikePosition(
  currentScenario: Scenario,
  aircraft: Aircraft,
  targetId: string,
  strikeRadiusNm: number
) {
  const target =
    currentScenario.getFacility(targetId) ||
    currentScenario.getShip(targetId) ||
    currentScenario.getAirbase(targetId) ||
    currentScenario.getAircraft(targetId);
  if (!target) return;
  if (aircraft.weapons.length < 1) return;

  const bearingBetweenAircraftAndTarget = getBearingBetweenTwoPoints(
    aircraft.latitude,
    aircraft.longitude,
    target.latitude,
    target.longitude
  );
  const bearingBetweenTargetAndAircraft = getBearingBetweenTwoPoints(
    target.latitude,
    target.longitude,
    aircraft.latitude,
    aircraft.longitude
  );
  const strikeLocation = getTerminalCoordinatesFromDistanceAndBearing(
    target.latitude,
    target.longitude,
    (strikeRadiusNm * NAUTICAL_MILES_TO_METERS) / 1000,
    bearingBetweenTargetAndAircraft
  );

  aircraft.route.push([strikeLocation[0], strikeLocation[1]]);
  aircraft.heading = bearingBetweenAircraftAndTarget;
}
