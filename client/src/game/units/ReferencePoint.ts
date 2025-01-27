import { BaseUnit, IUnit } from "@/game/units/BaseUnit";

interface IReferencePoint extends IUnit {}

export default class ReferencePoint extends BaseUnit {
  constructor(parameters: IReferencePoint) {
    super(parameters);
  }
}
