import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import CollapsibleCard from './CollapsibleCard';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DownloadIcon from "@mui/icons-material/Download";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RedoIcon from "@mui/icons-material/Redo";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import { ReactComponent as FlightIcon } from "../../assets/flight_black_24dp.svg";
import { ReactComponent as RadarIcon } from "../../assets/radar_black_24dp.svg";
import { ReactComponent as FlightTakeoffIcon } from "../../assets/flight_takeoff_black_24dp.svg";
import Game from "../../../game/Game";
import { v4 as uuidv4 } from "uuid";
import ReplayIcon from "@mui/icons-material/Replay";
import CurrentActionContextDisplay from "./CurrentActionContextDisplay";
import { Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const drawerWidth = 300;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
}));

interface ToolBarProps {
  addAircraftOnClick: () => void;
  addFacilityOnClick: () => void;
  addAirbaseOnClick: () => void;
  addShipOnClick: () => void;
  playOnClick: () => void;
  stepOnClick: () => void;
  pauseOnClick: () => void;
  toggleScenarioTimeCompressionOnClick: () => void;
  switchCurrentSideOnClick: () => void;
  refreshAllLayers: () => void;
  updateMapView: (center: number[], zoom: number) => void;
  updateScenarioTimeCompression: (scenarioTimeCompression: number) => void;
  updateCurrentSideName: (currentSideName: string) => void;
  updateCurrentScenarioTimeToContext: () => void;
  scenarioTimeCompression: number;
  scenarioCurrentSideName: string;
  game: Game;
  featureLabelVisibility: boolean;
  toggleFeatureLabelVisibility: (featureLabelVisibility: boolean) => void;
  threatRangeVisibility: boolean;
  toggleThreatRangeVisibility: (threatRangeVisibility: boolean) => void;
  routeVisibility: boolean;
  toggleRouteVisibility: (routeVisibility: boolean) => void;
  toggleBaseMapLayer: () => void;
  keyboardShortcutsEnabled: boolean;
}

export default function SideToolBar(props: Readonly<ToolBarProps>) {
  const [currentScenarioFile, setCurrentScenarioFile] = useState<File | null>(
    null
  );
  const [initialScenarioString, setInitialScenarioString] = useState<string>(
    props.game.exportCurrentScenario()
  );
  const [scenarioPaused, setScenarioPaused] = useState<boolean>(
    props.game.scenarioPaused
  );
  const [expandEditScenarioSection, setExpandEditScenarioSection] = useState<boolean>(false);
  const defaultButtonColor = "#676767";
  const toolbarStyle = {
    backgroundColor: "#282c34",
    padding: "5px",
    alignItems: "left",
    marginLeft: "0",
    marginRight: "auto",
  };
  const buttonStyle = (backgroundColor: string) => {
    return {
      backgroundColor: backgroundColor,
      justifyContent: "left",
    };
  };

  const exportScenario = () => {
    props.pauseOnClick();
    const exportObject = props.game.exportCurrentScenario();
    const exportName = "panopticon_scenario_" + uuidv4();
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(exportObject);
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const loadScenario = () => {
    props.pauseOnClick();
    setScenarioPaused(true);
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (readerEvent) => {
          props.game.loadScenario(readerEvent.target?.result as string);
          props.updateMapView(
            props.game.mapView.defaultCenter,
            props.game.mapView.defaultZoom
          );
          props.updateScenarioTimeCompression(
            props.game.currentScenario.timeCompression
          );
          props.updateCurrentSideName(props.game.currentSideName);
          props.refreshAllLayers();
          props.updateCurrentScenarioTimeToContext();
        };
        setCurrentScenarioFile(file);
      }
    };
    input.click();
  };

  const reloadScenario = () => {
    props.pauseOnClick();
    setScenarioPaused(true);
    if (currentScenarioFile) {
      const reader = new FileReader();
      reader.readAsText(currentScenarioFile, "UTF-8");
      reader.onload = (readerEvent) => {
        props.game.loadScenario(readerEvent.target?.result as string);
        props.updateMapView(
          props.game.mapView.defaultCenter,
          props.game.mapView.defaultZoom
        );
        props.updateScenarioTimeCompression(
          props.game.currentScenario.timeCompression
        );
        props.updateCurrentSideName(props.game.currentSideName);
        props.refreshAllLayers();
        props.updateCurrentScenarioTimeToContext();
      };
    } else {
      props.game.loadScenario(initialScenarioString);
      props.updateMapView(
        props.game.mapView.defaultCenter,
        props.game.mapView.defaultZoom
      );
      props.updateScenarioTimeCompression(
        props.game.currentScenario.timeCompression
      );
      props.updateCurrentSideName(props.game.currentSideName);
      props.refreshAllLayers();
      props.updateCurrentScenarioTimeToContext();
    }
  };

  const handlePlayClick = () => {
    if (scenarioPaused) {
      setScenarioPaused(false);
      props.playOnClick();
    } else {
      setScenarioPaused(true);
      props.pauseOnClick();
    }
  };

  const handleStepClick = () => {
    setScenarioPaused(true);
    props.stepOnClick();
  };

  const keyboardEventHandler = (event: KeyboardEvent) => {
    const key = event.key;
    switch (key) {
      case " ":
        event.preventDefault();
        handlePlayClick();
        break;
      case "n":
        event.preventDefault();
        handleStepClick();
        break;
      case "r":
        event.preventDefault();
        reloadScenario();
        break;
      case "f":
        event.preventDefault();
        props.toggleScenarioTimeCompressionOnClick();
        break;
      case "s":
        event.preventDefault();
        props.switchCurrentSideOnClick();
        break;
      case "1":
        event.preventDefault();
        props.addAircraftOnClick();
        break;
      case "2":
        event.preventDefault();
        props.addAirbaseOnClick();
        break;
      case "3":
        event.preventDefault();
        props.addFacilityOnClick();
        break;
      case "4":
        event.preventDefault();
        props.addShipOnClick();
        break;
      case "5":
        event.preventDefault();
        props.toggleFeatureLabelVisibility(!props.featureLabelVisibility);
        break;
      case "6":
        event.preventDefault();
        props.toggleThreatRangeVisibility(!props.threatRangeVisibility);
        break;
      case "7":
        event.preventDefault();
        props.toggleRouteVisibility(!props.routeVisibility);
        break;
      case "8":
        event.preventDefault();
        props.toggleBaseMapLayer();
        break;
      default:
        break;
    }
  };

  if (props.keyboardShortcutsEnabled) {
    document.onkeydown = keyboardEventHandler;
  } else {
    document.onkeydown = null;
  }

  const fileOperationsSection = () => {
    return (
      <Stack spacing={1} direction="column" style={{...toolbarStyle}}>
        <Button
          variant="contained"
          style={buttonStyle(defaultButtonColor)}
          onClick={exportScenario}
          // startIcon={<DownloadIcon />}
        >
          EXPORT SCENARIO
        </Button>
        <Button
          variant="contained"
          style={buttonStyle(defaultButtonColor)}
          onClick={loadScenario}
          // startIcon={<CloudUploadIcon />}
        >
          LOAD SCENARIO
        </Button>
        <Tooltip title="Reload the scenario. Shortcut: R" placement="right">
          <Button
            variant="contained"
            style={buttonStyle(defaultButtonColor)}
            onClick={reloadScenario}
            // startIcon={<ReplayIcon />}
          >
            RELOAD SCENARIO
          </Button>
        </Tooltip>   
      </Stack>          
    )
  }

  const editUnitSection = () => {
    return (
      <Stack spacing={1} direction="column" style={toolbarStyle}>
        <Tooltip title="Add an aircraft. Shortcut: 1" placement="right">
          <Button
            variant="contained"
            style={buttonStyle(defaultButtonColor)}
            onClick={props.addAircraftOnClick}
            // startIcon={<FlightIcon />}
          >
            Add aircraft
          </Button>
        </Tooltip>
        <Tooltip title="Add an airbase. Shortcut: 2" placement="right">
          <Button
            variant="contained"
            style={buttonStyle(defaultButtonColor)}
            onClick={props.addAirbaseOnClick}
            // startIcon={<FlightTakeoffIcon />}
          >
            Add airbase
          </Button>
        </Tooltip>
        <Tooltip title="Add a facility. Shortcut: 3" placement="right">
          <Button
            variant="contained"
            style={buttonStyle(defaultButtonColor)}
            onClick={props.addFacilityOnClick}
            // startIcon={<RadarIcon />}
          >
            Add SAM
          </Button>
        </Tooltip>
        <Tooltip title="Add a ship. Shortcut: 4" placement="right">
          <Button
            variant="contained"
            style={buttonStyle(defaultButtonColor)}
            onClick={props.addShipOnClick}
            // startIcon={<DirectionsBoatIcon />}
          >
            Add Ship
          </Button>
        </Tooltip>
      </Stack>
    )    
  }

  const editScenarioSection = () => {
    return (
      <Stack spacing={2} direction="column" style={toolbarStyle}>
        <Tooltip title="Switch sides. Shortcut: S" placement="right">
          <Button
            variant="contained"
            style={buttonStyle(
              props.game.currentScenario.getSideColor(
                props.scenarioCurrentSideName
              )
            )}
            onClick={props.switchCurrentSideOnClick}
          >
            Current side: {props.scenarioCurrentSideName}
          </Button>
        </Tooltip>
        <CollapsibleCard
          title="Add Unit"
          content={editUnitSection()}
          width={drawerWidth - 80}
          height={150}
          expandParent={setExpandEditScenarioSection}
          open={false}
          />                
      </Stack>    
    )    
  }

  const runScenarioSection = () => {
    return (
      <Stack spacing={1} direction="column" style={toolbarStyle}>
        <Tooltip title="Play/pause the scenario. Shortcut: SPACEBAR" placement="right">
          <Button
            variant="contained"
            style={buttonStyle(scenarioPaused ? "green" : "red")}
            onClick={handlePlayClick}
            // startIcon={scenarioPaused ? <PlayArrowIcon /> : <PauseIcon />}
          >
            {scenarioPaused ? "PLAY" : "PAUSE"}
          </Button>
        </Tooltip>
        <Tooltip title="Step the scenario forwards. Shortcut: N" placement="right">
          <Button
            variant="contained"
            style={buttonStyle(defaultButtonColor)}
            onClick={handleStepClick}
            // startIcon={<RedoIcon />}
          >
            STEP
          </Button>
        </Tooltip> 
        <Tooltip title="Change the scenario time compression. Shortcut: F" placement="right">
          <Button
            variant="contained"
            style={buttonStyle(defaultButtonColor)}
            onClick={props.toggleScenarioTimeCompressionOnClick}
          >
            Game Speed: {props.scenarioTimeCompression}X
          </Button>
        </Tooltip>             
      </Stack>    
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: "#282c34",
            overflow: "hidden",
          },
        }}
        variant="persistent"
        anchor="left"
        open={true}
      >
        <DrawerHeader sx={{backgroundColor: defaultButtonColor}}>
          <Stack spacing={2} direction="row" style={{width: "100%"}}>
            <Button
              variant="contained"
              style={
                {
                  backgroundColor: defaultButtonColor,
                  justifyContent: "left",
                  width: "100%",
                  height: "100%",
                }
              }
              startIcon={<HomeIcon />}
              href="https://panopticon-ai.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              HOME
            </Button>
          </Stack>
        </DrawerHeader>       
        <Divider />
        <List disablePadding>
          <Stack spacing={0.5} direction="column" style={toolbarStyle}>
            <CurrentActionContextDisplay />          
          </Stack>           
          <CollapsibleCard
            title="File"
            content={fileOperationsSection()}
            width={drawerWidth - 20}
            height={125}
            open={false}
            />
          <CollapsibleCard
            title="Edit Scenario"
            content={editScenarioSection()}
            width={drawerWidth - 20}
            height={expandEditScenarioSection ? 300 : 100}
            open={false}
            />
          <CollapsibleCard
            title="Run Scenario"
            content={runScenarioSection()}
            width={drawerWidth - 20}
            height={125}
            open={true}
          />
        </List>
      </Drawer>
    </Box>
  );
}
