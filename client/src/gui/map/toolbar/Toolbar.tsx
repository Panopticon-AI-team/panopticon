import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Button,
  CardActions,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { Menu } from "@/gui/shared/ui/MuiComponents";
import { visuallyHidden } from "@mui/utils";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Game from "@/game/Game";
import { AircraftDb, FacilityDb, ShipDb } from "@/game/db/UnitDb";
import { APP_DRAWER_WIDTH } from "@/utils/constants";
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
import {
  Cloud,
  Delete,
  Pause,
  PlayArrow,
  Save,
  Storage,
  Undo,
} from "@mui/icons-material";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import AirlineStopsOutlinedIcon from "@mui/icons-material/AirlineStopsOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
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
import RecordingPlayer from "@/gui/map/toolbar/RecordingPlayer";
import blankScenarioJson from "@/scenarios/blank_scenario.json";
import defaultScenarioJson from "@/scenarios/default_scenario.json";
import SCSScenarioJson from "@/scenarios/SCS.json";
import SideSelect from "@/gui/map/toolbar/SideSelect";
import {
  COLOR_PALETTE,
  DEFAULT_ICON_COLOR_FILTER,
  SELECTED_ICON_COLOR_FILTER,
  SIDE_COLOR,
} from "@/utils/colors";
import { useAuth0 } from "@auth0/auth0-react";
import LoginLogout from "@/gui/map/toolbar/LoginLogout";
import { randomUUID } from "@/utils/generateUUID";
import HealthCheck from "@/gui/map/toolbar/HealthCheck";
import {
  SetUnitDbContext,
  UnitDbContext,
} from "@/gui/contextProviders/contexts/UnitDbContext";

interface ToolBarProps {
  mobileView: boolean;
  drawerOpen: boolean;
  featureEntitiesPlotted: FeatureEntityState[];
  addAircraftOnClick: (unitClassName: string) => void;
  addFacilityOnClick: (unitClassName: string) => void;
  addAirbaseOnClick: (
    coordinates: number[],
    name?: string,
    realCoordinates?: number[]
  ) => void;
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
  handleUndo: () => void;
  switchCurrentSideOnClick: (sideId: string) => void;
  refreshAllLayers: () => void;
  updateMapView: (center: number[], zoom: number) => void;
  loadFeatureEntitiesState: () => void;
  updateScenarioTimeCompression: (scenarioTimeCompression: number) => void;
  updateCurrentScenarioTimeToContext: () => void;
  scenarioTimeCompression: number;
  scenarioCurrentSideId: string;
  game: Game;
  featureLabelVisibility: boolean;
  toggleFeatureLabelVisibility: (featureLabelVisibility: boolean) => void;
  threatRangeVisibility: boolean;
  toggleThreatRangeVisibility: (threatRangeVisibility: boolean) => void;
  routeVisibility: boolean;
  toggleRouteVisibility: (routeVisibility: boolean) => void;
  toggleBaseMapLayer: () => void;
  keyboardShortcutsEnabled: boolean;
  finishRouteDrawLine: () => void;
  toggleMissionCreator: () => void;
  openMissionEditor: (selectedMissionId: string) => void;
  handleOpenSideEditor: (sideId: string | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const scenarioNameRegex: RegExp = /^[a-zA-Z0-9 :-]{1,25}$/;

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
  marginTop: "-12px",
}));

const toolbarDrawerStyle = {
  backgroundColor: COLOR_PALETTE.DARK_GRAY,
  width: APP_DRAWER_WIDTH,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: APP_DRAWER_WIDTH + 13,
    boxSizing: "border-box",
    overflow: "hidden",
  },
};

const toolbarStyle = {
  backgroundColor: COLOR_PALETTE.LIGHT_GRAY,
  borderBottom: "1px solid",
  borderBottomColor: COLOR_PALETTE.DARK_GRAY,
};

interface CloudScenario {
  scenarioId: string;
  name: string;
  scenarioString: string;
}

export default function Toolbar(props: Readonly<ToolBarProps>) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [cloudScenarios, setCloudScenarios] = useState<CloudScenario[]>([]);
  const getCloudScenarios = async () => {
    if (!import.meta.env.VITE_ENV || import.meta.env.VITE_ENV === "standalone")
      return;
    if (!isAuthenticated) return;
    const accessToken = await getAccessTokenSilently();
    const resp = await fetch(
      `${import.meta.env.VITE_API_SERVER_URL}/api/v1/scenarios`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (resp.ok) {
      const rawCloudScenarios: CloudScenario[] = await resp.json();
      setCloudScenarios(rawCloudScenarios);
    } else {
      toastContext?.addToast(
        "Failed to load scenarios from cloud. Please try again later.",
        "error"
      );
    }
  };
  useEffect(() => {
    if (!isAuthenticated) return;
    getCloudScenarios();
  }, [isAuthenticated]);
  const toastContext = useContext(ToastContext);
  const unitDbContext = useContext(UnitDbContext);
  const setUnitDbContext = useContext(SetUnitDbContext);
  const [selectedSideId, setSelectedSideId] = useState<string>(
    props.scenarioCurrentSideId
  );
  useEffect(() => {
    setSelectedSideId(props.scenarioCurrentSideId);
    handleEntitySideChange(
      props.game.godMode
        ? props.game.currentScenario.sides.map((side) => side.id)
        : [props.scenarioCurrentSideId]
    );
  }, [props.scenarioCurrentSideId]);
  const [initialScenarioString, setInitialScenarioString] = useState<string>(
    props.game.exportCurrentScenario()
  );
  const [currentScenarioString, setCurrentScenarioString] = useState<
    string | null
  >(null);
  const [scenarioName, setScenarioName] = useState<string>(
    props.game.currentScenario.name ?? "New Scenario"
  );
  const [scenarioNameError, setScenarioNameError] = useState<boolean>(false);
  const [scenarioPaused, setScenarioPaused] = useState<boolean>(
    props.game.scenarioPaused
  );
  const [recordingScenario, setRecordingScenario] = useState<boolean>(
    props.game.recordingScenario
  );
  const [entityFilterSelectedOptions, setEntityFilterSelectedOptions] =
    useState<string[]>([
      ...(props.game.godMode
        ? props.game.currentScenario.sides.map((side) => side.id)
        : [props.scenarioCurrentSideId]),
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

  const [loadScenarioAnchorEl, setLoadScenarioAnchorEl] =
    useState<null | HTMLElement>(null);
  const presetScenarioSelectionMenuOpen = Boolean(loadScenarioAnchorEl);
  const handleLoadScenarioIconClick = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setLoadScenarioAnchorEl(event.currentTarget);
  };
  const handleLoadScenarioIconClose = () => {
    setLoadScenarioAnchorEl(null);
  };

  const [selectedAircraftUnitClass, setSelectedAircraftUnitClass] =
    useState<string>(AircraftDb[0].className);
  const [aircraftIconAnchorEl, setAircraftIconAnchorEl] =
    useState<null | HTMLElement>(null);
  const aircraftClassMenuOpen = Boolean(aircraftIconAnchorEl);
  const handleAircraftIconClick = (event: React.MouseEvent<HTMLElement>) => {
    if (
      !props.game.currentSideId ||
      props.game.currentScenario.sides.length === 0
    ) {
      toastContext?.addToast(
        "Please select a side before adding an aircraft.",
        "error"
      );
      return;
    }
    setAircraftIconAnchorEl(event.currentTarget);
  };
  const handleAircraftIconClose = () => {
    setAircraftIconAnchorEl(null);
  };

  const [selectedAirbaseUnitClass, setSelectedAirbaseUnitClass] =
    useState<string>(unitDbContext.getAirbaseDb()[0].name);
  const [airbaseIconAnchorEl, setAirbaseIconAnchorEl] =
    useState<null | HTMLElement>(null);
  const airbaseClassMenuOpen = Boolean(airbaseIconAnchorEl);
  const handleAirbaseIconClick = (event: React.MouseEvent<HTMLElement>) => {
    if (
      !props.game.currentSideId ||
      props.game.currentScenario.sides.length === 0
    ) {
      toastContext?.addToast(
        "Please select a side before adding an airbase.",
        "error"
      );
      return;
    }
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
    if (
      !props.game.currentSideId ||
      props.game.currentScenario.sides.length === 0
    ) {
      toastContext?.addToast(
        "Please select a side before adding a facility.",
        "error"
      );
      return;
    }
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
    if (
      !props.game.currentSideId ||
      props.game.currentScenario.sides.length === 0
    ) {
      toastContext?.addToast(
        "Please select a side before adding a ship.",
        "error"
      );
      return;
    }
    setShipIconAnchorEl(event.currentTarget);
  };
  const handleShipIconClose = () => {
    setShipIconAnchorEl(null);
  };

  const handleReferencePointIconClick = () => {
    if (
      !props.game.currentSideId ||
      props.game.currentScenario.sides.length === 0
    ) {
      toastContext?.addToast(
        "Please select a side before adding a reference point.",
        "error"
      );
      return;
    }
    props.addReferencePointOnClick();
  };

  const [unitDbToolsIconAnchorEl, setUnitDbToolsIconAnchorEl] =
    useState<null | HTMLElement>(null);
  const unitDbToolsMenuOpen = Boolean(unitDbToolsIconAnchorEl);
  const handleUnitDbToolsIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setUnitDbToolsIconAnchorEl(event.currentTarget);
  };
  const handleUnitDbToolsIconClose = () => {
    setUnitDbToolsIconAnchorEl(null);
  };

  const handleSideChange = (newSelectedSideId: string) => {
    if (newSelectedSideId != null && newSelectedSideId !== "add-side") {
      props.switchCurrentSideOnClick(newSelectedSideId);
    }
  };

  const handleEntitySideChange = (newSelectedSides: string[]) => {
    setEntityFilterSelectedOptions((prevItems: string[]) => {
      const nonSideFilters = [
        "aircraft",
        "airbase",
        "ship",
        "facility",
        "referencePoint",
      ];
      const filtersWithNewSide = prevItems.filter((item) =>
        nonSideFilters.includes(item)
      );
      return [...filtersWithNewSide, ...newSelectedSides];
    });
  };

  const saveScenarioToCloud = async () => {
    if (!import.meta.env.VITE_ENV || import.meta.env.VITE_ENV === "standalone")
      return;
    if (!isAuthenticated) return;
    if (cloudScenarios.length >= 5) return;
    const exportObject = props.game.exportCurrentScenario();
    const accessToken = await getAccessTokenSilently();
    const resp = await fetch(
      `${import.meta.env.VITE_API_SERVER_URL}/api/v1/scenarios`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: exportObject,
      }
    );
    if (!resp.ok) {
      toastContext?.addToast(
        "Failed to save scenario to cloud. Please try again later.",
        "error"
      );
    } else {
      const rawCloudScenarios: CloudScenario[] = await resp.json();
      setCloudScenarios(rawCloudScenarios);
      toastContext?.addToast(
        "Scenario saved to cloud successfully!",
        "success"
      );
    }
  };

  const deleteScenarioFromCloud = async (scenarioId: string) => {
    if (!import.meta.env.VITE_ENV || import.meta.env.VITE_ENV === "standalone")
      return;
    if (!isAuthenticated) return;
    const accessToken = await getAccessTokenSilently();
    const resp = await fetch(
      `${import.meta.env.VITE_API_SERVER_URL}/api/v1/scenarios/${scenarioId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (resp.ok) {
      const updatedCloudScenarios = cloudScenarios.filter(
        (scenario) => scenario.scenarioId !== scenarioId
      );
      setCloudScenarios(updatedCloudScenarios);
      toastContext?.addToast("Scenario deleted successfully!", "success");
    } else {
      toastContext?.addToast(
        "Failed to delete scenario. Please try again later.",
        "error"
      );
    }
  };

  const exportScenario = () => {
    if (isAuthenticated || import.meta.env.VITE_ENV !== "production") {
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
    }
  };

  const newScenario = () => {
    loadPresetScenario("blank_scenario");
  };

  const loadCloudScenario = (scenarioId: string) => {
    const scenario = cloudScenarios.find(
      (scenario) => scenario.scenarioId === scenarioId
    );
    if (scenario) {
      props.pauseOnClick();
      setScenarioPaused(true);
      loadScenario(scenario.scenarioString);
      setCurrentScenarioString(scenario.scenarioString);
      toastContext?.addToast("Scenario loaded successfully!", "success");
    } else {
      toastContext?.addToast(
        "Failed to load scenario. Please refresh page or try again later.",
        "error"
      );
    }
  };

  const loadPresetScenario = (presetScenarioName: string) => {
    let scenarioJson: Object | null = null;
    switch (presetScenarioName) {
      case "blank_scenario":
        scenarioJson = blankScenarioJson;
        handleLoadScenarioIconClose();
        break;
      case "default_scenario":
        scenarioJson = defaultScenarioJson;
        handleLoadScenarioIconClose();
        break;
      case "SCS":
        scenarioJson = SCSScenarioJson;
        handleLoadScenarioIconClose();
        break;
      case "_upload":
        handleLoadScenarioIconClose();
        uploadScenario();
        return;
      default:
        break;
    }
    if (scenarioJson !== null) {
      try {
        props.pauseOnClick();
        setScenarioPaused(true);
        let scenarioJsonWithNewId = JSON.parse(JSON.stringify(scenarioJson));
        if (
          presetScenarioName === "blank_scenario" ||
          presetScenarioName === "SCS" ||
          presetScenarioName === "default_scenario"
        ) {
          if (scenarioJsonWithNewId.currentScenario?.id) {
            scenarioJsonWithNewId.currentScenario.id = randomUUID();
          }
        }
        const scenarioString = JSON.stringify(scenarioJsonWithNewId);
        loadScenario(scenarioString);
        setCurrentScenarioString(scenarioString);
        toastContext?.addToast("Scenario loaded successfully!", "success");
      } catch (error) {
        toastContext?.addToast(
          "Failed to load scenario. Please refresh page or try again later.",
          "error"
        );
      }
    }
  };

  const loadScenario = (
    scenarioJson: string,
    updateScenarioName: boolean = true
  ) => {
    props.game.loadScenario(scenarioJson);
    props.updateMapView(
      props.game.mapView.currentCameraCenter,
      props.game.mapView.currentCameraZoom
    );
    props.updateScenarioTimeCompression(
      props.game.currentScenario.timeCompression
    );
    handleSideChange(props.game.currentSideId);
    if (updateScenarioName) {
      props.game.currentScenario.updateScenarioName(
        props.game.currentScenario.name
      );
      setScenarioName(props.game.currentScenario.name);
    }
    props.refreshAllLayers();
    props.updateCurrentScenarioTimeToContext();
    props.loadFeatureEntitiesState();
  };

  const uploadScenario = () => {
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
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (readerEvent) => {
          const scenarioString = readerEvent.target?.result as string;
          loadScenario(scenarioString);
          setCurrentScenarioString(scenarioString);
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
      }
    };
    input.click();
  };

  const reloadScenario = () => {
    props.pauseOnClick();
    setScenarioPaused(true);
    if (currentScenarioString) {
      try {
        loadScenario(currentScenarioString, false);
        props.game.currentScenario.updateScenarioName(scenarioName);
        setScenarioName(props.game.currentScenario.name);
      } catch {
        toastContext?.addToast(
          "Failed to restart scenario. Please refresh page or try again later.",
          "error"
        );
      }
    } else {
      loadScenario(initialScenarioString, false);
      props.game.currentScenario.updateScenarioName(scenarioName);
      setScenarioName(props.game.currentScenario.name);
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

  const handleUndo = () => {
    setScenarioPaused(true);
    props.handleUndo();
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
      case "airbase": {
        setSelectedAirbaseUnitClass(unitClassName);
        const airbaseTemplate = unitDbContext
          .getAirbaseDb()
          .find((airbase) => airbase.name === unitClassName);
        props.addAirbaseOnClick([0, 0], airbaseTemplate?.name, [
          airbaseTemplate?.longitude ?? 0,
          airbaseTemplate?.latitude ?? 0,
        ]);
        handleAirbaseClose();
        break;
      }
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
    if (props.game.godMode) {
      handleEntitySideChange(
        props.game.currentScenario.sides.map((side) => side.id)
      );
    } else {
      handleEntitySideChange([props.game.currentSideId]);
    }
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
      case "g":
        event.preventDefault();
        handleGodModeToggle();
        break;
      case "e":
        event.preventDefault();
        handleEraserModeToggle();
        break;
      case "z":
        event.preventDefault();
        handleUndo();
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
          const airbaseTemplate = unitDbContext
            .getAirbaseDb()
            .find((airbase) => airbase.name === selectedAirbaseUnitClass);
          props.addAirbaseOnClick([0, 0], airbaseTemplate?.name, [
            airbaseTemplate?.longitude ?? 0,
            airbaseTemplate?.latitude ?? 0,
          ]);
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
      case "Escape":
        event.preventDefault();
        props.finishRouteDrawLine();
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

  const ScenarioDb = [
    { name: "default_scenario", displayName: "Panopticon Demo" },
    { name: "SCS", displayName: "South China Sea Strike" },
    { name: "_upload", displayName: "Upload..." },
  ];

  const presetScenarioSelectionMenu = () => {
    return (
      <Menu
        id="preset-scenario-selection-menu"
        anchorEl={loadScenarioAnchorEl}
        open={presetScenarioSelectionMenuOpen}
        onClose={handleLoadScenarioIconClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
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
            backgroundColor: COLOR_PALETTE.LIGHT_GRAY,
            pl: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Load Scenario
          </Typography>
          <IconButton onClick={handleLoadScenarioIconClose}>
            <ClearIcon sx={{ fontSize: 15, color: "red" }} />
          </IconButton>
        </Stack>
        {ScenarioDb.map((scenario) => (
          <MenuItem
            onClick={(_event: React.MouseEvent<HTMLElement>) =>
              loadPresetScenario(scenario.name)
            }
            key={scenario.name}
            value={scenario.name}
          >
            {scenario.displayName}
          </MenuItem>
        ))}
        {cloudScenarios.map((scenario: CloudScenario) => (
          <MenuItem
            onClick={(_event: React.MouseEvent<HTMLElement>) =>
              loadCloudScenario(scenario.scenarioId)
            }
            key={scenario.scenarioId}
            value={scenario.scenarioId}
            sx={{ paddingTop: 0 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <Cloud />
                </ListItemIcon>
                <ListItemText
                  primary={scenario.name}
                  sx={{
                    flex: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
              </Box>

              <IconButton
                edge="end"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteScenarioFromCloud(scenario.scenarioId);
                }}
                sx={{ ml: 2 }}
              >
                <Delete color="error" />
              </IconButton>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    );
  };

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
      props.game.currentSideId
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
                  Side: {props.game.currentScenario.getSideName(mission.sideId)}
                </Typography>
              </Stack>
            }
          >
            <MenuItem
              onClick={() => {
                props.openMissionEditor(mission.id);
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
              backgroundColor: COLOR_PALETTE.LIGHT_GRAY,
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
          {unitDbContext.getAircraftDb().map((aircraft) => (
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
        <Tooltip title="Add airbase from database">
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
              backgroundColor: COLOR_PALETTE.LIGHT_GRAY,
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
          {unitDbContext.getAirbaseDb().map((airbase) => (
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
              backgroundColor: COLOR_PALETTE.LIGHT_GRAY,
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
          {unitDbContext.getFacilityDb().map((facility) => (
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
              backgroundColor: COLOR_PALETTE.LIGHT_GRAY,
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
          {unitDbContext.getShipDb().map((ship) => (
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
          <IconButton onClick={handleReferencePointIconClick}>
            <EntityIcon type="referencePoint" />
          </IconButton>
        </Tooltip>
        {/**  Unit Db Functions */}
        <Tooltip title="Database Tools">
          <IconButton onClick={handleUnitDbToolsIconClick}>
            <Storage />
          </IconButton>
        </Tooltip>
        <Menu
          id="unit-db-functions-menu"
          anchorEl={unitDbToolsIconAnchorEl}
          open={unitDbToolsMenuOpen}
          onClose={handleUnitDbToolsIconClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            root: { sx: { ".MuiList-root": { padding: 0 } } },
            list: {
              "aria-labelledby": "unit-db-functions-button",
            },
          }}
        >
          <MenuItem
            onClick={(_event: React.MouseEvent<HTMLElement>) => {
              const exportedUnitDb = unitDbContext.exportToJson();
              const exportName = "unit_db";
              const dataStr =
                "data:text/json;charset=utf-8," +
                encodeURIComponent(exportedUnitDb);
              const downloadAnchorNode = document.createElement("a");
              downloadAnchorNode.setAttribute("href", dataStr);
              downloadAnchorNode.setAttribute("download", exportName + ".json");
              document.body.appendChild(downloadAnchorNode); // required for firefox
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
              setUnitDbToolsIconAnchorEl(null);
            }}
            key={"export-unit-db"}
          >
            Export Unit Database
          </MenuItem>
          <MenuItem
            onClick={(_event: React.MouseEvent<HTMLElement>) => {
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
                  const reader = new FileReader();
                  reader.readAsText(file, "UTF-8");
                  reader.onload = (readerEvent) => {
                    const unitDbString = readerEvent.target?.result as string;
                    unitDbContext.importFromJson(unitDbString);
                    toastContext?.addToast(
                      "Unit database uploaded successfully!",
                      "success"
                    );
                    setUnitDbContext(unitDbContext);
                    setUnitDbToolsIconAnchorEl(null);
                  };
                  reader.onerror = () => {
                    reader.abort();
                    toastContext?.addToast(
                      "Failed to upload database.",
                      "error"
                    );
                  };
                }
              };
              input.click();
            }}
            key={"import-unit-db"}
          >
            Import Unit Database
          </MenuItem>
        </Menu>
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
                  ? SELECTED_ICON_COLOR_FILTER
                  : DEFAULT_ICON_COLOR_FILTER,
              }}
            />
          </IconButton>
        </Tooltip>
        {/**  Enable God Mode */}
        <Tooltip title="God Mode">
          <IconButton onClick={handleGodModeToggle}>
            <GodModeIcon
              sx={{
                color: props.game.godMode ? SIDE_COLOR.GREEN : SIDE_COLOR.BLACK,
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
    const sideIds = props.game.currentScenario.sides.map((side) => side.id);
    const currentlySelectedSides = props.game.godMode
      ? sideIds
      : [props.game.currentSideId];
    const plottedSideFeatures = props.featureEntitiesPlotted.filter(
      (feature: FeatureEntityState) =>
        currentlySelectedSides.includes(feature.sideId)
    );
    if (
      !entityFilterSelectedOptions.length ||
      !props.featureEntitiesPlotted.length ||
      !plottedSideFeatures.length
    ) {
      return <MenuItem disabled>No items available</MenuItem>;
    }

    return (
      <Stack spacing={1} direction={"column"} sx={{ gap: "8px" }}>
        {props.mobileView && entityMenuButtons()}
        {props.featureEntitiesPlotted
          .filter((feature: FeatureEntityState) => {
            const selectedSideIds = entityFilterSelectedOptions.filter(
              (selectedOption: string) => sideIds.includes(selectedOption)
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
            if (selectedSideIds.length) {
              // Type(s) selected too - filter both 'type' and 'side color'
              if (selectedTypes.length) {
                return (
                  selectedTypes.includes(feature.type) &&
                  selectedSideIds.includes(feature.sideId)
                );
              }
              // Only side color selected in options - filter 'side color'
              return selectedSideIds.includes(feature.sideId);
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
                    Side:{" "}
                    {props.game.currentScenario.getSideName(feature.sideId)}
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
                  <EntityIcon type={feature.type} color={feature.sideColor} />
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
                    color: COLOR_PALETTE.BLACK,
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
                    color: COLOR_PALETTE.BLACK,
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
                width: 47,
                height: 47,
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
                backgroundColor: COLOR_PALETTE.LIGHT_GRAY,
                color: COLOR_PALETTE.BLACK,
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
                    borderColor: COLOR_PALETTE.DARK_GRAY,
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
              sx={{ borderColor: COLOR_PALETTE.DARK_GRAY, mr: 1.6 }}
            />
            <SideSelect
              sides={props.game.currentScenario.sides}
              currentSideId={selectedSideId}
              onSideSelect={handleSideChange}
              openSideEditor={props.handleOpenSideEditor}
            />
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <HealthCheck />
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ borderColor: COLOR_PALETTE.DARK_GRAY, mr: 1.6 }}
          />
          <LoginLogout />
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
            backgroundColor: COLOR_PALETTE.LIGHT_GRAY,
            padding: 1,
            flexGrow: 1,
            borderRight: "1px solid",
            borderRightColor: COLOR_PALETTE.DARK_GRAY,
            overflowX: "hidden",
          }}
        >
          <DrawerHeader />
          {/** Scenario Section */}
          <Stack>
            {/** Scenario Name */}
            <Stack direction={"row"} sx={{ pl: 2, mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 200 }}>
                {props.game.currentScenario.name}
              </Typography>
            </Stack>
            {/** Context Notification Text Section */}
            <Stack spacing={0.5} direction="column" sx={{ p: 0, mt: 0 }}>
              <CurrentActionContextDisplay />
            </Stack>
            {/** Scenario Actions */}{" "}
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
                <Tooltip title="New Scenario">
                  <IconButton onClick={newScenario}>
                    <InsertDriveFileIcon
                      fontSize="medium"
                      sx={{ color: "#000000" }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Load Scenario">
                  <IconButton onClick={handleLoadScenarioIconClick}>
                    <UploadFileOutlinedIcon
                      fontSize="medium"
                      sx={{ color: "#171717" }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={
                    isAuthenticated
                      ? cloudScenarios.length > 4
                        ? "Cloud save limit reached. Please delete a scenario from the cloud to save a new one."
                        : "Save to cloud"
                      : "Login to save senario to cloud"
                  }
                >
                  <IconButton onClick={saveScenarioToCloud}>
                    <Save
                      fontSize="medium"
                      sx={{
                        color: isAuthenticated
                          ? "#171717"
                          : COLOR_PALETTE.DARK_GRAY,
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={
                    isAuthenticated || import.meta.env.VITE_ENV !== "production"
                      ? "Download Scenario"
                      : "Login to download scenario"
                  }
                >
                  <IconButton onClick={exportScenario}>
                    <FileDownloadOutlinedIcon
                      fontSize="medium"
                      sx={{
                        color:
                          isAuthenticated ||
                          import.meta.env.VITE_ENV !== "production"
                            ? "#171717"
                            : COLOR_PALETTE.DARK_GRAY,
                      }}
                    />
                  </IconButton>
                </Tooltip>
                {/* Scenario Name Edit Menu/Button  */}
                <Tooltip title="Edit Scenario Name">
                  <IconButton onClick={handleOpenScenarioEditNameMenu}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </CardActions>
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
            {presetScenarioSelectionMenu()}
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
                <Tooltip title={"Undo"}>
                  <IconButton onClick={handleUndo}>{<Undo />}</IconButton>
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
                    sx={{
                      minWidth: "52px",
                    }}
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
              backgroundColor: COLOR_PALETTE.LIGHT_GRAY,
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
                  const sideIds = props.game.currentScenario.sides.map(
                    (side) => side.id
                  );
                  const selectedSideIds =
                    entityFilterSelectedOptions.filter((item) =>
                      sideIds.includes(item)
                    ) || [];
                  const updatedOptions = [
                    ...selectedSideIds,
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
            backgroundColor: COLOR_PALETTE.LIGHT_GRAY,
            borderRight: "1px solid",
            borderRightColor: COLOR_PALETTE.DARK_GRAY,
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
