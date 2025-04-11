import SamIcon from "@/gui/assets/svg/radar_black_24dp.svg";
import AirbaseIcon from "@/gui/assets/svg/flight_takeoff_black_24dp.svg";
import AircraftIcon from "@/gui/assets/svg/flight_black_24dp.svg";
import ShipIcon from "@/gui/assets/svg/directions_boat_black_24dp.svg";
import PointMarkerIcon from "@/gui/assets/svg/pin_drop_24dp_E8EAED.svg";
import CircleIcon from "@/gui/assets/svg/brightness_1_24dp_E3E3E3.svg";
import HelpIcon from "@/gui/assets/svg/help_24dp_E3E3E3.svg";
import { SIDE_COLOR, getColorFilter } from "@/utils/colors";

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
        <img
          src={AircraftIcon}
          alt="Aircraft Unit Icon"
          width={width}
          height={height}
          style={{ filter: getColorFilter(color) }}
        />
      );
    case "airbase":
      return (
        <img
          src={AirbaseIcon}
          alt="Airebase Unit Icon"
          width={width}
          height={height}
          style={{ filter: getColorFilter(color) }}
        />
      );
    case "ship":
      return (
        <img
          src={ShipIcon}
          alt="Ship Unit Icon"
          width={width}
          height={height}
          style={{ filter: getColorFilter(color) }}
        />
      );
    case "facility":
      return (
        <img
          src={SamIcon}
          alt="Sam Unit Icon"
          width={width}
          height={height}
          style={{ filter: getColorFilter(color) }}
        />
      );
    case "referencePoint":
      return (
        <img
          src={PointMarkerIcon}
          alt="Reference Point Unit Icon"
          width={width}
          height={height}
          style={{ filter: getColorFilter(color) }}
        />
      );
    case "circle":
      return (
        <img
          src={CircleIcon}
          alt="Unknown Icon"
          width={width}
          height={height}
          style={{ filter: getColorFilter(color) }}
        />
      );
    default:
      return (
        <img
          src={HelpIcon}
          alt="Unknown Icon"
          width={width}
          height={height}
          style={{ filter: getColorFilter(color) }}
        />
      );
  }
}
