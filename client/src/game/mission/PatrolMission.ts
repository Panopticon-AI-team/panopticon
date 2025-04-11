import { fromLonLat, get as getProjection } from "ol/proj";
import { DEFAULT_OL_PROJECTION_CODE } from "@/utils/constants";
import { Polygon } from "ol/geom";
import ReferencePoint from "@/game/units/ReferencePoint";

interface IPatrolMission {
  id: string;
  name: string;
  sideId: string;
  assignedUnitIds: string[];
  assignedArea: ReferencePoint[];
  active: boolean;
}

export default class PatrolMission {
  id: string;
  name: string;
  sideId: string;
  assignedUnitIds: string[];
  assignedArea: ReferencePoint[];
  active: boolean;
  patrolAreaGeometry: Polygon;

  constructor(parameters: IPatrolMission) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.sideId = parameters.sideId;
    this.assignedUnitIds = parameters.assignedUnitIds;
    this.assignedArea = parameters.assignedArea;
    this.active = parameters.active;
    this.patrolAreaGeometry = this.createPatrolAreaGeometry(
      parameters.assignedArea
    );
  }

  updatePatrolAreaGeometry(): void {
    this.patrolAreaGeometry = this.createPatrolAreaGeometry(this.assignedArea);
  }

  createPatrolAreaGeometry(area: ReferencePoint[]): Polygon {
    const projection = getProjection(DEFAULT_OL_PROJECTION_CODE);
    return new Polygon([
      area.map((point) =>
        fromLonLat([point.longitude, point.latitude], projection!!)
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
      Math.random() *
        (this.assignedArea[2].latitude - this.assignedArea[0].latitude) +
        this.assignedArea[0].latitude,
      Math.random() *
        (this.assignedArea[1].longitude - this.assignedArea[0].longitude) +
        this.assignedArea[0].longitude,
    ];
    return randomCoordinates;
  }
}
