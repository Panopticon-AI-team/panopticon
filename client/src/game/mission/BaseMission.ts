import PatrolMission from "@/game/mission/PatrolMission";
import StrikeMission from "@/game/mission/StrikeMission";

export interface IMission {
  id: string;
  name: string;
  sideId: string;
  active: boolean;
  assignedUnitIds: string[];
}

export type Mission = PatrolMission | StrikeMission;

export abstract class BaseMission {
  id: string;
  name: string;
  sideId: string;
  active: boolean;
  assignedUnitIds: string[];

  constructor(parameters: IMission) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.sideId = parameters.sideId;
    this.active = parameters.active;
    this.assignedUnitIds = parameters.assignedUnitIds;
  }
}
