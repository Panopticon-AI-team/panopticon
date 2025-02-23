import Simulation, { Scenario } from "emscripten_dist/simulation.js";
import { createAircraft } from "./Aircraft.cpp";
import { createSide } from "./Side.cpp";

async function createScenario(): Promise<Scenario> {
  const scenarioId = "Test ID";
  const scenarioName = "Test Scenario";
  const scenarioStartTime = 1699073110;
  const scenarioCurrentTime = 1699073110;
  const scenarioDurationSeconds = 14400;
  const scenarioTimeCompression = 1;
  const scenarioConstructionParameters = {
    id: scenarioId,
    name: scenarioName,
    startTime: scenarioStartTime,
    currentTime: scenarioCurrentTime,
    durationSeconds: scenarioDurationSeconds,
    timeCompression: scenarioTimeCompression,
  };
  return await Simulation().then((module) => {
    const scenario = new module.Scenario(scenarioConstructionParameters);
    return scenario;
  });
}

function createScenarioTest() {
  createScenario().then((scenario) => {
    console.log("createScenarioTest scenario: ", scenario);
  });
}

function scenarioAddAircraftTest() {
  createScenario().then(async (scenario) => {
    const sampleAircraft = await createAircraft();
    scenario.addAircraft({
      id: sampleAircraft.id,
      name: sampleAircraft.name,
      className: sampleAircraft.className,
      sideId: sampleAircraft.sideId,
      latitude: sampleAircraft.coordinates.latitude,
      longitude: sampleAircraft.coordinates.longitude,
      altitude: sampleAircraft.coordinates.altitude,
      selected: sampleAircraft.selected,
      heading: sampleAircraft.heading,
      speedKnots: sampleAircraft.speedKnots,
      currentFuelLbs: sampleAircraft.currentFuelLbs,
      maxFuelLbs: sampleAircraft.maxFuelLbs,
      fuelRateLbsPerHour: sampleAircraft.fuelRateLbsPerHour,
      homeBaseId: sampleAircraft.homeBaseId,
      returnToBase: sampleAircraft.returnToBase,
      targetId: sampleAircraft.targetId,
    });
    const addedAircraft = scenario.getAircraftByIdAndSideId(
      sampleAircraft.sideId,
      sampleAircraft.id
    );
    console.log("scenarioAddAircraftTest aircraft: ", addedAircraft);
  });
}

function scenarioAddSideTest() {
  createScenario().then(async (scenario) => {
    const sampleSide = await createSide();
    scenario.addSide({
      id: sampleSide.id,
      name: sampleSide.name,
      color: sampleSide.color,
      totalScore: sampleSide.totalScore,
    });
    const addedSide = scenario.getSideById(sampleSide.id);
    console.log("scenarioAddSideTest side: ", addedSide);
  });
}

function scenarioMoveAircraftTest() {
  createScenario().then(async (scenario) => {
    const sampleAircraft = await createAircraft();
    scenario.addAircraft({
      id: sampleAircraft.id,
      name: sampleAircraft.name,
      className: sampleAircraft.className,
      sideId: sampleAircraft.sideId,
      latitude: sampleAircraft.coordinates.latitude,
      longitude: sampleAircraft.coordinates.longitude,
      altitude: sampleAircraft.coordinates.altitude,
      selected: sampleAircraft.selected,
      heading: sampleAircraft.heading,
      speedKnots: sampleAircraft.speedKnots,
      currentFuelLbs: sampleAircraft.currentFuelLbs,
      maxFuelLbs: sampleAircraft.maxFuelLbs,
      fuelRateLbsPerHour: sampleAircraft.fuelRateLbsPerHour,
      homeBaseId: sampleAircraft.homeBaseId,
      returnToBase: sampleAircraft.returnToBase,
      targetId: sampleAircraft.targetId,
    });
    const addedAircraft = scenario.getAircraftByIdAndSideId(
      sampleAircraft.sideId,
      sampleAircraft.id
    );
    addedAircraft?.addPointToRoute(50, 50, 50);
    addedAircraft?.addPointToRoute(100, 100, 100);
    console.log(
      "scenarioMoveAircraftTest aircraft.coordinates before moving: ",
      addedAircraft?.coordinates.latitude,
      addedAircraft?.coordinates.longitude
    );
    const timesteps = 1;
    for (let i = 0; i < timesteps; i++) {
      scenario.update(i);
    }
    console.log(
      "scenarioMoveAircraftTest aircraft.coordinates after moving: ",
      addedAircraft?.coordinates.latitude,
      addedAircraft?.coordinates.longitude
    );
    if (addedAircraft && addedAircraft.route.size() > 0) {
      for (let i = 0; i < addedAircraft.route.size(); i++) {
        console.log(
          "scenarioMoveAircraftTest aircraft route waypoint: ",
          addedAircraft?.route.get(i)
        );
      }
    }
    console.log(
      "scenarioMoveAircraftTest aircraft.fuel after moving: ",
      addedAircraft?.currentFuelLbs
    );
  });
}

export function scenarioCppTests() {
  createScenarioTest();
  scenarioAddAircraftTest();
  scenarioAddSideTest();
  scenarioMoveAircraftTest();
}
