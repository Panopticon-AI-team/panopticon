import { DEFAULT_SIDE_COLOR } from "../../utils/constants";

interface IReferencePoint {
  id: string;
  name: string;
  sideName: string;
  latitude: number;
  longitude: number;
  altitude: number;
  sideColor?: string;
}

export default class ReferencePoint {
  id: string;
  name: string;
  sideName: string;
  latitude: number;
  longitude: number;
  altitude: number;
  sideColor: string;

  constructor(parameters: IReferencePoint) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.sideName = parameters.sideName;
    this.latitude = parameters.latitude;
    this.longitude = parameters.longitude;
    this.altitude = parameters.altitude;
    this.sideColor = parameters.sideColor ?? DEFAULT_SIDE_COLOR;
  }
}
