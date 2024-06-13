import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { v4 as uuidv4 } from "uuid";

import Game from "../../../game/Game";
import { colorPalette } from "../../../utils/constants";
import { ReactComponent as PanopticonLogoSvg } from "../../assets/panopticon.svg";
import ToolbarCollapsible from "./ToolbarCollapsible";
import CurrentActionContextDisplay from "./CurrentActionContextDisplay";

const drawerWidth = 300;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
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

const formatSideName = (sideName: string) => {
  return sideName.charAt(0) + sideName.slice(1).toLowerCase();
};

export default function Toolbar(props: Readonly<ToolBarProps>) {
  const [currentScenarioFile, setCurrentScenarioFile] = useState<File | null>(
    null
  );
  const [initialScenarioString, setInitialScenarioString] = useState<string>(
    props.game.exportCurrentScenario()
  );
  const [scenarioPaused, setScenarioPaused] = useState<boolean>(
    props.game.scenarioPaused
  );
  const [addUnitSelectorValue, setAddUnitSelectorValue] =
    React.useState("aircraft");

  const toolbarDrawerStyle = {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      backgroundColor: colorPalette.lightGray,
      overflow: "hidden",
    },
  };
  const toolbarDrawerHeaderStyle = {
    backgroundColor: colorPalette.lightGray,
  };
  const homepageButtonStyle = {
    backgroundColor: colorPalette.lightGray,
    color: colorPalette.black,
    justifyContent: "left",
    width: "100%",
    height: "100%",
    textTransform: "none",
    fontWeight: "bold",
  };
  const stackStyle = {
    padding: "2px",
  };
  const toggleStyle = {
    border: 1,
    backgroundColor: colorPalette.white,
    color: colorPalette.black,
    borderRadius: "16px",
    borderColor: colorPalette.lightGray,
    justifyContent: "left",
    textTransform: "none",
    fontStyle: "normal",
    lineHeight: "normal",
  };
  const displayChipStyle = (backgroundColor: string, color: string) => {
    return {
      width: "90px",
      backgroundColor: backgroundColor,
      color: color,
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

  const handleAddUnitClick = () => {
    switch (addUnitSelectorValue) {
      case "aircraft":
        props.addAircraftOnClick();
        break;
      case "airbase":
        props.addAirbaseOnClick();
        break;
      case "facility":
        props.addFacilityOnClick();
        break;
      case "ship":
        props.addShipOnClick();
        break;
      default:
        break;
    }
  };

  const handleAddUnitSelectorChange = (unitType: string) => {
    setAddUnitSelectorValue(unitType);
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
        props.toggleBaseMapLayer();
        break;
      case "6":
        event.preventDefault();
        props.toggleRouteVisibility(!props.routeVisibility);
        break;
      case "7":
        event.preventDefault();
        props.toggleThreatRangeVisibility(!props.threatRangeVisibility);
        break;
      case "8":
        event.preventDefault();
        props.toggleFeatureLabelVisibility(!props.featureLabelVisibility);
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
      <Stack spacing={1} direction="row">
        <Stack spacing={1} direction="column" sx={stackStyle}>
          <Button variant="contained" sx={toggleStyle} onClick={loadScenario}>
            Upload Scenario
          </Button>
          <Button variant="contained" sx={toggleStyle} onClick={exportScenario}>
            Save Scenario
          </Button>
          <Tooltip title="Reload the scenario. Shortcut: R" placement="right">
            <Button
              variant="contained"
              sx={toggleStyle}
              onClick={reloadScenario}
            >
              Restart Scenario
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
    );
  };

  const editUnitSection = () => {
    return (
      <select
        value={addUnitSelectorValue}
        onChange={(event) => handleAddUnitSelectorChange(event.target.value)}
        aria-label="UnitType"
        style={{
          width: "112px",
          height: "30px",
          marginTop: "26px",
        }}
      >
        <option value={"aircraft"}>Aircraft</option>
        <option value={"airbase"}>Airbase</option>
        <option value={"facility"}>SAM</option>
        <option value={"ship"}>Ship</option>
      </select>
    );
  };

  const editScenarioSection = () => {
    return (
      <Stack spacing={1} direction="row" sx={stackStyle}>
        <Stack spacing={3} direction="column" sx={stackStyle}>
          <Tooltip title="Switch sides. Shortcut: S" placement="top">
            <Button
              variant="contained"
              sx={toggleStyle}
              onClick={props.switchCurrentSideOnClick}
            >
              Toggle Side
            </Button>
          </Tooltip>
          {editUnitSection()}
        </Stack>
        <Stack spacing={3} direction="column" sx={stackStyle}>
          <Chip
            label={formatSideName(props.scenarioCurrentSideName)}
            sx={displayChipStyle(
              props.game.currentScenario.getSideColor(
                props.scenarioCurrentSideName
              ),
              colorPalette.white
            )}
          />
          <Button
            variant="contained"
            sx={toggleStyle}
            onClick={handleAddUnitClick}
          >
            Add Unit
          </Button>
        </Stack>
      </Stack>
    );
  };

  const runScenarioSection = () => {
    return (
      <Stack spacing={1} direction="row" sx={stackStyle}>
        <Stack spacing={1} direction="column" sx={stackStyle}>
          <Tooltip
            title="Change the scenario time compression. Shortcut: F"
            placement="top"
          >
            <Button
              variant="contained"
              sx={toggleStyle}
              onClick={props.toggleScenarioTimeCompressionOnClick}
            >
              Toggle Speed
            </Button>
          </Tooltip>
          <Tooltip
            title="Play/pause the scenario. Shortcut: SPACEBAR"
            placement="right"
          >
            <Button
              variant="contained"
              sx={toggleStyle}
              onClick={handlePlayClick}
            >
              Play/Pause
            </Button>
          </Tooltip>
          <Tooltip
            title="Step the scenario forwards. Shortcut: N"
            placement="bottom"
          >
            <Button
              variant="contained"
              sx={toggleStyle}
              onClick={handleStepClick}
            >
              Step
            </Button>
          </Tooltip>
        </Stack>
        <Stack spacing={1} direction="column" sx={stackStyle}>
          <Chip
            label={props.scenarioTimeCompression + "x"}
            sx={displayChipStyle(colorPalette.darkGray, colorPalette.white)}
          />
          <Chip
            label={scenarioPaused ? "Paused" : "Playing"}
            sx={displayChipStyle(
              scenarioPaused ? "red" : "green",
              colorPalette.white
            )}
          />
        </Stack>
      </Stack>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={toolbarDrawerStyle}
        variant="persistent"
        anchor="left"
        open={true}
      >
        <DrawerHeader sx={toolbarDrawerHeaderStyle}>
          <Button
            variant="text"
            sx={homepageButtonStyle}
            startIcon={<PanopticonLogoSvg />}
            href="https://panopticon-ai.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Panopticon AI
          </Button>
        </DrawerHeader>
        <Divider />
        <List disablePadding>
          <Stack spacing={0.5} direction="column" sx={stackStyle}>
            <CurrentActionContextDisplay />
          </Stack>
          <ToolbarCollapsible
            title="File"
            content={fileOperationsSection()}
            width={drawerWidth - 20}
            height={95}
            open={true}
          />
          <ToolbarCollapsible
            title="Edit Scenario"
            content={editScenarioSection()}
            width={drawerWidth - 20}
            height={95}
            open={true}
          />
          <ToolbarCollapsible
            title="Run Scenario"
            content={runScenarioSection()}
            width={drawerWidth - 20}
            height={95}
            open={true}
          />
        </List>
      </Drawer>
    </Box>
  );
}
