import { v4 as uuidv4 } from "uuid";

import { Circle } from "ol/geom";
import { DEFAULT_OL_PROJECTION_CODE, NAUTICAL_MILES_TO_METERS } from '../utils/constants';
import { Projection, fromLonLat } from "ol/proj";

import Aircraft from "./units/Aircraft";
import Facility from "./units/Facility";
import Scenario from "./Scenario";

import { getBearingBetweenTwoPoints, randomFloat, generateRoute } from "../utils/utils";
import Airbase from "./units/Airbase";
import Side from "./Side";
import Weapon from "./units/Weapon";

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
        const aircraft = new Aircraft({
            id: uuidv4(), 
            name: aircraftName, 
            sideName: this.currentSideName, 
            className: className,
            latitude: latitude,
            longitude: longitude,
            altitude: 10000.0,
            heading: 90.0,
            speed: 150.0,
            fuel: 10000.0,
            range: 100,
            sideColor: this.currentScenario.getSideColor(this.currentSideName),
            weapons: [this.getSampleWeapon(10, 0.25)],
        });
        this.currentScenario.aircraft.push(aircraft);
    }

    addAircraftToAirbase(aircraftName: string, className: string, airbaseId: string) {
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
                speed: 150.0,
                fuel: 10000.0,
                range: 100,
                sideColor: this.currentScenario.getSideColor(this.currentSideName),
                weapons: [this.getSampleWeapon(10, 0.25)],
            });
            airbase.aircraft.push(aircraft);
        }
    }

    addAirbase(airbaseName: string, className: string, latitude: number, longitude: number) {
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
    }

    removeAirbase(airbaseId: string) {
        this.currentScenario.airbases = this.currentScenario.airbases.filter((airbase) => airbase.id !== airbaseId);
    }

    removeFacility(facilityId: string) {
        this.currentScenario.facilities = this.currentScenario.facilities.filter((facility) => facility.id !== facilityId);
    }

    removeAircraft(aircraftId: string) {
        this.currentScenario.aircraft = this.currentScenario.aircraft.filter((aircraft) => aircraft.id !== aircraftId);
    }

    addFacility(facilityName: string, className: string, latitude: number, longitude: number) {
        if (!this.currentSideName) {
            return;
        }
        const facility = new Facility(uuidv4(), facilityName, this.currentSideName, className);
        facility.latitude = latitude;
        facility.longitude = longitude;
        facility.sideColor = this.currentScenario.getSideColor(this.currentSideName);
        facility.weapons = [this.getSampleWeapon(30, 0.1, facility.sideName)];
        this.currentScenario.facilities.push(facility);
    }

    getSampleWeapon(quantity: number, lethality: number, sideName: string = this.currentSideName) {
        const weapon = new Weapon({
            id: uuidv4(), 
            name: 'Sample Weapon', 
            sideName: sideName, 
            className: 'Sample Weapon',
            latitude: 0.0,
            longitude: 0.0,
            altitude: 10000.0,
            heading: 90.0,
            speed: 150.0,
            fuel: 10000.0,
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

    weaponEndgame(weapon: Weapon, target: Aircraft | Facility): boolean {
        this.currentScenario.weapons = this.currentScenario.weapons.filter((currentScenarioWeapon) => currentScenarioWeapon.id !== weapon.id);
        if (randomFloat() <= weapon.lethality) {
            if (target instanceof Aircraft) {
                this.currentScenario.aircraft = this.currentScenario.aircraft.filter((currentScenarioAircraft) => currentScenarioAircraft.id !== target.id);
            } else if (target instanceof Facility) {
                this.currentScenario.facilities = this.currentScenario.facilities.filter((currentScenarioFacility) => currentScenarioFacility.id !== target.id)
            }
            return true
        }
        return false
    }

    launchWeapon(origin: Aircraft | Facility, target: Aircraft | Facility) {
        if (origin.weapons.length === 0) return

        const numberOfWaypoints = 5
        const weaponPrototype = origin.weapons[0]
        const newWeapon = new Weapon({
            id: uuidv4(), 
            name: weaponPrototype.name, 
            sideName: origin.sideName, 
            className: weaponPrototype.className,
            latitude: weaponPrototype.latitude,
            longitude: weaponPrototype.longitude,
            altitude: weaponPrototype.altitude,
            heading: getBearingBetweenTwoPoints(origin.latitude, origin.longitude, target.latitude, target.longitude),
            speed: weaponPrototype.speed,
            fuel: weaponPrototype.fuel,
            range: weaponPrototype.range,
            route: generateRoute(origin.latitude, origin.longitude, target.latitude, target.longitude, numberOfWaypoints),
            sideColor: this.currentScenario.getSideColor(weaponPrototype.sideName),
            targetId: target.id,
            lethality: weaponPrototype.lethality,
            maxQuantity: weaponPrototype.maxQuantity,
            currentQuantity: weaponPrototype.currentQuantity,
        });
        this.currentScenario.weapons.push(newWeapon);
        origin.weapons[0].currentQuantity -= 1
        if (origin.weapons[0].currentQuantity < 1) origin.weapons.shift()
    }

    weaponTrackTarget(weapon: Weapon) {
        const target = this.currentScenario.getAircraft(weapon.targetId) ?? this.currentScenario.getFacility(weapon.targetId);
        if (target) {
            const weaponRoute = weapon.route;
            if (weaponRoute.length > 0) {
                const nextWaypoint = weaponRoute[0];
                weapon.route = generateRoute(nextWaypoint[0], nextWaypoint[1], target.latitude, target.longitude, weaponRoute.length > 0 ? weaponRoute.length - 1 : 0);
                weapon.heading = getBearingBetweenTwoPoints(weapon.latitude, weapon.longitude, target.latitude, target.longitude);
            }
        } else {
            this.currentScenario.weapons = this.currentScenario.weapons.filter((currentScenarioWeapon) => currentScenarioWeapon.id !== weapon.id)
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
                fuel: aircraft.fuel,
                range: aircraft.range,
                route: aircraft.route,
                selected: aircraft.selected,
                sideColor: aircraft.sideColor,
                weapons: aircraft.weapons ?? [this.getSampleWeapon(10, 0.25, aircraft.sideName)],
            });
            loadedScenario.aircraft.push(newAircraft);
        });
        savedScenario.airbases.forEach((airbase: any) => {
            const airbaseAircraft: Aircraft[] = []
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
                    fuel: aircraft.fuel,
                    range: aircraft.range,
                    route: aircraft.route,
                    selected: aircraft.selected,
                    sideColor: aircraft.sideColor,
                    weapons: aircraft.weapons ?? [this.getSampleWeapon(10, 0.25, aircraft.sideName)],
                });
                airbaseAircraft.push(newAircraft);
            })
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
            const newFacility = new Facility(facility.id, facility.name, facility.sideName, facility.className);
            newFacility.latitude = facility.latitude;
            newFacility.longitude = facility.longitude;
            newFacility.sideColor = facility.sideColor;
            newFacility.weapons = facility.weapons ?? [this.getSampleWeapon(100, 0.1, facility.sideName)];
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
                        this.launchWeapon(facility, aircraft)
                    }
                }
            })
        })

        this.currentScenario.weapons.forEach((weapon) => {
            if (weapon.route.length === 2) {
                const target = this.currentScenario.getAircraft(weapon.targetId) ?? this.currentScenario.getFacility(weapon.targetId);
                if (target) this.weaponEndgame(weapon, target)
            } else {
                this.weaponTrackTarget(weapon)
            }

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
