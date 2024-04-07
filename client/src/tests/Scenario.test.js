import Scenario from "../game/Scenario";
import Side from "../game/Side";
import Aircraft from "../game/units/Aircraft";
import Ship from "../game/units/Ship";
import Airbase from "../game/units/Airbase";
import Facility from "../game/units/Facility";
import Weapon from "../game/units/Weapon";

function getTestUnits() {
  const sideBlue = new Side({
    id: "123453",
    name: "BLUE",
    sideColor: "blue",
  });
  const sideRed = new Side({
    id: "123453",
    name: "RED",
    sideColor: "red",
  });
  const testAirbase = new Airbase({
    id: "12345",
    name: "Floridistan AFB",
    sideName: "BLUE",
    className: "Airfield",
    latitude: 90,
    longitude: 90,
    altitude: 0.0,
    sideColor: "blue",
  });
  const testWeapon = new Weapon({
    id: "123456",
    name: "Sample Weapon",
    sideName: "sideName",
    className: "Sample Weapon",
    latitude: 0.0,
    longitude: 0.0,
    altitude: 10000.0,
    heading: 90.0,
    speed: 1000.0,
    currentFuel: 5000.0,
    maxFuel: 5000.0,
    fuelRate: 5000.0,
    range: 100,
    sideColor: "red",
    targetId: null,
    lethality: 0.5,
    maxQuantity: 20,
    currentQuantity: 20,
  });
  const testAircraft = new Aircraft({
    id: "12345",
    name: "F-16",
    sideName: "BLUE",
    className: "Fighter",
    latitude: 15,
    longitude: 20,
    altitude: 0.0,
    heading: 0,
    speed: 100,
    currentFuel: 100,
    maxFuel: 100,
    fuelRate: 10,
    range: 100,
    sideColor: "blue",
    weapons: [testWeapon],
    homeBaseId: "12345",
  });
  const testShip = new Ship({
    id: "12345",
    name: "Nimitz",
    sideName: "BLUE",
    className: "USS Nimitz",
    latitude: 15,
    longitude: 20,
    altitude: 0.0,
    heading: 0,
    speed: 100,
    currentFuel: 100,
    maxFuel: 100,
    fuelRate: 10,
    range: 100,
    route: [
      [0, 0],
      [1, 1],
    ],
    sideColor: "blue",
    weapons: [testWeapon],
  });
  const testFacility = new Facility({
    id: "12345",
    name: "SAM",
    sideName: "RED",
    className: "SAM",
    latitude: 15,
    longitude: 20,
    altitude: 0.0,
    range: 250,
    sideColor: "red",
    weapons: [testWeapon],
  });
  const testScenario = new Scenario({
    id: "123453",
    name: "Test Scenario",
    startTime: 1699073110,
    currentTime: 1699073110,
    duration: 14400,
    sides: [sideBlue, sideRed],
    timeCompression: 1,
    aircraft: [testAircraft],
    ships: [testShip],
    airbases: [testAirbase],
    facilities: [testFacility],
    weapons: [testWeapon],
  });
  return [
    testScenario,
    testAirbase,
    testAircraft,
    testFacility,
    testShip,
    testWeapon,
    sideBlue,
    sideRed,
  ];
}

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
    expect(testScenario.id).toBe("123453");
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
    expect(testScenario.getAircraft("12345")).toBe(testAircraft);
  });

  test("getAircraft returns undefined if the aircraft is not found", () => {
    const [testScenario] = getTestUnits();
    expect(testScenario.getAircraft("123456")).toBe(undefined);
  });

  test("getAirbase finds the correct airbase", () => {
    const [testScenario, testAirbase] = getTestUnits();
    expect(testScenario.getAirbase("12345")).toBe(testAirbase);
  });

  test("getAirbase returns undefined if the airbase is not found", () => {
    const [testScenario] = getTestUnits();
    expect(testScenario.getAirbase("123456")).toBe(undefined);
  });

  test("getFacility finds the correct facility", () => {
    const [testScenario, testAirbase, testAircraft, testFacility] =
      getTestUnits();
    expect(testScenario.getFacility("12345")).toBe(testFacility);
  });

  test("getFacility returns undefined if the facility is not found", () => {
    const [testScenario] = getTestUnits();
    expect(testScenario.getFacility("123456")).toBe(undefined);
  });

  test("getShip finds the correct ship", () => {
    const [testScenario, testAirbase, testAircraft, testFacility, testShip] =
      getTestUnits();
    expect(testScenario.getShip("12345")).toBe(testShip);
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
      "12345",
      newAircraftName,
      newAircraftClassname,
      newAircraftSpeed,
      newAircraftWeaponQuantity,
      newAircraftCurrentFuel,
      newAircraftFuelRate
    );
    const updatedAircraft = testScenario.getAircraft("12345");
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
      "12345",
      newShipName,
      newShipClassname,
      newShipSpeed,
      newShipCurrentFuel,
      newShipWeaponQuantity,
      newShipRange
    );
    const updatedShip = testScenario.getShip("12345");
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
      "12345",
      newFacilityName,
      newFacilityClassname,
      newFacilityRange,
      newFacilityWeaponQuantity
    );
    const updatedFacility = testScenario.getFacility("12345");
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
    testScenario.updateAirbase("12345", newAirbaseName);
    const updatedAirbase = testScenario.getAirbase("12345");
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
