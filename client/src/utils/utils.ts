import { EARTH_RADIUS_KM } from "./constants";

export function toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
};

function toDegrees(radians: number): number {
    return radians * 180 / Math.PI;
}

export function getBearingBetweenTwoPoints(startLatitude: number, startLongitude: number, destinationLatitude: number, destinationLongitude: number): number {
    startLatitude = toRadians(startLatitude);
    startLongitude = toRadians(startLongitude);
    destinationLatitude = toRadians(destinationLatitude);
    destinationLongitude = toRadians(destinationLongitude);

    const y = Math.sin(destinationLongitude - startLongitude) * Math.cos(destinationLatitude);
    const x = Math.cos(startLatitude) * Math.sin(destinationLatitude) - Math.sin(startLatitude) * Math.cos(destinationLatitude) * Math.cos(destinationLongitude - startLongitude);
    const bearing = (toDegrees(Math.atan2(y, x)) + 360) % 360;

    return bearing;
}

export function getDistanceBetweenTwoPoints(startLatitude: number, startLongitude: number, destinationLatitude: number, destinationLongitude: number): number {
    const φ1 = toRadians(startLatitude);
    const φ2 = toRadians(destinationLatitude);
    const Δφ = toRadians(destinationLatitude-startLatitude);
    const Δλ = toRadians(destinationLongitude-startLongitude);

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = EARTH_RADIUS_KM * c; // in kilometres

    return d;
}

export function getTerminalCoordinatesFromDistanceAndBearing(startLatitude: number, startLongitude: number, distance: number, bearing: number): number[] {
    const bearingInRadians = toRadians(bearing);

    const initialLatitude = toRadians(startLatitude);
    const initialLongitude = toRadians(startLongitude);

    const finalLatitude = toDegrees(Math.asin(Math.sin(initialLatitude)*Math.cos(distance/EARTH_RADIUS_KM) + Math.cos(initialLatitude)*Math.sin(distance/EARTH_RADIUS_KM)*Math.cos(bearingInRadians)));

    const finalLongitude = toDegrees(initialLongitude + Math.atan2(Math.sin(bearingInRadians)*Math.sin(distance/EARTH_RADIUS_KM)*Math.cos(initialLatitude), Math.cos(distance/EARTH_RADIUS_KM)-Math.sin(initialLatitude)*Math.sin(finalLatitude)));

    return [finalLatitude, finalLongitude]; 
}

export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export function unixToLocalTime(unixTimestamp: number): string {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds
    const date = new Date(unixTimestamp * 1000);

    // Hours part from the timestamp
    const hours = date.getHours();

    // Minutes part from the timestamp
    const minutes = "0" + date.getMinutes();

    // Seconds part from the timestamp
    const seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    const formattedTime = hours + ':' + minutes.substring(minutes.length-2) + ':' + seconds.substring(seconds.length-2);

    return formattedTime;
}

export function colorNameToHex(color: string): string {
    const colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    const colorLowercase = color.toLocaleLowerCase()
    if (typeof colors[colorLowercase as keyof typeof colors] != 'undefined')
        return colors[colorLowercase as keyof typeof colors];

    return '';
}