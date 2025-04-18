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
} from "@/utils/mapFunctions";
import Airbase from "@/game/units/Airbase";
import Ship from "@/game/units/Ship";

export type Target = Aircraft | Facility | Weapon | Airbase | Ship;

export function checkIfThreatIsWithinRange(
  threat: Aircraft | Weapon,
  defender: Facility | Ship | Weapon
): boolean {
  const projection = getProjection(DEFAULT_OL_PROJECTION_CODE);
  const defenderRangeGeometry = new Circle(
    fromLonLat([defender.longitude, defender.latitude], projection!),
    defender.range * NAUTICAL_MILES_TO_METERS
  );
  return defenderRangeGeometry.intersectsCoordinate(
    fromLonLat([threat.longitude, threat.latitude], projection!)
  );
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
  target: Target
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
    return true;
  }
  return false;
}

export function launchWeapon(
  currentScenario: Scenario,
  origin: Aircraft | Facility | Ship,
  target: Target
) {
  if (origin.weapons.length === 0) return;

  const weaponWithMaxRangePrototype = origin.getWeaponWithHighestRange();
  if (!weaponWithMaxRangePrototype) return;

  const nextWeaponCoordinates = getNextCoordinates(
    origin.latitude,
    origin.longitude,
    target.latitude,
    target.longitude,
    weaponWithMaxRangePrototype.speed
  );
  const nextWeaponLatitude = nextWeaponCoordinates[0];
  const nextWeaponLongitude = nextWeaponCoordinates[1];
  const newWeapon = new Weapon({
    id: randomUUID(),
    name: weaponWithMaxRangePrototype.name,
    sideId: origin.sideId,
    className: weaponWithMaxRangePrototype.className,
    latitude: nextWeaponLatitude,
    longitude: nextWeaponLongitude,
    altitude: weaponWithMaxRangePrototype.altitude,
    heading: getBearingBetweenTwoPoints(
      nextWeaponLatitude,
      nextWeaponLongitude,
      target.latitude,
      target.longitude
    ),
    speed: weaponWithMaxRangePrototype.speed,
    currentFuel: weaponWithMaxRangePrototype.currentFuel,
    maxFuel: weaponWithMaxRangePrototype.maxFuel,
    fuelRate: weaponWithMaxRangePrototype.fuelRate,
    range: weaponWithMaxRangePrototype.range,
    route: [[target.latitude, target.longitude]],
    sideColor: weaponWithMaxRangePrototype.sideColor,
    targetId: target.id,
    lethality: weaponWithMaxRangePrototype.lethality,
    maxQuantity: weaponWithMaxRangePrototype.maxQuantity,
    currentQuantity: weaponWithMaxRangePrototype.currentQuantity,
  });
  currentScenario.weapons.push(newWeapon);
  origin.weapons[0].currentQuantity -= 1;
  if (origin.weapons[0].currentQuantity < 1) origin.weapons.shift();
}

export function weaponEngagement(currentScenario: Scenario, weapon: Weapon) {
  const target =
    currentScenario.getAircraft(weapon.targetId) ??
    currentScenario.getFacility(weapon.targetId) ??
    currentScenario.getWeapon(weapon.targetId) ??
    currentScenario.getShip(weapon.targetId) ??
    currentScenario.getAirbase(weapon.targetId);
  if (target) {
    const weaponRoute = weapon.route;
    if (weaponRoute.length > 0) {
      if (
        getDistanceBetweenTwoPoints(
          weapon.latitude,
          weapon.longitude,
          target.latitude,
          target.longitude
        ) < 0.5
      ) {
        weaponEndgame(currentScenario, weapon, target);
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
      }
    }
  } else {
    currentScenario.weapons = currentScenario.weapons.filter(
      (currentScenarioWeapon) => currentScenarioWeapon.id !== weapon.id
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
