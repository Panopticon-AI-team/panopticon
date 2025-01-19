import Game from "@/game/Game";
import Scenario from "@/game/Scenario";
import Side from "@/game/Side";
import Aircraft from "@/game/units/Aircraft";
import Ship from "@/game/units/Ship";
import Airbase from "@/game/units/Airbase";
import Facility from "@/game/units/Facility";
import Weapon from "@/game/units/Weapon";

export function getTestUnits() {
  const sideBlue = new Side({
    id: "1",
    name: "BLUE",
    sideColor: "blue",
  });
  const sideRed = new Side({
    id: "2",
    name: "RED",
    sideColor: "red",
  });
  const testAirbase = new Airbase({
    id: "3",
    name: "Floridistan AFB",
    sideName: "BLUE",
    className: "Airfield",
    latitude: 90,
    longitude: 90,
    altitude: 0.0,
    sideColor: "blue",
  });
  const testWeapon = new Weapon({
    id: "4",
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
    id: "5",
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
    homeBaseId: "3",
  });
  const testShip = new Ship({
    id: "6",
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
    id: "7",
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
    id: "8",
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

export function getTestGame() {
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
  const testGame = new Game(testScenario as Scenario);
  testGame.currentSideName = "BLUE";
  return testGame;
}
