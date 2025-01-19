import Facility from "@/game/units/Facility";
import Weapon from "@/game/units/Weapon";

describe("Facility", () => {
  test("a Facility is instantiated correctly", () => {
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
    expect(testFacility.id).toBe("12345");
    expect(testFacility.name).toBe("SAM");
    expect(testFacility.sideName).toBe("RED");
    expect(testFacility.className).toBe("SAM");
    expect(testFacility.latitude).toBe(15);
    expect(testFacility.longitude).toBe(20);
    expect(testFacility.altitude).toBe(0.0);
    expect(testFacility.range).toBe(250);
    expect(testFacility.sideColor).toBe("red");
    expect(testFacility.weapons.length).toBe(1);
    expect(testFacility.weapons[0]).toBe(testWeapon);
  });

  test("getTotalWeaponQuantity returns the correct number of weapons on a Facility", () => {
    const testWeapon1 = new Weapon({
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
    const testWeapon2 = new Weapon({
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
      maxQuantity: 30,
      currentQuantity: 30,
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
      weapons: [testWeapon1, testWeapon2],
    });
    expect(testFacility.getTotalWeaponQuantity()).toBe(50);
  });
});
