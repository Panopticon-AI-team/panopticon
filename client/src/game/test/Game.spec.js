import { getTestGame } from "../../testing/helpers";

describe("aircraft rtb", () => {
  test("aircraft stops returning to airbase if airbase is deleted (bug #42)", () => {
    const testGame = getTestGame();
    const testScenario = testGame.currentScenario;
    const testAircraft = testScenario.getAircraft("5");
    const testAirbase = testScenario.getAirbase("3");
    expect(testAircraft.homeBaseId).toBe(testAirbase.id);
    expect(testAircraft.rtb).toBe(false);
    testGame.aircraftReturnToBase(testAircraft.id);
    expect(testAircraft.rtb).toBe(true);
    expect(testAircraft.route.length).toBe(1);
    expect(testAircraft.route[0][0]).toBe(testAirbase.latitude);
    expect(testAircraft.route[0][1]).toBe(testAirbase.longitude);
    testGame.removeAirbase(testAirbase.id);
    expect(testAircraft.rtb).toBe(false);
    expect(testAircraft.homeBaseId).toBe("");
    expect(testAircraft.route.length).toBe(0);
  });

  test("aircraft stops returning to ship if ship is deleted (bug #42)", () => {
    const testGame = getTestGame();
    const testScenario = testGame.currentScenario;
    const testAircraft = testScenario.getAircraft("5");
    const testShip = testScenario.getShip("6");
    testAircraft.homeBaseId = testShip.id;
    expect(testAircraft.homeBaseId).toBe(testShip.id);
    expect(testAircraft.rtb).toBe(false);
    testGame.aircraftReturnToBase(testAircraft.id);
    expect(testAircraft.rtb).toBe(true);
    expect(testAircraft.route.length).toBe(1);
    expect(testAircraft.route[0][0]).toBe(testShip.latitude);
    expect(testAircraft.route[0][1]).toBe(testShip.longitude);
    testGame.removeShip(testShip.id);
    expect(testAircraft.rtb).toBe(false);
    expect(testAircraft.homeBaseId).toBe("");
    expect(testAircraft.route.length).toBe(0);
  });
});
