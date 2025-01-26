import Aircraft from "@/game/units/Aircraft";
import { BaseUnit, IUnit } from "@/game/units/BaseUnit";

interface IAirbase extends IUnit {
  className: string;
  aircraft?: Aircraft[];
}

export default class Airbase extends BaseUnit {
  className: string;
  aircraft: Aircraft[];

  constructor(parameters: IAirbase) {
    super(parameters);
    this.className = parameters.className;
    this.aircraft = parameters.aircraft ?? [];
  }
}
