import { useContext, useEffect, useRef, useState } from "react";
import { Feature, MapBrowserEvent, Map as OlMap, Overlay } from "ol";
import { unByKey } from "ol/Observable";
import View from "ol/View";
import { EventsKey } from "ol/events";
import { Geometry, LineString } from "ol/geom";
import Point from "ol/geom/Point.js";
import Draw from "ol/interaction/Draw.js";
import { Pixel } from "ol/pixel";
import {
  Projection,
  fromLonLat,
  get as getProjection,
  toLonLat,
  transform,
} from "ol/proj";
import VectorSource from "ol/source/Vector";
import { getLength } from "ol/sphere.js";
import Game from "@/game/Game";
import Scenario from "@/game/Scenario";
import "@/styles/ScenarioMap.css";
import {
  APP_DRAWER_WIDTH,
  DEFAULT_OL_PROJECTION_CODE,
  NAUTICAL_MILES_TO_METERS,
} from "@/utils/constants";
import { styled } from "@mui/material/styles";
import { randomInt } from "@/utils/mapFunctions";
import { delay } from "@/utils/dateTimeFunctions";
import MultipleFeatureSelector from "@/gui/map/MultipleFeatureSelector";
import { SetScenarioTimeContext } from "@/gui/contextProviders/contexts/ScenarioTimeContext";
import { SetGameStatusContext } from "@/gui/contextProviders/contexts/GameStatusContext";
import { SetMouseMapCoordinatesContext } from "@/gui/contextProviders/contexts/MouseMapCoordinatesContext";
import { ToastContext } from "@/gui/contextProviders/contexts/ToastContext";
import AirbaseCard from "@/gui/map/feature/AirbaseCard";
import AircraftCard from "@/gui/map/feature/AircraftCard";
import FacilityCard from "@/gui/map/feature/FacilityCard";
import ShipCard from "@/gui/map/feature/ShipCard";
import BaseMapLayers from "@/gui/map/mapLayers/BaseMapLayers";
import { routeDrawLineStyle } from "@/gui/map/mapLayers/FeatureLayerStyles";
import {
  AirbasesLayer,
  AircraftLayer,
  FacilityLayer,
  FeatureLabelLayer,
  RouteLayer,
  ShipLayer,
  ThreatRangeLayer,
  WeaponLayer,
  ReferencePointLayer,
  FeatureEntityState,
} from "@/gui/map/mapLayers/FeatureLayers";
import BottomInfoDisplay from "@/gui/map/toolbar/BottomInfoDisplay";
import LayerVisibilityPanelToggle from "@/gui/map/toolbar/LayerVisibilityToggle";
import Toolbar from "@/gui/map/toolbar/Toolbar";
import { AircraftDb, AirbaseDb, FacilityDb, ShipDb } from "@/game/db/UnitDb";
import ReferencePointCard from "@/gui/map/feature/ReferencePointCard";
import ReferencePoint from "@/game/units/ReferencePoint";
import MissionCreatorCard from "@/gui/map/mission/MissionCreatorCard";
import MissionEditorCard from "@/gui/map/mission/MissionEditorCard";
import BaseVectorLayer from "ol/layer/BaseVector";
import VectorLayer from "ol/layer/Vector";

interface ScenarioMapProps {
  zoom: number;
  center: number[];
  game: Game;
  projection?: Projection;
  mobileView: boolean;
}

interface IOpenMultipleFeatureSelector {
  open: boolean;
  top: number;
  left: number;
  features: Feature<Geometry>[];
}

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${APP_DRAWER_WIDTH}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

export default function ScenarioMap({
  zoom,
  center,
  game,
  projection,
  mobileView,
}: Readonly<ScenarioMapProps>) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const defaultProjection = getProjection(DEFAULT_OL_PROJECTION_CODE);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [baseMapLayers, setBaseMapLayers] = useState(
    new BaseMapLayers(projection)
  );
  const [aircraftLayer, setAircraftLayer] = useState(
    new AircraftLayer(projection, 3)
  );
  const [airbasesLayer, setAirbasesLayer] = useState(
    new AirbasesLayer(projection, 1)
  );
  const [facilityLayer, setFacilityLayer] = useState(
    new FacilityLayer(projection, 1)
  );
  const [threatRangeLayer, setThreatRangeLayer] = useState(
    new ThreatRangeLayer(projection)
  );
  const [aircraftRouteLayer, setAircraftRouteLayer] = useState(
    new RouteLayer("aircraftRouteLayer", projection)
  );
  const [shipRouteLayer, setShipRouteLayer] = useState(
    new RouteLayer("shipRouteLayer", projection)
  );
  const [weaponLayer, setWeaponLayer] = useState(
    new WeaponLayer(projection, 2)
  );
  const [shipLayer, setShipLayer] = useState(new ShipLayer(projection, 1));
  const [referencePointLayer, setReferencePointLayer] = useState(
    new ReferencePointLayer(projection, 1)
  );
  const [featureLabelLayer, setFeatureLabelLayer] = useState(
    new FeatureLabelLayer(projection, 4)
  );
  const [featureEntitiesState, setFeatureEntitiesState] = useState<
    FeatureEntityState[]
  >([]);
  const [currentScenarioTimeCompression, setCurrentScenarioTimeCompression] =
    useState(game.currentScenario.timeCompression);
  const [currentSideName, setCurrentSideName] = useState(game.currentSideName);
  const [openAircraftCard, setOpenAircraftCard] = useState({
    open: false,
    top: 0,
    left: 0,
    aircraftId: "",
  });
  const [openAirbaseCard, setOpenAirbaseCard] = useState({
    open: false,
    top: 0,
    left: 0,
    airbaseId: "",
  });
  const [openFacilityCard, setOpenFacilityCard] = useState({
    open: false,
    top: 0,
    left: 0,
    facilityId: "",
  });
  const [openShipCard, setOpenShipCard] = useState({
    open: false,
    top: 0,
    left: 0,
    shipId: "",
  });
  const [openReferencePointCard, setOpenReferencePointCard] = useState({
    open: false,
    top: 0,
    left: 0,
    referencePointId: "",
  });
  const [openMultipleFeatureSelector, setOpenMultipleFeatureSelector] =
    useState<IOpenMultipleFeatureSelector>({
      open: false,
      top: 0,
      left: 0,
      features: [],
    });
  const [featureLabelVisible, setFeatureLabelVisible] = useState(true);
  const [threatRangeVisible, setThreatRangeVisible] = useState(true);
  const [routeVisible, setRouteVisible] = useState(true);
  const [referencePointVisible, setReferencePointVisible] = useState(true);
  const [keyboardShortcutsEnabled, setKeyboardShortcutsEnabled] =
    useState(true);
  const [missionCreatorActive, setMissionCreatorActive] = useState(false);
  const [missionEditorActive, setMissionEditorActive] = useState(false);
  const setCurrentScenarioTimeToContext = useContext(SetScenarioTimeContext);
  const setCurrentGameStatusToContext = useContext(SetGameStatusContext);
  const setCurrentMouseMapCoordinatesToContext = useContext(
    SetMouseMapCoordinatesContext
  );
  const toastContext = useContext(ToastContext);

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    minHeight: "auto",
    margin: mobileView ? 0 : 16,
    justifyContent: "flex-end",
  }));

  let routeMeasurementDrawLine: Draw | null = null;
  let routeMeasurementTooltipElement: HTMLDivElement | null = null;
  let routeMeasurementTooltip: Overlay | null = null;
  let routeMeasurementListener: EventsKey | undefined;
  let mousePosition: number[];
  let teleportingUnit = false;

  const map = new OlMap({
    layers: [
      ...baseMapLayers.layers,
      aircraftLayer.layer,
      facilityLayer.layer,
      airbasesLayer.layer,
      threatRangeLayer.layer,
      aircraftRouteLayer.layer,
      shipRouteLayer.layer,
      weaponLayer.layer,
      featureLabelLayer.layer,
      shipLayer.layer,
      referencePointLayer.layer,
    ],
    view: new View({
      center: center,
      zoom: zoom,
      projection: projection ?? defaultProjection!,
    }),
    controls: [],
  });
  const [theMap, setTheMap] = useState(map);

  useEffect(() => {
    theMap.setTarget(mapRef.current!);
    refreshAllLayers();
    setCurrentScenarioTimeToContext(game.currentScenario.currentTime);
    loadFeatureEntitiesState();

    return () => {
      if (!theMap) return;
      theMap.setTarget();
    };
  }, []);

  theMap.on("click", (event) => handleMapClick(event));

  theMap.on("pointermove", function (event) {
    mousePosition = event.coordinate;
    const coordinatesLatLong = toLonLat(
      event.coordinate,
      theMap.getView().getProjection()
    );
    setCurrentMouseMapCoordinatesToContext({
      latitude: coordinatesLatLong[1],
      longitude: coordinatesLatLong[0],
    });
  });

  theMap.on("moveend", function (event) {
    const view = event.map.getView();
    const center = view.getCenter();
    const zoom = view.getZoom();
    if (center) {
      game.mapView.currentCameraCenter = toLonLat(center, view.getProjection());
    }
    if (zoom) game.mapView.currentCameraZoom = zoom;
  });

  // theMap.getViewport().addEventListener('contextmenu', function (evt) {
  //   evt.preventDefault();
  //   console.log(theMap.getEventPixel(evt));
  // });

  function getSelectedFeatureType(featureId: string): string {
    let featureType = "";
    if (game.currentScenario.getAircraft(featureId)) featureType = "aircraft";
    else if (game.currentScenario.getFacility(featureId))
      featureType = "facility";
    else if (game.currentScenario.getAirbase(featureId))
      featureType = "airbase";
    else if (game.currentScenario.getShip(featureId)) featureType = "ship";
    return featureType;
  }

  function getMapClickContext(event: MapBrowserEvent<MouseEvent>): string {
    let context = "default";
    const featuresAtPixel = getFeaturesAtPixel(
      theMap.getEventPixel(event.originalEvent)
    );
    const selectedFeatureType = getSelectedFeatureType(game.selectedUnitId);
    const attackerFeatureType = getSelectedFeatureType(game.currentAttackerId);
    if (selectedFeatureType === "aircraft" && routeMeasurementDrawLine) {
      context = "moveAircraft";
    } else if (selectedFeatureType === "ship" && routeMeasurementDrawLine) {
      context = "moveShip";
    } else if (game.selectedUnitId && teleportingUnit) {
      context = "teleportUnit";
    } else if (
      game.selectingTarget &&
      attackerFeatureType === "aircraft" &&
      featuresAtPixel.length === 1
    ) {
      context = "aircraftSelectedAttackTarget";
    } else if (
      game.selectingTarget &&
      attackerFeatureType === "ship" &&
      featuresAtPixel.length === 1
    ) {
      context = "shipSelectedAttackTarget";
    } else if (
      game.selectingTarget &&
      attackerFeatureType === "aircraft" &&
      featuresAtPixel.length !== 1
    ) {
      context = "aircraftCancelledAttack";
    } else if (
      game.selectingTarget &&
      attackerFeatureType === "ship" &&
      featuresAtPixel.length !== 1
    ) {
      context = "shipCancelledAttack";
    } else if (featuresAtPixel.length === 1) {
      context = "selectSingleFeature";
    } else if (featuresAtPixel.length > 1) {
      context = "selectMultipleFeatures";
    } else if (
      game.addingAircraft ||
      game.addingFacility ||
      game.addingAirbase ||
      game.addingShip ||
      game.addingReferencePoint
    ) {
      context = "addUnit";
    }
    return context;
  }

  function handleMapClick(event: MapBrowserEvent<MouseEvent>) {
    const mapClickContext = getMapClickContext(event);
    const featuresAtPixel = getFeaturesAtPixel(
      theMap.getEventPixel(event.originalEvent)
    );
    switch (mapClickContext) {
      case "moveAircraft": {
        moveAircraft(game.selectedUnitId, event.coordinate);
        break;
      }
      case "moveShip": {
        moveShip(game.selectedUnitId, event.coordinate);
        break;
      }
      case "teleportUnit": {
        teleportingUnit = false;
        teleportUnit(game.selectedUnitId, event.coordinate);
        game.selectedUnitId = "";
        setCurrentGameStatusToContext(
          game.scenarioPaused ? "Scenario paused" : "Scenario playing"
        );
        break;
      }
      case "aircraftSelectedAttackTarget": {
        const targetFeature = featuresAtPixel[0];
        const targetId = targetFeature.getProperties()?.id;
        game.handleAircraftAttack(game.currentAttackerId, targetId);
        resetAttack();
        setCurrentGameStatusToContext("Target acquired");
        break;
      }
      case "shipSelectedAttackTarget": {
        const targetFeature = featuresAtPixel[0];
        const targetId = targetFeature.getProperties()?.id;
        game.handleShipAttack(game.currentAttackerId, targetId);
        resetAttack();
        setCurrentGameStatusToContext("Target acquired");
        break;
      }
      case "aircraftCancelledAttack": {
        resetAttack();
        break;
      }
      case "shipCancelledAttack": {
        resetAttack();
        break;
      }
      case "selectSingleFeature":
        handleSelectSingleFeature(featuresAtPixel[0]);
        break;
      case "selectMultipleFeatures":
        handleSelectMultipleFeatures(featuresAtPixel);
        break;
      case "addUnit":
        handleAddUnit(event.coordinate);
        break;
      case "default":
        break;
    }
  }

  function handleSelectSingleFeature(feature: Feature) {
    const currentSelectedFeatureId = feature.getProperties()?.id;
    const currentSelectedFeatureType = feature.getProperties()?.type;
    const currentSelectedFeatureSideName = feature.getProperties()?.sideName;

    if (
      !game.godMode &&
      currentSelectedFeatureSideName &&
      currentSelectedFeatureSideName !== game.currentSideName
    )
      return;

    if (currentSelectedFeatureId) {
      if (
        currentSelectedFeatureType === "aircraft" &&
        game.currentScenario.getAircraft(currentSelectedFeatureId)
      ) {
        if (game.eraserMode) {
          removeAircraft(currentSelectedFeatureId);
          return;
        }
        game.selectedUnitId = "";
        const aircraft = game.currentScenario.getAircraft(
          currentSelectedFeatureId
        );
        if (aircraft) {
          aircraft.selected = false;
          aircraftLayer.updateAircraftFeature(
            aircraft.id,
            aircraft.selected,
            aircraft.heading
          );
        }
        const aircraftGeometry = feature.getGeometry() as Point;
        const aircraftCoordinate = aircraftGeometry.getCoordinates();
        const aircraftPixels =
          theMap.getPixelFromCoordinate(aircraftCoordinate);
        setOpenAircraftCard({
          open: true,
          top: aircraftPixels[1],
          left: aircraftPixels[0],
          aircraftId: currentSelectedFeatureId,
        });
      } else if (
        currentSelectedFeatureType === "airbase" &&
        game.currentScenario.getAirbase(currentSelectedFeatureId)
      ) {
        if (game.eraserMode) {
          removeAirbase(currentSelectedFeatureId);
          return;
        }
        const airbaseGeometry = feature.getGeometry() as Point;
        const airbaseCoordinate = airbaseGeometry.getCoordinates();
        const airbasePixels = theMap.getPixelFromCoordinate(airbaseCoordinate);
        setOpenAirbaseCard({
          open: true,
          top: airbasePixels[1],
          left: airbasePixels[0],
          airbaseId: currentSelectedFeatureId,
        });
      } else if (
        currentSelectedFeatureType === "facility" &&
        game.currentScenario.getFacility(currentSelectedFeatureId)
      ) {
        if (game.eraserMode) {
          removeFacility(currentSelectedFeatureId);
          return;
        }
        const facilityGeometry = feature.getGeometry() as Point;
        const facilityCoordinate = facilityGeometry.getCoordinates();
        const facilityPixels =
          theMap.getPixelFromCoordinate(facilityCoordinate);
        setOpenFacilityCard({
          open: true,
          top: facilityPixels[1],
          left: facilityPixels[0],
          facilityId: currentSelectedFeatureId,
        });
      } else if (
        currentSelectedFeatureType === "ship" &&
        game.currentScenario.getShip(currentSelectedFeatureId)
      ) {
        if (game.eraserMode) {
          removeShip(currentSelectedFeatureId);
          return;
        }
        game.selectedUnitId = "";
        const ship = game.currentScenario.getShip(currentSelectedFeatureId);
        if (ship) {
          ship.selected = false;
          shipLayer.updateShipFeature(ship.id, ship.selected, ship.heading);
        }
        const shipGeometry = feature.getGeometry() as Point;
        const shipCoordinate = shipGeometry.getCoordinates();
        const shipPixels = theMap.getPixelFromCoordinate(shipCoordinate);
        setOpenShipCard({
          open: true,
          top: shipPixels[1],
          left: shipPixels[0],
          shipId: currentSelectedFeatureId,
        });
      } else if (
        currentSelectedFeatureType === "referencePoint" &&
        game.currentScenario.getReferencePoint(currentSelectedFeatureId)
      ) {
        if (game.eraserMode) {
          removeReferencePoint(currentSelectedFeatureId);
          return;
        }
        const referencePointGeometry = feature.getGeometry() as Point;
        const referencePointCoordinate =
          referencePointGeometry.getCoordinates();
        const referencePointPixels = theMap.getPixelFromCoordinate(
          referencePointCoordinate
        );
        setOpenReferencePointCard({
          open: true,
          top: referencePointPixels[1],
          left: referencePointPixels[0],
          referencePointId: currentSelectedFeatureId,
        });
      }
      setKeyboardShortcutsEnabled(false);
    }
  }

  function handleSelectMultipleFeatures(features: Feature[]) {
    if (features.length < 2) return;
    const singleFeatureGeometry = features[0].getGeometry() as Point;
    const singleFeatureCoordinates = singleFeatureGeometry.getCoordinates();
    const singleFeaturePixels = theMap.getPixelFromCoordinate(
      singleFeatureCoordinates
    );
    setOpenMultipleFeatureSelector({
      open: true,
      top: singleFeaturePixels[1],
      left: singleFeaturePixels[0],
      features: features,
    });
  }

  function handleAddUnit(coordinates: number[]) {
    const unitClassSelected = game.selectedUnitClassName;
    if (game.addingAircraft) {
      const aircraftTemplate = AircraftDb.find(
        (aircraft) => aircraft.className === unitClassSelected
      );
      addAircraft(
        coordinates,
        aircraftTemplate?.className,
        aircraftTemplate?.speed ? aircraftTemplate?.speed / 1.151 : undefined,
        aircraftTemplate?.maxFuel,
        aircraftTemplate?.fuelRate ? aircraftTemplate?.fuelRate * 8 : undefined,
        aircraftTemplate?.range
      );
      game.addingAircraft = false;
    } else if (game.addingFacility) {
      const facilityTemplate = FacilityDb.find(
        (facility) => facility.className === unitClassSelected
      );
      addFacility(
        coordinates,
        facilityTemplate?.className,
        facilityTemplate?.range
      );
      game.addingFacility = false;
    } else if (game.addingAirbase) {
      const airbaseTemplate = AirbaseDb.find(
        (airbase) => airbase.name === unitClassSelected
      );
      addAirbase(coordinates, airbaseTemplate?.name);
      game.addingAirbase = false;
    } else if (game.addingShip) {
      const shipTemplate = ShipDb.find(
        (ship) => ship.className === unitClassSelected
      );
      addShip(
        coordinates,
        shipTemplate?.className,
        shipTemplate?.speed ? shipTemplate?.speed / 1.151 : undefined,
        shipTemplate?.maxFuel,
        shipTemplate?.fuelRate ? shipTemplate?.fuelRate * 8 : undefined,
        shipTemplate?.range
      );
      game.addingShip = false;
    } else if (game.addingReferencePoint) {
      addReferencePoint(coordinates);
      game.addingReferencePoint = false;
    }
    setCurrentGameStatusToContext(
      game.scenarioPaused ? "Scenario paused" : "Scenario playing"
    );
    updateSelectedUnitClassName(null);
  }

  function getFeaturesAtPixel(pixel: Pixel): Feature[] {
    const selectedFeatures: Feature[] = [];
    const excludedFeatureTypes = [
      "rangeRing",
      "route",
      "weapon",
      "aircraftFeatureLabel",
      "facilityFeatureLabel",
      "airbaseFeatureLabel",
      "shipFeatureLabel",
    ];
    const includedFeatureTypes = [
      "aircraft",
      "facility",
      "airbase",
      "ship",
      "referencePoint",
    ];
    theMap.forEachFeatureAtPixel(
      pixel,
      function (feature) {
        if (includedFeatureTypes.includes(feature.getProperties()?.type))
          selectedFeatures.push(feature as Feature);
      },
      { hitTolerance: 5 }
    );
    return selectedFeatures;
  }

  function loadFeatureEntitiesState() {
    if (!theMap) return;

    const vectorLayers = theMap
      .getLayers()
      .getArray()
      .filter(
        (layer) =>
          layer instanceof VectorLayer || layer instanceof BaseVectorLayer
      );

    const visibleFeaturesMap: Record<string, FeatureEntityState> = {};

    const features = vectorLayers
      .map((layer) => layer.getSource().getFeatures())
      .flat();

    for (const feature of features) {
      if (
        ["rangeRing", "route"].includes(feature.get("type")) ||
        visibleFeaturesMap[feature.get("id")] !== undefined
      ) {
        continue;
      }
      visibleFeaturesMap[feature.get("id")] = {
        id: feature.get("id"),
        name: feature.get("name"),
        type: feature.get("type").replaceAll("FeatureLabel", ""),
        sideColor: feature.get("sideColor"),
      };
    }

    setFeatureEntitiesState(Object.values(visibleFeaturesMap));
  }

  function handleFeatureEntityStateAction(
    payload: Partial<FeatureEntityState>,
    action: "add" | "remove"
  ) {
    if (action === "remove") {
      setFeatureEntitiesState((prevFeatures) =>
        prevFeatures.filter((feature) => feature.id !== payload.id)
      );
    }

    if (action === "add") {
      const existingFeature = featureEntitiesState.find(
        (feature) => feature.id === payload.id
      );
      if (!existingFeature) {
        setFeatureEntitiesState((prevFeatures) => [
          payload as FeatureEntityState,
          ...prevFeatures,
        ]);
      }
    }
  }

  function updateSelectedUnitClassName(unitClassName: string | null) {
    game.selectedUnitClassName = unitClassName;
  }

  function setAddingAircraft(unitClassName: string) {
    game.addingAircraft = !game.addingAircraft;
    game.addingFacility = false;
    game.addingAirbase = false;
    game.addingShip = false;
    game.addingReferencePoint = false;
    if (game.addingAircraft) {
      setCurrentGameStatusToContext("Click on the map to add an aircraft");
      updateSelectedUnitClassName(unitClassName);
    } else {
      setCurrentGameStatusToContext(
        game.scenarioPaused ? "Scenario paused" : "Scenario playing"
      );
      updateSelectedUnitClassName(null);
    }
  }

  function setAddingFacility(unitClassName: string) {
    game.addingFacility = !game.addingFacility;
    game.addingAircraft = false;
    game.addingAirbase = false;
    game.addingShip = false;
    game.addingReferencePoint = false;
    if (game.addingFacility) {
      setCurrentGameStatusToContext("Click on the map to add a facility");
      updateSelectedUnitClassName(unitClassName);
    } else {
      setCurrentGameStatusToContext(
        game.scenarioPaused ? "Scenario paused" : "Scenario playing"
      );
      updateSelectedUnitClassName(null);
    }
  }

  function setAddingAirbase(unitClassName: string) {
    game.addingAirbase = !game.addingAirbase;
    game.addingAircraft = false;
    game.addingFacility = false;
    game.addingShip = false;
    game.addingReferencePoint = false;
    if (game.addingAirbase) {
      setCurrentGameStatusToContext("Click on the map to add an airbase");
      updateSelectedUnitClassName(unitClassName);
    } else {
      setCurrentGameStatusToContext(
        game.scenarioPaused ? "Scenario paused" : "Scenario playing"
      );
      updateSelectedUnitClassName(null);
    }
  }

  function setAddingShip(unitClassName: string) {
    game.addingShip = !game.addingShip;
    game.addingAircraft = false;
    game.addingFacility = false;
    game.addingAirbase = false;
    game.addingReferencePoint = false;
    if (game.addingShip) {
      setCurrentGameStatusToContext("Click on the map to add a ship");
      updateSelectedUnitClassName(unitClassName);
    } else {
      setCurrentGameStatusToContext(
        game.scenarioPaused ? "Scenario paused" : "Scenario playing"
      );
      updateSelectedUnitClassName(null);
    }
  }

  function setAddingReferencePoint() {
    game.addingReferencePoint = !game.addingReferencePoint;
    game.addingAircraft = false;
    game.addingFacility = false;
    game.addingAirbase = false;
    game.addingShip = false;
    if (game.addingReferencePoint) {
      setCurrentGameStatusToContext(
        "Click on the map to add a reference point"
      );
    } else {
      setCurrentGameStatusToContext(
        game.scenarioPaused ? "Scenario paused" : "Scenario playing"
      );
    }
  }

  function handleStepGameClick() {
    setGamePaused();
    stepGameAndDrawFrame();
  }

  function handlePauseGameClick() {
    setGamePaused();
    setCurrentScenarioTimeToContext(game.currentScenario.currentTime);
  }

  async function handlePlayGameClick() {
    setCurrentGameStatusToContext("Scenario playing");
    game.scenarioPaused = false;
    let gameEnded = game.checkGameEnded();
    while (!game.scenarioPaused && !gameEnded) {
      const [_observation, _reward, terminated, truncated, _info] =
        stepGameAndDrawFrame();

      const status = terminated || truncated;
      gameEnded = status as boolean;

      await delay(0);
    }
  }

  function stepGameForStepSize(
    stepSize: number
  ): [Scenario, number, boolean, boolean, null] {
    let steps = 1;
    let [observation, reward, terminated, truncated, info] = game.step();
    while (steps < stepSize) {
      [observation, reward, terminated, truncated, info] = game.step();
      steps++;
    }
    return [observation, reward, terminated, truncated, info];
  }

  function stepGameAndDrawFrame() {
    // const gameStepStartTime = new Date().getTime();
    const [observation, reward, terminated, truncated, info] =
      stepGameForStepSize(game.currentScenario.timeCompression);
    // const gameStepElapsed = new Date().getTime() - gameStepStartTime;

    setCurrentScenarioTimeToContext(observation.currentTime);

    // const guiDrawStartTime = new Date().getTime();
    drawNextFrame(observation);
    // const guiDrawElapsed = new Date().getTime() - guiDrawStartTime;
    // console.log('gameStepElapsed:', gameStepElapsed, 'guiDrawElapsed:', guiDrawElapsed)

    return [observation, reward, terminated, truncated, info];
  }

  function drawNextFrame(observation: Scenario) {
    aircraftLayer.refresh(observation.aircraft);
    weaponLayer.refresh(observation.weapons);
    shipLayer.refresh(observation.ships);
    refreshRouteLayer(observation);
    if (featureLabelVisible) {
      featureLabelLayer.refreshSubset(observation.aircraft, "aircraft");
      featureLabelLayer.refreshSubset(observation.ships, "ship");
    }
    if (facilityLayer.featureCount !== observation.facilities.length) {
      facilityLayer.refresh(observation.facilities);
      if (featureLabelVisible)
        featureLabelLayer.refreshSubset(observation.facilities, "facility");
    }
    if (airbasesLayer.featureCount !== observation.airbases.length) {
      airbasesLayer.refresh(observation.airbases);
      if (featureLabelVisible)
        featureLabelLayer.refreshSubset(observation.airbases, "airbase");
    }
    if (threatRangeVisible)
      threatRangeLayer.refresh([
        ...observation.facilities,
        ...observation.ships,
      ]);
    if (
      referencePointLayer.featureCount !== observation.referencePoints.length
    ) {
      referencePointLayer.refresh(observation.referencePoints);
      if (featureLabelVisible)
        featureLabelLayer.refreshSubset(
          observation.referencePoints,
          "referencePoint"
        );
    }
  }

  function setGamePaused() {
    game.scenarioPaused = true;
    setCurrentGameStatusToContext("Scenario paused");
  }

  function addAircraft(
    coordinates: number[],
    className?: string,
    speed?: number,
    maxFuel?: number,
    fuelRate?: number,
    range?: number
  ) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    className = className ?? "F-22Z";
    const aircraftName = className + " #" + randomInt(1, 5000).toString();
    const latitude = coordinates[1];
    const longitude = coordinates[0];
    const newAircraft = game.addAircraft(
      aircraftName,
      className,
      latitude,
      longitude,
      speed,
      maxFuel,
      fuelRate,
      range
    );
    if (newAircraft) {
      aircraftLayer.addAircraftFeature(newAircraft);
      handleFeatureEntityStateAction(
        {
          id: newAircraft.id,
          name: newAircraft.name,
          type: "aircraft",
          sideColor: newAircraft.sideColor as "blue" | "red",
        },
        "add"
      );
      if (featureLabelVisible)
        featureLabelLayer.addFeatureLabelFeature(newAircraft);
    }
  }

  function addAircraftToAirbase(airbaseId: string) {
    const aircraftName = "Raptor #" + randomInt(1, 5000).toString();
    const className = AircraftDb[0].className;
    game.addAircraftToAirbase(aircraftName, className, airbaseId);
  }

  function addFacility(
    coordinates: number[],
    className?: string,
    range?: number
  ) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    className = className ?? "SAM";
    const facilityName = className + " #" + randomInt(1, 5000).toString();
    const latitude = coordinates[1];
    const longitude = coordinates[0];
    const newFacility = game.addFacility(
      facilityName,
      className,
      latitude,
      longitude,
      range
    );
    if (newFacility) {
      facilityLayer.addFacilityFeature(newFacility);
      handleFeatureEntityStateAction({ id: newFacility.id }, "add");
      if (threatRangeVisible) threatRangeLayer.addRangeFeature(newFacility);
      if (featureLabelVisible)
        featureLabelLayer.addFeatureLabelFeature(newFacility);
    }
  }

  function addAirbase(coordinates: number[], name?: string) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const airbaseName =
      (name ?? "Floridistan AFB") + " #" + randomInt(1, 5000).toString();
    const className = "Airfield";
    const latitude = coordinates[1];
    const longitude = coordinates[0];
    const newAirbase = game.addAirbase(
      airbaseName,
      className,
      latitude,
      longitude
    );
    if (newAirbase) {
      airbasesLayer.addAirbaseFeature(newAirbase);
      handleFeatureEntityStateAction(
        {
          id: newAirbase.id,
          name: newAirbase.name,
          type: "airbase",
          sideColor: newAirbase.sideColor as "blue" | "red",
        },
        "add"
      );
      if (featureLabelVisible)
        featureLabelLayer.addFeatureLabelFeature(newAirbase);
    }
  }

  function removeAirbase(airbaseId: string) {
    game.removeAirbase(airbaseId);
    airbasesLayer.removeFeatureById(airbaseId);
    handleFeatureEntityStateAction({ id: airbaseId }, "remove");
    if (featureLabelVisible) featureLabelLayer.removeFeatureById(airbaseId);
  }

  function removeFacility(facilityId: string) {
    game.removeFacility(facilityId);
    facilityLayer.removeFeatureById(facilityId);
    threatRangeLayer.removeFeatureById(facilityId);
    handleFeatureEntityStateAction({ id: facilityId }, "remove");
    if (featureLabelVisible) featureLabelLayer.removeFeatureById(facilityId);
  }

  function removeAircraft(aircraftId: string) {
    game.removeAircraft(aircraftId);
    aircraftLayer.removeFeatureById(aircraftId);
    aircraftRouteLayer.removeFeatureById(aircraftId);
    handleFeatureEntityStateAction({ id: aircraftId }, "remove");
    if (featureLabelVisible) featureLabelLayer.removeFeatureById(aircraftId);
  }

  function addReferencePoint(coordinates: number[], name?: string) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    name = name ?? "Reference Point #" + randomInt(1, 5000).toString();
    const newReferencePoint = game.addReferencePoint(
      name,
      coordinates[1],
      coordinates[0]
    );
    if (newReferencePoint) {
      referencePointLayer.addReferencePointFeature(newReferencePoint);
      handleFeatureEntityStateAction(
        {
          id: newReferencePoint.id,
          name: newReferencePoint.name,
          type: "referencePoint",
          sideColor: newReferencePoint.sideColor as "blue" | "red",
        },
        "add"
      );
      if (featureLabelVisible)
        featureLabelLayer.addFeatureLabelFeature(newReferencePoint);
    }
  }

  function removeReferencePoint(referencePointId: string) {
    game.removeReferencePoint(referencePointId);
    referencePointLayer.removeFeatureById(referencePointId);
    handleFeatureEntityStateAction({ id: referencePointId }, "remove");
    if (featureLabelVisible)
      featureLabelLayer.removeFeatureById(referencePointId);
  }

  function addShip(
    coordinates: number[],
    className?: string,
    speed?: number,
    maxFuel?: number,
    fuelRate?: number,
    range?: number
  ) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    className = className ?? "Carrier";
    const shipName = className + " #" + randomInt(1, 5000).toString();
    const latitude = coordinates[1];
    const longitude = coordinates[0];
    const newShip = game.addShip(
      shipName,
      className,
      latitude,
      longitude,
      speed,
      maxFuel,
      fuelRate,
      range
    );
    if (newShip) {
      shipLayer.addShipFeature(newShip);
      handleFeatureEntityStateAction(
        {
          id: newShip.id,
          name: newShip.name,
          type: "facility",
          sideColor: newShip.sideColor as "blue" | "red",
        },
        "add"
      );
      if (threatRangeVisible) threatRangeLayer.addRangeFeature(newShip);
      if (featureLabelVisible)
        featureLabelLayer.addFeatureLabelFeature(newShip);
    }
  }

  function addAircraftToShip(shipId: string) {
    const aircraftName = "Raptor #" + randomInt(1, 5000).toString();
    const className = AircraftDb[0].className;
    game.addAircraftToShip(aircraftName, className, shipId);
  }

  function removeShip(shipId: string) {
    game.removeShip(shipId);
    shipLayer.removeFeatureById(shipId);
    shipRouteLayer.removeFeatureById(shipId);
    threatRangeLayer.removeFeatureById(shipId);
    handleFeatureEntityStateAction({ id: shipId }, "remove");
    if (featureLabelVisible) featureLabelLayer.removeFeatureById(shipId);
  }

  function moveShip(shipId: string, coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const destinationLatitude = coordinates[1];
    const destinationLongitude = coordinates[0];
    game.moveShip(shipId, destinationLatitude, destinationLongitude);
  }

  function launchAircraftFromShip(shipId: string) {
    const launchedAircraft = game.launchAircraftFromShip(shipId);
    if (launchedAircraft) {
      aircraftLayer.addAircraftFeature(launchedAircraft);
      if (featureLabelVisible)
        featureLabelLayer.addFeatureLabelFeature(launchedAircraft);
    }
  }

  function moveAircraft(aircraftId: string, coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const destinationLatitude = coordinates[1];
    const destinationLongitude = coordinates[0];
    game.moveAircraft(aircraftId, destinationLatitude, destinationLongitude);
  }

  function teleportUnit(unitId: string, coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const destinationLatitude = coordinates[1];
    const destinationLongitude = coordinates[0];
    const teleportedUnit = game.teleportUnit(
      unitId,
      destinationLatitude,
      destinationLongitude
    );
    if (teleportedUnit) refreshAllLayers();
  }

  function launchAircraftFromAirbase(airbaseId: string) {
    const launchedAircraft = game.launchAircraftFromAirbase(airbaseId);
    if (launchedAircraft) {
      aircraftLayer.addAircraftFeature(launchedAircraft);
      if (featureLabelVisible)
        featureLabelLayer.addFeatureLabelFeature(launchedAircraft);
    }
  }

  function resetAttack() {
    game.selectingTarget = false;
    game.currentAttackerId = "";
    setCurrentGameStatusToContext(
      game.scenarioPaused ? "Scenario paused" : "Scenario playing"
    );
  }

  function handleAircraftAttack(aircraftId: string) {
    game.selectingTarget = true;
    game.currentAttackerId = aircraftId;
    setCurrentGameStatusToContext("Select an enemy target to attack");
  }

  function handleShipAttack(shipId: string) {
    game.selectingTarget = true;
    game.currentAttackerId = shipId;
    setCurrentGameStatusToContext("Select an enemy target to attack");
  }

  function queueAircraftForMovement(aircraftId: string) {
    game.selectedUnitId = aircraftId;
    const aircraft = game.currentScenario.getAircraft(aircraftId);
    if (aircraft) {
      aircraft.selected = true;
      aircraftLayer.updateAircraftFeature(
        aircraft.id,
        aircraft.selected,
        aircraft.heading
      );
      addRouteMeasurementInteraction(
        fromLonLat(
          [aircraft.longitude, aircraft.latitude],
          projection ?? defaultProjection!
        ),
        aircraft.sideColor
      );
      aircraft.rtb = false;
      setCurrentGameStatusToContext("Click on the map to move the aircraft");
    }
  }

  function queueShipForMovement(shipId: string) {
    game.selectedUnitId = shipId;
    const ship = game.currentScenario.getShip(shipId);
    if (ship) {
      ship.selected = true;
      shipLayer.updateShipFeature(ship.id, ship.selected, ship.heading);
      shipRouteLayer.removeFeatureById(ship.id);
      addRouteMeasurementInteraction(
        fromLonLat(
          [ship.longitude, ship.latitude],
          projection ?? defaultProjection!
        ),
        ship.sideColor
      );
      setCurrentGameStatusToContext("Click on the map to move the ship");
    }
  }

  function handleAircraftRtb(aircraftId: string) {
    const aircraftReturningToBase = game.aircraftReturnToBase(aircraftId);
    if (aircraftReturningToBase) {
      if (aircraftReturningToBase.route.length === 0)
        aircraftRouteLayer.removeFeatureById(aircraftId);
      else aircraftRouteLayer.addRouteFeature(aircraftReturningToBase);
    }
  }

  function handleDuplicateAircraft(aircraftId: string) {
    const duplicatedAircraft = game.duplicateUnit(aircraftId, "aircraft");
    if (duplicatedAircraft) {
      aircraftLayer.addAircraftFeature(duplicatedAircraft);
      if (featureLabelVisible)
        featureLabelLayer.addFeatureLabelFeature(duplicatedAircraft);
    }
  }

  function handleCreatePatrolMission(
    missionName: string,
    assignedUnits: string[],
    referencePoints: string[]
  ) {
    if (referencePoints.length < 3) return;
    const assignedArea = [];
    for (const referencePointId of referencePoints) {
      const referencePoint =
        game.currentScenario.getReferencePoint(referencePointId);
      if (referencePoint) {
        assignedArea.push([referencePoint.latitude, referencePoint.longitude]);
      }
    }
    game.createPatrolMission(missionName, assignedUnits, assignedArea);
    toastContext?.addToast(
      `Created patrol mission [${missionName}] successfully!`,
      "success"
    );
  }

  function handleUpdatePatrolMission(
    missionId: string,
    missionName?: string,
    assignedUnits?: string[],
    referencePoints?: string[]
  ) {
    if (referencePoints && referencePoints.length < 3) return;
    const assignedArea = [];
    if (referencePoints) {
      for (const referencePointId of referencePoints) {
        const referencePoint =
          game.currentScenario.getReferencePoint(referencePointId);
        if (referencePoint) {
          assignedArea.push([
            referencePoint.latitude,
            referencePoint.longitude,
          ]);
        }
      }
    }
    game.updatePatrolMission(
      missionId,
      missionName,
      assignedUnits,
      assignedArea
    );
    toastContext?.addToast(
      `Updated patrol mission [${missionName}] successfully!`,
      "success"
    );
  }

  function handleCreateStrikeMission(
    missionName: string,
    assignedUnits: string[],
    targetIds: string[]
  ) {
    game.createStrikeMission(missionName, assignedUnits, targetIds);
    toastContext?.addToast(
      `Created strike mission [${missionName}] successfully!`,
      "success"
    );
  }

  function handleUpdateStrikeMission(
    missionId: string,
    missionName?: string,
    assignedUnits?: string[],
    targetIds?: string[]
  ) {
    game.updateStrikeMission(missionId, missionName, assignedUnits, targetIds);
    toastContext?.addToast(
      `Updated strike mission [${missionName}] successfully!`,
      "success"
    );
  }

  function handleDeleteMission(missionId: string) {
    game.deleteMission(missionId);
    toastContext?.addToast(`Deleted mission successfully!`, "success");
  }

  function queueUnitForTeleport(unitId: string) {
    game.selectedUnitId = unitId;
    teleportingUnit = true;
    setCurrentGameStatusToContext("Click on the map to teleport the unit");
  }

  function switchCurrentSide() {
    if (missionEditorActive) setMissionEditorActive(false);
    game.switchCurrentSide();
    setCurrentSideName(game.currentSideName);
    toastContext?.addToast(
      `Side changed: ${game.currentSideName.toUpperCase()}`
    );
  }

  function toggleScenarioTimeCompression() {
    game.switchScenarioTimeCompression();
    setCurrentScenarioTimeCompression(game.currentScenario.timeCompression);
  }

  function refreshAllLayers() {
    aircraftLayer.refresh(game.currentScenario.aircraft);
    facilityLayer.refresh(game.currentScenario.facilities);
    airbasesLayer.refresh(game.currentScenario.airbases);
    if (threatRangeVisible)
      threatRangeLayer.refresh([
        ...game.currentScenario.facilities,
        ...game.currentScenario.ships,
      ]);
    weaponLayer.refresh(game.currentScenario.weapons);
    shipLayer.refresh(game.currentScenario.ships);
    referencePointLayer.refresh(game.currentScenario.referencePoints);
    if (featureLabelVisible) refreshFeatureLabelLayer();
    if (routeVisible) refreshRouteLayer(game.currentScenario);
  }

  function refreshFeatureLabelLayer() {
    featureLabelLayer.refresh([
      ...game.currentScenario.aircraft,
      ...game.currentScenario.facilities,
      ...game.currentScenario.airbases,
      ...game.currentScenario.ships,
      ...game.currentScenario.referencePoints,
    ]);
  }

  function refreshThreatRangeLayer() {
    threatRangeLayer.refresh([
      ...game.currentScenario.facilities,
      ...game.currentScenario.ships,
    ]);
  }

  function refreshRouteLayer(observation: Scenario) {
    if (
      !observation.getAircraft(game.selectedUnitId) &&
      !observation.getShip(game.selectedUnitId)
    ) {
      cleanUpRouteDrawLineAndMeasurementTooltip();
      aircraftRouteLayer.refresh(observation.aircraft);
      shipRouteLayer.refresh(observation.ships);
      return;
    }
    aircraftRouteLayer.refresh(observation.aircraft);
    shipRouteLayer.refresh(observation.ships);
  }

  function updateMapView(center: number[], zoom: number) {
    theMap
      .getView()
      .setCenter(transform(center, "EPSG:4326", DEFAULT_OL_PROJECTION_CODE));
    theMap.getView().setZoom(zoom);
  }

  function updateAircraft(
    aircraftId: string,
    aircraftName: string,
    aircraftClassName: string,
    aircraftSpeed: number,
    aircraftWeaponQuantity: number,
    aircraftCurrentFuel: number,
    aircraftFuelRate: number
  ) {
    game.currentScenario.updateAircraft(
      aircraftId,
      aircraftName,
      aircraftClassName,
      aircraftSpeed,
      aircraftWeaponQuantity,
      aircraftCurrentFuel,
      aircraftFuelRate,
      game.getSampleWeapon(aircraftWeaponQuantity, 0.25)
    );
    featureLabelLayer.updateFeatureLabelFeature(aircraftId, aircraftName);
  }

  function updateFacility(
    facilityId: string,
    facilityName: string,
    facilityClassName: string,
    facilityRange: number,
    facilityWeaponQuantity: number
  ) {
    game.currentScenario.updateFacility(
      facilityId,
      facilityName,
      facilityClassName,
      facilityRange,
      facilityWeaponQuantity
    );
    threatRangeLayer.updateFacilityRangeFeature(facilityId, facilityRange);
    featureLabelLayer.updateFeatureLabelFeature(facilityId, facilityName);
  }

  function updateAirbase(airbaseId: string, airbaseName: string) {
    game.currentScenario.updateAirbase(airbaseId, airbaseName);
    featureLabelLayer.updateFeatureLabelFeature(airbaseId, airbaseName);
  }

  function updateShip(
    shipId: string,
    shipName: string,
    shipClassName: string,
    shipSpeed: number,
    shipWeaponQuantity: number,
    shipCurrentFuel: number,
    shipRange: number
  ) {
    game.currentScenario.updateShip(
      shipId,
      shipName,
      shipClassName,
      shipSpeed,
      shipCurrentFuel,
      shipWeaponQuantity,
      shipRange
    );
    threatRangeLayer.updateShipRangeFeature(shipId, shipRange);
    featureLabelLayer.updateFeatureLabelFeature(shipId, shipName);
  }

  function updateReferencePoint(
    referencePointId: string,
    referencePointName: string
  ) {
    game.currentScenario.updateReferencePoint(
      referencePointId,
      referencePointName
    );
    featureLabelLayer.updateFeatureLabelFeature(
      referencePointId,
      referencePointName
    );
  }

  function toggleFeatureLabelVisibility(on: boolean) {
    setFeatureLabelVisible(on);
    if (on) {
      refreshFeatureLabelLayer();
      featureLabelLayer.layer.setVisible(true);
    } else {
      featureLabelLayer.layer.setVisible(false);
    }
  }

  function toggleThreatRangeVisibility(on: boolean) {
    setThreatRangeVisible(on);
    if (on) {
      refreshThreatRangeLayer();
      threatRangeLayer.layer.setVisible(true);
    } else {
      threatRangeLayer.layer.setVisible(false);
    }
  }

  function toggleRouteVisibility(on: boolean) {
    setRouteVisible(on);
    if (on) {
      refreshRouteLayer(game.currentScenario);
      aircraftRouteLayer.layer.setVisible(true);
      shipRouteLayer.layer.setVisible(true);
    } else {
      aircraftRouteLayer.layer.setVisible(false);
      shipRouteLayer.layer.setVisible(false);
    }
  }

  function toggleReferencePointVisibility(on: boolean) {
    setReferencePointVisible(on);
    let referencePointsToRefresh: ReferencePoint[] = [];
    if (on) {
      referencePointLayer.layer.setVisible(true);
      referencePointsToRefresh = game.currentScenario.referencePoints;
    } else {
      referencePointLayer.layer.setVisible(false);
    }
    featureLabelLayer.refresh([
      ...game.currentScenario.aircraft,
      ...game.currentScenario.facilities,
      ...game.currentScenario.airbases,
      ...game.currentScenario.ships,
      ...referencePointsToRefresh,
    ]);
  }

  function toggleBaseMapLayer() {
    baseMapLayers.toggleLayer();
  }

  function createRouteMeasurementTooltip() {
    if (routeMeasurementTooltipElement) {
      routeMeasurementTooltipElement.parentNode?.removeChild(
        routeMeasurementTooltipElement
      );
    }
    routeMeasurementTooltipElement = document.createElement("div");
    routeMeasurementTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    routeMeasurementTooltip = new Overlay({
      element: routeMeasurementTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
      stopEvent: false,
      insertFirst: false,
    });
    theMap.addOverlay(routeMeasurementTooltip);
  }

  function cleanUpRouteDrawLineAndMeasurementTooltip() {
    if (routeMeasurementDrawLine)
      theMap.removeInteraction(routeMeasurementDrawLine);
    routeMeasurementDrawLine = null;
    theMap.getInteractions().forEach((interaction) => {
      if (interaction instanceof Draw) {
        theMap.removeInteraction(interaction);
      }
    });
    if (routeMeasurementTooltipElement) {
      routeMeasurementTooltipElement.parentNode?.removeChild(
        routeMeasurementTooltipElement
      );
    }
    if (routeMeasurementTooltip) theMap.removeOverlay(routeMeasurementTooltip);
    theMap.getOverlays().forEach((overlay) => {
      if (overlay.getElement()?.innerHTML.slice(-2) === "NM") {
        theMap.removeOverlay(overlay);
      }
    });
    routeMeasurementTooltipElement = null;
    routeMeasurementTooltip = null;
    if (routeMeasurementListener) unByKey(routeMeasurementListener);
  }

  const formatRouteLengthDisplay = function (line: LineString) {
    const length = getLength(line, {
      projection: projection ?? defaultProjection!,
    });
    const output = (length / NAUTICAL_MILES_TO_METERS).toFixed(2) + " " + "NM";
    return output;
  };

  function addRouteMeasurementInteraction(
    startCoordinates: number[],
    sideColor: string | undefined = undefined
  ) {
    routeMeasurementDrawLine = new Draw({
      source: new VectorSource(),
      type: "LineString",
      style: routeDrawLineStyle,
    });

    theMap.addInteraction(routeMeasurementDrawLine);

    createRouteMeasurementTooltip();

    routeMeasurementDrawLine.on("drawstart", function (event) {
      const defaultColor = game.currentScenario.getSideColor(
        game.currentSideName
      );
      const drawLineFeature = event.feature;
      drawLineFeature.setProperties({
        sideColor: sideColor ?? defaultColor,
      });
      routeMeasurementListener = drawLineFeature
        .getGeometry()
        ?.on("change", function (event) {
          const geom = event.target as LineString;
          const firstPoint = geom.getFirstCoordinate();
          const lastPoint = geom.getLastCoordinate();
          const tooltipCoord = [
            (firstPoint[0] + lastPoint[0]) / 2,
            (firstPoint[1] + lastPoint[1]) / 2,
          ];
          if (routeMeasurementTooltipElement) {
            routeMeasurementTooltipElement.innerHTML =
              formatRouteLengthDisplay(geom);
            routeMeasurementTooltipElement.style.color =
              sideColor ?? defaultColor;
            routeMeasurementTooltipElement.style.fontWeight = "bold";
          }
          routeMeasurementTooltip?.setPosition(tooltipCoord);
        });
    });

    routeMeasurementDrawLine.on("drawend", function (_event) {
      cleanUpRouteDrawLineAndMeasurementTooltip();
      const aircraft = game.currentScenario.getAircraft(game.selectedUnitId);
      if (aircraft) {
        aircraft.selected = !aircraft.selected;
        aircraftLayer.updateAircraftFeature(
          aircraft.id,
          aircraft.selected,
          aircraft.heading
        );
      }
      const ship = game.currentScenario.getShip(game.selectedUnitId);
      if (ship) {
        ship.selected = !ship.selected;
        shipLayer.updateShipFeature(ship.id, ship.selected, ship.heading);
      }
      game.commitRoute(game.selectedUnitId);
      game.selectedUnitId = "";
      setCurrentGameStatusToContext(
        game.scenarioPaused ? "Scenario paused" : "Scenario playing"
      );
      refreshRouteLayer(game.currentScenario);
    });

    routeMeasurementDrawLine.appendCoordinates([startCoordinates]);
  }

  function handleDrawerOpen() {
    setDrawerOpen(true);
  }

  function handleDrawerClose() {
    setDrawerOpen(false);
  }

  return (
    <>
      <Toolbar
        drawerOpen={drawerOpen}
        openDrawer={handleDrawerOpen}
        closeDrawer={handleDrawerClose}
        addAircraftOnClick={setAddingAircraft}
        addFacilityOnClick={setAddingFacility}
        addAirbaseOnClick={setAddingAirbase}
        addShipOnClick={setAddingShip}
        addReferencePointOnClick={setAddingReferencePoint}
        playOnClick={handlePlayGameClick}
        stepOnClick={handleStepGameClick}
        pauseOnClick={handlePauseGameClick}
        toggleScenarioTimeCompressionOnClick={toggleScenarioTimeCompression}
        switchCurrentSideOnClick={switchCurrentSide}
        refreshAllLayers={refreshAllLayers}
        updateMapView={updateMapView}
        loadFeatureEntitiesState={loadFeatureEntitiesState}
        updateScenarioTimeCompression={setCurrentScenarioTimeCompression}
        updateCurrentScenarioTimeToContext={() => {
          setCurrentScenarioTimeToContext(game.currentScenario.currentTime);
        }}
        updateCurrentSideName={setCurrentSideName}
        scenarioTimeCompression={currentScenarioTimeCompression}
        scenarioCurrentSideName={currentSideName}
        game={game}
        featureLabelVisibility={featureLabelVisible}
        toggleFeatureLabelVisibility={toggleFeatureLabelVisibility}
        threatRangeVisibility={threatRangeVisible}
        toggleThreatRangeVisibility={toggleThreatRangeVisibility}
        routeVisibility={routeVisible}
        toggleRouteVisibility={toggleRouteVisibility}
        toggleBaseMapLayer={toggleBaseMapLayer}
        keyboardShortcutsEnabled={keyboardShortcutsEnabled}
        toggleMissionCreator={() => {
          setKeyboardShortcutsEnabled(!keyboardShortcutsEnabled);
          setMissionCreatorActive(!missionCreatorActive);
        }}
        featureEntitiesPlotted={featureEntitiesState}
        toggleMissionEditor={() => {
          const currentSideId = game.currentScenario.getSide(
            game.currentSideName
          )?.id;
          if (
            !missionEditorActive &&
            game.currentScenario.missions.filter(
              (mission) => mission.sideId === currentSideId
            ).length === 0
          )
            return;
          setKeyboardShortcutsEnabled(!keyboardShortcutsEnabled);
          setMissionEditorActive(!missionEditorActive);
        }}
        mobileView={mobileView}
      />

      <LayerVisibilityPanelToggle
        featureLabelVisibility={featureLabelVisible}
        toggleFeatureLabelVisibility={toggleFeatureLabelVisibility}
        threatRangeVisibility={threatRangeVisible}
        toggleThreatRangeVisibility={toggleThreatRangeVisibility}
        routeVisibility={routeVisible}
        toggleRouteVisibility={toggleRouteVisibility}
        toggleBaseMapLayer={toggleBaseMapLayer}
        toggleReferencePointVisibility={toggleReferencePointVisibility}
        referencePointVisibility={referencePointVisible}
      />

      <BottomInfoDisplay mobileView={mobileView} />

      {missionCreatorActive && (
        <MissionCreatorCard
          aircraft={game.currentScenario.aircraft.filter(
            (aircraft) =>
              aircraft.sideName === game.currentSideName &&
              game.currentScenario.missions
                .map((mission) => mission.assignedUnitIds)
                .flat()
                .indexOf(aircraft.id) === -1
          )}
          targets={game.currentScenario.getAllTargetsFromEnemySides(
            game.currentSideName
          )}
          referencePoints={game.currentScenario.referencePoints.filter(
            (referencePoint) => referencePoint.sideName === game.currentSideName
          )}
          handleCloseOnMap={() => {
            setKeyboardShortcutsEnabled(true);
            setMissionCreatorActive(false);
          }}
          createPatrolMission={handleCreatePatrolMission}
          createStrikeMission={handleCreateStrikeMission}
        />
      )}

      {/** // TODO: Add selected mission param to 'toggleMissionEditor(...)'  - pass mission as prop here and prepopulate selected mission data instead */}
      {missionEditorActive && game.currentScenario.missions.length > 0 && (
        <MissionEditorCard
          missions={game.currentScenario.missions.filter(
            (mission) =>
              mission.sideId ===
              game.currentScenario.getSide(game.currentSideName)?.id
          )}
          aircraft={game.currentScenario.aircraft.filter(
            (aircraft) => aircraft.sideName === game.currentSideName
          )}
          referencePoints={game.currentScenario.referencePoints.filter(
            (referencePoint) => referencePoint.sideName === game.currentSideName
          )}
          targets={game.currentScenario.getAllTargetsFromEnemySides(
            game.currentSideName
          )}
          updatePatrolMission={handleUpdatePatrolMission}
          updateStrikeMission={handleUpdateStrikeMission}
          deleteMission={handleDeleteMission}
          handleCloseOnMap={() => {
            setKeyboardShortcutsEnabled(true);
            setMissionEditorActive(!missionEditorActive);
          }}
        />
      )}

      <Main open={drawerOpen}>
        <DrawerHeader />
        <div ref={mapRef} id="map"></div>
      </Main>

      {openAirbaseCard.open &&
        game.currentScenario.getAirbase(openAirbaseCard.airbaseId) && (
          <AirbaseCard
            airbase={
              game.currentScenario.getAirbase(openAirbaseCard.airbaseId)!
            }
            handleAddAircraft={addAircraftToAirbase}
            handleLaunchAircraft={launchAircraftFromAirbase}
            handleDeleteAirbase={removeAirbase}
            handleEditAirbase={updateAirbase}
            handleTeleportUnit={queueUnitForTeleport}
            anchorPositionTop={openAirbaseCard.top}
            anchorPositionLeft={openAirbaseCard.left}
            handleCloseOnMap={() => {
              setOpenAirbaseCard({
                open: false,
                top: 0,
                left: 0,
                airbaseId: "",
              });
              setKeyboardShortcutsEnabled(true);
            }}
          />
        )}
      {openFacilityCard.open &&
        game.currentScenario.getFacility(openFacilityCard.facilityId) && (
          <FacilityCard
            facility={
              game.currentScenario.getFacility(openFacilityCard.facilityId)!
            }
            handleTeleportUnit={queueUnitForTeleport}
            handleDeleteFacility={removeFacility}
            handleEditFacility={updateFacility}
            anchorPositionTop={openFacilityCard.top}
            anchorPositionLeft={openFacilityCard.left}
            handleCloseOnMap={() => {
              setOpenFacilityCard({
                open: false,
                top: 0,
                left: 0,
                facilityId: "",
              });
              setKeyboardShortcutsEnabled(true);
            }}
          />
        )}
      {openAircraftCard.open &&
        game.currentScenario.getAircraft(openAircraftCard.aircraftId) && (
          <AircraftCard
            aircraft={
              game.currentScenario.getAircraft(openAircraftCard.aircraftId)!
            }
            handleDeleteAircraft={removeAircraft}
            handleMoveAircraft={queueAircraftForMovement}
            handleAircraftAttack={handleAircraftAttack}
            handleEditAircraft={updateAircraft}
            handleAircraftRtb={handleAircraftRtb}
            handleDuplicateAircraft={handleDuplicateAircraft}
            handleTeleportUnit={queueUnitForTeleport}
            anchorPositionTop={openAircraftCard.top}
            anchorPositionLeft={openAircraftCard.left}
            handleCloseOnMap={() => {
              setOpenAircraftCard({
                open: false,
                top: 0,
                left: 0,
                aircraftId: "",
              });
              setKeyboardShortcutsEnabled(true);
            }}
          />
        )}
      {openShipCard.open &&
        game.currentScenario.getShip(openShipCard.shipId) && (
          <ShipCard
            ship={game.currentScenario.getShip(openShipCard.shipId)!}
            handleAddAircraft={addAircraftToShip}
            handleLaunchAircraft={launchAircraftFromShip}
            handleDeleteShip={removeShip}
            handleMoveShip={queueShipForMovement}
            handleShipAttack={handleShipAttack}
            handleTeleportUnit={queueUnitForTeleport}
            handleEditShip={updateShip}
            anchorPositionTop={openShipCard.top}
            anchorPositionLeft={openShipCard.left}
            handleCloseOnMap={() => {
              setOpenShipCard({
                open: false,
                top: 0,
                left: 0,
                shipId: "",
              });
              setKeyboardShortcutsEnabled(true);
            }}
          />
        )}
      {openReferencePointCard.open &&
        game.currentScenario.getReferencePoint(
          openReferencePointCard.referencePointId
        ) && (
          <ReferencePointCard
            referencePoint={
              game.currentScenario.getReferencePoint(
                openReferencePointCard.referencePointId
              )!
            }
            handleDeleteReferencePoint={removeReferencePoint}
            handleEditReferencePoint={updateReferencePoint}
            handleTeleportUnit={queueUnitForTeleport}
            anchorPositionTop={openReferencePointCard.top}
            anchorPositionLeft={openReferencePointCard.left}
            handleCloseOnMap={() => {
              setOpenReferencePointCard({
                open: false,
                top: 0,
                left: 0,
                referencePointId: "",
              });
              setKeyboardShortcutsEnabled(true);
            }}
          />
        )}
      {openMultipleFeatureSelector.open && (
        <MultipleFeatureSelector
          features={openMultipleFeatureSelector.features}
          handleSelectSingleFeature={handleSelectSingleFeature}
          anchorPositionTop={openMultipleFeatureSelector.top}
          anchorPositionLeft={openMultipleFeatureSelector.left}
          handleCloseOnMap={() => {
            setOpenMultipleFeatureSelector({
              open: false,
              top: 0,
              left: 0,
              features: [],
            });
          }}
        />
      )}
    </>
  );
}
