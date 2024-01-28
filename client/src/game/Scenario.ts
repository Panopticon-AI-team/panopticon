import Aircraft from "./Aircraft";
import Base from "./Base";
import Facility from "./Facility";
import Side from "./Side";

export default class Scenario {
    id: string;
    name: string;
    startTime: number;
    duration: number;
    sides: Side[];
    timeCompression: number;
    aircraft: Aircraft[] = [];
    facilities: Facility[] = [];
    bases: Base[] = []

    constructor(id: string, name: string, startTime: number, duration: number, sides: Side[]) {  
        this.id = id;
        this.name = name;
        this.startTime = startTime;
        this.duration = duration;
        this.sides = sides;
        this.timeCompression = 1;
    }

    getSide(sideName: string): Side | undefined {
        return this.sides.find((side) => side.name === sideName);
    }

    getAircraft(aircraftId: string): Aircraft | undefined {
        return this.aircraft.find((aircraft) => aircraft.id === aircraftId);
    }

    getFacility(facilityId: string): Facility | undefined {
        return this.facilities.find((facility) => facility.id === facilityId);
    }

    getBase(baseId: string): Base | undefined {
        return this.bases.find((base) => base.id === baseId);
    }

}