import {
  toRadians,
  toDegrees,
  getBearingBetweenTwoPoints,
  getDistanceBetweenTwoPoints,
  getTerminalCoordinatesFromDistanceAndBearing,
  unixToLocalTime,
  colorNameToHex,
  colorNameToColorArray,
  randomFloat,
  randomInt,
  generateRoute,
  generateRouteRealistic,
  getNextCoordinates,
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
      ).toBeCloseTo(bearing, 5);
    }
  );

  it.each([
    [{ lat: 0, lon: 0 }, { lat: 0, lon: 0 }, 0],
    [{ lat: 0, lon: 0 }, { lat: 0, lon: 1 }, 111.32],
    [{ lat: 0, lon: 0 }, { lat: 1, lon: 0 }, 111.32],
    [{ lat: 0, lon: 0 }, { lat: 1, lon: 1 }, 157.25],
    [{ lat: 0, lon: 0 }, { lat: 1, lon: -1 }, 157.25],
    [{ lat: 0, lon: 0 }, { lat: -1, lon: 1 }, 157.25],
    [{ lat: 0, lon: 0 }, { lat: -1, lon: -1 }, 157.25],
    [{ lat: 0, lon: 0 }, { lat: -1, lon: 0 }, 111.32],
    [{ lat: 0, lon: 0 }, { lat: 0, lon: -5 }, 556.6],
    [{ lat: 40.76, lon: -73.984 }, { lat: 38.89, lon: -77.032 }, 333.9],
    [
      { lat: 60.82778, lon: -28.17587 },
      { lat: 75.91378, lon: -56.74914 },
      2001.4341,
    ],
  ])(
    `distance between (%o) and (%o) is %f`,
    (startCoordinates, destCoordinates, distance) => {
      expect(
        getDistanceBetweenTwoPoints(
          startCoordinates.lat,
          startCoordinates.lon,
          destCoordinates.lat,
          destCoordinates.lon
        )
      ).toBeCloseTo(distance, 5);
    }
  );

  it.each([
    [{ lat: 0, lon: 0 }, 0, 0, { lat: 0, lon: 0 }],
    [{ lat: 0, lon: 0 }, 1, 0, { lat: 0.008993203677616674, lon: 0 }],
    [{ lat: 0, lon: 0 }, 1, 90, { lat: 0, lon: 0.008993203677616674 }],
    [{ lat: 0, lon: 0 }, 1, 180, { lat: -0.008993203677616674, lon: 0 }],
    [{ lat: 0, lon: 0 }, 1, 270, { lat: 0, lon: -0.008993203677616674 }],
    [
      { lat: 0, lon: 0 },
      1,
      45,
      { lat: 0.006363961030678928, lon: 0.006363961030678928 },
    ],
    [
      { lat: 0, lon: 0 },
      1,
      135,
      { lat: 0.006363961030678928, lon: -0.006363961030678928 },
    ],
    [
      { lat: 0, lon: 0 },
      1,
      225,
      { lat: -0.006363961030678928, lon: -0.006363961030678928 },
    ],
    [
      { lat: 0, lon: 0 },
      1,
      315,
      { lat: -0.006363961030678928, lon: 0.006363961030678928 },
    ],
    [{ lat: 0, lon: 0 }, 1, 360, { lat: 0.008993203677616674, lon: 0 }],
    [
      { lat: 0, lon: 0 },
      1,
      405,
      { lat: 0.006363961030678928, lon: 0.006363961030678928 },
    ],
    [{ lat: 0, lon: 0 }, 1, 450, { lat: 0, lon: 0.008993203677616674 }],
    [
      { lat: 0, lon: 0 },
      1,
      495,
      { lat: -0.006363961030678928, lon: 0.006363961030678928 },
    ],
    [{ lat: 0, lon: 0 }, 1, 540, { lat: -0.008993203677616674, lon: 0 }],
  ])(
    `terminal coordinates from distance and bearing`,
    (startCoordinates, distance, bearing, expectedEndCoordinates) => {
      const [endLatitude, endLongitude] =
        getTerminalCoordinatesFromDistanceAndBearing(
          startCoordinates.lat,
          startCoordinates.lon,
          distance,
          bearing
        );
      expect(endLatitude).toBeCloseTo(expectedEndCoordinates.lat, 5);
      expect(endLongitude).toBeCloseTo(expectedEndCoordinates.lon, 5);
    }
  );
});

describe("testing miscellaneous utility functions", () => {
  it.each([
    [1712279806, "20:16:46"],
    [0, "18:00:00"],
    [86400, "18:00:00"],
    [86401, "18:00:01"],
    [1732475866, "13:17:46"],
    [-1732475866, "22:42:14"],
    [2147483647.546, "21:14:07"],
  ])(`formatted unix time %i is %s`, (unixTime, formattedTime) => {
    expect(unixToLocalTime(unixTime)).toBe(formattedTime);
  });

  it.each([
    ["aliceblue", "#f0f8ff"],
    ["ALICEBLUE", "#f0f8ff"],
    ["AliceBlue", "#f0f8ff"],
    ["bluealice", ""],
  ])(`color name %s in hex is %s`, (colorName, hex) => {
    expect(colorNameToHex(colorName)).toBe(hex);
  });

  it.each([
    ["aliceblue", 1, [240, 248, 255, 1]],
    ["ALICEBLUE", undefined, [240, 248, 255, 1]],
    ["AliceBlue", 0.3, [240, 248, 255, 0.3]],
    ["AliceBlue", 2, [240, 248, 255, 1]],
    ["sandybrown", -1, [244, 164, 96, 0]],
    ["bluealice", undefined, undefined],
  ])(`color name %s in RGB array is %s`, (colorName, alpha, rgb) => {
    expect(colorNameToColorArray(colorName, alpha)).toStrictEqual(rgb);
  });

  it.each([
    [0, 1],
    [-1.3, 2.3],
    [0.5, 1.5],
    [1.5, -4.5],
  ])(`random float is between %f and %f`, (min, max) => {
    const random = randomFloat(min, max);
    if (min < max) {
      expect(random).toBeGreaterThanOrEqual(min);
      expect(random).toBeLessThanOrEqual(max);
    } else {
      expect(random).toBeGreaterThanOrEqual(max);
      expect(random).toBeLessThanOrEqual(min);
    }
  });

  it.each([
    [0, 1],
    [-1, 2],
    [0, 1],
    [1, -4],
  ])(`random int is between %i and %i`, (min, max) => {
    const random = randomInt(min, max);
    if (min < max) {
      expect(random).toBeGreaterThanOrEqual(min);
      expect(random).toBeLessThanOrEqual(max);
    } else {
      expect(random).toBeGreaterThanOrEqual(max);
      expect(random).toBeLessThanOrEqual(min);
    }
  });
});

describe("testing route generation", () => {
  it("generates a route with 10 waypoints", () => {});

  it("generates a realistic route with 10 waypoints", () => {});

  it.each([
    [0, 0, 0],
    [1, 1, 1],
    [200, 1, 1],
    [-100, 1, 1],
  ])(
    "gets the next coordinates along a route with speed %i",
    (platformSpeed, expectedNextLatitude, expectedNextLongitude) => {
      const startLatitude = 0;
      const startLongitude = 0;
      const endLatitude = 1;
      const endLongitude = 1;
      const [nextLatitude, nextLongitude] = getNextCoordinates(
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude,
        platformSpeed
      );
      expect(nextLatitude).toBeCloseTo(expectedNextLatitude, 5);
      expect(nextLongitude).toBeCloseTo(expectedNextLongitude, 5);
    }
  );
});
