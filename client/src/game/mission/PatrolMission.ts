import { fromLonLat, get as getProjection } from "ol/proj";
import { DEFAULT_OL_PROJECTION_CODE } from "@/utils/constants";
import { BaseMission, IMission } from "@/game/mission/BaseMission";
import { Polygon } from "ol/geom";

interface IPatrolMission extends IMission {
  assignedArea: number[][];
}

export default class PatrolMission extends BaseMission {
  assignedArea: number[][];
  patrolAreaGeometry: Polygon;

  constructor(parameters: IPatrolMission) {
    super(parameters);
    this.assignedArea = parameters.assignedArea;
    const projection = getProjection(DEFAULT_OL_PROJECTION_CODE);
    this.patrolAreaGeometry = new Polygon([
      this.assignedArea.map((coordinates) =>
        fromLonLat([coordinates[1], coordinates[0]], projection!!)
      ),
    ]);
  }

  checkIfCoordinatesIsWithinPatrolArea(coordinates: number[]): boolean {
    const projection = getProjection(DEFAULT_OL_PROJECTION_CODE);
    return this.patrolAreaGeometry.intersectsCoordinate(
      fromLonLat([coordinates[1], coordinates[0]], projection!!)
    );
  }

  generateRandomCoordinatesWithinPatrolArea(): number[] {
    const randomCoordinates = [
      Math.random() * (this.assignedArea[2][0] - this.assignedArea[0][0]) +
        this.assignedArea[0][0],
      Math.random() * (this.assignedArea[1][1] - this.assignedArea[0][1]) +
        this.assignedArea[0][1],
    ];
    return randomCoordinates;
  }
}
