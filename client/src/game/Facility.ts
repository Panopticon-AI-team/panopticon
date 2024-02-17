export default class Facility {
    id: string;
    name: string;
    sideName: string;
    className: string;
    latitude: number = 0.0;
    longitude: number = 0.0;
    altitude: number = 0.0; // FT ASL -- currently default -- need to reference from database
    range: number = 250; // NM -- currently default -- need to reference from database
    sideColor: string = 'black';

    constructor(id: string, name: string, sideName: string, className: string) {
        this.id = id;
        this.name = name;
        this.sideName = sideName;
        this.className = className;
    }

}