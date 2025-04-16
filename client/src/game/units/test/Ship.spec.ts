import Ship from "@/game/units/Ship";
import Aircraft from "@/game/units/Aircraft";
import Weapon from "@/game/units/Weapon";

describe("Ship", () => {
  test("a Ship is instantiated correctly", () => {
    const testWeapon = new Weapon({
      id: "123456",
      name: "Sample Weapon",
      sideId: "sideId",
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
      sideId: "BLUE",
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
    });
    const testShip = new Ship({
      id: "12345",
      name: "Nimitz",
      sideId: "BLUE",
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
      aircraft: [testAircraft],
    });
    expect(testShip.id).toBe("12345");
    expect(testShip.name).toBe("Nimitz");
    expect(testShip.sideId).toBe("BLUE");
    expect(testShip.className).toBe("USS Nimitz");
    expect(testShip.latitude).toBe(15);
    expect(testShip.longitude).toBe(20);
    expect(testShip.altitude).toBe(0.0);
    expect(testShip.heading).toBe(0);
    expect(testShip.speed).toBe(100);
    expect(testShip.currentFuel).toBe(100);
    expect(testShip.maxFuel).toBe(100);
    expect(testShip.fuelRate).toBe(10);
    expect(testShip.range).toBe(100);
    expect(testShip.sideColor).toBe("blue");
    expect(testShip.route.length).toBe(2);
    expect(testShip.route[0]).toStrictEqual([0, 0]);
    expect(testShip.route[1]).toStrictEqual([1, 1]);
    expect(testShip.weapons.length).toBe(1);
    expect(testShip.weapons[0]).toBe(testWeapon);
    expect(testShip.selected).toBe(false);
    expect(testShip.aircraft.length).toBe(1);
    expect(testShip.aircraft[0]).toBe(testAircraft);
  });

  test("getTotalWeaponQuantity returns the correct number of weapons on a Ship", () => {
    const testWeapon1 = new Weapon({
      id: "123456",
      name: "Sample Weapon",
      sideId: "sideId",
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
    const testWeapon2 = new Weapon({
      id: "123456",
      name: "Sample Weapon",
      sideId: "sideId",
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
      maxQuantity: 30,
      currentQuantity: 30,
    });
    const testShip = new Ship({
      id: "12345",
      name: "Nimitz",
      sideId: "BLUE",
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
      weapons: [testWeapon1, testWeapon2],
    });
    expect(testShip.getTotalWeaponQuantity()).toBe(50);
  });
});
