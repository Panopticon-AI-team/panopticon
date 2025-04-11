import { asArray } from "ol/color";
import {
  EARTH_RADIUS_KM,
  KILOMETERS_TO_NAUTICAL_MILES,
} from "@/utils/constants";

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function getBearingBetweenTwoPoints(
  startLatitude: number,
  startLongitude: number,
  destinationLatitude: number,
  destinationLongitude: number
): number {
  startLatitude = toRadians(startLatitude);
  startLongitude = toRadians(startLongitude);
  destinationLatitude = toRadians(destinationLatitude);
  destinationLongitude = toRadians(destinationLongitude);

  const y =
    Math.sin(destinationLongitude - startLongitude) *
    Math.cos(destinationLatitude);
  const x =
    Math.cos(startLatitude) * Math.sin(destinationLatitude) -
    Math.sin(startLatitude) *
      Math.cos(destinationLatitude) *
      Math.cos(destinationLongitude - startLongitude);
  const bearing = (toDegrees(Math.atan2(y, x)) + 360) % 360;

  return bearing;
}

export function getDistanceBetweenTwoPoints(
  startLatitude: number,
  startLongitude: number,
  destinationLatitude: number,
  destinationLongitude: number
): number {
  const φ1 = toRadians(startLatitude);
  const φ2 = toRadians(destinationLatitude);
  const Δφ = toRadians(destinationLatitude - startLatitude);
  const Δλ = toRadians(destinationLongitude - startLongitude);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = EARTH_RADIUS_KM * c; // in kilometres

  return d;
}

export function getTerminalCoordinatesFromDistanceAndBearing(
  startLatitude: number,
  startLongitude: number,
  distance: number,
  bearing: number
): number[] {
  const bearingInRadians = toRadians(bearing);

  const initialLatitude = toRadians(startLatitude);
  const initialLongitude = toRadians(startLongitude);

  const finalLatitude = toDegrees(
    Math.asin(
      Math.sin(initialLatitude) * Math.cos(distance / EARTH_RADIUS_KM) +
        Math.cos(initialLatitude) *
          Math.sin(distance / EARTH_RADIUS_KM) *
          Math.cos(bearingInRadians)
    )
  );

  const finalLongitude = toDegrees(
    initialLongitude +
      Math.atan2(
        Math.sin(bearingInRadians) *
          Math.sin(distance / EARTH_RADIUS_KM) *
          Math.cos(initialLatitude),
        Math.cos(distance / EARTH_RADIUS_KM) -
          Math.sin(initialLatitude) * Math.sin(finalLatitude)
      )
  );

  return [finalLatitude, finalLongitude];
}

export function randomFloat(min: number = 0, max: number = 1): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number = 0, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getNextCoordinates(
  originLatitude: number,
  originLongitude: number,
  destinationLatitude: number,
  destinationLongitude: number,
  platformSpeed: number
) {
  const heading = getBearingBetweenTwoPoints(
    originLatitude,
    originLongitude,
    destinationLatitude,
    destinationLongitude
  );
  const totalDistanceKm = getDistanceBetweenTwoPoints(
    originLatitude,
    originLongitude,
    destinationLatitude,
    destinationLongitude
  );
  const totalTimeHours =
    (totalDistanceKm * KILOMETERS_TO_NAUTICAL_MILES) /
    (platformSpeed < 0 ? -platformSpeed : platformSpeed); // hours
  const totalTimeSeconds = Math.max(Math.floor(totalTimeHours * 3600), 0.0001); // seconds
  const legDistanceKm = totalDistanceKm / totalTimeSeconds;

  return getTerminalCoordinatesFromDistanceAndBearing(
    originLatitude,
    originLongitude,
    legDistanceKm,
    heading
  );
}
