export default class Side {
    id: string;
    name: string;
    totalScore: number = 0;
    sideColor: string = 'black';

    constructor(id: string, name: string) {  
        this.id = id;
        this.name = name;
    }

}