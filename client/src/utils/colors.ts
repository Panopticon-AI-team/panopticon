import { asArray } from "ol/color";

export enum COLOR_PALETTE {
  LIGHT_GRAY = "#E8E8E8",
  DARK_GRAY = "#9B9B9B",
  BLACK = "#000000",
  WHITE = "#F2F2F2",
}
export enum SIDE_COLOR {
  BLACK = "black",
  WHITE = "white",
  GRAY = "gray",
  SILVER = "silver",
  BEIGE = "beige",
  BROWN = "brown",
  MAROON = "maroon",
  RED = "red",
  DARK_RED = "darkred",
  CORAL = "coral",
  SALMON = "salmon",
  ORANGE = "orange",
  GOLD = "gold",
  YELLOW = "yellow",
  OLIVE = "olive",
  LIME = "lime",
  LIGHT_GREEN = "lightgreen",
  GREEN = "green",
  DARK_GREEN = "darkgreen",
  AQUAMARINE = "aquamarine",
  TEAL = "teal",
  TURQUOISE = "turquoise",
  CYAN = "cyan",
  SKY_BLUE = "skyblue",
  BLUE = "blue",
  DARK_BLUE = "darkblue",
  NAVY = "navy",
  INDIGO = "indigo",
  PURPLE = "purple",
  PLUM = "plum",
  MAGENTA = "magenta",
  PINK = "pink",
}

export function convertColorNameToSideColor(
  color: string | null | undefined,
  returnIfError: SIDE_COLOR = SIDE_COLOR.BLACK
): SIDE_COLOR {
  if (!color) return returnIfError;
  const colorKey = color.toUpperCase() as keyof typeof SIDE_COLOR;
  if (colorKey in SIDE_COLOR) {
    return SIDE_COLOR[colorKey];
  }
  return returnIfError;
}

export function colorNameToHex(color: string): string {
  const colors = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgrey: "#d3d3d3",
    lightgreen: "#90ee90",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370d8",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#d87093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32",
  };

  const colorLowercase = color.toLocaleLowerCase();
  if (typeof colors[colorLowercase as keyof typeof colors] != "undefined")
    return colors[colorLowercase as keyof typeof colors];

  return "#000000";
}

export function colorNameToColorArray(
  color: string,
  alpha: number = 1
): number[] | undefined {
  const colorHexCode = colorNameToHex(color);
  if (colorHexCode) {
    let colorArray;
    colorArray = asArray(colorHexCode);
    colorArray = colorArray.slice();
    colorArray[3] = Math.min(Math.max(alpha, 0), 1);
    return colorArray;
  }
}

export const getColorFilter = (color?: string): string => {
  switch (color) {
    case SIDE_COLOR.RED:
      return "brightness(0) saturate(100%) invert(15%) sepia(86%) saturate(7141%) hue-rotate(0deg) brightness(103%) contrast(116%)";
    case SIDE_COLOR.BLUE:
      return "brightness(0) saturate(100%) invert(32%) sepia(36%) saturate(5674%) hue-rotate(200deg) brightness(103%) contrast(106%)";
    case SIDE_COLOR.GREEN:
      return "brightness(0) saturate(100%) invert(22%) sepia(92%) saturate(2194%) hue-rotate(103deg) brightness(97%) contrast(102%)";
    case SIDE_COLOR.ORANGE:
      return "brightness(0) saturate(100%) invert(76%) sepia(49%) saturate(4923%) hue-rotate(0deg) brightness(104%) contrast(106%)";
    case SIDE_COLOR.PURPLE:
      return "brightness(0) saturate(100%) invert(6%) sepia(84%) saturate(5964%) hue-rotate(295deg) brightness(129%) contrast(112%)";
    case SIDE_COLOR.YELLOW:
      return "brightness(0) saturate(100%) invert(98%) sepia(95%) saturate(7483%) hue-rotate(359deg) brightness(101%) contrast(107%)";
    case SIDE_COLOR.PINK:
      return "brightness(0) saturate(100%) invert(74%) sepia(35%) saturate(425%) hue-rotate(305deg) brightness(106%) contrast(105%)";
    case SIDE_COLOR.TEAL:
      return "brightness(0) saturate(100%) invert(36%) sepia(13%) saturate(5522%) hue-rotate(144deg) brightness(95%) contrast(100%)";
    case SIDE_COLOR.CYAN:
      return "brightness(0) saturate(100%) invert(91%) sepia(24%) saturate(3483%) hue-rotate(115deg) brightness(109%) contrast(102%)";
    case SIDE_COLOR.LIME:
      return "brightness(0) saturate(100%) invert(64%) sepia(78%) saturate(3929%) hue-rotate(81deg) brightness(118%) contrast(122%)";
    case SIDE_COLOR.BROWN:
      return "brightness(0) saturate(100%) invert(17%) sepia(81%) saturate(2369%) hue-rotate(350deg) brightness(101%) contrast(78%)";
    case SIDE_COLOR.GRAY:
      return "brightness(0) saturate(100%) invert(49%) sepia(41%) saturate(0%) hue-rotate(183deg) brightness(95%) contrast(86%)";
    case SIDE_COLOR.BLACK:
      return "brightness(0) saturate(100%) invert(0%) sepia(1%) saturate(7462%) hue-rotate(107deg) brightness(98%) contrast(96%)";
    case SIDE_COLOR.WHITE:
      return "brightness(0) saturate(100%) invert(100%) sepia(93%) saturate(0%) hue-rotate(201deg) brightness(106%) contrast(106%)";
    case SIDE_COLOR.MAGENTA:
      return "brightness(0) saturate(100%) invert(20%) sepia(100%) saturate(2324%) hue-rotate(286deg) brightness(115%) contrast(144%)";
    case SIDE_COLOR.PLUM:
      return "brightness(0) saturate(100%) invert(94%) sepia(57%) saturate(2944%) hue-rotate(212deg) brightness(89%) contrast(95%)";
    case SIDE_COLOR.LIGHT_GREEN:
      return "brightness(0) saturate(100%) invert(83%) sepia(11%) saturate(1492%) hue-rotate(68deg) brightness(101%) contrast(93%)";
    case SIDE_COLOR.DARK_RED:
      return "brightness(0) saturate(100%) invert(7%) sepia(76%) saturate(5872%) hue-rotate(359deg) brightness(102%) contrast(111%)";
    case SIDE_COLOR.DARK_BLUE:
      return "brightness(0) saturate(100%) invert(18%) sepia(26%) saturate(7462%) hue-rotate(231deg) brightness(70%) contrast(137%)";
    case SIDE_COLOR.DARK_GREEN:
      return "brightness(0) saturate(100%) invert(18%) sepia(60%) saturate(3719%) hue-rotate(108deg) brightness(94%) contrast(105%)";
    case SIDE_COLOR.GOLD:
      return "brightness(0) saturate(100%) invert(87%) sepia(12%) saturate(7489%) hue-rotate(360deg) brightness(104%) contrast(104%)";
    case SIDE_COLOR.SILVER:
      return "brightness(0) saturate(100%) invert(84%) sepia(8%) saturate(15%) hue-rotate(41deg) brightness(89%) contrast(96%)";
    case SIDE_COLOR.NAVY:
      return "brightness(0) saturate(100%) invert(6%) sepia(81%) saturate(6977%) hue-rotate(244deg) brightness(87%) contrast(122%)";
    case SIDE_COLOR.MAROON:
      return "brightness(0) saturate(100%) invert(12%) sepia(52%) saturate(4699%) hue-rotate(351deg) brightness(93%) contrast(115%)";
    case SIDE_COLOR.OLIVE:
      return "brightness(0) saturate(100%) invert(37%) sepia(97%) saturate(783%) hue-rotate(33deg) brightness(96%) contrast(100%)";
    case SIDE_COLOR.CORAL:
      return "brightness(0) saturate(100%) invert(74%) sepia(28%) saturate(7083%) hue-rotate(326deg) brightness(103%) contrast(101%)";
    case SIDE_COLOR.TURQUOISE:
      return "brightness(0) saturate(100%) invert(78%) sepia(14%) saturate(1631%) hue-rotate(122deg) brightness(95%) contrast(97%)";
    case SIDE_COLOR.INDIGO:
      return "brightness(0) saturate(100%) invert(16%) sepia(37%) saturate(5121%) hue-rotate(264deg) brightness(84%) contrast(130%)";
    case SIDE_COLOR.BEIGE:
      return "brightness(0) saturate(100%) invert(92%) sepia(3%) saturate(3465%) hue-rotate(334deg) brightness(122%) contrast(92%)";
    case SIDE_COLOR.SALMON:
      return "brightness(0) saturate(100%) invert(86%) sepia(31%) saturate(7160%) hue-rotate(312deg) brightness(99%) contrast(98%)";
    case SIDE_COLOR.SKY_BLUE:
      return "brightness(0) saturate(100%) invert(80%) sepia(79%) saturate(3004%) hue-rotate(174deg) brightness(97%) contrast(90%)";
    case SIDE_COLOR.AQUAMARINE:
      return "brightness(0) saturate(100%) invert(85%) sepia(38%) saturate(470%) hue-rotate(95deg) brightness(101%) contrast(101%)";
    default:
      return "brightness(0) saturate(100%) invert(0%) sepia(1%) saturate(7462%) hue-rotate(107deg) brightness(98%) contrast(96%)";
  }
};

export const SELECTED_ICON_COLOR_FILTER = getColorFilter(SIDE_COLOR.GREEN);
export const DEFAULT_ICON_COLOR_FILTER = getColorFilter(SIDE_COLOR.BLACK);
