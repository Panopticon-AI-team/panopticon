import React from "react";
import { v4 as uuidv4 } from "uuid";

import {
  get as getProjection,
} from 'ol/proj.js';

import './styles/App.css';
import ScenarioMap from './gui/map/ScenarioMap';
import Side from './game/Side';
import Scenario from './game/Scenario';
import Game from './game/Game';
import { DEFAULT_OL_PROJECTION_CODE } from "./utils/constants";

export default function App() {
  const sideBlue = new Side(uuidv4(), 'BLUE');
  sideBlue.sideColor = 'blue';
  const sideRed = new Side(uuidv4(), 'RED');
  sideRed.sideColor = 'red';
  const currentScenario = new Scenario(uuidv4(), 'Test Scenario', 1699073110, 14400, [sideBlue, sideRed]);
  const theGame = new Game(currentScenario);
  theGame.currentSideName = sideBlue.name;
  const projection = getProjection(DEFAULT_OL_PROJECTION_CODE);

  return (
    <div className="App">
      <ScenarioMap center={[0, 0]} zoom={5} game={theGame} projection={projection}></ScenarioMap>   
    </div>
  );
}
