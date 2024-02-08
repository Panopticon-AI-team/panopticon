import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ReactComponent as FlightIcon } from './assets/flight_black_24dp.svg';
import { ReactComponent as RadarIcon } from './assets/radar_black_24dp.svg';
import { ReactComponent as FlightTakeoffIcon } from './assets/flight_takeoff_black_24dp.svg';
import Chip from '@mui/material/Chip';
import { unixToLocalTime } from '../utils/utils';
import Game from '../game/Game';
import { v4 as uuidv4 } from "uuid";

interface ToolBarProps {
    addAircraftOnClick: () => void;
    addFacilityOnClick: () => void;
    addBaseOnClick: () => void;
    playOnClick: () => void;
    pauseOnClick: () => void;
    switchCurrentSideOnClick: () => void;
    refreshAllLayers: () => void;
    scenarioCurrentTime: number;
    scenarioCurrentSideName: string;
    game: Game;
}

export default function ToolBar({ addAircraftOnClick, addFacilityOnClick, addBaseOnClick, playOnClick, pauseOnClick, switchCurrentSideOnClick, refreshAllLayers, scenarioCurrentTime, scenarioCurrentSideName, game }: Readonly<ToolBarProps>) {

  const toolbarStyle = {
    backgroundColor: "#282c34",
  }

  const currentTimeChipStyle = {
    backgroundColor: "white",
  }

  const exportScenario = () => {
    const exportObject = game.exportCurrentScenario();
    const exportName = "panopticon_scenario_" + uuidv4();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObject);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const loadScenario = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (readerEvent) => {
          game.loadScenario(readerEvent.target?.result as string);
          refreshAllLayers();
        }
      }
    }
    input.click();
  }

  return (
    <Stack spacing={2} direction="row" style={toolbarStyle}>
      <Chip label={"Current time: " + unixToLocalTime(scenarioCurrentTime)} style={currentTimeChipStyle} />
      <Button variant="contained" color="success" onClick={playOnClick} startIcon={<PlayArrowIcon/>}>PLAY</Button>
      <Button variant="contained" color="error" onClick={pauseOnClick} startIcon={<PauseIcon/>}>PAUSE</Button>
      <Button variant="contained" onClick={switchCurrentSideOnClick}>Current side: {scenarioCurrentSideName}</Button>
      <Button variant="contained" onClick={addAircraftOnClick} startIcon={<FlightIcon/>}>Add aircraft</Button>
      <Button variant="contained" onClick={addBaseOnClick} startIcon={<FlightTakeoffIcon/>}>Add base</Button>
      <Button variant="contained" onClick={addFacilityOnClick} startIcon={<RadarIcon/>}>Add SAM</Button>
      <Button variant="contained" onClick={exportScenario} startIcon={<DownloadIcon/>}>EXPORT SCENARIO</Button>
      <Button variant="contained" onClick={loadScenario} startIcon={<CloudUploadIcon/>}>LOAD SCENARIO</Button>
    </Stack>
  );
}
