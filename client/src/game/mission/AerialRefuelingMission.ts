import ReferencePoint from "@/game/units/ReferencePoint";

interface IAerialRefuelingMission {
  id: string;
  name: string;
  sideId: string;
  refuelingTrack: ReferencePoint[];
  assignedUnitIds: string[];
  active: boolean;
}

export default class AerialRefuelingMission {
  id: string;
  name: string;
  sideId: string;
  refuelingTrack: ReferencePoint[];
  assignedUnitIds: string[];
  active: boolean;

  constructor(parameters: IAerialRefuelingMission) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.sideId = parameters.sideId;
    this.refuelingTrack = parameters.refuelingTrack;
    this.assignedUnitIds = parameters.assignedUnitIds;
    this.active = parameters.active;
  }
}
