import { toRadians } from "../utils/utils";

describe("testing distance math functions", () => {
  test("0 in radians is zero", () => {
    expect(toRadians(0)).toBe(0);
  });
});
