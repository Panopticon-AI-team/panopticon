import { convertColorNameToSideColor, SIDE_COLOR } from "@/utils/colors";

interface IReferencePoint {
  id: string;
  name: string;
  sideId: string;
  latitude: number;
  longitude: number;
  altitude: number;
  sideColor?: string | SIDE_COLOR;
}

export default class ReferencePoint {
  id: string;
  name: string;
  sideId: string;
  latitude: number;
  longitude: number;
  altitude: number;
  sideColor: SIDE_COLOR;

  constructor(parameters: IReferencePoint) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.sideId = parameters.sideId;
    this.latitude = parameters.latitude;
    this.longitude = parameters.longitude;
    this.altitude = parameters.altitude;
    this.sideColor = convertColorNameToSideColor(parameters.sideColor);
  }
}
