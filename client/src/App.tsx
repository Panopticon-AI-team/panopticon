import { useState, useEffect } from "react";
import { randomUUID } from "@/utils/generateUUID";
import { get as getProjection, transform } from "ol/proj.js";
import ScenarioMap from "@/gui/map/ScenarioMap";
import Side from "@/game/Side";
import Scenario from "@/game/Scenario";
import Game from "@/game/Game";
import { DEFAULT_OL_PROJECTION_CODE } from "@/utils/constants";
import defaultScenarioJson from "@/scenarios/default_scenario.json"; // < To easily switch between default_scenario.json and SCS.json when testing. Ignore lint warning. Possible to resort to something else instead of having unsued import here ?
import SCSScenarioJson from "@/scenarios/SCS.json";
import { CurrentScenarioTimeProvider } from "@/gui/map/contextProviders/ScenarioTimeProvider";
import { CurrentGameStatusProvider } from "@/gui/map/contextProviders/GameStatusProvider";
import { CurrentMouseMapCoordinatesProvider } from "@/gui/map/contextProviders/MouseMapCoordinatesProvider";

import Simulation, { MainModule } from "emscripten_dist/simulation.js";
import { runCppTests } from "./test/Simulation.cpp.ts";

export default function App() {
  const [simulationCppModule, setSimulationCppModule] =
    useState<MainModule | null>(null);
  useEffect(() => {
    Simulation().then((module) => {
      setSimulationCppModule(module);
    });
  }, []);

  if (simulationCppModule === null) {
    console.log("Simulation module not loaded yet.");
    return null;
  }

  runCppTests();

  const sideBlue = new Side({
    id: randomUUID(),
    name: "BLUE",
    sideColor: "blue",
  });
  const sideRed = new Side({
    id: randomUUID(),
    name: "RED",
    sideColor: "red",
  });
  const currentScenario = new Scenario({
    id: randomUUID(),
    name: "Test Scenario",
    startTime: 1699073110,
    currentTime: 1699073110,
    duration: 14400,
    sides: [sideBlue, sideRed],
    timeCompression: 1,
  });
  const theGame = new Game(currentScenario);
  theGame.currentSideName = sideBlue.name;
  const projection = getProjection(DEFAULT_OL_PROJECTION_CODE) ?? undefined;

  theGame.loadScenario(JSON.stringify(SCSScenarioJson)); // loads default scenario for easier testing

  return (
    <div className="App">
      <CurrentScenarioTimeProvider>
        <CurrentGameStatusProvider>
          <CurrentMouseMapCoordinatesProvider>
            <ScenarioMap
              center={transform(
                theGame.mapView.currentCameraCenter,
                "EPSG:4326",
                DEFAULT_OL_PROJECTION_CODE
              )}
              zoom={theGame.mapView.currentCameraZoom}
              game={theGame}
              projection={projection}
            ></ScenarioMap>
          </CurrentMouseMapCoordinatesProvider>
        </CurrentGameStatusProvider>
      </CurrentScenarioTimeProvider>
    </div>
  );
}
