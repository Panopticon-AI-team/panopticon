import ReferencePoint from "@/game/units/ReferencePoint";

interface IAerialRefuelingMission {
  id: string;
  name: string;
  sideId: string;
  assignedArea: ReferencePoint[];
  assignedUnitIds: string[];
  active: boolean;
}

export default class AerialRefuelingMission {
  id: string;
  name: string;
  sideId: string;
  assignedArea: ReferencePoint[];
  assignedUnitIds: string[];
  active: boolean;

  constructor(parameters: IAerialRefuelingMission) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.sideId = parameters.sideId;
    this.assignedArea = parameters.assignedArea;
    this.assignedUnitIds = parameters.assignedUnitIds;
    this.active = parameters.active;
  }
}
