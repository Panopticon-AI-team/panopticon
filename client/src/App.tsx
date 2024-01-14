import React from 'react';
import './styles/App.css';
import GameMap from './mapComponents/map/GameMap';

function App() {
  return (
    <div className="App">
      <GameMap center={[0, 0]} zoom={12}></GameMap>
    </div>
  );
}

export default App;
