import SamIcon from "@/gui/assets/svg/radar_black_24dp.svg";
import AirbaseIcon from "@/gui/assets/svg/flight_takeoff_black_24dp.svg";
import AircraftIcon from "@/gui/assets/svg/flight_black_24dp.svg";
import ShipIcon from "@/gui/assets/svg/directions_boat_black_24dp.svg";
import PointMarkerIcon from "@/gui/assets/svg/pin_drop_24dp_E8EAED.svg";
import { ICON_COLOR, getColorFilter } from "@/utils/colors";

export interface IEntityIconProps {
  type: "aircraft" | "airbase" | "ship" | "facility" | "referencePoint";
  width?: number;
  height?: number;
  color?: string;
}

export default function EntityIcon({
  type,
  width = 24,
  height = 24,
  color = ICON_COLOR.BLACK,
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
  }
}
