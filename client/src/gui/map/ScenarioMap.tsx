import React, { useEffect, useRef, useState } from "react";

import { Pixel } from "ol/pixel";
import { Feature, MapBrowserEvent, Map as OlMap } from "ol";
import View from "ol/View";
import { Projection, toLonLat } from "ol/proj";

import "../styles/ScenarioMap.css";
import { AircraftLayer, BaseLayer, FacilityLayer, RangeLayer } from "./FeatureLayers";
import BaseMapLayers from "./MapLayers";
import Game from "../../game/Game";
import ToolBar from "../ToolBar";
import { DEFAULT_OL_PROJECTION_CODE } from "../../utils/constants";
import { delay } from "../../utils/utils";

interface ScenarioMapProps {
  zoom: number;
  center: number[];
  game: Game;
  projection: Projection | null;
}

export default function ScenarioMap({ zoom, center, game, projection }: Readonly<ScenarioMapProps>) {  
  const mapId = useRef(null);
  const defaultProjection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});
  const baseMapLayers = new BaseMapLayers(projection ?? defaultProjection);
  const [aircraftLayer, setAircraftLayer] = useState(new AircraftLayer(projection ?? defaultProjection));
  const [basesLayer, setBasesLayer] = useState(new BaseLayer(projection ?? defaultProjection));
  const [facilityLayer, setFacilityLayer] = useState(new FacilityLayer(projection ?? defaultProjection));
  const [rangeLayer, setRangeLayer] = useState(new RangeLayer(projection ?? defaultProjection));
  const [currentScenarioTime, setCurrentScenarioTime] = useState(game.currentScenario.currentTime);
  const [currentSideName, setCurrentSideName] = useState(game.currentSideName);
  
  const map = new OlMap({
    layers: [...baseMapLayers.layers, aircraftLayer.layer, facilityLayer.layer, rangeLayer.layer, basesLayer.layer],
    view: new View({
      center: center,
      zoom: zoom,
      projection: projection ?? defaultProjection,
    }),
  });
  const [theMap, setTheMap] = useState(map);

  useEffect(() => {
    theMap.setTarget(mapId.current!);
    
    return () => {
      if (!theMap) return;
      theMap.setTarget();
    }
  }, []);

  theMap.on('click', (event) => handleMapClick(event));

  // theMap.getViewport().addEventListener('contextmenu', function (evt) {
  //   evt.preventDefault();
  //   console.log(theMap.getEventPixel(evt));
  // });

  function handleMapClick(event: MapBrowserEvent<any>) {
    const featuresAtPixel = getFeaturesAtPixel(theMap.getEventPixel(event.originalEvent));
    if (game.selectedUnitId && featuresAtPixel.length === 0) {
      moveAircraft(game.selectedUnitId, event.coordinate);
      const aircraft = game.currentScenario.getAircraft(game.selectedUnitId);
      if (aircraft) aircraft.selected = !aircraft.selected;
      aircraftLayer.refresh(game.currentScenario.aircraft);
      game.selectedUnitId = '';
    } else if (featuresAtPixel.length === 1) {
      handleSelectSingleFeature(featuresAtPixel[0]);
    } else if (featuresAtPixel.length > 1) {
      // pass, need to deconflict when there are more than 1 feature at the same pixel
    } else {
      handleAddUnit(event.coordinate);
    }
  }

  function handleSelectSingleFeature(feature: Feature) {
    const currentSelectedFeatureId = feature.getProperties()?.id;
    const currentSelectedFeatureType = feature.getProperties()?.type;
    const currentSelectedFeatureSideName = feature.getProperties()?.sideName;
    
    if (currentSelectedFeatureSideName && currentSelectedFeatureSideName !== game.currentSideName) return;

    if (currentSelectedFeatureId && currentSelectedFeatureType === 'aircraft') {
      game.selectedUnitId = game.selectedUnitId === '' ? currentSelectedFeatureId : '';
      const aircraft = game.currentScenario.getAircraft(currentSelectedFeatureId);
      if (aircraft) aircraft.selected = !aircraft.selected;
      aircraftLayer.refresh(game.currentScenario.aircraft);
    }
  }

  function handleAddUnit(coordinates: number[]) {
    if (game.addingAircraft) {
      addAircraft(coordinates);
      aircraftLayer.refresh(game.currentScenario.aircraft);
      game.addingAircraft = false;
    } else if (game.addingFacility) {
      addFacility(coordinates);
      facilityLayer.refresh(game.currentScenario.facilities);
      rangeLayer.refresh(game.currentScenario.facilities);
      game.addingFacility = false;
    } else if (game.addingBase) {
      addBase(coordinates);
      basesLayer.refresh(game.currentScenario.bases);
      game.addingBase = false;
    }
  }

  function getFeaturesAtPixel(pixel: Pixel): Feature[] {
    const selectedFeatures: Feature[] = [];
    theMap.forEachFeatureAtPixel(pixel, function (feature) {
      selectedFeatures.push(feature as Feature);
    }, {hitTolerance: 5,})
    return selectedFeatures;
  }

  function setAddingAircraft() {
    game.addingAircraft = !game.addingAircraft;
    game.addingFacility = false;
    game.addingBase = false;
  }

  function setAddingFacility() {
    game.addingFacility = !game.addingFacility;
    game.addingAircraft = false;
    game.addingBase = false;
  }

  function setAddingBase() {
    game.addingBase = !game.addingBase;
    game.addingAircraft = false;
    game.addingFacility = false;
  }

  async function setGamePlaying() {
    game.scenarioPaused = false;
    let gameEnded = game.checkGameEnded();
    while (!game.scenarioPaused && !gameEnded) {
      const [observation, reward, terminated, truncated, info] = game.step();

      setCurrentScenarioTime(observation.currentTime);
      aircraftLayer.refresh(observation.aircraft);

      gameEnded = terminated || truncated;

      await delay(1000);
    }
  }

  function setGamePaused() {
    game.scenarioPaused = true;
  }

  function addAircraft(coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const aircraftName = 'Dummy';
    const className = 'F-16C';
    const latitude = coordinates[1];
    const longitude = coordinates[0];
    game.addAircraft(aircraftName, className, latitude, longitude);
  }

  function addFacility(coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const facilityName = 'Threat';
    const className = 'SA-20';
    const latitude = coordinates[1];
    const longitude = coordinates[0];
    game.addFacility(facilityName, className, latitude, longitude);
  }

  function addBase(coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const baseName = 'Floridistan';
    const className = 'Airfield';
    const latitude = coordinates[1];
    const longitude = coordinates[0];
    game.addBase(baseName, className, latitude, longitude);
  }

  function moveAircraft(aircraftId: string, coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const destinationLatitude = coordinates[1];
    const destinationLongitude = coordinates[0];
    game.moveAircraft(aircraftId, destinationLatitude, destinationLongitude);
  }

  function switchCurrentSide() {
    game.switchCurrentSide();
    setCurrentSideName(game.currentSideName);
  }

  return (
    <div>
      <ToolBar addAircraftOnClick={setAddingAircraft} addFacilityOnClick={setAddingFacility} addBaseOnClick={setAddingBase} playOnClick={setGamePlaying} pauseOnClick={setGamePaused} switchCurrentSideOnClick={switchCurrentSide} scenarioCurrentTime={currentScenarioTime} scenarioCurrentSideName={currentSideName}></ToolBar>
      <div ref={mapId} className='map'></div>
    </div>
  );
};
