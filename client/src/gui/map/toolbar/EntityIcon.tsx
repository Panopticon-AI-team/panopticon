import SamIcon from "@/gui/assets/svg/radar_black_24dp.svg";
import AirbaseIcon from "@/gui/assets/svg/flight_takeoff_black_24dp.svg";
import AircraftIcon from "@/gui/assets/svg/flight_black_24dp.svg";
import ShipIcon from "@/gui/assets/svg/directions_boat_black_24dp.svg";
import PointMarkerIcon from "@/gui/assets/svg/pin_drop_24dp_E8EAED.svg";

export interface IEntityIconProps {
  type: "aircraft" | "airbase" | "ship" | "facility" | "referencePoint";
  width?: number;
  height?: number;
  sideColor?: "blue" | "red";
  defaultColor?: "white" | "black";
}

export default function EntityIcon({
  type,
  width = 24,
  height = 24,
  sideColor,
  defaultColor = "black",
}: Readonly<IEntityIconProps>) {
  const getColorFilter = (color?: "blue" | "red") => {
    switch (color) {
      case "blue":
        return "invert(70%) sepia(69%) saturate(4532%) hue-rotate(220deg)";
      case "red":
        return "invert(70%) sepia(91%) saturate(2552%) hue-rotate(0deg)";
      default:
        return defaultColor === "white"
          ? "brightness(100%) contrast(100%)"
          : "brightness(0) contrast(100%)";
    }
  };

  switch (type) {
    case "aircraft":
      return (
        <img
          src={AircraftIcon}
          alt="Aircraft Unit Icon"
          width={width}
          height={height}
          style={{ filter: getColorFilter(sideColor) }}
        />
      );
    case "airbase":
      return (
        <img
          src={AirbaseIcon}
          alt="Airebase Unit Icon"
          width={width}
          height={height}
          style={{ filter: getColorFilter(sideColor) }}
        />
      );
    case "ship":
      return (
        <img
          src={ShipIcon}
          alt="Ship Unit Icon"
          width={width}
          height={height}
          style={{ filter: getColorFilter(sideColor) }}
        />
      );
    case "facility":
      return (
        <img
          src={SamIcon}
          alt="Sam Unit Icon"
          width={width}
          height={height}
          style={{ filter: getColorFilter(sideColor) }}
        />
      );
    case "referencePoint":
      return (
        <img
          src={PointMarkerIcon}
          alt="Reference Point Unit Icon"
          width={width}
          height={height}
          style={{ filter: getColorFilter(sideColor) }}
        />
      );
  }
}
