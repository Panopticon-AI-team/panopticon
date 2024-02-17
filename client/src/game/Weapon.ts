export default class Weapon {
    id: string;
    name: string;
    sideName: string;
    className: string;
    latitude: number = 0.0;
    longitude: number = 0.0;
    altitude: number = 10000.0; // FT ASL -- currently default -- need to reference from database
    heading: number = 90.0;
    speed: number = 150.0; // KTS -- currently default -- need to reference from database
    fuel: number = 0.0;
    range: number = 100; // NM -- currently default -- need to reference from database
    route: number[][] = [];
    sideColor: string = 'black';
    targetId: string = '';
    lethality: number = 0.0; // currently default -- need to reference from database

    constructor(id: string, name: string, sideName: string, className: string) {
        this.id = id;
        this.name = name;
        this.sideName = sideName;
        this.className = className;
    }

}