import React, { useState } from 'react';
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
import Game from '../../game/Game';
import { v4 as uuidv4 } from "uuid";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ReplayIcon from '@mui/icons-material/Replay';
import CurrentTimeDisplay from './CurrentTimeDisplay';

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
    updateCurrentScenarioTimeToContext: () => void;
    scenarioTimeCompression: number;
    scenarioCurrentSideName: string;
    game: Game;
    featureLabelVisibility: boolean;
    toggleFeatureLabelVisibility: (featureLabelVisibility: boolean) => void;
    toggleBaseMapLayer: () => void;
}

export default function ToolBar(props: Readonly<ToolBarProps>) {
  const [currentScenarioFile, setCurrentScenarioFile] = useState<File | null>(null);
  const [initialScenarioString, setInitialScenarioString] = useState<string>(props.game.exportCurrentScenario());
  const [scenarioPaused, setScenarioPaused] = useState<boolean>(props.game.scenarioPaused);
  const defaultButtonColor = "#676767"

  const toolbarStyle = {
    backgroundColor: "#282c34",
    padding: "10px",
  }

  const buttonStyle = (backgroundColor: string) => {
    return {
      backgroundColor: backgroundColor,
    }
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
          props.updateCurrentScenarioTimeToContext();
        }
        setCurrentScenarioFile(file);
      }
    }
    input.click();
  }

  const reloadScenario = () => {
    props.pauseOnClick()
    if (currentScenarioFile) {
      const reader = new FileReader();
      reader.readAsText(currentScenarioFile, "UTF-8");
      reader.onload = (readerEvent) => {
        props.game.loadScenario(readerEvent.target?.result as string);
        props.updateMapView(props.game.mapView.defaultCenter, props.game.mapView.defaultZoom);
        props.updateScenarioTimeCompression(props.game.currentScenario.timeCompression)
        props.refreshAllLayers();
        props.updateCurrentScenarioTimeToContext();
      }
    } else {
      props.game.loadScenario(initialScenarioString);
      props.updateMapView(props.game.mapView.defaultCenter, props.game.mapView.defaultZoom);
      props.updateScenarioTimeCompression(props.game.currentScenario.timeCompression)
      props.refreshAllLayers();
      props.updateCurrentScenarioTimeToContext();
    }
  }

  const handlePlayClick = () => {
    setScenarioPaused(false);
    props.playOnClick()
  }

  const handlePauseClick = () => {
    setScenarioPaused(true);
    props.pauseOnClick()
  }

  const handleStepClick = () => {
    setScenarioPaused(true);
    props.stepOnClick()
  }

  return (
    <Stack spacing={2} direction="row" style={toolbarStyle}>
      <CurrentTimeDisplay/>
      <Button variant="contained" style={buttonStyle(defaultButtonColor)} onClick={props.toggleScenarioTimeCompressionOnClick}>Game Speed: {props.scenarioTimeCompression}X</Button>
      <Button variant="contained" color="success" onClick={handlePlayClick} startIcon={<PlayArrowIcon/>}>{scenarioPaused ? "PLAY": "PLAYING"}</Button>
      <Button variant="contained" color="error" onClick={handlePauseClick} startIcon={<PauseIcon/>}>{scenarioPaused ? "PAUSED": "PAUSE"}</Button>
      <Button variant="contained" style={buttonStyle(defaultButtonColor)} onClick={handleStepClick} startIcon={<RedoIcon/>}>STEP</Button>
      <Button variant="contained" style={buttonStyle(props.game.currentScenario.getSideColor(props.scenarioCurrentSideName))} onClick={props.switchCurrentSideOnClick}>Current side: {props.scenarioCurrentSideName}</Button>
      <Button variant="contained" style={buttonStyle(defaultButtonColor)} onClick={() => {props.toggleFeatureLabelVisibility(!props.featureLabelVisibility)}} startIcon={props.featureLabelVisibility ? <VisibilityIcon/> : <VisibilityOffIcon/>}>{"LABELS " + (props.featureLabelVisibility ? "ON" : "OFF")}</Button>
      <Button variant="contained" style={buttonStyle(defaultButtonColor)} onClick={props.toggleBaseMapLayer} startIcon={<VisibilityIcon/>}>SWITCH MAP</Button>
      <Button variant="contained" style={buttonStyle(defaultButtonColor)} onClick={props.addAircraftOnClick} startIcon={<FlightIcon/>}>Add aircraft</Button>
      <Button variant="contained" style={buttonStyle(defaultButtonColor)} onClick={props.addAirbaseOnClick} startIcon={<FlightTakeoffIcon/>}>Add airbase</Button>
      <Button variant="contained" style={buttonStyle(defaultButtonColor)} onClick={props.addFacilityOnClick} startIcon={<RadarIcon/>}>Add SAM</Button>
      <Button variant="contained" style={buttonStyle(defaultButtonColor)} onClick={exportScenario} startIcon={<DownloadIcon/>}>EXPORT SCENARIO</Button>
      <Button variant="contained" style={buttonStyle(defaultButtonColor)} onClick={loadScenario} startIcon={<CloudUploadIcon/>}>LOAD SCENARIO</Button>
      <Button variant="contained" style={buttonStyle(defaultButtonColor)} onClick={reloadScenario} startIcon={<ReplayIcon/>}>RELOAD SCENARIO</Button>
    </Stack>
  );
}
