import Weapon from "@/game/units/Weapon";

describe("Weapon", () => {
  test("a Weapon is instantiated correctly", () => {
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
      route: [
        [0, 0],
        [1, 1],
      ],
      sideColor: "red",
      targetId: null,
      lethality: 0.5,
      maxQuantity: 20,
      currentQuantity: 20,
    });
    expect(testWeapon.id).toBe("123456");
    expect(testWeapon.name).toBe("Sample Weapon");
    expect(testWeapon.sideId).toBe("sideId");
    expect(testWeapon.className).toBe("Sample Weapon");
    expect(testWeapon.latitude).toBe(0.0);
    expect(testWeapon.longitude).toBe(0.0);
    expect(testWeapon.altitude).toBe(10000.0);
    expect(testWeapon.heading).toBe(90.0);
    expect(testWeapon.speed).toBe(1000.0);
    expect(testWeapon.currentFuel).toBe(5000.0);
    expect(testWeapon.maxFuel).toBe(5000.0);
    expect(testWeapon.fuelRate).toBe(5000.0);
    expect(testWeapon.range).toBe(100);
    expect(testWeapon.route.length).toBe(2);
    expect(testWeapon.route[0]).toStrictEqual([0, 0]);
    expect(testWeapon.route[1]).toStrictEqual([1, 1]);
    expect(testWeapon.sideColor).toBe("red");
    expect(testWeapon.targetId).toBe(null);
    expect(testWeapon.lethality).toBe(0.5);
    expect(testWeapon.maxQuantity).toBe(20);
    expect(testWeapon.currentQuantity).toBe(20);
  });
});
