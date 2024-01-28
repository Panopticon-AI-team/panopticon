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
    return (brng + 360) % 360;
}

export function getDistanceBetweenTwoPoints(lat1: number, lon1: number, lat2: number, lon2: number) {
    return Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1))*6371
}

export function getTerminalCoordinatesFromDistanceAndBearing(startLat: number, startLng: number, distance: number, bearing: number) {
    const bearing_rad = (bearing*Math.PI)/180;

    const EARTH_RADIUS = 6378.137;

    const init_lat = toRadians(startLat);
    const init_lon = toRadians(startLng);

    const final_lat = toDegrees(Math.asin( Math.sin(init_lat)*Math.cos(distance/EARTH_RADIUS) + Math.cos(init_lat)*Math.sin(distance/EARTH_RADIUS)*Math.cos(bearing_rad)));

    const final_lon = toDegrees(init_lon + Math.atan2(Math.sin(bearing_rad)*Math.sin(distance/EARTH_RADIUS)*Math.cos(init_lat), Math.cos(distance/EARTH_RADIUS)-Math.sin(init_lat)*Math.sin(final_lat)));

    return [final_lat, final_lon]; 
}

export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}