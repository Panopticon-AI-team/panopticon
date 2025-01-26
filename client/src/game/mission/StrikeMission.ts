import { IMission, BaseMission } from "@/game/mission/BaseMission";

interface IStrikeMission extends IMission {
  assignedTargetIds: string[];
}

export default class StrikeMission extends BaseMission {
  assignedTargetIds: string[];

  constructor(parameters: IStrikeMission) {
    super(parameters);
    this.assignedTargetIds = parameters.assignedTargetIds;
  }
}
