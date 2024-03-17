import React from "react";
import { v4 as uuidv4 } from "uuid";

import {
  get as getProjection, transform,
} from 'ol/proj.js';

import './styles/App.css';
import ScenarioMap from './gui/map/ScenarioMap';
import Side from './game/Side';
import Scenario from './game/Scenario';
import Game from './game/Game';
import { DEFAULT_OL_PROJECTION_CODE } from "./utils/constants";
import defaultScenarioJson from './scenarios/default_scenario.json';
import SCSScenarioJson from './scenarios/SCS.json';
import { CurrentScenarioTimeProvider } from "./gui/map/CurrentScenarioTimeProvider";

export default function App() {
  const sideBlue = new Side({
    id: uuidv4(),
    name: 'BLUE',
    sideColor: 'blue'
  });
  const sideRed = new Side({
    id: uuidv4(),
    name: 'RED',
    sideColor: 'red'
  });
  const currentScenario = new Scenario({
    id: uuidv4(),
    name: 'Test Scenario',
    startTime: 1699073110,
    currentTime: 1699073110,
    duration: 14400,
    sides: [sideBlue, sideRed],
    timeCompression: 1
  });
  const theGame = new Game(currentScenario);
  theGame.currentSideName = sideBlue.name;
  const projection = getProjection(DEFAULT_OL_PROJECTION_CODE) ?? undefined;

  theGame.loadScenario(JSON.stringify(SCSScenarioJson)); // loads default scenario for easier testing

  return (
    <div className="App">
      <CurrentScenarioTimeProvider>
        <ScenarioMap center={transform(theGame.mapView.defaultCenter, 'EPSG:4326', DEFAULT_OL_PROJECTION_CODE)} zoom={theGame.mapView.defaultZoom} game={theGame} projection={projection}></ScenarioMap>   
      </CurrentScenarioTimeProvider>
    </div>
  );
}
