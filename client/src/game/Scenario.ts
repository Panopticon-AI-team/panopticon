import Aircraft from "./units/Aircraft";
import Airbase from "./units/Airbase";
import Facility from "./units/Facility";
import Side from "./Side";
import Weapon from "./units/Weapon";

export default class Scenario {
    id: string;
    name: string;
    startTime: number;
    currentTime: number;
    duration: number;
    sides: Side[];
    timeCompression: number;
    aircraft: Aircraft[] = [];
    facilities: Facility[] = [];
    airbases: Airbase[] = []
    weapons: Weapon[] = []

    constructor(id: string, name: string, startTime: number, duration: number, sides: Side[]) {  
        this.id = id;
        this.name = name;
        this.startTime = startTime;
        this.currentTime = startTime;
        this.duration = duration;
        this.sides = sides;
        this.timeCompression = 1;
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