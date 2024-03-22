import React, { useEffect, useRef, useState, useContext } from "react";

import { Pixel } from "ol/pixel";
import { Feature, MapBrowserEvent, Map as OlMap, Overlay } from "ol";
import View from "ol/View";
import {
  Projection,
  fromLonLat,
  toLonLat,
  transform,
  get as getProjection,
} from "ol/proj";
import Point from "ol/geom/Point.js";
import Draw from "ol/interaction/Draw.js";
import { getLength } from "ol/sphere.js";

import "../styles/ScenarioMap.css";
import {
  AircraftLayer,
  RouteLayer,
  AirbasesLayer,
  FacilityLayer,
  ThreatRangeLayer,
  WeaponLayer,
  FeatureLabelLayer,
  ShipLayer,
} from "./mapLayers/FeatureLayers";
import BaseMapLayers from "./mapLayers/BaseMapLayers";
import Game from "../../game/Game";
import ToolBar from "./ToolBar";
import {
  DEFAULT_OL_PROJECTION_CODE,
  GAME_SPEED_DELAY_MS,
  NAUTICAL_MILES_TO_METERS,
} from "../../utils/constants";
import { delay, randomInt } from "../../utils/utils";
import AirbaseCard from "./featureCards/AirbaseCard";
import MultipleFeatureSelector from "./MultipleFeatureSelector";
import { Geometry, LineString } from "ol/geom";
import FacilityCard from "./featureCards/FacilityCard";
import AircraftCard from "./featureCards/AircraftCard";
import Scenario from "../../game/Scenario";
import { SetCurrentScenarioTimeContext } from "./ScenarioTimeProvider";
import { EventsKey } from "ol/events";
import { unByKey } from "ol/Observable";
import VectorSource from "ol/source/Vector";
import { routeDrawLineStyle } from "./mapLayers/FeatureLayerStyles";
import ShipCard from "./featureCards/ShipCard";

interface ScenarioMapProps {
  zoom: number;
  center: number[];
  game: Game;
  projection?: Projection;
}

interface IOpenMultipleFeatureSelector {
  open: boolean;
  top: number;
  left: number;
  features: Feature<Geometry>[];
}

export default function ScenarioMap({
  zoom,
  center,
  game,
  projection,
}: Readonly<ScenarioMapProps>) {
  const mapId = useRef(null);
  const defaultProjection = getProjection(DEFAULT_OL_PROJECTION_CODE);
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
  const [featureLabelLayer, setFeatureLabelLayer] = useState(
    new FeatureLabelLayer(projection, 4)
  );
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
  const setCurrentScenarioTimeToContext = useContext(
    SetCurrentScenarioTimeContext
  );
  let routeMeasurementDrawLine: Draw | null = null;
  let routeMeasurementTooltipElement: HTMLDivElement | null = null;
  let routeMeasurementTooltip: Overlay | null = null;
  let routeMeasurementListener: EventsKey | undefined;
  let mousePosition: number[];

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
    theMap.setTarget(mapId.current!);
    refreshAllLayers();
    setCurrentScenarioTimeToContext(game.currentScenario.currentTime);

    return () => {
      if (!theMap) return;
      theMap.setTarget();
    };
  }, []);

  theMap.on("click", (event) => handleMapClick(event));

  theMap.on("pointermove", function (event) {
    mousePosition = event.coordinate;
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

  function getMapClickContext(event: MapBrowserEvent<any>): string {
    let context = "default";
    const featuresAtPixel = getFeaturesAtPixel(
      theMap.getEventPixel(event.originalEvent)
    );
    if (
      getSelectedFeatureType(game.selectedUnitId) == "aircraft" &&
      routeMeasurementDrawLine
    ) {
      context = "moveAircraft";
    } else if (
      getSelectedFeatureType(game.selectedUnitId) == "ship" &&
      routeMeasurementDrawLine
    ) {
      context = "moveShip";
    } else if (
      game.selectingTarget &&
      getSelectedFeatureType(game.currentAttackerId) == "aircraft" &&
      featuresAtPixel.length === 1
    ) {
      context = "aircraftSelectedAttackTarget";
    } else if (
      game.selectingTarget &&
      getSelectedFeatureType(game.currentAttackerId) == "ship" &&
      featuresAtPixel.length === 1
    ) {
      context = "shipSelectedAttackTarget";
    } else if (
      game.selectingTarget &&
      getSelectedFeatureType(game.currentAttackerId) == "aircraft" &&
      featuresAtPixel.length !== 1
    ) {
      context = "aircraftCancelledAttack";
    } else if (
      game.selectingTarget &&
      getSelectedFeatureType(game.currentAttackerId) == "ship" &&
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
      game.addingShip
    ) {
      context = "addUnit";
    }
    return context;
  }

  function handleMapClick(event: MapBrowserEvent<any>) {
    const mapClickContext = getMapClickContext(event);
    const featuresAtPixel = getFeaturesAtPixel(
      theMap.getEventPixel(event.originalEvent)
    );
    switch (mapClickContext) {
      case "moveAircraft": {
        cleanUpRouteDrawLineAndMeasurementTooltip();
        moveAircraft(game.selectedUnitId, event.coordinate);
        const aircraft = game.currentScenario.getAircraft(game.selectedUnitId);
        if (aircraft) {
          aircraft.selected = !aircraft.selected;
          aircraftLayer.updateAircraftFeature(
            aircraft.id,
            aircraft.selected,
            aircraft.heading
          );
        }
        game.selectedUnitId = "";
        break;
      }
      case "moveShip": {
        cleanUpRouteDrawLineAndMeasurementTooltip();
        moveShip(game.selectedUnitId, event.coordinate);
        const ship = game.currentScenario.getShip(game.selectedUnitId);
        if (ship) {
          ship.selected = !ship.selected;
          shipLayer.updateShipFeature(ship.id, ship.selected, ship.heading);
        }
        game.selectedUnitId = "";
        break;
      }
      case "aircraftSelectedAttackTarget": {
        const targetFeature = featuresAtPixel[0];
        const targetId = targetFeature.getProperties()?.id;
        game.handleAircraftAttack(game.currentAttackerId, targetId);
        resetAttack();
        break;
      }
      case "shipSelectedAttackTarget": {
        const targetFeature = featuresAtPixel[0];
        const targetId = targetFeature.getProperties()?.id;
        game.handleShipAttack(game.currentAttackerId, targetId);
        resetAttack();
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
      currentSelectedFeatureSideName &&
      currentSelectedFeatureSideName !== game.currentSideName
    )
      return;

    if (currentSelectedFeatureId) {
      if (
        currentSelectedFeatureType === "aircraft" &&
        game.currentScenario.getAircraft(currentSelectedFeatureId)
      ) {
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
      }
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
    if (game.addingAircraft) {
      addAircraft(coordinates);
      game.addingAircraft = false;
    } else if (game.addingFacility) {
      addFacility(coordinates);
      game.addingFacility = false;
    } else if (game.addingAirbase) {
      addAirbase(coordinates);
      game.addingAirbase = false;
    } else if (game.addingShip) {
      addShip(coordinates);
      game.addingShip = false;
    }
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
    const includedFeatureTypes = ["aircraft", "facility", "airbase", "ship"];
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

  function setAddingAircraft() {
    game.addingAircraft = !game.addingAircraft;
    game.addingFacility = false;
    game.addingAirbase = false;
    game.addingShip = false;
  }

  function setAddingFacility() {
    game.addingFacility = !game.addingFacility;
    game.addingAircraft = false;
    game.addingAirbase = false;
    game.addingShip = false;
  }

  function setAddingAirbase() {
    game.addingAirbase = !game.addingAirbase;
    game.addingAircraft = false;
    game.addingFacility = false;
    game.addingShip = false;
  }

  function setAddingShip() {
    game.addingShip = !game.addingShip;
    game.addingAircraft = false;
    game.addingFacility = false;
    game.addingAirbase = false;
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
    game.scenarioPaused = false;
    let gameEnded = game.checkGameEnded();
    while (!game.scenarioPaused && !gameEnded) {
      const [observation, reward, terminated, truncated, info] =
        stepGameAndDrawFrame();

      gameEnded = terminated || truncated;

      await delay(0);
    }
  }

  function stepGameForStepSize(
    stepSize: number
  ): [Scenario, number, boolean, boolean, any] {
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
  }

  function setGamePaused() {
    game.scenarioPaused = true;
  }

  function addAircraft(coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const aircraftName = "Raptor #" + randomInt(1, 5000).toString();
    const className = "F-22Z";
    const latitude = coordinates[1];
    const longitude = coordinates[0];
    const newAircraft = game.addAircraft(
      aircraftName,
      className,
      latitude,
      longitude
    );
    if (newAircraft) {
      aircraftLayer.addAircraftFeature(newAircraft);
      if (featureLabelVisible)
        featureLabelLayer.addFeatureLabelFeature(newAircraft);
    }
  }

  function addAircraftToAirbase(airbaseId: string) {
    const aircraftName = "Raptor #" + randomInt(1, 5000).toString();
    const className = "F-22Z";
    game.addAircraftToAirbase(aircraftName, className, airbaseId);
  }

  function addFacility(coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const facilityName = "SAM #" + randomInt(1, 5000).toString();
    const className = "SAM";
    const latitude = coordinates[1];
    const longitude = coordinates[0];
    const newFacility = game.addFacility(
      facilityName,
      className,
      latitude,
      longitude
    );
    if (newFacility) {
      facilityLayer.addFacilityFeature(newFacility);
      if (threatRangeVisible) threatRangeLayer.addRangeFeature(newFacility);
      if (featureLabelVisible)
        featureLabelLayer.addFeatureLabelFeature(newFacility);
    }
  }

  function addAirbase(coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const airbaseName = "Floridistan AFB #" + randomInt(1, 5000).toString();
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
      if (featureLabelVisible)
        featureLabelLayer.addFeatureLabelFeature(newAirbase);
    }
  }

  function removeAirbase(airbaseId: string) {
    game.removeAirbase(airbaseId);
    airbasesLayer.removeFeatureById(airbaseId);
    if (featureLabelVisible) featureLabelLayer.removeFeatureById(airbaseId);
  }

  function removeFacility(facilityId: string) {
    game.removeFacility(facilityId);
    facilityLayer.removeFeatureById(facilityId);
    threatRangeLayer.removeFeatureById(facilityId);
    if (featureLabelVisible) featureLabelLayer.removeFeatureById(facilityId);
  }

  function removeAircraft(aircraftId: string) {
    game.removeAircraft(aircraftId);
    aircraftLayer.removeFeatureById(aircraftId);
    aircraftRouteLayer.removeFeatureById(aircraftId);
    if (featureLabelVisible) featureLabelLayer.removeFeatureById(aircraftId);
  }

  function addShip(coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const shipName = "Fishing boat #" + randomInt(1, 5000).toString();
    const className = "Carrier";
    const latitude = coordinates[1];
    const longitude = coordinates[0];
    const newShip = game.addShip(shipName, className, latitude, longitude);
    if (newShip) {
      shipLayer.addShipFeature(newShip);
      if (threatRangeVisible) threatRangeLayer.addRangeFeature(newShip);
      if (featureLabelVisible)
        featureLabelLayer.addFeatureLabelFeature(newShip);
    }
  }

  function addAircraftToShip(shipId: string) {
    const aircraftName = "Raptor #" + randomInt(1, 5000).toString();
    const className = "F-22Z";
    game.addAircraftToShip(aircraftName, className, shipId);
  }

  function removeShip(shipId: string) {
    game.removeShip(shipId);
    shipLayer.removeFeatureById(shipId);
    shipRouteLayer.removeFeatureById(shipId);
    threatRangeLayer.removeFeatureById(shipId);
    if (featureLabelVisible) featureLabelLayer.removeFeatureById(shipId);
  }

  function moveShip(shipId: string, coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const destinationLatitude = coordinates[1];
    const destinationLongitude = coordinates[0];
    const shipQueuedForMovement = game.moveShip(
      shipId,
      destinationLatitude,
      destinationLongitude
    );
    if (shipQueuedForMovement)
      shipRouteLayer.addRouteFeature(shipQueuedForMovement);
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
    const aircraftQueuedForMovement = game.moveAircraft(
      aircraftId,
      destinationLatitude,
      destinationLongitude
    );
    if (aircraftQueuedForMovement)
      aircraftRouteLayer.addRouteFeature(aircraftQueuedForMovement);
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
  }

  function handleAircraftAttack(aircraftId: string) {
    game.selectingTarget = true;
    game.currentAttackerId = aircraftId;
  }

  function handleShipAttack(shipId: string) {
    game.selectingTarget = true;
    game.currentAttackerId = shipId;
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
      aircraftRouteLayer.removeFeatureById(aircraft.id);
      addRouteMeasurementInteraction(
        fromLonLat(
          [aircraft.longitude, aircraft.latitude],
          projection ?? defaultProjection!
        )
      );
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
        )
      );
    }
  }

  function switchCurrentSide() {
    game.switchCurrentSide();
    setCurrentSideName(game.currentSideName);
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
    // aircraftRouteLayer.refresh(game.currentScenario.aircraft);
    // shipRouteLayer.refresh(game.currentScenario.ships);
    weaponLayer.refresh(game.currentScenario.weapons);
    shipLayer.refresh(game.currentScenario.ships);
    if (featureLabelVisible) refreshFeatureLabelLayer();
    if (routeVisible) refreshRouteLayer(game.currentScenario);
  }

  function refreshFeatureLabelLayer() {
    featureLabelLayer.refresh([
      ...game.currentScenario.aircraft,
      ...game.currentScenario.facilities,
      ...game.currentScenario.airbases,
      ...game.currentScenario.ships,
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

    let routeDrawInteraction: Draw | undefined;
    theMap.getInteractions().forEach((interaction) => {
      if (interaction instanceof Draw) {
        routeDrawInteraction = interaction;
      }
    });
    if (
      routeDrawInteraction &&
      getSelectedFeatureType(game.selectedUnitId) == "aircraft"
    ) {
      aircraftRouteLayer.refresh(
        observation.aircraft.filter((aircraft) => {
          return aircraft.id !== game.selectedUnitId;
        })
      );
      shipRouteLayer.refresh(observation.ships);
      routeDrawInteraction.removeLastPoint();
      routeDrawInteraction.removeLastPoint();
      const aircraftQueuedForMovement = observation.aircraft.find(
        (aircraft) => aircraft.id === game.selectedUnitId
      );
      if (aircraftQueuedForMovement) {
        const aircraftNewCoordinates = fromLonLat(
          [
            aircraftQueuedForMovement.longitude,
            aircraftQueuedForMovement.latitude,
          ],
          projection ?? defaultProjection!
        );
        routeDrawInteraction.appendCoordinates([
          aircraftNewCoordinates,
          mousePosition,
        ]);
      }
    } else if (
      routeDrawInteraction &&
      getSelectedFeatureType(game.selectedUnitId) == "ship"
    ) {
      shipRouteLayer.refresh(
        observation.ships.filter((ship) => {
          return ship.id !== game.selectedUnitId;
        })
      );
      aircraftRouteLayer.refresh(observation.aircraft);
      routeDrawInteraction.removeLastPoint();
      routeDrawInteraction.removeLastPoint();
      const shipQueuedForMovement = observation.ships.find(
        (ship) => ship.id === game.selectedUnitId
      );
      if (shipQueuedForMovement) {
        const shipNewCoordinates = fromLonLat(
          [shipQueuedForMovement.longitude, shipQueuedForMovement.latitude],
          projection ?? defaultProjection!
        );
        routeDrawInteraction.appendCoordinates([
          shipNewCoordinates,
          mousePosition,
        ]);
      }
    } else {
      aircraftRouteLayer.refresh(observation.aircraft);
      shipRouteLayer.refresh(observation.ships);
    }
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
    aircraftCurrentFuel: number
  ) {
    game.currentScenario.updateAircraft(
      aircraftId,
      aircraftName,
      aircraftClassName,
      aircraftSpeed,
      aircraftWeaponQuantity,
      aircraftCurrentFuel
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

  function addRouteMeasurementInteraction(startCoordinates: number[]) {
    routeMeasurementDrawLine = new Draw({
      source: new VectorSource(),
      type: "LineString",
      style: routeDrawLineStyle,
    });

    theMap.addInteraction(routeMeasurementDrawLine);

    createRouteMeasurementTooltip();

    routeMeasurementDrawLine.on("drawstart", function (event) {
      const drawLineFeature = event.feature;
      drawLineFeature.setProperties({
        sideColor: game.currentScenario.getSideColor(game.currentSideName),
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
              game.currentScenario.getSideColor(game.currentSideName);
            routeMeasurementTooltipElement.style.fontWeight = "bold";
          }
          routeMeasurementTooltip?.setPosition(tooltipCoord);
        });
    });

    routeMeasurementDrawLine.appendCoordinates([startCoordinates]);
  }

  return (
    <div>
      <ToolBar
        addAircraftOnClick={setAddingAircraft}
        addFacilityOnClick={setAddingFacility}
        addAirbaseOnClick={setAddingAirbase}
        addShipOnClick={setAddingShip}
        playOnClick={handlePlayGameClick}
        stepOnClick={handleStepGameClick}
        pauseOnClick={handlePauseGameClick}
        toggleScenarioTimeCompressionOnClick={toggleScenarioTimeCompression}
        switchCurrentSideOnClick={switchCurrentSide}
        refreshAllLayers={refreshAllLayers}
        updateMapView={updateMapView}
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
      />
      <div ref={mapId} className="map"></div>
      {openAirbaseCard.open && (
        <AirbaseCard
          airbase={game.currentScenario.getAirbase(openAirbaseCard.airbaseId)!}
          handleAddAircraft={addAircraftToAirbase}
          handleLaunchAircraft={launchAircraftFromAirbase}
          handleDeleteAirbase={removeAirbase}
          handleEditAirbase={updateAirbase}
          anchorPositionTop={openAirbaseCard.top}
          anchorPositionLeft={openAirbaseCard.left}
          handleCloseOnMap={() => {
            setOpenAirbaseCard({ open: false, top: 0, left: 0, airbaseId: "" });
          }}
        />
      )}
      {openFacilityCard.open && (
        <FacilityCard
          facility={
            game.currentScenario.getFacility(openFacilityCard.facilityId)!
          }
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
          }}
        />
      )}
      {openAircraftCard.open && (
        <AircraftCard
          aircraft={
            game.currentScenario.getAircraft(openAircraftCard.aircraftId)!
          }
          handleDeleteAircraft={removeAircraft}
          handleMoveAircraft={queueAircraftForMovement}
          handleAircraftAttack={handleAircraftAttack}
          handleEditAircraft={updateAircraft}
          anchorPositionTop={openAircraftCard.top}
          anchorPositionLeft={openAircraftCard.left}
          handleCloseOnMap={() => {
            setOpenAircraftCard({
              open: false,
              top: 0,
              left: 0,
              aircraftId: "",
            });
          }}
        />
      )}
      {openShipCard.open && (
        <ShipCard
          ship={game.currentScenario.getShip(openShipCard.shipId)!}
          handleAddAircraft={addAircraftToShip}
          handleLaunchAircraft={launchAircraftFromShip}
          handleDeleteShip={removeShip}
          handleMoveShip={queueShipForMovement}
          handleShipAttack={handleShipAttack}
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
    </div>
  );
}
