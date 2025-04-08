import React, { useContext, useState } from "react";
import {
  AppBar,
  Avatar,
  Button,
  CardActions,
  CardHeader,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Game from "@/game/Game";
import { AircraftDb, AirbaseDb, FacilityDb, ShipDb } from "@/game/db/UnitDb";
import { APP_DRAWER_WIDTH, colorPalette } from "@/utils/constants";
import PanopticonLogoSvg from "@/gui/assets/svg/panopticon.svg?react";
import ToolbarCollapsible from "@/gui/map/toolbar/ToolbarCollapsible";
import CurrentActionContextDisplay from "@/gui/map/toolbar/CurrentActionContextDisplay";
import MenuIcon from "@mui/icons-material/Menu";
import { Toolbar as MapToolbar } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import EraserIcon from "@/gui/assets/img/eraser-icon.png";
import GodModeIcon from "@mui/icons-material/Preview";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import ClearIcon from "@mui/icons-material/Clear";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Container } from "@mui/system";
import { Pause, PlayArrow } from "@mui/icons-material";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import AirlineStopsOutlinedIcon from "@mui/icons-material/AirlineStopsOutlined";
import {
  formatSecondsToString,
  getLocalDateTime,
} from "@/utils/dateTimeFunctions";
import GitHubIcon from "@/gui/assets/img/github-mark.png";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@/gui/shared/ui/TextField";
import { ToastContext } from "@/gui/contextProviders/contexts/ToastContext";
import EntityIcon from "@/gui/map/toolbar/EntityIcon";
import { FeatureEntityState } from "@/gui/map/mapLayers/FeatureLayers";
import RecordingPlayer from "./RecordingPlayer";

interface ToolBarProps {
  mobileView: boolean;
  drawerOpen: boolean;
  featureEntitiesPlotted: FeatureEntityState[];
  addAircraftOnClick: (unitClassName: string) => void;
  addFacilityOnClick: (unitClassName: string) => void;
  addAirbaseOnClick: (unitClassName: string) => void;
  addShipOnClick: (unitClassName: string) => void;
  addReferencePointOnClick: () => void;
  playOnClick: () => void;
  stepOnClick: () => void;
  pauseOnClick: () => void;
  toggleScenarioTimeCompressionOnClick: () => void;
  toggleRecordEverySeconds: () => void;
  recordScenarioOnClick: () => void;
  stopRecordingScenarioOnClick: () => void;
  loadRecordingOnClick: () => void;
  handlePlayRecordingClick: () => void;
  handlePauseRecordingClick: () => void;
  handleStepRecordingToStep: (step: number) => void;
  handleStepRecordingBackwards: () => void;
  handleStepRecordingForwards: () => void;
  switchCurrentSideOnClick: () => void;
  refreshAllLayers: () => void;
  updateMapView: (center: number[], zoom: number) => void;
  loadFeatureEntitiesState: () => void;
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
  toggleMissionCreator: () => void;
  toggleMissionEditor: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const scenarioNameRegex: RegExp = /^[a-zA-Z0-9 :-]{1,25}$/;

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
  marginTop: "-12px",
}));

const toolbarDrawerStyle = {
  backgroundColor: colorPalette.darkGray,
  width: APP_DRAWER_WIDTH,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: APP_DRAWER_WIDTH + 13,
    boxSizing: "border-box",
    overflow: "hidden",
  },
};

const toolbarStyle = {
  backgroundColor: colorPalette.lightGray,
  borderBottom: "1px solid",
  borderBottomColor: colorPalette.darkGray,
};

export default function Toolbar(props: Readonly<ToolBarProps>) {
  const toastContext = useContext(ToastContext);
  const [selectedSide, setSelectedSide] = useState<"blue" | "red">("blue");
  const [currentScenarioFile, setCurrentScenarioFile] = useState<File | null>(
    null
  );
  const [scenarioName, setScenarioName] = useState<string>(
    props.game.currentScenario.name ?? "New Scenario"
  );
  const [scenarioNameError, setScenarioNameError] = useState<boolean>(false);
  const [initialScenarioString, setInitialScenarioString] = useState<string>(
    props.game.exportCurrentScenario()
  );
  const [scenarioPaused, setScenarioPaused] = useState<boolean>(
    props.game.scenarioPaused
  );
  const [recordingScenario, setRecordingScenario] = useState<boolean>(
    props.game.recordingScenario
  );
  const [entityFilterSelectedOptions, setEntityFilterSelectedOptions] =
    useState<string[]>([
      props.game.currentSideName.toLowerCase(),
      "aircraft",
      "airbase",
      "ship",
      "facility",
      "referencePoint",
    ]);
  const [scenarioEditNameAnchorEl, setScenarioEditNameAnchorEl] =
    useState<null | HTMLElement>(null);

  const handleOpenScenarioEditNameMenu = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setScenarioEditNameAnchorEl(event.currentTarget);
  };

  const handleCloseScenarioEditNameMenu = () => {
    setScenarioEditNameAnchorEl(null);
    setScenarioName(props.game.currentScenario.name);
  };

  const handleScenarioNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.trim();
    if (scenarioNameError) {
      if (scenarioNameRegex.test(value)) {
        setScenarioNameError(false);
      }
    }
    setScenarioName(value);
  };

  const handleScenarioNameSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!scenarioNameRegex.test(scenarioName)) {
      setScenarioNameError(true);
      return;
    }
    setScenarioNameError(false);
    props.game.currentScenario.updateScenarioName(scenarioName);
    handleCloseScenarioEditNameMenu();
    toastContext?.addToast("Scenario name updated successfully!", "success");
  };

  const [selectedAircraftUnitClass, setSelectedAircraftUnitClass] =
    useState<string>(AircraftDb[0].className);
  const [aircraftIconAnchorEl, setAircraftIconAnchorEl] =
    useState<null | HTMLElement>(null);
  const aircraftClassMenuOpen = Boolean(aircraftIconAnchorEl);
  const handleAircraftIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAircraftIconAnchorEl(event.currentTarget);
  };
  const handleAircraftIconClose = () => {
    setAircraftIconAnchorEl(null);
  };

  const [selectedAirbaseUnitClass, setSelectedAirbaseUnitClass] =
    useState<string>(AirbaseDb[0].name);
  const [airbaseIconAnchorEl, setAirbaseIconAnchorEl] =
    useState<null | HTMLElement>(null);
  const airbaseClassMenuOpen = Boolean(airbaseIconAnchorEl);
  const handleAirbaseIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAirbaseIconAnchorEl(event.currentTarget);
  };
  const handleAirbaseClose = () => {
    setAirbaseIconAnchorEl(null);
  };

  const [selectedSamUnitClass, setSelectedSamUnitClass] = useState<string>(
    FacilityDb[0].className
  );
  const [samIconAnchorEl, setSamIconAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const samClassMenuOpen = Boolean(samIconAnchorEl);
  const handleSamIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setSamIconAnchorEl(event.currentTarget);
  };
  const handleSamIconClose = () => {
    setSamIconAnchorEl(null);
  };

  const [selectedShipUnitClass, setSelectedShipUnitClass] = useState<string>(
    ShipDb[0].className
  );
  const [shipIconAnchorEl, setShipIconAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const shipClassMenuOpen = Boolean(shipIconAnchorEl);
  const handleShipIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setShipIconAnchorEl(event.currentTarget);
  };
  const handleShipIconClose = () => {
    setShipIconAnchorEl(null);
  };

  const handleSideChange = (
    _event: React.MouseEvent<HTMLElement>,
    newSelectedSide: "blue" | "red"
  ) => {
    if (newSelectedSide != null && newSelectedSide != selectedSide) {
      setSelectedSide(newSelectedSide);
      props.switchCurrentSideOnClick();
    }
  };

  const handleEntitySideChange = (
    _event: React.MouseEvent<HTMLElement>,
    newSelectedSide: string
  ) => {
    setEntityFilterSelectedOptions((prevItems: string[]) => {
      if (prevItems.includes(newSelectedSide)) {
        const updatedItems = prevItems.filter(
          (item) => item !== newSelectedSide
        );
        if (["blue", "red"].some((value) => updatedItems.includes(value))) {
          return updatedItems;
        } else {
          return prevItems;
        }
      }
      return [...prevItems, newSelectedSide];
    });
  };

  const exportScenario = () => {
    props.pauseOnClick();
    const exportObject = props.game.exportCurrentScenario();
    const [localDateString, time] = getLocalDateTime().split("T");
    const timestamp = `${localDateString.replace(/-/g, "_")}_T${time}`;
    const currentScenarioName = !scenarioName
      ? "panopticon_scenario"
      : scenarioName.trim().replace(/\s+/g, "_").toLowerCase();
    const exportName = currentScenarioName + "_" + timestamp;
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
    input.style.display = "none";
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      input.remove();
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        props.game.currentScenario.updateScenarioName(file.name);
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (readerEvent) => {
          props.game.loadScenario(readerEvent.target?.result as string);
          props.updateMapView(
            props.game.mapView.currentCameraCenter,
            props.game.mapView.currentCameraZoom
          );
          props.updateScenarioTimeCompression(
            props.game.currentScenario.timeCompression
          );
          props.updateCurrentSideName(props.game.currentSideName);
          props.game.currentScenario.updateScenarioName(
            props.game.currentScenario.name
          );
          setScenarioName(props.game.currentScenario.name);
          props.refreshAllLayers();
          props.updateCurrentScenarioTimeToContext();
          props.loadFeatureEntitiesState();
          toastContext?.addToast(
            "Scenario file uploaded successfully!",
            "success"
          );
        };
        reader.onerror = () => {
          reader.abort();
          toastContext?.addToast(
            "Failed to upload scenario file. Please refresh page or try again later.",
            "error"
          );
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
          props.game.mapView.currentCameraCenter,
          props.game.mapView.currentCameraZoom
        );
        props.updateScenarioTimeCompression(
          props.game.currentScenario.timeCompression
        );
        props.updateCurrentSideName(props.game.currentSideName);
        props.game.currentScenario.updateScenarioName(
          props.game.currentScenario.name
        );
        setScenarioName(props.game.currentScenario.name);
        props.refreshAllLayers();
        props.updateCurrentScenarioTimeToContext();
        props.loadFeatureEntitiesState();
      };
      reader.onerror = () => {
        reader.abort();
        toastContext?.addToast(
          "Failed to restart scenario. Please refresh page or try again later.",
          "error"
        );
      };
    } else {
      props.game.loadScenario(initialScenarioString);
      props.updateMapView(
        props.game.mapView.currentCameraCenter,
        props.game.mapView.currentCameraZoom
      );
      props.updateScenarioTimeCompression(
        props.game.currentScenario.timeCompression
      );
      props.updateCurrentSideName(props.game.currentSideName);
      props.game.currentScenario.updateScenarioName(
        props.game.currentScenario.name
      );
      setScenarioName(props.game.currentScenario.name);
      props.refreshAllLayers();
      props.updateCurrentScenarioTimeToContext();
      props.loadFeatureEntitiesState();
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

  const handleRecordScenarioClick = () => {
    if (recordingScenario) {
      setRecordingScenario(false);
      props.stopRecordingScenarioOnClick();
    } else {
      setRecordingScenario(true);
      props.recordScenarioOnClick();
    }
  };

  const handleStepClick = () => {
    setScenarioPaused(true);
    props.stepOnClick();
  };

  const handleUnitClassSelect = (
    unitType: "aircraft" | "airbase" | "facility" | "ship",
    unitClassName: string
  ) => {
    switch (unitType) {
      case "aircraft":
        setSelectedAircraftUnitClass(unitClassName);
        props.addAircraftOnClick(unitClassName);
        handleAircraftIconClose();
        break;
      case "airbase":
        setSelectedAirbaseUnitClass(unitClassName);
        props.addAirbaseOnClick(unitClassName);
        handleAirbaseClose();
        break;
      case "facility":
        setSelectedSamUnitClass(unitClassName);
        props.addFacilityOnClick(unitClassName);
        handleSamIconClose();
        break;
      case "ship":
        setSelectedShipUnitClass(unitClassName);
        props.addShipOnClick(unitClassName);
        handleShipIconClose();
        break;
      default:
        break;
    }
  };

  const handleGodModeToggle = () => {
    props.game.toggleGodMode();
    toastContext?.addToast(`God Mode:  ${props.game.godMode ? "ON" : "OFF"}`);
  };

  const handleEraserModeToggle = () => {
    props.game.toggleEraserMode();
    toastContext?.addToast(`Eraser:  ${props.game.eraserMode ? "ON" : "OFF"}`);
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
        setSelectedSide((prevSide) => (prevSide === "blue" ? "red" : "blue"));
        props.switchCurrentSideOnClick();
        break;
      case "g":
        event.preventDefault();
        handleGodModeToggle();
        break;
      case "e":
        event.preventDefault();
        handleEraserModeToggle();
        break;
      case "1":
        event.preventDefault();
        if (selectedAircraftUnitClass) {
          props.addAircraftOnClick(selectedAircraftUnitClass);
        }
        break;
      case "2":
        event.preventDefault();
        if (selectedAirbaseUnitClass) {
          props.addAirbaseOnClick(selectedAirbaseUnitClass);
        }
        break;
      case "3":
        event.preventDefault();
        if (selectedSamUnitClass) {
          props.addFacilityOnClick(selectedSamUnitClass);
        }
        break;
      case "4":
        event.preventDefault();
        if (selectedShipUnitClass) {
          props.addShipOnClick(selectedShipUnitClass);
        }
        break;
      case "5":
        event.preventDefault();
        props.addReferencePointOnClick();
        break;
      case "6":
        event.preventDefault();
        props.toggleBaseMapLayer();
        break;
      case "7":
        event.preventDefault();
        props.toggleRouteVisibility(!props.routeVisibility);
        break;
      case "8":
        event.preventDefault();
        props.toggleThreatRangeVisibility(!props.threatRangeVisibility);
        break;
      case "9":
        event.preventDefault();
        props.toggleFeatureLabelVisibility(!props.featureLabelVisibility);
        break;
      default:
        break;
    }
  };

  if (props.keyboardShortcutsEnabled && !scenarioEditNameAnchorEl) {
    document.onkeydown = keyboardEventHandler;
  } else {
    document.onkeydown = null;
  }

  const recordingSection = () => {
    return (
      <Stack spacing={1} direction={"column"}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Chip
            variant="outlined"
            label={recordingScenario ? "Stop Recording" : "Record"}
            onClick={handleRecordScenarioClick}
          />
          <Chip
            variant="outlined"
            label={`every ${formatSecondsToString(props.game.playbackRecorder.recordEverySeconds)}`}
            onClick={props.toggleRecordEverySeconds}
          />
          <Tooltip title="Upload Recording">
            <IconButton onClick={props.loadRecordingOnClick}>
              <UploadFileOutlinedIcon
                fontSize="medium"
                sx={{ color: "#171717" }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
        {props.game.recordingPlayer.hasRecording() && (
          <RecordingPlayer
            recordingPaused={props.game.recordingPlayer.isPaused()}
            timelineStart={props.game.recordingPlayer.getStartStepIndex()}
            timelineEnd={props.game.recordingPlayer.getEndStepIndex()}
            handlePlayRecordingClick={props.handlePlayRecordingClick}
            handlePauseRecordingClick={props.handlePauseRecordingClick}
            handleStepRecordingToStep={props.handleStepRecordingToStep}
            handleStepRecordingBackwards={props.handleStepRecordingBackwards}
            handleStepRecordingForwards={props.handleStepRecordingForwards}
            formatTimelineMark={(recordingStep: number) =>
              props.game.recordingPlayer.getStepScenarioTime(recordingStep)
            }
          />
        )}
      </Stack>
    );
  };

  const missionSection = () => {
    const currentSideId = props.game.currentScenario.getSide(
      props.game.currentSideName
    )?.id;
    const sideMissions = props.game.currentScenario.missions.filter(
      (mission) => mission.sideId === currentSideId
    );
    if (!sideMissions || !Array.isArray(sideMissions) || !sideMissions.length) {
      return <MenuItem disabled>No items available</MenuItem>;
    }

    return (
      <Stack spacing={1} direction="column">
        {sideMissions.map((mission) => (
          <Tooltip
            key={mission.id}
            placement="right"
            arrow
            title={
              <Stack direction={"column"} spacing={0.1}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Name: {mission.name.toUpperCase()}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Side Color: {mission.sideId.toUpperCase()}
                </Typography>
              </Stack>
            }
          >
            <MenuItem
              onClick={() => {
                props.toggleMissionEditor();
              }}
              key={mission.id}
              value={mission.name}
            >
              <ListItemText primary={mission.name} />
            </MenuItem>
          </Tooltip>
        ))}
      </Stack>
    );
  };

  const entityMenuButtons = () => {
    return (
      <Stack
        direction={"row"}
        spacing={props.mobileView ? 2 : 0}
        sx={
          props.mobileView
            ? { justifyContent: "center", flexWrap: "wrap" }
            : null
        }
      >
        {/** Add Aircraft Menu/Button */}
        <Tooltip title="Add Aircraft">
          <IconButton
            id="add-aircraft-icon-button"
            aria-controls={
              aircraftClassMenuOpen ? "aircraft-classes-menu" : undefined
            }
            aria-haspopup="true"
            aria-expanded={aircraftClassMenuOpen ? "true" : undefined}
            onClick={handleAircraftIconClick}
          >
            <EntityIcon type="aircraft" />
          </IconButton>
        </Tooltip>
        <Menu
          id="aircraft-classes-menu"
          anchorEl={aircraftIconAnchorEl}
          open={aircraftClassMenuOpen}
          onClose={handleAircraftIconClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            root: { sx: { ".MuiList-root": { padding: 0 } } },
            list: {
              "aria-labelledby": "add-aircraft-icon-button",
            },
          }}
        >
          <Stack
            direction={"row"}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: colorPalette.lightGray,
              pl: 2,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Select Aircraft
            </Typography>
            <IconButton onClick={handleAircraftIconClose}>
              <ClearIcon sx={{ fontSize: 15, color: "red" }} />
            </IconButton>
          </Stack>
          {AircraftDb.map((aircraft) => (
            <MenuItem
              onClick={(_event: React.MouseEvent<HTMLElement>) =>
                handleUnitClassSelect("aircraft", aircraft.className)
              }
              selected={aircraft.className === selectedAircraftUnitClass}
              key={aircraft.className}
              value={aircraft.className}
            >
              {aircraft.className}
            </MenuItem>
          ))}
        </Menu>
        {/** Add Airbase Menu/Button */}
        <Tooltip title="Add Airbase">
          <IconButton
            id="add-airbase-icon-button"
            aria-controls={
              airbaseClassMenuOpen ? "airbase-classes-menu" : undefined
            }
            aria-haspopup="true"
            aria-expanded={airbaseClassMenuOpen ? "true" : undefined}
            onClick={handleAirbaseIconClick}
          >
            <EntityIcon type="airbase" />
          </IconButton>
        </Tooltip>
        <Menu
          id="airbase-classes-menu"
          anchorEl={airbaseIconAnchorEl}
          open={airbaseClassMenuOpen}
          onClose={handleAirbaseClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            root: { sx: { ".MuiList-root": { padding: 0 } } },
            list: {
              "aria-labelledby": "add-airbase-icon-button",
            },
          }}
        >
          <Stack
            spacing={2}
            direction={"row"}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: colorPalette.lightGray,
              pl: 2,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Select Airbase
            </Typography>
            <IconButton onClick={handleAirbaseClose}>
              <ClearIcon sx={{ fontSize: 15, color: "red" }} />
            </IconButton>
          </Stack>
          {AirbaseDb.map((airbase) => (
            <MenuItem
              onClick={(_event: React.MouseEvent<HTMLElement>) =>
                handleUnitClassSelect("airbase", airbase.name)
              }
              selected={airbase.name === selectedAirbaseUnitClass}
              key={airbase.name}
              value={airbase.name}
            >
              {airbase.name}
            </MenuItem>
          ))}
        </Menu>
        {/** Add Sam Menu/Button */}
        <Tooltip title="Add Sam">
          <IconButton
            id="add-sam-icon-button"
            aria-controls={samClassMenuOpen ? "sam-classes-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={samClassMenuOpen ? "true" : undefined}
            onClick={handleSamIconClick}
          >
            <EntityIcon type="facility" />
          </IconButton>
        </Tooltip>
        <Menu
          id="sam-classes-menu"
          anchorEl={samIconAnchorEl}
          open={samClassMenuOpen}
          onClose={handleSamIconClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            root: { sx: { ".MuiList-root": { padding: 0 } } },
            list: {
              "aria-labelledby": "add-sam-icon-button",
            },
          }}
        >
          <Stack
            spacing={2}
            direction={"row"}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: colorPalette.lightGray,
              pl: 2,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Select Sam
            </Typography>
            <IconButton onClick={handleSamIconClose}>
              <ClearIcon sx={{ fontSize: 15, color: "red" }} />
            </IconButton>
          </Stack>
          {FacilityDb.map((facility) => (
            <MenuItem
              onClick={(_event: React.MouseEvent<HTMLElement>) =>
                handleUnitClassSelect("facility", facility.className)
              }
              selected={facility.className === selectedSamUnitClass}
              key={facility.className}
              value={facility.className}
            >
              {facility.className}
            </MenuItem>
          ))}
        </Menu>
        {/** Add Ship Menu/Button */}
        <Tooltip title="Add Ship">
          <IconButton
            id="add-ship-icon-button"
            aria-controls={shipClassMenuOpen ? "ship-classes-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={shipClassMenuOpen ? "true" : undefined}
            onClick={handleShipIconClick}
          >
            <EntityIcon type="ship" />
          </IconButton>
        </Tooltip>
        <Menu
          id="ship-classes-menu"
          anchorEl={shipIconAnchorEl}
          open={shipClassMenuOpen}
          onClose={handleShipIconClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            root: { sx: { ".MuiList-root": { padding: 0 } } },
            list: {
              "aria-labelledby": "add-ship-icon-button",
            },
          }}
        >
          <Stack
            spacing={2}
            direction={"row"}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: colorPalette.lightGray,
              pl: 2,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Select Ship
            </Typography>
            <IconButton onClick={handleShipIconClose}>
              <ClearIcon sx={{ fontSize: 15, color: "red" }} />
            </IconButton>
          </Stack>
          {ShipDb.map((ship) => (
            <MenuItem
              onClick={(_event: React.MouseEvent<HTMLElement>) =>
                handleUnitClassSelect("ship", ship.className)
              }
              selected={ship.className === selectedShipUnitClass}
              key={ship.className}
              value={ship.className}
            >
              {ship.className}
            </MenuItem>
          ))}
        </Menu>
        {/** Add Reference Point */}
        <Tooltip title="Add Reference Point">
          <IconButton onClick={props.addReferencePointOnClick}>
            <EntityIcon type="referencePoint" />
          </IconButton>
        </Tooltip>
        {/**  Enable Eraser */}
        <Tooltip title="Eraser">
          <IconButton onClick={handleEraserModeToggle}>
            <img
              src={EraserIcon}
              alt="Eraser Icon"
              width={24}
              height={24}
              style={{
                filter: props.game.eraserMode
                  ? "invert(32%) sepia(98%) saturate(2000%) hue-rotate(95deg) brightness(90%) contrast(105%)"
                  : "grayscale(100%) contrast(200%)",
              }}
            />
          </IconButton>
        </Tooltip>
        {/**  Enable God Mode */}
        <Tooltip title="God Mode">
          <IconButton onClick={handleGodModeToggle}>
            <GodModeIcon
              sx={{
                color: props.game.godMode ? "#009406" : colorPalette.black,
                width: 24,
                height: 24,
              }}
            />
          </IconButton>
        </Tooltip>
      </Stack>
    );
  };

  const entitiesSection = () => {
    if (
      !entityFilterSelectedOptions.length ||
      !props.featureEntitiesPlotted.length ||
      (entityFilterSelectedOptions.length &&
        entityFilterSelectedOptions.every(
          (option) => option === "blue" || option === "red"
        ))
    ) {
      return <MenuItem disabled>No items available</MenuItem>;
    }

    return (
      <Stack spacing={1} direction={"column"} sx={{ gap: "8px" }}>
        {props.mobileView && entityMenuButtons()}
        <ToggleButtonGroup
          fullWidth
          value={entityFilterSelectedOptions.filter((selectedOption) =>
            ["blue", "red"].includes(selectedOption)
          )}
          exclusive
          onChange={handleEntitySideChange}
          aria-label="side"
          sx={{ display: "flex", justifyContent: "center", height: 35 }}
        >
          <ToggleButton color="primary" value="blue">
            Blue
          </ToggleButton>
          <ToggleButton color="error" value="red">
            Red
          </ToggleButton>
        </ToggleButtonGroup>
        {props.featureEntitiesPlotted
          .filter((feature: FeatureEntityState) => {
            const selectedSideColors = entityFilterSelectedOptions.filter(
              (selectedOption: string) =>
                ["red", "blue"].includes(selectedOption)
            );
            const selectedTypes = entityFilterSelectedOptions.filter(
              (selectedOption: string) =>
                [
                  "airbase",
                  "aircraft",
                  "ship",
                  "facility",
                  "referencePoint",
                ].includes(selectedOption)
            );

            // Side color(s) selected, prioritize 'side color' first
            if (selectedSideColors.length) {
              // Type(s) selected too - filter both 'type' and 'side color'
              if (selectedTypes.length) {
                return (
                  selectedTypes.includes(feature.type) &&
                  selectedSideColors.includes(feature.sideColor)
                );
              }
              // Only side color selected in options - filter 'side color'
              return selectedSideColors.includes(feature.sideColor);
            }

            // No side color filter(s) - filter 'type'
            return selectedTypes.includes(feature.type);
          })
          .map((feature: FeatureEntityState) => (
            <Tooltip
              key={feature.id}
              placement="right"
              arrow
              title={
                <Stack direction={"column"} spacing={0.1}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Name: {feature.name.toUpperCase()}
                  </Typography>
                  {!feature.type.startsWith("reference") && (
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Type: {feature.type.toUpperCase()}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Side Color: {feature.sideColor.toUpperCase()}
                  </Typography>
                </Stack>
              }
            >
              <MenuItem
                disableRipple
                sx={{ cursor: "help" }}
                key={feature.id}
                value={feature.name}
              >
                <ListItemIcon>
                  <EntityIcon
                    type={feature.type}
                    sideColor={feature.sideColor}
                  />
                </ListItemIcon>
                <ListItemText primary={feature.name} />
              </MenuItem>
            </Tooltip>
          ))}
      </Stack>
    );
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <MapToolbar variant="dense" sx={toolbarStyle} disableGutters>
          {props.drawerOpen ? (
            <Tooltip title="Close Drawer">
              <IconButton
                color="inherit"
                aria-label="close drawer"
                onClick={props.closeDrawer}
                edge="start"
                sx={[
                  {
                    ml: 1,
                    color: colorPalette.black,
                  },
                ]}
              >
                <MenuOpenOutlinedIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Open Drawer">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={props.openDrawer}
                edge="start"
                sx={[
                  {
                    ml: 1,
                    color: colorPalette.black,
                  },
                ]}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}
          <Stack direction={"row"} sx={{ alignItems: "center" }}>
            <IconButton
              href="https://panopticon-ai.com/"
              target="_blank"
              disableRipple
              sx={{
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
                display: { md: "flex" },
              }}
            >
              <PanopticonLogoSvg />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="https://panopticon-ai.com/"
              target="_blank"
              sx={{
                mr: 2,
                display: "flex",
                fontWeight: 400,
                textDecoration: "none",
                backgroundColor: colorPalette.lightGray,
                color: colorPalette.black,
                transform: "none",
              }}
            >
              Panopticon AI
            </Typography>
            {!props.mobileView && (
              <>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    borderColor: colorPalette.darkGray,
                    ml: 9.3,
                  }}
                />
                {entityMenuButtons()}
              </>
            )}
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ borderColor: colorPalette.darkGray, mr: 1.6 }}
            />
            <ToggleButtonGroup
              color={selectedSide === "blue" ? "primary" : "error"}
              value={selectedSide}
              exclusive
              onChange={handleSideChange}
              aria-label="side"
              sx={{ display: "flex", justifyContent: "center", height: 35 }}
            >
              <ToggleButton value="blue">Blue</ToggleButton>
              <ToggleButton value="red">Red</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </MapToolbar>
      </AppBar>
      {/** Side Drawer */}
      <Drawer
        sx={toolbarDrawerStyle}
        variant="persistent"
        anchor="left"
        open={props.drawerOpen}
      >
        {/** Container/Wrapper */}
        <Container
          disableGutters
          sx={{
            backgroundColor: colorPalette.lightGray,
            padding: 1,
            flexGrow: 1,
            borderRight: "1px solid",
            borderRightColor: colorPalette.darkGray,
            overflowX: "hidden",
          }}
        >
          <DrawerHeader />
          {/** Context Notification Text Section */}
          <Stack spacing={0.5} direction="column" sx={{ p: 0, mt: 1 }}>
            <CurrentActionContextDisplay />
          </Stack>
          {/** Scenario Section */}
          <Stack>
            <CardHeader
              sx={{ paddingBottom: 0 }}
              action={
                <Stack direction={"row"}>
                  <Tooltip title="Upload Scenario">
                    <IconButton onClick={loadScenario}>
                      <UploadFileOutlinedIcon
                        fontSize="medium"
                        sx={{ color: "#171717" }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Save Scenario">
                    <IconButton onClick={exportScenario}>
                      <FileDownloadOutlinedIcon
                        fontSize="medium"
                        sx={{ color: "#171717" }}
                      />
                    </IconButton>
                  </Tooltip>
                  {/* Scenario Name Edit Menu/Button  */}
                  <Tooltip title="Edit Scenario Name">
                    <IconButton onClick={handleOpenScenarioEditNameMenu}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={scenarioEditNameAnchorEl}
                    open={Boolean(scenarioEditNameAnchorEl)}
                    onClose={handleCloseScenarioEditNameMenu}
                    slotProps={{
                      root: { sx: { ".MuiList-root": { padding: 0 } } },
                    }}
                  >
                    <Typography variant="h6" sx={{ textAlign: "center", p: 1 }}>
                      Edit Scenario Name
                    </Typography>

                    <form
                      onSubmit={handleScenarioNameSubmit}
                      style={{
                        width: "100%",
                      }}
                    >
                      <Stack direction={"column"} spacing={1} sx={{ p: 1 }}>
                        <TextField
                          error={scenarioNameError}
                          helperText={
                            scenarioNameError
                              ? 'Must be alphanumeric, ":,-" allowed, max 25'
                              : ""
                          }
                          autoComplete="off"
                          id="scenario-name-text-field"
                          label="Scenario Name"
                          sx={{ width: "100%" }}
                          onChange={handleScenarioNameChange}
                          defaultValue={scenarioName}
                        />
                        <Stack direction={"row"} spacing={1}>
                          <Button
                            disabled={
                              !scenarioName.length ||
                              props.game.currentScenario.name === scenarioName
                            }
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="small"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={handleCloseScenarioEditNameMenu}
                            type="button"
                            fullWidth
                            variant="contained"
                            size="small"
                            color="error"
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </Stack>
                    </form>
                  </Menu>
                </Stack>
              }
              title={
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: 400 }}
                >
                  Scenario
                </Typography>
              }
            />
            {/** Scenario Name */}
            <Stack direction={"row"} sx={{ pl: 2, mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 200 }}>
                {props.game.currentScenario.name}
              </Typography>
            </Stack>
            {/** Scenario Actions */}
            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={1}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Step Scenario">
                  <Chip
                    variant="outlined"
                    label="Step"
                    onClick={handleStepClick}
                  />
                </Tooltip>
                <Tooltip title="Restart Scenario">
                  <IconButton onClick={reloadScenario}>
                    <RestartAltIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={!scenarioPaused ? "Pause Scenario" : "Play Scenario"}
                >
                  <IconButton onClick={handlePlayClick}>
                    {!scenarioPaused ? <Pause /> : <PlayArrow />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Toggle Scenario Speed">
                  <Chip
                    onClick={props.toggleScenarioTimeCompressionOnClick}
                    variant="outlined"
                    label={props.scenarioTimeCompression + "x"}
                  />
                </Tooltip>
              </Stack>
            </CardActions>
          </Stack>
          {/** Toolbar Feature Controls Dropdown/List Section */}
          <List
            sx={{
              py: 0,
              width: "100%",
              backgroundColor: colorPalette.lightGray,
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
            component="nav"
            aria-labelledby="feature-controls-dropdown-list"
            subheader={
              <ListSubheader
                color="inherit"
                component="div"
                id="feature-controls-dropdown-list"
                sx={{
                  ...visuallyHidden, // screen reader only
                  backgroundColor: "transparent",
                }}
              >
                Feature Controls
              </ListSubheader>
            }
          >
            <ToolbarCollapsible
              title="Recording"
              prependIcon={RadioButtonCheckedIcon}
              content={recordingSection()}
              open={false}
            />
            <ToolbarCollapsible
              title="Entities"
              prependIcon={DocumentScannerOutlinedIcon}
              content={entitiesSection()}
              enableFilter={true}
              filterProps={{
                options: [
                  { label: "Aircraft", value: "aircraft" },
                  { label: "Airbase", value: "airbase" },
                  { label: "Sam", value: "facility" },
                  { label: "Ship", value: "ship" },
                  { label: "Reference Point", value: "referencePoint" },
                ],
                onApplyFilterOptions: (selectedOptions: string[]) => {
                  const selectedSideColors =
                    entityFilterSelectedOptions.filter(
                      (item) => item === "blue" || item === "red"
                    ) || [];
                  const updatedOptions = [
                    ...selectedSideColors,
                    ...selectedOptions,
                  ];
                  setEntityFilterSelectedOptions(updatedOptions);
                },
              }}
              open={false}
            />
            <ToolbarCollapsible
              title="Missions"
              prependIcon={AirlineStopsOutlinedIcon}
              content={missionSection()}
              appendIcon={AddBoxIcon}
              appendIconProps={{
                tooltipProps: {
                  title: "Add Mission",
                },
                onClick: () => {
                  props.toggleMissionCreator();
                },
              }}
              open={true}
            />
          </List>
        </Container>
        {/** Drawer Footer */}
        <Box
          sx={{
            marginTop: "auto",
            padding: 2,
            backgroundColor: colorPalette.lightGray,
            borderRight: "1px solid",
            borderRightColor: colorPalette.darkGray,
          }}
        >
          <Divider sx={{ marginBottom: 2 }} />
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Typography variant="body2">Panopticon AI</Typography>
            <Typography variant="body2">•</Typography>
            <Typography variant="body2">
              ©{new Date().getFullYear()}
            </Typography>
            <Typography variant="body2">•</Typography>
            <IconButton
              href="https://github.com/Panopticon-AI-team/panopticon"
              target="_blank"
              color="inherit"
              aria-label="GitHub"
            >
              <Avatar
                alt="Github Logo"
                src={GitHubIcon}
                sx={{ width: 24, height: 24 }}
              />
            </IconButton>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}
