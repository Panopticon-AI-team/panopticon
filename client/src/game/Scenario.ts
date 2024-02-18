import Aircraft from "./units/Aircraft";
import Airbase from "./units/Airbase";
import Facility from "./units/Facility";
import Side from "./Side";
import Weapon from "./units/Weapon";

interface IScenario {
    id: string;
    name: string;
    startTime: number;
    currentTime?: number;
    duration: number;
    sides: Side[];
    timeCompression?: number;
    aircraft?: Aircraft[];
    facilities?: Facility[];
    airbases?: Airbase[];
    weapons?: Weapon[];
}

export default class Scenario {
    id: string;
    name: string;
    startTime: number;
    currentTime: number;
    duration: number;
    sides: Side[];
    timeCompression: number;
    aircraft: Aircraft[];
    facilities: Facility[];
    airbases: Airbase[]
    weapons: Weapon[]

    constructor(parameters: IScenario) {  
        this.id = parameters.id;
        this.name = parameters.name;
        this.startTime = parameters.startTime;
        this.currentTime = parameters.currentTime ?? parameters.startTime;
        this.duration = parameters.duration;
        this.sides = parameters.sides;
        this.timeCompression = parameters.timeCompression ?? 1;
        this.aircraft = parameters.aircraft ?? [];
        this.facilities = parameters.facilities ?? [];
        this.airbases = parameters.airbases ?? [];
        this.weapons = parameters.weapons ?? [];
    }

    getSide(sideName: string): Side | undefined {
        return this.sides.find((side) => side.name === sideName);
    }

    getSideColor(sideName: string): string {
        const side = this.getSide(sideName);
        if (side) {
            return side.sideColor;
        }
        return 'black';
    }

    getAircraft(aircraftId: string | null): Aircraft | undefined {
        return this.aircraft.find((aircraft) => aircraft.id === aircraftId);
    }

    getFacility(facilityId: string | null): Facility | undefined {
        return this.facilities.find((facility) => facility.id === facilityId);
    }

    getAirbase(airbaseId: string | null): Airbase | undefined {
        return this.airbases.find((airbase) => airbase.id === airbaseId);
    }

    getWeapon(weaponId: string | null): Weapon | undefined {
        return this.weapons.find((weapon) => weapon.id === weaponId);
    }

}