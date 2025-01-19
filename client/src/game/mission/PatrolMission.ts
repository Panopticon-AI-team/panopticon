import { fromLonLat, get as getProjection } from "ol/proj";
import { DEFAULT_OL_PROJECTION_CODE } from "@/utils/constants";
import { Polygon } from "ol/geom";

interface IPatrolMission {
  id: string;
  name: string;
  sideId: string;
  assignedUnitIds: string[];
  assignedArea: number[][];
  active: boolean;
}

export default class PatrolMission {
  id: string;
  name: string;
  sideId: string;
  assignedUnitIds: string[];
  assignedArea: number[][];
  active: boolean;
  patrolAreaGeometry: Polygon;

  constructor(parameters: IPatrolMission) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.sideId = parameters.sideId;
    this.assignedUnitIds = parameters.assignedUnitIds;
    this.assignedArea = parameters.assignedArea;
    this.active = parameters.active;
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
