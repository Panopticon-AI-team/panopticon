import { v4 as uuidv4 } from "uuid";

import Aircraft from "./Aircraft";
import Facility from "./Facility";
import Scenario from "./Scenario";

import { getBearingBetweenTwoPoints, getDistanceBetweenTwoPoints, getTerminalCoordinatesFromDistanceAndBearing } from "../utils/utils";
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
        aircraft.sideColor = this.currentScenario.getSideColor(this.currentSideName);

        this.currentScenario.aircraft.push(aircraft);
    }

    addBase(baseName: string, className: string, latitude: number, longitude: number) {
        if (!this.currentSideName) {
            return;
        }
        const base = new Base(uuidv4(), baseName, this.currentSideName, className);
        base.latitude = latitude;
        base.longitude = longitude;
        base.sideColor = this.currentScenario.getSideColor(this.currentSideName);

        this.currentScenario.bases.push(base);
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
        const numberOfWaypoints = 100;
        const aircraft = this.currentScenario.getAircraft(aircraftId);
        if (aircraft) {
            aircraft.route = [[aircraft.latitude, aircraft.longitude]];
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

    _get_observation(): Scenario {
        return this.currentScenario;
    }

    _get_info() {
        return null;
    }

    step(): [Scenario, number, boolean, boolean, any] {
        this.currentScenario.currentTime += 1;
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
        const observation = this._get_observation();
        const info = this._get_info();
        return [observation, reward, terminated, truncated, info];
    }

    reset() {

    }

    checkGameEnded(): boolean {
        return false;
    }
}
