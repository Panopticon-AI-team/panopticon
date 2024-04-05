import {
  toRadians,
  toDegrees,
  getBearingBetweenTwoPoints,
} from "../utils/utils";

describe("testing distance math functions", () => {
  it.each([
    [0, 0],
    [46, 0.8028514559173915],
    [90, 1.5707963267948966],
    [132, 2.303834612632515],
    [180, 3.141592653589793],
    [270, 4.71238898038469],
    [360, 6.283185307179586],
    [-20, -0.3490658503988659],
    [-90.0, -1.5707963267948966],
    [-184.0, -3.211405823669566],
    [-277.0, -4.834562028024293],
    [-360.7, -6.295402611943546],
  ])(`%i in radians is %f`, (degrees, radians) => {
    expect(toRadians(degrees)).toBeCloseTo(radians, 5);
  });

  it.each([
    [0, 0],
    [0.8028514559173915, 46],
    [1.5707963267948966, 90],
    [2.303834612632515, 132],
    [3.141592653589793, 180],
    [4.71238898038469, 270],
    [6.283185307179586, 360],
    [-0.3490658503988659, -20],
    [-1.5707963267948966, -90],
    [-3.211405823669566, -184],
    [-4.834562028024293, -277],
    [-6.283185307179586, -360],
  ])(`%f in degrees is %i`, (radians, degrees) => {
    expect(toDegrees(radians)).toBeCloseTo(degrees, 5);
  });

  it.each([
    [{ lat: 0, lon: 0 }, { lat: 0, lon: 0 }, 0],
    [{ lat: 0, lon: 0 }, { lat: 0, lon: 1 }, 90],
    [{ lat: 0, lon: 0 }, { lat: 1, lon: 0 }, 0],
    [{ lat: 0, lon: 0 }, { lat: 1, lon: 1 }, 45],
    [{ lat: 0, lon: 0 }, { lat: 1, lon: -1 }, 315],
    [{ lat: 0, lon: 0 }, { lat: -1, lon: 1 }, 135],
    [{ lat: 0, lon: 0 }, { lat: -1, lon: -1 }, 225],
    [{ lat: 0, lon: 0 }, { lat: -1, lon: 0 }, 180],
    [{ lat: 0, lon: 0 }, { lat: 0, lon: -5 }, 270],
    [{ lat: 40.76, lon: -73.984 }, { lat: 38.89, lon: -77.032 }, 231.38],
    [
      { lat: 60.82778, lon: -28.17587 },
      { lat: 75.91378, lon: -56.74914 },
      326.2,
    ],
  ])(
    `bearing between (%o) and (%o) is %f`,
    (startCoordinates, destCoordinates, bearing) => {
      expect(
        getBearingBetweenTwoPoints(
          startCoordinates.lat,
          startCoordinates.lon,
          destCoordinates.lat,
          destCoordinates.lon
        )
      ).toBeCloseTo(bearing, 2);
    }
  );
});
