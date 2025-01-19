import { getTestUnits } from "../../testing/helpers";

describe("Scenario", () => {
  test("a Scenario is instantiated correctly", () => {
    const [
      testScenario,
      testAirbase,
      testAircraft,
      testFacility,
      testShip,
      testWeapon,
    ] = getTestUnits();
    expect(testScenario.id).toBe("8");
    expect(testScenario.name).toBe("Test Scenario");
    expect(testScenario.startTime).toBe(1699073110);
    expect(testScenario.currentTime).toBe(1699073110);
    expect(testScenario.duration).toBe(14400);
    expect(testScenario.sides.length).toBe(2);
    expect(testScenario.sides[0].name).toBe("BLUE");
    expect(testScenario.sides[1].name).toBe("RED");
    expect(testScenario.timeCompression).toBe(1);
    expect(testScenario.aircraft.length).toBe(1);
    expect(testScenario.aircraft[0]).toBe(testAircraft);
    expect(testScenario.ships.length).toBe(1);
    expect(testScenario.ships[0]).toBe(testShip);
    expect(testScenario.airbases.length).toBe(1);
    expect(testScenario.airbases[0]).toBe(testAirbase);
    expect(testScenario.facilities.length).toBe(1);
    expect(testScenario.facilities[0]).toBe(testFacility);
    expect(testScenario.weapons.length).toBe(1);
    expect(testScenario.weapons[0]).toBe(testWeapon);
  });

  test("getSide finds the correct side", () => {
    const [
      testScenario,
      testAirbase,
      testAircraft,
      testFacility,
      testShip,
      testWeapon,
      sideBlue,
      sideRed,
    ] = getTestUnits();
    expect(testScenario.getSide("BLUE")).toBe(sideBlue);
    expect(testScenario.getSide("RED")).toBe(sideRed);
  });

  test("getSide returns undefined if the side is not found", () => {
    const [testScenario] = getTestUnits();
    expect(testScenario.getSide("GREEN")).toBe(undefined);
  });

  test("getAircraft finds the correct aircraft", () => {
    const [testScenario, testAirbase, testAircraft] = getTestUnits();
    expect(testScenario.getAircraft("5")).toBe(testAircraft);
  });

  test("getAircraft returns undefined if the aircraft is not found", () => {
    const [testScenario] = getTestUnits();
    expect(testScenario.getAircraft("123456")).toBe(undefined);
  });

  test("getAirbase finds the correct airbase", () => {
    const [testScenario, testAirbase] = getTestUnits();
    expect(testScenario.getAirbase("3")).toBe(testAirbase);
  });

  test("getAirbase returns undefined if the airbase is not found", () => {
    const [testScenario] = getTestUnits();
    expect(testScenario.getAirbase("123456")).toBe(undefined);
  });

  test("getFacility finds the correct facility", () => {
    const [testScenario, testAirbase, testAircraft, testFacility] =
      getTestUnits();
    expect(testScenario.getFacility("7")).toBe(testFacility);
  });

  test("getFacility returns undefined if the facility is not found", () => {
    const [testScenario] = getTestUnits();
    expect(testScenario.getFacility("123456")).toBe(undefined);
  });

  test("getShip finds the correct ship", () => {
    const [testScenario, testAirbase, testAircraft, testFacility, testShip] =
      getTestUnits();
    expect(testScenario.getShip("6")).toBe(testShip);
  });

  test("getShip returns undefined if the ship is not found", () => {
    const [testScenario] = getTestUnits();
    expect(testScenario.getShip("123456")).toBe(undefined);
  });

  test("can update an aircraft", () => {
    const newAircraftName = "F-22";
    const newAircraftClassname = "Stealth Fighter";
    const newAircraftSpeed = 600;
    const newAircraftWeaponQuantity = 60;
    const newAircraftCurrentFuel = 1000;
    const newAircraftFuelRate = 5;
    const [testScenario] = getTestUnits();
    testScenario.updateAircraft(
      "5",
      newAircraftName,
      newAircraftClassname,
      newAircraftSpeed,
      newAircraftWeaponQuantity,
      newAircraftCurrentFuel,
      newAircraftFuelRate
    );
    const updatedAircraft = testScenario.getAircraft("5");
    expect(updatedAircraft.name).toBe(newAircraftName);
    expect(updatedAircraft.className).toBe(newAircraftClassname);
    expect(updatedAircraft.speed).toBe(newAircraftSpeed);
    expect(updatedAircraft.currentFuel).toBe(newAircraftCurrentFuel);
    expect(updatedAircraft.fuelRate).toBe(newAircraftFuelRate);
    expect(updatedAircraft.weapons[0].currentQuantity).toBe(
      newAircraftWeaponQuantity
    );
  });

  test("can update a ship", () => {
    const newShipName = "USS Enterprise";
    const newShipClassname = "USS Enterprise";
    const newShipSpeed = 200;
    const newShipCurrentFuel = 200;
    const newShipWeaponQuantity = 50;
    const newShipRange = 600;
    const [testScenario] = getTestUnits();
    testScenario.updateShip(
      "6",
      newShipName,
      newShipClassname,
      newShipSpeed,
      newShipCurrentFuel,
      newShipWeaponQuantity,
      newShipRange
    );
    const updatedShip = testScenario.getShip("6");
    expect(updatedShip.name).toBe(newShipName);
    expect(updatedShip.className).toBe(newShipClassname);
    expect(updatedShip.speed).toBe(newShipSpeed);
    expect(updatedShip.currentFuel).toBe(newShipCurrentFuel);
    expect(updatedShip.weapons[0].currentQuantity).toBe(newShipWeaponQuantity);
    expect(updatedShip.range).toBe(newShipRange);
  });

  test("can update facility", () => {
    const newFacilityName = "Patriot";
    const newFacilityClassname = "Patriot";
    const newFacilityRange = 300;
    const newFacilityWeaponQuantity = 40;
    const [testScenario] = getTestUnits();
    testScenario.updateFacility(
      "7",
      newFacilityName,
      newFacilityClassname,
      newFacilityRange,
      newFacilityWeaponQuantity
    );
    const updatedFacility = testScenario.getFacility("7");
    expect(updatedFacility.name).toBe(newFacilityName);
    expect(updatedFacility.className).toBe(newFacilityClassname);
    expect(updatedFacility.range).toBe(newFacilityRange);
    expect(updatedFacility.weapons[0].currentQuantity).toBe(
      newFacilityWeaponQuantity
    );
  });

  test("can update airbase", () => {
    const newAirbaseName = "Floridistan International Airport";
    const [testScenario] = getTestUnits();
    testScenario.updateAirbase("3", newAirbaseName);
    const updatedAirbase = testScenario.getAirbase("3");
    expect(updatedAirbase.name).toBe(newAirbaseName);
  });

  test("finds aircraft homebase", () => {
    const [testScenario, testAirbase, testAircraft] = getTestUnits();
    const homebase = testScenario.getAircraftHomeBase(testAircraft.id);
    expect(homebase).toBe(testAirbase);
  });

  test("finds closest homebase to aircraft", () => {
    const [testScenario, testAirbase, testAircraft, testFacility, testShip] =
      getTestUnits();
    const homebase = testScenario.getClosestBaseToAircraft(testAircraft.id);
    expect(homebase).toBe(testShip);
  });
});
