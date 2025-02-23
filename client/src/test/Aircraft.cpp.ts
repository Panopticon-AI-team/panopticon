import Simulation, { Aircraft } from "emscripten_dist/simulation.js";

export async function createAircraft(): Promise<Aircraft> {
  return await Simulation().then((module) => {
    const id = "Test ID";
    const name = "Test Name";
    const className = "Test Class";
    const sideId = "Test Side ID";
    const latitude = 4;
    const longitude = 5;
    const altitude = 6;
    const selected = true;
    const heading = 90;
    const speedKnots = 500;
    const currentFuelLbs = 1000;
    const maxFuelLbs = 2000;
    const fuelRateLbsPerHour = 5;
    const homeBaseId = "Test Home Base ID";
    const returnToBase = true;
    const targetId = "Test Target ID";
    const aircraftConstructionParameters = {
      id: id,
      name: name,
      className: className,
      sideId: sideId,
      latitude: latitude,
      longitude: longitude,
      altitude: altitude,
      selected: selected,
      heading: heading,
      speedKnots: speedKnots,
      currentFuelLbs: currentFuelLbs,
      maxFuelLbs: maxFuelLbs,
      fuelRateLbsPerHour: fuelRateLbsPerHour,
      homeBaseId: homeBaseId,
      returnToBase: returnToBase,
      targetId: targetId,
    };
    const aircraft = new module.Aircraft(aircraftConstructionParameters);
    return aircraft;
  });
}

export function createAircraftTest() {
  createAircraft().then((aircraft) => {
    console.log("createAircraftTest aircraft: ", aircraft);
  });
}

export function addPointToRouteTest() {
  createAircraft().then((aircraft) => {
    aircraft.addPointToRoute(7, 8, 9);
    const route = aircraft.route;
    for (let i = 0; i < route.size(); i++) {
      console.log(
        "addPointToRouteTest aircraft route waypoint: ",
        route.get(i)
      );
    }
  });
}

export function clearFirstNPointsFromRouteTest() {
  createAircraft().then((aircraft) => {
    aircraft.addPointToRoute(7, 8, 9);
    aircraft.addPointToRoute(10, 11, 12);
    aircraft.addPointToRoute(13, 14, 15);
    aircraft.clearFirstNPointsFromRoute(1);
    const route = aircraft.route;
    for (let i = 0; i < route.size(); i++) {
      console.log(
        "clearFirstNPointsFromRouteTest aircraft route waypoint: ",
        route.get(i)
      );
    }
  });
}

export function clearLastNPointsFromRouteTest() {
  createAircraft().then((aircraft) => {
    aircraft.addPointToRoute(7, 8, 9);
    aircraft.addPointToRoute(10, 11, 12);
    aircraft.addPointToRoute(13, 14, 15);
    aircraft.clearLastNPointsFromRoute(1);
    const route = aircraft.route;
    for (let i = 0; i < route.size(); i++) {
      console.log(
        "clearLastNPointsFromRouteTest aircraft route waypoint: ",
        route.get(i)
      );
    }
  });
}

export function clearRouteTest() {
  createAircraft().then((aircraft) => {
    aircraft.addPointToRoute(7, 8, 9);
    aircraft.addPointToRoute(10, 11, 12);
    aircraft.addPointToRoute(13, 14, 15);
    aircraft.clearRoute();
    const route = aircraft.route;
    console.log("clearRouteTest aircraft route size: ", route.size());
  });
}

export function aircraftCppTests() {
  createAircraftTest();
  addPointToRouteTest();
  clearFirstNPointsFromRouteTest();
  clearLastNPointsFromRouteTest();
  clearRouteTest();
}
