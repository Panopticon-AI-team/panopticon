import SamIcon from "@/gui/assets/svg/radar_black_24dp.svg";
import AirbaseIcon from "@/gui/assets/svg/flight_takeoff_black_24dp.svg";
import AircraftIcon from "@/gui/assets/svg/flight_black_24dp.svg";
import ShipIcon from "@/gui/assets/svg/directions_boat_black_24dp.svg";
import PointMarkerIcon from "@/gui/assets/svg/pin_drop_24dp_E8EAED.svg";
import { ICON_COLOR } from "@/utils/constants";

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
  const getColorFilter = (color?: string): string => {
    switch (color) {
      case ICON_COLOR.RED:
        return "brightness(0) saturate(100%) invert(15%) sepia(86%) saturate(7141%) hue-rotate(0deg) brightness(103%) contrast(116%)";
      case ICON_COLOR.BLUE:
        return "brightness(0) saturate(100%) invert(32%) sepia(36%) saturate(5674%) hue-rotate(200deg) brightness(103%) contrast(106%)";
      case ICON_COLOR.GREEN:
        return "brightness(0) saturate(100%) invert(22%) sepia(92%) saturate(2194%) hue-rotate(103deg) brightness(97%) contrast(102%)";
      case ICON_COLOR.ORANGE:
        return "brightness(0) saturate(100%) invert(76%) sepia(49%) saturate(4923%) hue-rotate(0deg) brightness(104%) contrast(106%)";
      case ICON_COLOR.PURPLE:
        return "brightness(0) saturate(100%) invert(6%) sepia(84%) saturate(5964%) hue-rotate(295deg) brightness(129%) contrast(112%)";
      case ICON_COLOR.YELLOW:
        return "brightness(0) saturate(100%) invert(98%) sepia(95%) saturate(7483%) hue-rotate(359deg) brightness(101%) contrast(107%)";
      case ICON_COLOR.PINK:
        return "brightness(0) saturate(100%) invert(74%) sepia(35%) saturate(425%) hue-rotate(305deg) brightness(106%) contrast(105%)";
      case ICON_COLOR.TEAL:
        return "brightness(0) saturate(100%) invert(36%) sepia(13%) saturate(5522%) hue-rotate(144deg) brightness(95%) contrast(100%)";
      case ICON_COLOR.CYAN:
        return "brightness(0) saturate(100%) invert(91%) sepia(24%) saturate(3483%) hue-rotate(115deg) brightness(109%) contrast(102%)";
      case ICON_COLOR.LIME:
        return "brightness(0) saturate(100%) invert(64%) sepia(78%) saturate(3929%) hue-rotate(81deg) brightness(118%) contrast(122%)";
      case ICON_COLOR.BROWN:
        return "brightness(0) saturate(100%) invert(17%) sepia(81%) saturate(2369%) hue-rotate(350deg) brightness(101%) contrast(78%)";
      case ICON_COLOR.GRAY:
        return "brightness(0) saturate(100%) invert(49%) sepia(41%) saturate(0%) hue-rotate(183deg) brightness(95%) contrast(86%)";
      case ICON_COLOR.BLACK:
        return "brightness(0) saturate(100%) invert(0%) sepia(1%) saturate(7462%) hue-rotate(107deg) brightness(98%) contrast(96%)";
      case ICON_COLOR.WHITE:
        return "brightness(0) saturate(100%) invert(100%) sepia(93%) saturate(0%) hue-rotate(201deg) brightness(106%) contrast(106%)";
      case ICON_COLOR.MAGENTA:
        return "brightness(0) saturate(100%) invert(20%) sepia(100%) saturate(2324%) hue-rotate(286deg) brightness(115%) contrast(144%)";
      case ICON_COLOR.PLUM:
        return "brightness(0) saturate(100%) invert(94%) sepia(57%) saturate(2944%) hue-rotate(212deg) brightness(89%) contrast(95%)";
      case ICON_COLOR.LIGHT_GREEN:
        return "brightness(0) saturate(100%) invert(83%) sepia(11%) saturate(1492%) hue-rotate(68deg) brightness(101%) contrast(93%)";
      case ICON_COLOR.DARK_RED:
        return "brightness(0) saturate(100%) invert(7%) sepia(76%) saturate(5872%) hue-rotate(359deg) brightness(102%) contrast(111%)";
      case ICON_COLOR.DARK_BLUE:
        return "brightness(0) saturate(100%) invert(18%) sepia(26%) saturate(7462%) hue-rotate(231deg) brightness(70%) contrast(137%)";
      case ICON_COLOR.DARK_GREEN:
        return "brightness(0) saturate(100%) invert(18%) sepia(60%) saturate(3719%) hue-rotate(108deg) brightness(94%) contrast(105%)";
      case ICON_COLOR.GOLD:
        return "brightness(0) saturate(100%) invert(87%) sepia(12%) saturate(7489%) hue-rotate(360deg) brightness(104%) contrast(104%)";
      case ICON_COLOR.SILVER:
        return "brightness(0) saturate(100%) invert(84%) sepia(8%) saturate(15%) hue-rotate(41deg) brightness(89%) contrast(96%)";
      case ICON_COLOR.NAVY:
        return "brightness(0) saturate(100%) invert(6%) sepia(81%) saturate(6977%) hue-rotate(244deg) brightness(87%) contrast(122%)";
      case ICON_COLOR.MAROON:
        return "brightness(0) saturate(100%) invert(12%) sepia(52%) saturate(4699%) hue-rotate(351deg) brightness(93%) contrast(115%)";
      case ICON_COLOR.OLIVE:
        return "brightness(0) saturate(100%) invert(37%) sepia(97%) saturate(783%) hue-rotate(33deg) brightness(96%) contrast(100%)";
      case ICON_COLOR.CORAL:
        return "brightness(0) saturate(100%) invert(74%) sepia(28%) saturate(7083%) hue-rotate(326deg) brightness(103%) contrast(101%)";
      case ICON_COLOR.TURQUOISE:
        return "brightness(0) saturate(100%) invert(78%) sepia(14%) saturate(1631%) hue-rotate(122deg) brightness(95%) contrast(97%)";
      case ICON_COLOR.INDIGO:
        return "brightness(0) saturate(100%) invert(16%) sepia(37%) saturate(5121%) hue-rotate(264deg) brightness(84%) contrast(130%)";
      case ICON_COLOR.BEIGE:
        return "brightness(0) saturate(100%) invert(92%) sepia(3%) saturate(3465%) hue-rotate(334deg) brightness(122%) contrast(92%)";
      case ICON_COLOR.SALMON:
        return "brightness(0) saturate(100%) invert(86%) sepia(31%) saturate(7160%) hue-rotate(312deg) brightness(99%) contrast(98%)";
      case ICON_COLOR.SKY_BLUE:
        return "brightness(0) saturate(100%) invert(80%) sepia(79%) saturate(3004%) hue-rotate(174deg) brightness(97%) contrast(90%)";
      case ICON_COLOR.AQUAMARINE:
        return "brightness(0) saturate(100%) invert(85%) sepia(38%) saturate(470%) hue-rotate(95deg) brightness(101%) contrast(101%)";
      default:
        return "brightness(0) saturate(100%) invert(0%) sepia(1%) saturate(7462%) hue-rotate(107deg) brightness(98%) contrast(96%)";
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
