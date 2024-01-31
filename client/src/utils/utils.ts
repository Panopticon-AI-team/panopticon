import { EARTH_RADIUS } from "./constants";

// Converts from degrees to radians.
export function toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
function toDegrees(radians: number): number {
    return radians * 180 / Math.PI;
}

export function getBearingBetweenTwoPoints(startLat: number, startLng: number, destLat: number, destLng: number): number {
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);

    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    brng = (brng + 360) % 360;
    // console.log("Bearing: ", brng);
    return brng;
}

export function getDistanceBetweenTwoPoints(startLat: number, startLng: number, destLat: number, destLng: number) {
    const φ1 = toRadians(startLat); // φ, λ in radians
    const φ2 = toRadians(destLat);
    const Δφ = toRadians(destLat-startLat);
    const Δλ = toRadians(destLng-startLng);

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = EARTH_RADIUS * c; // in kilometres

    // console.log("Distance: ", d);
    return d;
}

export function getTerminalCoordinatesFromDistanceAndBearing(startLat: number, startLng: number, distance: number, bearing: number) {
    const bearing_rad = (bearing*Math.PI)/180;

    const init_lat = toRadians(startLat);
    const init_lon = toRadians(startLng);

    const final_lat = toDegrees(Math.asin( Math.sin(init_lat)*Math.cos(distance/EARTH_RADIUS) + Math.cos(init_lat)*Math.sin(distance/EARTH_RADIUS)*Math.cos(bearing_rad)));

    const final_lon = toDegrees(init_lon + Math.atan2(Math.sin(bearing_rad)*Math.sin(distance/EARTH_RADIUS)*Math.cos(init_lat), Math.cos(distance/EARTH_RADIUS)-Math.sin(init_lat)*Math.sin(final_lat)));

    return [final_lat, final_lon]; 
}

export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}