import React from "react";
import { v4 as uuidv4 } from "uuid";

import './styles/App.css';
import ScenarioMap from './gui/map/ScenarioMap';
import Side from './game/Side';
import Scenario from './game/Scenario';
import Game from './game/Game';

export default function App() {
  const sideBlue = new Side(uuidv4(), 'BLUE');
  const sideRed = new Side(uuidv4(), 'RED');
  const currentScenario = new Scenario(uuidv4(), 'Test Scenario', 1699073110, 14400, [sideBlue, sideRed]);
  const theGame = new Game(currentScenario);
  theGame.currentSideName = sideBlue.name;

  return (
    <div className="App">
      <ScenarioMap center={[0, 0]} zoom={3} game={theGame}></ScenarioMap>   
    </div>
  );
}
