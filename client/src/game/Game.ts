import { v4 as uuidv4 } from "uuid";

import Aircraft from "./Aircraft";
import Facility from "./Facility";
import Scenario from "./Scenario";

import { getBearingBetweenTwoPoints, getDistanceBetweenTwoPoints, getTerminalCoordinatesFromDistanceAndBearing, delay } from "../utils/utils";
import Base from "./Base";

export default class Game {
    currentScenario: Scenario;
    currentSideName: string | undefined;
    scenarioPaused: boolean = true;
    addingAircraft: boolean = false;
    addingBase: boolean = false;
    addingFacility: boolean = false;
    selectedUnitId: string = '';

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

        this.currentScenario.aircraft.push(aircraft);
    }

    moveAircraft(aircraftId: string, newLatitude: number, newLongitude: number) {
        const numberOfWaypoints = 100;
        const aircraft = this.currentScenario.getAircraft(aircraftId);
        if (aircraft) {
            aircraft.route = [];
            aircraft.route.push([aircraft.latitude, aircraft.longitude]);
            aircraft.heading = getBearingBetweenTwoPoints(aircraft.latitude, aircraft.longitude, newLatitude, newLongitude);
            const totalDistance = getDistanceBetweenTwoPoints(aircraft.latitude, aircraft.longitude, newLatitude, newLongitude);
            const legDistance = totalDistance / numberOfWaypoints;

            for (let waypointIndex = 1; waypointIndex < numberOfWaypoints; waypointIndex++) {
                const newWaypoint = getTerminalCoordinatesFromDistanceAndBearing(aircraft.route[waypointIndex - 1][0], aircraft.route[waypointIndex - 1][1], legDistance, aircraft.heading);
                aircraft.route.push(newWaypoint);
            }

            aircraft.route.push([newLatitude, newLongitude]);
        }
    }

    addFacility(facilityName: string, className: string, latitude: number, longitude: number) {
        if (!this.currentSideName) {
            return;
        }
        const facility = new Facility(uuidv4(), facilityName, this.currentSideName, className);
        facility.latitude = latitude;
        facility.longitude = longitude;

        this.currentScenario.facilities.push(facility);
    }

    addBase(baseName: string, className: string, latitude: number, longitude: number) {
        if (!this.currentSideName) {
            return;
        }
        const base = new Base(uuidv4(), baseName, this.currentSideName, className);
        base.latitude = latitude;
        base.longitude = longitude;

        this.currentScenario.bases.push(base);
    }

    async startScenario(callbackFunction1: () => void, callbackFunction2: () => void) {
        while (!this.scenarioPaused) {
            this.currentScenario.currentTime += 1;
            this.currentScenario.aircraft.forEach((aircraft) => {
                const route = aircraft.route;
                if (route.length > 0) {
                    const nextWaypoint = route[0];
                    aircraft.latitude = nextWaypoint[0];
                    aircraft.longitude = nextWaypoint[1];
                    aircraft.route.shift();
                }
                console.log(route.length)
            });
            callbackFunction1();
            callbackFunction2();
            await delay(1000);
        }
    }

    pauseScenario() {
        this.scenarioPaused = true;
    }
}
