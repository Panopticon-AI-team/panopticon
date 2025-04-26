import { SIDE_COLOR } from "@/utils/colors";
import {
  Brightness1,
  DirectionsBoat,
  Flight,
  FlightTakeoff,
  Help,
  PinDrop,
  Radar,
  DoubleArrow,
} from "@mui/icons-material";

export interface IEntityIconProps {
  type: string;
  width?: number;
  height?: number;
  color?: SIDE_COLOR;
}

export default function EntityIcon({
  type,
  width = 24,
  height = 24,
  color = SIDE_COLOR.BLACK,
}: Readonly<IEntityIconProps>) {
  switch (type) {
    case "aircraft":
      return (
        <Flight
          sx={{
            width: width,
            height: height,
            color: color,
          }}
        />
      );
    case "airbase":
      return (
        <FlightTakeoff
          sx={{
            width: width,
            height: height,
            color: color,
          }}
        />
      );
    case "ship":
      return (
        <DirectionsBoat
          sx={{
            width: width,
            height: height,
            color: color,
          }}
        />
      );
    case "facility":
      return (
        <Radar
          sx={{
            width: width,
            height: height,
            color: color,
          }}
        />
      );
    case "referencePoint":
      return (
        <PinDrop
          sx={{
            width: width,
            height: height,
            color: color,
          }}
        />
      );
    case "weapon":
      return (
        <DoubleArrow
          sx={{
            width: width,
            height: height,
            color: color,
          }}
        />
      );
    case "circle":
      return (
        <Brightness1
          sx={{
            width: width,
            height: height,
            color: color,
          }}
        />
      );
    default:
      return (
        <Help
          sx={{
            width: width,
            height: height,
            color: color,
          }}
        />
      );
  }
}
