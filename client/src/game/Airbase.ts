import Aircraft from "./Aircraft";

export default class Airbase {
    id: string;
    name: string;
    sideName: string;
    className: string;
    latitude: number = 0.0;
    longitude: number = 0.0;
    altitude: number = 0.0; // FT ASL -- currently default -- need to reference from database
    sideColor: string = 'black';
    aircraft: Aircraft[] = [];

    constructor(id: string, name: string, sideName: string, className: string) {
        this.id = id;
        this.name = name;
        this.sideName = sideName;
        this.className = className;
    }

}