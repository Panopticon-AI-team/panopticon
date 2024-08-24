interface IStrikeMission {
  id: string;
  name: string;
  sideId: string;
  assignedUnitIds: string[];
  assignedTargetIds: string[];
  active: boolean;
}

export default class StrikeMission {
  id: string;
  name: string;
  sideId: string;
  assignedUnitIds: string[];
  assignedTargetIds: string[];
  active: boolean;

  constructor(parameters: IStrikeMission) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.sideId = parameters.sideId;
    this.assignedUnitIds = parameters.assignedUnitIds;
    this.assignedTargetIds = parameters.assignedTargetIds;
    this.active = parameters.active;
  }
}
