import { v4 as uuidv4 } from "uuid";

import { Circle } from "ol/geom";
import { DEFAULT_OL_PROJECTION_CODE, NAUTICAL_MILES_TO_METERS } from '../utils/constants';
import { Projection, fromLonLat } from "ol/proj";

import Aircraft from "./Aircraft";
import Facility from "./Facility";
import Scenario from "./Scenario";

import { getBearingBetweenTwoPoints, getDistanceBetweenTwoPoints, getTerminalCoordinatesFromDistanceAndBearing, randomFloat, generateRoute } from "../utils/utils";
import Airbase from "./Airbase";
import Side from "./Side";
import Weapon from "./Weapon";

export default class Game {
    currentScenario: Scenario;
    currentSideName: string = '';
    scenarioPaused: boolean = true;
    addingAircraft: boolean = false;
    addingAirbase: boolean = false;
    addingFacility: boolean = false;
    selectedUnitId: string = '';
    numberOfWaypoints: number = 50;

    constructor(currentScenario: Scenario) {
        this.currentScenario = currentScenario;
    }

    addAircraft(aircraftName: string, className: string, latitude: number, longitude: number) {
        if (!this.currentSideName) {
            return;
        }
        const aircraft = new Aircraft(uuidv4(), aircraftName, this.currentSideName, className);
        aircraft.latitude = latitude;
        aircraft.longitude = longitude;
        aircraft.sideColor = this.currentScenario.getSideColor(this.currentSideName);

        this.currentScenario.aircraft.push(aircraft);
    }

    addAircraftToAirbase(aircraftName: string, className: string, airbaseId: string) {
        if (!this.currentSideName) {
            return;
        }
        const airbase = this.currentScenario.getAirbase(airbaseId);
        if (airbase) {
            const aircraft = new Aircraft(uuidv4(), aircraftName, this.currentSideName, className);
            aircraft.latitude = airbase.latitude - 0.5;
            aircraft.longitude = airbase.longitude - 0.5;
            aircraft.sideColor = this.currentScenario.getSideColor(this.currentSideName);
            airbase.aircraft.push(aircraft);
        }
    }

    addAirbase(airbaseName: string, className: string, latitude: number, longitude: number) {
        if (!this.currentSideName) {
            return;
        }
        const airbase = new Airbase(uuidv4(), airbaseName, this.currentSideName, className);
        airbase.latitude = latitude;
        airbase.longitude = longitude;
        airbase.sideColor = this.currentScenario.getSideColor(this.currentSideName);

        this.currentScenario.airbases.push(airbase);
    }

    addFacility(facilityName: string, className: string, latitude: number, longitude: number) {
        if (!this.currentSideName) {
            return;
        }
        const facility = new Facility(uuidv4(), facilityName, this.currentSideName, className);
        facility.latitude = latitude;
        facility.longitude = longitude;
        facility.sideColor = this.currentScenario.getSideColor(this.currentSideName);

        this.currentScenario.facilities.push(facility);
    }

    moveAircraft(aircraftId: string, newLatitude: number, newLongitude: number) {
        const aircraft = this.currentScenario.getAircraft(aircraftId);
        if (aircraft) {
            aircraft.route = generateRoute(aircraft.latitude, aircraft.longitude, newLatitude, newLongitude, this.numberOfWaypoints);
            aircraft.heading = getBearingBetweenTwoPoints(aircraft.latitude, aircraft.longitude, newLatitude, newLongitude);
        }
    }

    launchAircraftFromAirbase(airbaseId: string) {
        if (!this.currentSideName) {
            return;
        }
        const airbase = this.currentScenario.getAirbase(airbaseId);
        if (airbase && airbase.aircraft.length > 0) {
            const aircraft = airbase.aircraft.pop()
            if (aircraft) this.currentScenario.aircraft.push(aircraft);
        }
    }

    checkIfAircraftIsWithinFacilityThreatRange(aircraft: Aircraft, facility: Facility): boolean {
        const projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE})
        const facilityRangeGeometry = new Circle(fromLonLat([facility.longitude, facility.latitude], projection), facility.range * NAUTICAL_MILES_TO_METERS)
        return facilityRangeGeometry.intersectsCoordinate(fromLonLat([aircraft.longitude, aircraft.latitude], projection))
    }

    checkWeaponDestroyedTarget(weapon: Weapon, target: Aircraft | Facility): boolean {
        if (randomFloat() <= weapon.lethality) {
            if (target instanceof Aircraft) {
                this.currentScenario.aircraft = this.currentScenario.aircraft.filter((currentScenarioAircraft) => currentScenarioAircraft.id !== target.id);
            } else if (target instanceof Facility) {
                this.currentScenario.facilities = this.currentScenario.facilities.filter((currentScenarioFacility) => currentScenarioFacility.id !== target.id)
            }
            this.currentScenario.weapons = this.currentScenario.weapons.filter((currentScenarioWeapon) => currentScenarioWeapon.id !== weapon.id);
            return true
        }
        return false
    }

    launchMissile(origin: Aircraft | Facility, target: Aircraft | Facility) {
        const missile = new Weapon(uuidv4(), 'missile', origin.sideName, 'missile')
        missile.latitude = origin.latitude;
        missile.longitude = origin.longitude;
        missile.sideColor = this.currentScenario.getSideColor(origin.sideName);
        missile.targetId = target.id;
        missile.lethality = 0.3
        missile.route = generateRoute(missile.latitude, missile.longitude, target.latitude, target.longitude, this.numberOfWaypoints / 10);
        missile.heading = getBearingBetweenTwoPoints(missile.latitude, missile.longitude, target.latitude, target.longitude);

        this.currentScenario.weapons.push(missile);
    }

    weaponTrackTarget(weapon: Weapon) {
        const target = this.currentScenario.getAircraft(weapon.targetId) ?? this.currentScenario.getFacility(weapon.targetId);
        if (target) {
            const weaponRoute = weapon.route;
            if (weaponRoute.length > 0) {
                const nextWaypoint = weaponRoute[0];
                weapon.latitude = nextWaypoint[0];
                weapon.longitude = nextWaypoint[1];
                weapon.route.shift();
            }
            weapon.route = generateRoute(weapon.latitude, weapon.longitude, target.latitude, target.longitude, this.numberOfWaypoints / 10);
            weapon.heading = getBearingBetweenTwoPoints(weapon.latitude, weapon.longitude, target.latitude, target.longitude);
        }
    }

    switchCurrentSide() {
        for (let i = 0; i < this.currentScenario.sides.length; i++) {
            if (this.currentScenario.sides[i].name === this.currentSideName) {
                this.currentSideName = this.currentScenario.sides[(i + 1) % this.currentScenario.sides.length].name;
                break;
            }
        }
    }

    exportCurrentScenario(): string {
        const exportObject = {
            "currentScenario": this.currentScenario,
            "currentSideName": this.currentSideName,
            "selectedUnitId": this.selectedUnitId,
        }
        return JSON.stringify(exportObject);
    }

    loadScenario(scenarioString: string) {
        const importObject = JSON.parse(scenarioString);
        this.currentSideName = importObject.currentSideName;
        this.selectedUnitId = importObject.selectedUnitId;

        const savedScenario = importObject.currentScenario;
        const savedSides = savedScenario.sides.map((side: any) => {
            const newSide = new Side(side.id, side.name);
            newSide.totalScore = side.totalScore;
            newSide.sideColor = side.sideColor;
            return newSide;
        });
        const loadedScenario = new Scenario(savedScenario.id, savedScenario.name, savedScenario.startTime, savedScenario.duration, savedSides);
        this.currentScenario = loadedScenario;
        savedScenario.aircraft.forEach((aircraft: any) => {
            const newAircraft = new Aircraft(aircraft.id, aircraft.name, aircraft.sideName, aircraft.className);
            newAircraft.latitude = aircraft.latitude;
            newAircraft.longitude = aircraft.longitude;
            newAircraft.heading = aircraft.heading;
            newAircraft.route = aircraft.route;
            newAircraft.sideColor = aircraft.sideColor;
            loadedScenario.aircraft.push(newAircraft);
        });
        savedScenario.airbases.forEach((airbase: any) => {
            const newAirbase = new Airbase(airbase.id, airbase.name, airbase.sideName, airbase.className);
            newAirbase.latitude = airbase.latitude;
            newAirbase.longitude = airbase.longitude;
            newAirbase.sideColor = airbase.sideColor;
            newAirbase.aircraft = airbase.aircraft ?? [];
            loadedScenario.airbases.push(newAirbase);
        });
        savedScenario.facilities.forEach((facility: any) => {
            const newFacility = new Facility(facility.id, facility.name, facility.sideName, facility.className);
            newFacility.latitude = facility.latitude;
            newFacility.longitude = facility.longitude;
            newFacility.sideColor = facility.sideColor;
            loadedScenario.facilities.push(newFacility);
        });
    }

    _getObservation(): Scenario {
        return this.currentScenario;
    }

    _getInfo() {
        return null;
    }

    step(): [Scenario, number, boolean, boolean, any] {
        this.currentScenario.currentTime += 1;

        this.currentScenario.facilities.forEach((facility) => {
            this.currentScenario.aircraft.forEach((aircraft) => {
                if (facility.sideName !== aircraft.sideName) {
                    if (this.checkIfAircraftIsWithinFacilityThreatRange(aircraft, facility)) {
                        if (!facility.fired) {
                            this.launchMissile(facility, aircraft)
                            facility.fired = true
                        } else {
                            this.weaponTrackTarget(this.currentScenario.weapons[this.currentScenario.weapons.length - 1])
                            this.checkWeaponDestroyedTarget(this.currentScenario.weapons[this.currentScenario.weapons.length - 1], aircraft)
                        }
                    }
                }
            })
        })

        this.currentScenario.weapons.forEach((weapon) => {
            const route = weapon.route;
            if (route.length > 0) {
                const nextWaypoint = route[0];
                weapon.latitude = nextWaypoint[0];
                weapon.longitude = nextWaypoint[1];
                weapon.route.shift();
            }
        });

        this.currentScenario.aircraft.forEach((aircraft) => {
            const route = aircraft.route;
            if (route.length > 0) {
                const nextWaypoint = route[0];
                aircraft.latitude = nextWaypoint[0];
                aircraft.longitude = nextWaypoint[1];
                aircraft.route.shift();
            }
        });

        const terminated = false;
        const truncated = this.checkGameEnded();
        const reward = 0;
        const observation = this._getObservation();
        const info = this._getInfo();
        return [observation, reward, terminated, truncated, info];
    }

    reset() {

    }

    checkGameEnded(): boolean {
        return false;
    }

}
