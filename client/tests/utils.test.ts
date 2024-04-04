import { toRadians } from "../src/utils/utils";

describe("testing index file", () => {
  test("empty string should result in zero", () => {
    expect(toRadians(0)).toBe(0);
  });
});
