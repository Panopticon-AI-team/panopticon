import { convertColorNameToSideColor, SIDE_COLOR } from "@/utils/colors";

interface ISide {
  id: string;
  name: string;
  totalScore?: number;
  color?: string | SIDE_COLOR;
}

export default class Side {
  id: string;
  name: string;
  totalScore: number;
  color: SIDE_COLOR;

  constructor(parameters: ISide) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.totalScore = parameters.totalScore ?? 0;
    this.color = convertColorNameToSideColor(parameters.color);
  }
}
