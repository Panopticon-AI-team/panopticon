import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RedoIcon from '@mui/icons-material/Redo';
import { ReactComponent as FlightIcon } from '../assets/flight_black_24dp.svg';
import { ReactComponent as RadarIcon } from '../assets/radar_black_24dp.svg';
import { ReactComponent as FlightTakeoffIcon } from '../assets/flight_takeoff_black_24dp.svg';
import Chip from '@mui/material/Chip';
import { unixToLocalTime } from '../../utils/utils';
import Game from '../../game/Game';
import { v4 as uuidv4 } from "uuid";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface ToolBarProps {
    addAircraftOnClick: () => void;
    addFacilityOnClick: () => void;
    addAirbaseOnClick: () => void;
    playOnClick: () => void;
    stepOnClick: () => void;
    pauseOnClick: () => void;
    toggleScenarioTimeCompressionOnClick: () => void;
    switchCurrentSideOnClick: () => void;
    refreshAllLayers: () => void;
    updateMapView: (center: number[], zoom: number) => void;
    updateScenarioTimeCompression: (scenarioTimeCompression: number) => void;
    scenarioCurrentTime: number;
    scenarioTimeCompression: number;
    scenarioCurrentSideName: string;
    game: Game;
    featureLabelVisibility: boolean;
    toggleFeatureLabelVisibility: (featureLabelVisibility: boolean) => void;
}

export default function ToolBar(props: Readonly<ToolBarProps>) {

  const toolbarStyle = {
    backgroundColor: "#282c34",
  }

  const currentTimeChipStyle = {
    backgroundColor: "white",
  }

  const exportScenario = () => {
    props.pauseOnClick()
    const exportObject = props.game.exportCurrentScenario();
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
    props.pauseOnClick()
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (readerEvent) => {
          props.game.loadScenario(readerEvent.target?.result as string);
          props.updateMapView(props.game.mapView.defaultCenter, props.game.mapView.defaultZoom);
          props.updateScenarioTimeCompression(props.game.currentScenario.timeCompression)
          props.refreshAllLayers();
        }
      }
    }
    input.click();
  }

  return (
    <Stack spacing={2} direction="row" style={toolbarStyle}>
      <Chip label={"Current time: " + unixToLocalTime(props.scenarioCurrentTime)} style={currentTimeChipStyle} />
      <Button variant="contained" onClick={props.toggleScenarioTimeCompressionOnClick}>Game Speed: {props.scenarioTimeCompression}X</Button>
      <Button variant="contained" color="success" onClick={props.playOnClick} startIcon={<PlayArrowIcon/>}>PLAY</Button>
      <Button variant="contained" color="error" onClick={props.pauseOnClick} startIcon={<PauseIcon/>}>PAUSE</Button>
      <Button variant="contained" onClick={props.stepOnClick} startIcon={<RedoIcon/>}>STEP</Button>
      <Button variant="contained" onClick={props.switchCurrentSideOnClick}>Current side: {props.scenarioCurrentSideName}</Button>
      <Button variant="contained" onClick={props.addAircraftOnClick} startIcon={<FlightIcon/>}>Add aircraft</Button>
      <Button variant="contained" onClick={props.addAirbaseOnClick} startIcon={<FlightTakeoffIcon/>}>Add airbase</Button>
      <Button variant="contained" onClick={props.addFacilityOnClick} startIcon={<RadarIcon/>}>Add SAM</Button>
      <Button variant="contained" onClick={exportScenario} startIcon={<DownloadIcon/>}>EXPORT SCENARIO</Button>
      <Button variant="contained" onClick={loadScenario} startIcon={<CloudUploadIcon/>}>LOAD SCENARIO</Button>
      <Button variant="contained" onClick={() => {props.toggleFeatureLabelVisibility(!props.featureLabelVisibility)}} startIcon={props.featureLabelVisibility ? <VisibilityIcon/> : <VisibilityOffIcon/>}>{"LABELS " + (props.featureLabelVisibility ? "ON" : "OFF")}</Button>
    </Stack>
  );
}
