import Scenario from "@/game/Scenario";
import Airbase from "@/game/units/Airbase";
import Aircraft from "@/game/units/Aircraft";
import Facility from "@/game/units/Facility";
import ReferencePoint from "@/game/units/ReferencePoint";
import Ship from "@/game/units/Ship";
import Weapon from "@/game/units/Weapon";

const DEFAULT_EXPORTED_NUMBER_PRECISION = 3;

const roundNumber = (
  num: number,
  precision: number = DEFAULT_EXPORTED_NUMBER_PRECISION
) => {
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
};

interface AircraftUpdate {
  id: string;
  name?: string;
  className?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  currentFuel?: number;
  maxFuel?: number;
  fuelRate?: number;
  range?: number;
  route?: number[][];
  weapons?: Weapon[];
  rtb?: boolean;
  targetId?: string;
}

interface ShipUpdate {
  id: string;
  name?: string;
  className?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  currentFuel?: number;
  maxFuel?: number;
  fuelRate?: number;
  range?: number;
  route?: number[][];
  weapons?: Weapon[];
  aircraft?: Aircraft[];
}

interface WeaponUpdate {
  id: string;
  name?: string;
  className?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  currentFuel?: number;
  maxFuel?: number;
  fuelRate?: number;
  range?: number;
  route?: number[][];
  targetId?: string;
}

interface AirbaseUpdate {
  id: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  aircraft?: Aircraft[];
}

interface FacilityUpdate {
  id: string;
  name?: string;
  className?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  range?: number;
  weapons?: Weapon[];
}

interface ReferencePointUpdate {
  id: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
}

interface Change {
  currentTime: number;
  newAircraft?: Aircraft[];
  deletedAircraftIds?: string[];
  aircraftUpdates?: AircraftUpdate[];
  newShips?: Ship[];
  deletedShipIds?: string[];
  shipUpdates?: ShipUpdate[];
  newWeapons?: Weapon[];
  deletedWeaponIds?: string[];
  weaponUpdates?: WeaponUpdate[];
  newAirbases?: Airbase[];
  deletedAirbaseIds?: string[];
  airbaseUpdates?: AirbaseUpdate[];
  newFacilities?: Facility[];
  deletedFacilityIds?: string[];
  facilityUpdates?: FacilityUpdate[];
  newReferencePoints?: ReferencePoint[];
  deletedReferencePointIds?: string[];
  referencePointUpdates?: ReferencePointUpdate[];
}

class PlaybackRecorder {
  scenarioName: string = "New Scenario";
  recordedSteps: Change[] = [];
  previousStep: Scenario | null = null;

  reset() {
    this.scenarioName = "New Scenario";
    this.recordedSteps = [];
    this.previousStep = null;
  }

  startRecording(scenario: Scenario) {
    this.reset();
    this.scenarioName = scenario.name;
    this.previousStep = scenario;
    this.recordInitialFrame(scenario);
  }

  getAircraftChanges(nextAircraft: Aircraft[]) {
    const previousAircraft = this.previousStep?.aircraft ?? [];
    const previousAircraftIds = previousAircraft.map((aircraft) => aircraft.id);
    const nextAircraftIds = nextAircraft.map((aircraft) => aircraft.id);
    // add new aircraft
    const newAircraft = nextAircraft.filter(
      (aircraft) => !previousAircraftIds.includes(aircraft.id)
    );
    // remove deleted aircraft
    const deletedAircraftIds =
      previousAircraft
        .filter((aircraft) => !nextAircraftIds.includes(aircraft.id))
        .map((aircraft) => aircraft.id) ?? [];
    // update other aircraft
    const updatedAircraft = nextAircraft.filter((aircraft) =>
      previousAircraftIds.includes(aircraft.id)
    );
    const aircraftUpdates: AircraftUpdate[] = [];
    updatedAircraft.forEach((currentAc) => {
      const previousAc = previousAircraft.find((ac) => ac.id === currentAc.id);
      if (!previousAc) {
        return;
      }
      const update: AircraftUpdate = {
        id: currentAc.id,
      };
      if (previousAc.name !== currentAc.name) update.name = currentAc.name;
      if (previousAc.className !== currentAc.className)
        update.className = currentAc.className;
      if (previousAc.latitude !== currentAc.latitude)
        update.latitude = roundNumber(currentAc.latitude);
      if (previousAc.longitude !== currentAc.longitude)
        update.longitude = roundNumber(currentAc.longitude);
      if (previousAc.altitude !== currentAc.altitude)
        update.altitude = roundNumber(currentAc.altitude);
      if (previousAc.heading !== currentAc.heading)
        update.heading = roundNumber(currentAc.heading);
      if (previousAc.speed !== currentAc.speed) update.speed = currentAc.speed;
      if (previousAc.currentFuel !== currentAc.currentFuel)
        update.currentFuel = roundNumber(currentAc.currentFuel);
      if (previousAc.maxFuel !== currentAc.maxFuel)
        update.maxFuel = roundNumber(currentAc.maxFuel);
      if (previousAc.fuelRate !== currentAc.fuelRate)
        update.fuelRate = roundNumber(currentAc.fuelRate);
      if (previousAc.range !== currentAc.range)
        update.range = roundNumber(currentAc.range);
      if (previousAc.route !== currentAc.route) {
        const route = currentAc.route.map((waypoint) => [
          roundNumber(waypoint[0]),
          roundNumber(waypoint[1]),
        ]);
        update.route = route;
      }
      // if (previousAc.weapons !== currentAc.weapons)
      //   update.weapons = currentAc.weapons;
      if (previousAc.rtb !== currentAc.rtb) update.rtb = currentAc.rtb;
      if (previousAc.targetId !== currentAc.targetId)
        update.targetId = currentAc.targetId;
      if (Object.keys(update).length > 1) aircraftUpdates.push(update);
    });
    return {
      newAircraft,
      deletedAircraftIds,
      aircraftUpdates,
    };
  }

  getShipChanges(nextShips: Ship[]) {
    const previousShips = this.previousStep?.ships ?? [];
    const previousShipIds = previousShips.map((ship) => ship.id);
    const nextShipIds = nextShips.map((ship) => ship.id);
    // add new ship
    const newShips = nextShips.filter(
      (ship) => !previousShipIds.includes(ship.id)
    );
    // remove deleted ship
    const deletedShipIds =
      previousShips
        .filter((ship) => !nextShipIds.includes(ship.id))
        .map((ship) => ship.id) ?? [];
    // update other ship
    const updatedShips = nextShips.filter((ship) =>
      previousShipIds.includes(ship.id)
    );
    const shipUpdates: ShipUpdate[] = [];
    updatedShips.forEach((currentShip) => {
      const previousShip = previousShips.find((sh) => sh.id === currentShip.id);
      if (!previousShip) {
        return;
      }
      const update: ShipUpdate = {
        id: currentShip.id,
      };
      if (previousShip.name !== currentShip.name)
        update.name = currentShip.name;
      if (previousShip.className !== currentShip.className)
        update.className = currentShip.className;
      if (previousShip.latitude !== currentShip.latitude)
        update.latitude = roundNumber(currentShip.latitude);
      if (previousShip.longitude !== currentShip.longitude)
        update.longitude = roundNumber(currentShip.longitude);
      if (previousShip.altitude !== currentShip.altitude)
        update.altitude = roundNumber(currentShip.altitude);
      if (previousShip.heading !== currentShip.heading)
        update.heading = roundNumber(currentShip.heading);
      if (previousShip.speed !== currentShip.speed)
        update.speed = currentShip.speed;
      if (previousShip.currentFuel !== currentShip.currentFuel)
        update.currentFuel = roundNumber(currentShip.currentFuel);
      if (previousShip.maxFuel !== currentShip.maxFuel)
        update.maxFuel = roundNumber(currentShip.maxFuel);
      if (previousShip.fuelRate !== currentShip.fuelRate)
        update.fuelRate = roundNumber(currentShip.fuelRate);
      if (previousShip.range !== currentShip.range)
        update.range = roundNumber(currentShip.range);
      if (previousShip.route !== currentShip.route) {
        const route = currentShip.route.map((waypoint) => [
          roundNumber(waypoint[0]),
          roundNumber(waypoint[1]),
        ]);
        update.route = route;
      }
      // if (previousShip.weapons !== currentShip.weapons)
      //   update.weapons = currentShip.weapons;
      //   if (previousShip.aircraft !== currentShip.aircraft)
      //     update.aircraft = currentShip.aircraft;
      if (Object.keys(update).length > 1) shipUpdates.push(update);
    });
    return {
      newShips,
      deletedShipIds,
      shipUpdates,
    };
  }

  getWeaponChanges(nextWeapons: Weapon[]) {
    const previousWeapons = this.previousStep?.weapons ?? [];
    const previousWeaponIds = previousWeapons.map((weapon) => weapon.id);
    const nextWeaponIds = nextWeapons.map((weapon) => weapon.id);
    // add new weapon
    const newWeapons = nextWeapons.filter(
      (weapon) => !previousWeaponIds.includes(weapon.id)
    );
    // remove deleted weapon
    const deletedWeaponIds =
      previousWeapons
        .filter((weapon) => !nextWeaponIds.includes(weapon.id))
        .map((weapon) => weapon.id) ?? [];
    // update other weapon
    const updatedWeapons = nextWeapons.filter((weapon) =>
      previousWeaponIds.includes(weapon.id)
    );
    const weaponUpdates: WeaponUpdate[] = [];
    updatedWeapons.forEach((currentWeapon) => {
      const previousWeapon = previousWeapons.find(
        (wp) => wp.id === currentWeapon.id
      );
      if (!previousWeapon) {
        return;
      }
      const update: WeaponUpdate = {
        id: currentWeapon.id,
      };
      if (previousWeapon.name !== currentWeapon.name)
        update.name = currentWeapon.name;
      if (previousWeapon.className !== currentWeapon.className)
        update.className = currentWeapon.className;
      if (previousWeapon.latitude !== currentWeapon.latitude)
        update.latitude = roundNumber(currentWeapon.latitude);
      if (previousWeapon.longitude !== currentWeapon.longitude)
        update.longitude = roundNumber(currentWeapon.longitude);
      if (previousWeapon.altitude !== currentWeapon.altitude)
        update.altitude = roundNumber(currentWeapon.altitude);
      if (previousWeapon.heading !== currentWeapon.heading)
        update.heading = roundNumber(currentWeapon.heading);
      if (previousWeapon.speed !== currentWeapon.speed)
        update.speed = currentWeapon.speed;
      if (previousWeapon.currentFuel !== currentWeapon.currentFuel)
        update.currentFuel = roundNumber(currentWeapon.currentFuel);
      if (previousWeapon.maxFuel !== currentWeapon.maxFuel)
        update.maxFuel = roundNumber(currentWeapon.maxFuel);
      if (previousWeapon.fuelRate !== currentWeapon.fuelRate)
        update.fuelRate = roundNumber(currentWeapon.fuelRate);
      if (previousWeapon.range !== currentWeapon.range)
        update.range = roundNumber(currentWeapon.range);
      if (previousWeapon.route !== currentWeapon.route) {
        const route = currentWeapon.route.map((waypoint) => [
          roundNumber(waypoint[0]),
          roundNumber(waypoint[1]),
        ]);
        update.route = route;
      }
      if (
        previousWeapon.targetId !== currentWeapon.targetId &&
        currentWeapon.targetId
      )
        update.targetId = currentWeapon.targetId;
      if (Object.keys(update).length > 1) weaponUpdates.push(update);
    });
    return {
      newWeapons,
      deletedWeaponIds,
      weaponUpdates,
    };
  }

  getAirbaseChanges(nextAirbases: Airbase[]) {
    const previousAirbases = this.previousStep?.airbases ?? [];
    const previousAirbaseIds = previousAirbases.map((airbase) => airbase.id);
    const nextAirbaseIds = nextAirbases.map((airbase) => airbase.id);
    // add new airbases
    const newAirbases = nextAirbases.filter(
      (airbase) => !previousAirbaseIds.includes(airbase.id)
    );
    // remove deleted airbases
    const deletedAirbaseIds =
      previousAirbases
        .filter((airbase) => !nextAirbaseIds.includes(airbase.id))
        .map((ab) => ab.id) ?? [];
    // update other airbases
    const updatedAirbases = nextAirbases.filter((airbase) =>
      previousAirbaseIds.includes(airbase.id)
    );
    const airbaseUpdates: AirbaseUpdate[] = [];
    updatedAirbases.forEach((airbase) => {
      const previousAirbase = previousAirbases.find(
        (ab) => ab.id === airbase.id
      );
      if (!previousAirbase) {
        return;
      }
      const update: AirbaseUpdate = {
        id: airbase.id,
      };
      if (previousAirbase.name !== airbase.name) update.name = airbase.name;
      if (previousAirbase.latitude !== airbase.latitude)
        update.latitude = roundNumber(airbase.latitude);
      if (previousAirbase.longitude !== airbase.longitude)
        update.longitude = roundNumber(airbase.longitude);
      if (previousAirbase.altitude !== airbase.altitude)
        update.altitude = roundNumber(airbase.altitude);
      //   if (previousAirbase.aircraft !== airbase.aircraft)
      //     update.aircraft = airbase.aircraft;
      if (Object.keys(update).length > 1) airbaseUpdates.push(update);
    });
    return {
      newAirbases,
      deletedAirbaseIds,
      airbaseUpdates,
    };
  }

  getFacilityChanges(nextFacilities: Facility[]) {
    const previousFacilities = this.previousStep?.facilities ?? [];
    const previousFacilityIds = previousFacilities.map(
      (facility) => facility.id
    );
    const nextFacilityIds = nextFacilities.map((facility) => facility.id);
    // add new facilities
    const newFacilities = nextFacilities.filter(
      (facility) => !previousFacilityIds.includes(facility.id)
    );
    // remove deleted facilities
    const deletedFacilityIds =
      previousFacilities
        .filter((facility) => !nextFacilityIds.includes(facility.id))
        .map((fa) => fa.id) ?? [];
    // update other facilities
    const updatedFacilities = nextFacilities.filter((facility) =>
      previousFacilityIds.includes(facility.id)
    );
    const facilityUpdates: FacilityUpdate[] = [];
    updatedFacilities.forEach((facility) => {
      const previousFacility = previousFacilities.find(
        (fa) => fa.id === facility.id
      );
      if (!previousFacility) {
        return;
      }
      const update: FacilityUpdate = {
        id: facility.id,
      };
      if (previousFacility.name !== facility.name) update.name = facility.name;
      if (previousFacility.className !== facility.className)
        update.className = facility.className;
      if (previousFacility.latitude !== facility.latitude)
        update.latitude = roundNumber(facility.latitude);
      if (previousFacility.longitude !== facility.longitude)
        update.longitude = roundNumber(facility.longitude);
      if (previousFacility.altitude !== facility.altitude)
        update.altitude = roundNumber(facility.altitude);
      if (previousFacility.range !== facility.range)
        update.range = roundNumber(facility.range);
      // if (previousFacility.weapons !== facility.weapons)
      //   update.weapons = facility.weapons;
      if (Object.keys(update).length > 1) facilityUpdates.push(update);
    });
    return {
      newFacilities,
      deletedFacilityIds,
      facilityUpdates,
    };
  }

  getReferencePointChanges(nextReferencePoints: ReferencePoint[]) {
    const previousReferencePoints = this.previousStep?.referencePoints ?? [];
    const previousReferencePointIds = previousReferencePoints.map(
      (referencePoint) => referencePoint.id
    );
    const nextReferencePointIds = nextReferencePoints.map(
      (referencePoint) => referencePoint.id
    );
    // add new reference points
    const newReferencePoints = nextReferencePoints.filter(
      (referencePoint) => !previousReferencePointIds.includes(referencePoint.id)
    );
    // remove deleted reference points
    const deletedReferencePointIds =
      previousReferencePoints
        .filter(
          (referencePoint) => !nextReferencePointIds.includes(referencePoint.id)
        )
        .map((rp) => rp.id) ?? [];
    // update other reference points
    const updatedReferencePoints = nextReferencePoints.filter(
      (referencePoint) => previousReferencePointIds.includes(referencePoint.id)
    );
    const referencePointUpdates: ReferencePointUpdate[] = [];
    updatedReferencePoints.forEach((referencePoint) => {
      const previousReferencePoint = previousReferencePoints.find(
        (rp) => rp.id === referencePoint.id
      );
      if (!previousReferencePoint) {
        return;
      }
      const update: ReferencePointUpdate = {
        id: referencePoint.id,
      };
      if (previousReferencePoint.name !== referencePoint.name)
        update.name = referencePoint.name;
      if (previousReferencePoint.latitude !== referencePoint.latitude)
        update.latitude = roundNumber(referencePoint.latitude);
      if (previousReferencePoint.longitude !== referencePoint.longitude)
        update.longitude = roundNumber(referencePoint.longitude);
      if (previousReferencePoint.altitude !== referencePoint.altitude)
        update.altitude = roundNumber(referencePoint.altitude);
      if (Object.keys(update).length > 1) referencePointUpdates.push(update);
    });
    return {
      newReferencePoints,
      deletedReferencePointIds,
      referencePointUpdates,
    };
  }

  recordInitialFrame(scenario: Scenario) {
    const change: Change = {
      currentTime: scenario.currentTime,
      newAircraft: scenario.aircraft,
      newShips: scenario.ships,
      newWeapons: scenario.weapons,
      newAirbases: scenario.airbases,
      newFacilities: scenario.facilities,
      newReferencePoints: scenario.referencePoints,
    };
    this.recordedSteps.push(change);
  }

  recordFrame(currentStep: Scenario) {
    if (!this.previousStep) {
      return;
    }
    const { newAircraft, deletedAircraftIds, aircraftUpdates } =
      this.getAircraftChanges(currentStep.aircraft);
    const { newShips, deletedShipIds, shipUpdates } = this.getShipChanges(
      currentStep.ships
    );
    const { newAirbases, deletedAirbaseIds, airbaseUpdates } =
      this.getAirbaseChanges(currentStep.airbases);
    const { newFacilities, deletedFacilityIds, facilityUpdates } =
      this.getFacilityChanges(currentStep.facilities);
    const { newWeapons, deletedWeaponIds, weaponUpdates } =
      this.getWeaponChanges(currentStep.weapons);
    const {
      newReferencePoints,
      deletedReferencePointIds,
      referencePointUpdates,
    } = this.getReferencePointChanges(currentStep.referencePoints);
    const change: Change = {
      currentTime: currentStep.currentTime,
    };
    if (newAircraft.length > 0) change.newAircraft = newAircraft;
    if (deletedAircraftIds.length > 0)
      change.deletedAircraftIds = deletedAircraftIds;
    if (aircraftUpdates.length > 0) change.aircraftUpdates = aircraftUpdates;
    if (newShips.length > 0) change.newShips = newShips;
    if (deletedShipIds.length > 0) change.deletedShipIds = deletedShipIds;
    if (shipUpdates.length > 0) change.shipUpdates = shipUpdates;
    if (newWeapons.length > 0) change.newWeapons = newWeapons;
    if (deletedWeaponIds.length > 0) change.deletedWeaponIds = deletedWeaponIds;
    if (weaponUpdates.length > 0) change.weaponUpdates = weaponUpdates;
    if (newAirbases.length > 0) change.newAirbases = newAirbases;
    if (deletedAirbaseIds.length > 0)
      change.deletedAirbaseIds = deletedAirbaseIds;
    if (airbaseUpdates.length > 0) change.airbaseUpdates = airbaseUpdates;
    if (newFacilities.length > 0) change.newFacilities = newFacilities;
    if (deletedFacilityIds.length > 0)
      change.deletedFacilityIds = deletedFacilityIds;
    if (facilityUpdates.length > 0) change.facilityUpdates = facilityUpdates;
    if (newReferencePoints.length > 0)
      change.newReferencePoints = newReferencePoints;
    if (deletedReferencePointIds.length > 0)
      change.deletedReferencePointIds = deletedReferencePointIds;
    if (referencePointUpdates.length > 0)
      change.referencePointUpdates = referencePointUpdates;
    if (Object.keys(change).length > 1) this.recordedSteps.push(change);
    this.previousStep = currentStep;
  }

  exportRecording() {
    const jsonlDataStr = this.recordedSteps.map((step) => {
      return JSON.stringify(step);
    });
    const jsonlData = jsonlDataStr.join("\n");
    const jsonlDataStrUrl =
      "data:text/json;charset=utf-8," + encodeURIComponent(jsonlData);
    const downloadJsonlAnchorNode = document.createElement("a");
    downloadJsonlAnchorNode.setAttribute("href", jsonlDataStrUrl);
    downloadJsonlAnchorNode.setAttribute(
      "download",
      `${this.scenarioName} Recording.jsonl`
    );
    document.body.appendChild(downloadJsonlAnchorNode); // required for firefox
    downloadJsonlAnchorNode.click();
    downloadJsonlAnchorNode.remove();
  }

  applyAircraftChangesToScenario(change: Change, scenario: Scenario) {
    change.newAircraft?.forEach((aircraft: Aircraft) => {
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
        weapons: aircraft.weapons,
        homeBaseId: aircraft.homeBaseId,
        rtb: aircraft.rtb,
        targetId: aircraft.targetId ?? "",
      });
      scenario.aircraft.push(newAircraft);
    });
    scenario.aircraft = scenario.aircraft.filter(
      (aircraft) => !change.deletedAircraftIds?.includes(aircraft.id)
    );
    change.aircraftUpdates?.forEach((update) => {
      const aircraft = scenario.aircraft.find(
        (aircraft) => aircraft.id === update.id
      );
      if (!aircraft) {
        return;
      }
      if (update.name) aircraft.name = update.name;
      if (update.className) aircraft.className = update.className;
      if (update.latitude) aircraft.latitude = update.latitude;
      if (update.longitude) aircraft.longitude = update.longitude;
      if (update.altitude) aircraft.altitude = update.altitude;
      if (update.heading) aircraft.heading = update.heading;
      if (update.speed) aircraft.speed = update.speed;
      if (update.currentFuel) aircraft.currentFuel = update.currentFuel;
      if (update.maxFuel) aircraft.maxFuel = update.maxFuel;
      if (update.fuelRate) aircraft.fuelRate = update.fuelRate;
      if (update.range) aircraft.range = update.range;
      if (update.route) aircraft.route = update.route;
      if (update.rtb) aircraft.rtb = update.rtb;
      if (update.targetId) aircraft.targetId = update.targetId;
    });
  }

  applyShipChangesToScenario(change: Change, scenario: Scenario) {
    change.newShips?.forEach((ship: Ship) => {
      const shipAircraft: Aircraft[] = [];
      ship.aircraft.forEach((aircraft: Aircraft) => {
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
          weapons: aircraft.weapons,
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
        weapons: ship.weapons,
        aircraft: shipAircraft,
      });
      scenario.ships.push(newShip);
    });
    scenario.ships = scenario.ships.filter(
      (ship) => !change.deletedShipIds?.includes(ship.id)
    );
    change.shipUpdates?.forEach((update) => {
      const ship = scenario.ships.find((ship) => ship.id === update.id);
      if (!ship) {
        return;
      }
      if (update.name) ship.name = update.name;
      if (update.className) ship.className = update.className;
      if (update.latitude) ship.latitude = update.latitude;
      if (update.longitude) ship.longitude = update.longitude;
      if (update.altitude) ship.altitude = update.altitude;
      if (update.heading) ship.heading = update.heading;
      if (update.speed) ship.speed = update.speed;
      if (update.currentFuel) ship.currentFuel = update.currentFuel;
      if (update.maxFuel) ship.maxFuel = update.maxFuel;
      if (update.fuelRate) ship.fuelRate = update.fuelRate;
      if (update.range) ship.range = update.range;
      if (update.route) ship.route = update.route;
    });
  }

  applyWeaponChangesToScenario(change: Change, scenario: Scenario) {
    change.newWeapons?.forEach((weapon: Weapon) => {
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
      scenario.weapons.push(newWeapon);
    });
    scenario.weapons = scenario.weapons.filter(
      (weapon) => !change.deletedWeaponIds?.includes(weapon.id)
    );
    change.weaponUpdates?.forEach((update) => {
      const weapon = scenario.weapons.find((weapon) => weapon.id === update.id);
      if (!weapon) {
        return;
      }
      if (update.name) weapon.name = update.name;
      if (update.className) weapon.className = update.className;
      if (update.latitude) weapon.latitude = update.latitude;
      if (update.longitude) weapon.longitude = update.longitude;
      if (update.altitude) weapon.altitude = update.altitude;
      if (update.heading) weapon.heading = update.heading;
      if (update.speed) weapon.speed = update.speed;
      if (update.currentFuel) weapon.currentFuel = update.currentFuel;
      if (update.maxFuel) weapon.maxFuel = update.maxFuel;
      if (update.fuelRate) weapon.fuelRate = update.fuelRate;
      if (update.range) weapon.range = update.range;
      if (update.route) weapon.route = update.route;
      if (update.targetId) weapon.targetId = update.targetId;
    });
  }

  applyAirbaseChangesToScenario(change: Change, scenario: Scenario) {
    change.newAirbases?.forEach((airbase: Airbase) => {
      const airbaseAircraft: Aircraft[] = [];
      airbase.aircraft.forEach((aircraft: Aircraft) => {
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
          weapons: aircraft.weapons,
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
      scenario.airbases.push(newAirbase);
    });
    scenario.airbases = scenario.airbases.filter(
      (airbase) => !change.deletedAirbaseIds?.includes(airbase.id)
    );
    change.airbaseUpdates?.forEach((update) => {
      const airbase = scenario.airbases.find(
        (airbase) => airbase.id === update.id
      );
      if (!airbase) {
        return;
      }
      if (update.name) airbase.name = update.name;
      if (update.latitude) airbase.latitude = update.latitude;
      if (update.longitude) airbase.longitude = update.longitude;
      if (update.altitude) airbase.altitude = update.altitude;
    });
  }

  applyFacilityChangesToScenario(change: Change, scenario: Scenario) {
    change.newFacilities?.forEach((facility: Facility) => {
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
        weapons: facility.weapons,
      });
      scenario.facilities.push(newFacility);
    });
    scenario.facilities = scenario.facilities.filter(
      (facility) => !change.deletedFacilityIds?.includes(facility.id)
    );
    change.facilityUpdates?.forEach((update) => {
      const facility = scenario.facilities.find(
        (facility) => facility.id === update.id
      );
      if (!facility) {
        return;
      }
      if (update.name) facility.name = update.name;
      if (update.className) facility.className = update.className;
      if (update.latitude) facility.latitude = update.latitude;
      if (update.longitude) facility.longitude = update.longitude;
      if (update.altitude) facility.altitude = update.altitude;
      if (update.range) facility.range = update.range;
    });
  }

  applyReferencePointChangesToScenario(change: Change, scenario: Scenario) {
    change.newReferencePoints?.forEach((referencePoint: ReferencePoint) => {
      const newReferencePoint = new ReferencePoint({
        id: referencePoint.id,
        name: referencePoint.name,
        sideName: referencePoint.sideName,
        latitude: referencePoint.latitude,
        longitude: referencePoint.longitude,
        altitude: referencePoint.altitude,
        sideColor: referencePoint.sideColor,
      });
      scenario.referencePoints.push(newReferencePoint);
    });
    scenario.referencePoints = scenario.referencePoints.filter(
      (referencePoint) =>
        !change.deletedReferencePointIds?.includes(referencePoint.id)
    );
    change.referencePointUpdates?.forEach((update) => {
      const referencePoint = scenario.referencePoints.find(
        (referencePoint) => referencePoint.id === update.id
      );
      if (!referencePoint) {
        return;
      }
      if (update.name) referencePoint.name = update.name;
      if (update.latitude) referencePoint.latitude = update.latitude;
      if (update.longitude) referencePoint.longitude = update.longitude;
      if (update.altitude) referencePoint.altitude = update.altitude;
    });
  }

  applyChangeToScenario(change: Change, scenario: Scenario) {
    this.applyAircraftChangesToScenario(change, scenario);
    this.applyShipChangesToScenario(change, scenario);
    this.applyWeaponChangesToScenario(change, scenario);
    this.applyAirbaseChangesToScenario(change, scenario);
    this.applyFacilityChangesToScenario(change, scenario);
    this.applyReferencePointChangesToScenario(change, scenario);
  }
}

export default PlaybackRecorder;
