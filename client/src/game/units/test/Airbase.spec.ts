import Airbase from "@/game/units/Airbase";
import Aircraft from "@/game/units/Aircraft";

describe("Airbase", () => {
  test("an Airbase is instantiated correctly", () => {
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
    const testAirbase = new Airbase({
      id: "12345",
      name: "Floridistan AFB",
      sideId: "BLUE",
      className: "Airfield",
      latitude: 15,
      longitude: 20,
      altitude: 0.0,
      sideColor: "blue",
      aircraft: [testAircraft],
    });
    expect(testAirbase.id).toBe("12345");
    expect(testAirbase.name).toBe("Floridistan AFB");
    expect(testAirbase.sideId).toBe("BLUE");
    expect(testAirbase.className).toBe("Airfield");
    expect(testAirbase.latitude).toBe(15);
    expect(testAirbase.longitude).toBe(20);
    expect(testAirbase.altitude).toBe(0.0);
    expect(testAirbase.sideColor).toBe("blue");
    expect(testAirbase.aircraft.length).toBe(1);
    expect(testAirbase.aircraft[0]).toBe(testAircraft);
  });
});
