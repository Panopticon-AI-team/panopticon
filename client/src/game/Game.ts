import { v4 as uuidv4 } from "uuid";

import Aircraft from "./Aircraft";
import Facility from "./Facility";
import Scenario from "./Scenario";

import { getBearingBetweenTwoPoints, getDistanceBetweenTwoPoints, getTerminalCoordinatesFromDistanceAndBearing } from "../utils/utils";
import Base from "./Base";

export default class Game {
    currentScenario: Scenario;
    currentSideName: string | undefined;

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
        const numberOfWaypoints = 20;
        const aircraft = this.currentScenario.getAircraft(aircraftId);
        if (aircraft) {
            aircraft.route = [];
            aircraft.heading = getBearingBetweenTwoPoints(aircraft.latitude, aircraft.longitude, newLatitude, newLongitude);
            const totalDistance = getDistanceBetweenTwoPoints(aircraft.latitude, aircraft.longitude, newLatitude, newLongitude);
            for (let waypointIndex = 0; waypointIndex < numberOfWaypoints; waypointIndex++) {
                const distance = totalDistance * (waypointIndex / numberOfWaypoints);
                const newWaypoint = getTerminalCoordinatesFromDistanceAndBearing(aircraft.latitude, aircraft.longitude, distance, aircraft.heading);
                aircraft.route.push(newWaypoint);
                // console.log(`Waypoint ${waypointIndex}: ${newWaypoint[0]}, ${newWaypoint[1]}`);
            }
            aircraft.latitude = newLatitude;
            aircraft.longitude = newLongitude;
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

}
