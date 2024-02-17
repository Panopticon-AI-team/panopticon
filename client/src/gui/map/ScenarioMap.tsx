import React, { useEffect, useRef, useState } from "react";

import { Pixel } from "ol/pixel";
import { Feature, MapBrowserEvent, Map as OlMap } from "ol";
import View from "ol/View";
import { Projection, toLonLat } from "ol/proj";
import Point from 'ol/geom/Point.js';

import "../styles/ScenarioMap.css";
import { AircraftLayer, AircraftRouteLayer, AirbasesLayer, FacilityLayer, RangeLayer, WeaponLayer } from "./FeatureLayers";
import BaseMapLayers from "./BaseMapLayers";
import Game from "../../game/Game";
import ToolBar from "../ToolBar";
import { DEFAULT_OL_PROJECTION_CODE } from "../../utils/constants";
import { delay } from "../../utils/utils";
import AirbaseCard from "./AirbaseCard";
import MultipleFeatureSelector from "./MultipleFeatureSelector";
import { Geometry } from "ol/geom";

interface ScenarioMapProps {
  zoom: number;
  center: number[];
  game: Game;
  projection: Projection | null;
}

interface IOpenMultipleFeatureSelector {
  open: boolean;
  top: number;
  left: number;
  features: Feature<Geometry>[];
}

export default function ScenarioMap({ zoom, center, game, projection }: Readonly<ScenarioMapProps>) {  
  const mapId = useRef(null);
  const defaultProjection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});
  const baseMapLayers = new BaseMapLayers(projection ?? defaultProjection);
  const [aircraftLayer, setAircraftLayer] = useState(new AircraftLayer(projection ?? defaultProjection));
  const [airbasesLayer, setAirbasesLayer] = useState(new AirbasesLayer(projection ?? defaultProjection));
  const [facilityLayer, setFacilityLayer] = useState(new FacilityLayer(projection ?? defaultProjection));
  const [rangeLayer, setRangeLayer] = useState(new RangeLayer(projection ?? defaultProjection));
  const [aircraftRouteLayer, setAircraftRouteLayer] = useState(new AircraftRouteLayer(projection ?? defaultProjection));
  const [weaponLayer, setWeaponLayer] = useState(new WeaponLayer(projection ?? defaultProjection));
  const [currentScenarioTime, setCurrentScenarioTime] = useState(game.currentScenario.currentTime);
  const [currentSideName, setCurrentSideName] = useState(game.currentSideName);
  const [openAirbaseCard, setOpenAirbaseCard] = useState({
    open: false,
    top: 0,
    left: 0,
    airbaseId: '',
  });
  const [openMultipleFeatureSelector, setOpenMultipleFeatureSelector] = useState<IOpenMultipleFeatureSelector>({
    open: false,
    top: 0,
    left: 0,
    features: [],
  });
  
  const map = new OlMap({
    layers: [...baseMapLayers.layers, aircraftLayer.layer, facilityLayer.layer, airbasesLayer.layer, rangeLayer.layer, aircraftRouteLayer.layer, weaponLayer.layer],
    view: new View({
      center: center,
      zoom: zoom,
      projection: projection ?? defaultProjection,
    }),
    controls: [],
  });
  const [theMap, setTheMap] = useState(map);

  useEffect(() => {
    theMap.setTarget(mapId.current!);
    refreshAllLayers();
    
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

  function getMapClickContext(event: MapBrowserEvent<any>): string {
    let context = 'default';
    const featuresAtPixel = getFeaturesAtPixel(theMap.getEventPixel(event.originalEvent));
    if (game.selectedUnitId && featuresAtPixel.length === 0){
      context = 'moveAircraft';
    } else if (featuresAtPixel.length === 1) {
      context = 'selectSingleFeature';
    } else if (featuresAtPixel.length > 1) {
      context = 'selectMultipleFeatures';
    } else if (game.addingAircraft || game.addingFacility || game.addingAirbase) {
      context = 'addUnit';
    }
    return context
  }

  function handleMapClick(event: MapBrowserEvent<any>) {
    const mapClickContext = getMapClickContext(event);
    const featuresAtPixel = getFeaturesAtPixel(theMap.getEventPixel(event.originalEvent));
    switch (mapClickContext) {
      case 'moveAircraft': {
        moveAircraft(game.selectedUnitId, event.coordinate);
        const aircraft = game.currentScenario.getAircraft(game.selectedUnitId);
        if (aircraft) aircraft.selected = !aircraft.selected;
        aircraftLayer.refresh(game.currentScenario.aircraft);
        game.selectedUnitId = '';
        break;
      }
      case 'selectSingleFeature':
        handleSelectSingleFeature(featuresAtPixel[0]);
        break;
      case 'selectMultipleFeatures':
        // pass, need to deconflict when there are more than 1 feature at the same pixel
        handleSelectMultipleFeatures(featuresAtPixel)
        break;
      case 'addUnit':
        handleAddUnit(event.coordinate);
        break;
      case 'default':
        break;
    }
  }

  function handleSelectSingleFeature(feature: Feature) {
    const currentSelectedFeatureId = feature.getProperties()?.id;
    const currentSelectedFeatureType = feature.getProperties()?.type;
    const currentSelectedFeatureSideName = feature.getProperties()?.sideName;
    
    if (currentSelectedFeatureSideName && currentSelectedFeatureSideName !== game.currentSideName) return;

    if (currentSelectedFeatureId) {
      if (currentSelectedFeatureType === 'aircraft') {
        game.selectedUnitId = game.selectedUnitId === '' ? currentSelectedFeatureId : '';
        const aircraft = game.currentScenario.getAircraft(currentSelectedFeatureId);
        if (aircraft) aircraft.selected = !aircraft.selected;
        aircraftLayer.refresh(game.currentScenario.aircraft);
      } else if (currentSelectedFeatureType === 'airbase' && game.currentScenario.getAirbase(currentSelectedFeatureId)) {
        const airbaseGeometry = feature.getGeometry() as Point
        const airbaseCoordinate = airbaseGeometry.getCoordinates()
        const airbasePixels = theMap.getPixelFromCoordinate(airbaseCoordinate)
        setOpenAirbaseCard({
          open: true,
          top: airbasePixels[1],
          left: airbasePixels[0],
          airbaseId: currentSelectedFeatureId,
        });
      }
    }
  }

  function handleSelectMultipleFeatures(features: Feature[]) {
    if (features.length < 2) return
    const singleFeatureGeometry = features[0].getGeometry() as Point
    const singleFeatureCoordinates = singleFeatureGeometry.getCoordinates()
    const singleFeaturePixels = theMap.getPixelFromCoordinate(singleFeatureCoordinates)
    setOpenMultipleFeatureSelector({
      open: true,
      top: singleFeaturePixels[1],
      left: singleFeaturePixels[0],
      features: features,
    })
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
    }
  }

  function getFeaturesAtPixel(pixel: Pixel): Feature[] {
    const selectedFeatures: Feature[] = [];
    const excludedFeatureTypes = ['rangeRing', 'aircraftRoute'];
    theMap.forEachFeatureAtPixel(pixel, function (feature) {
      if (!excludedFeatureTypes.includes(feature.getProperties()?.type)) selectedFeatures.push(feature as Feature);
    }, {hitTolerance: 5,})
    return selectedFeatures;
  }

  function setAddingAircraft() {
    game.addingAircraft = !game.addingAircraft;
    game.addingFacility = false;
    game.addingAirbase = false;
  }

  function setAddingFacility() {
    game.addingFacility = !game.addingFacility;
    game.addingAircraft = false;
    game.addingAirbase = false;
  }

  function setAddingAirbase() {
    game.addingAirbase = !game.addingAirbase;
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
      aircraftRouteLayer.refresh(observation.aircraft);
      weaponLayer.refresh(observation.weapons);

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
    aircraftLayer.refresh(game.currentScenario.aircraft)
  }

  function addAircraftToAirbase(airbaseId: string) {
    const aircraftName = 'Dummy';
    const className = 'F-16C';
    game.addAircraftToAirbase(aircraftName, className, airbaseId);
  }

  function addFacility(coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const facilityName = 'Threat';
    const className = 'SA-20';
    const latitude = coordinates[1];
    const longitude = coordinates[0];
    game.addFacility(facilityName, className, latitude, longitude);
    facilityLayer.refresh(game.currentScenario.facilities);
    rangeLayer.refresh(game.currentScenario.facilities);
  }

  function addAirbase(coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const airbaseName = 'Floridistan';
    const className = 'Airfield';
    const latitude = coordinates[1];
    const longitude = coordinates[0];
    game.addAirbase(airbaseName, className, latitude, longitude);
    airbasesLayer.refresh(game.currentScenario.airbases);
  }

  function removeAirbase(airbaseId: string) {
    game.removeAirbase(airbaseId);
    airbasesLayer.refresh(game.currentScenario.airbases);
  }

  function moveAircraft(aircraftId: string, coordinates: number[]) {
    coordinates = toLonLat(coordinates, theMap.getView().getProjection());
    const destinationLatitude = coordinates[1];
    const destinationLongitude = coordinates[0];
    game.moveAircraft(aircraftId, destinationLatitude, destinationLongitude);
    aircraftRouteLayer.refresh(game.currentScenario.aircraft);
  }

  function launchAircraft(airbaseId: string) {
    game.launchAircraftFromAirbase(airbaseId)
    aircraftLayer.refresh(game.currentScenario.aircraft)
  }

  function switchCurrentSide() {
    game.switchCurrentSide();
    setCurrentSideName(game.currentSideName);
  }

  function refreshAllLayers() {
    aircraftLayer.refresh(game.currentScenario.aircraft);
    facilityLayer.refresh(game.currentScenario.facilities);
    airbasesLayer.refresh(game.currentScenario.airbases);
    rangeLayer.refresh(game.currentScenario.facilities);
    aircraftRouteLayer.refresh(game.currentScenario.aircraft);
    weaponLayer.refresh(game.currentScenario.weapons);
  }

  return (
    <div>
      <ToolBar addAircraftOnClick={setAddingAircraft} addFacilityOnClick={setAddingFacility} addAirbaseOnClick={setAddingAirbase} playOnClick={setGamePlaying} pauseOnClick={setGamePaused} switchCurrentSideOnClick={switchCurrentSide} refreshAllLayers={refreshAllLayers} scenarioCurrentTime={currentScenarioTime} scenarioCurrentSideName={currentSideName} game={game}></ToolBar>
      <div ref={mapId} className='map'></div>
      {openAirbaseCard.open &&
        <AirbaseCard 
          airbase={game.currentScenario.getAirbase(openAirbaseCard.airbaseId)!} 
          handleAddAircraft={addAircraftToAirbase} 
          handleLaunchAircraft={launchAircraft}
          handleDeleteAirbase={removeAirbase} 
          anchorPositionTop={openAirbaseCard.top} 
          anchorPositionLeft={openAirbaseCard.left} 
          handleCloseOnMap={() => {setOpenAirbaseCard({open: false, top: 0, left: 0, airbaseId: ''})}}
        />
      }
      {openMultipleFeatureSelector.open &&
        <MultipleFeatureSelector 
          features={openMultipleFeatureSelector.features}
          handleSelectSingleFeature={handleSelectSingleFeature}
          anchorPositionTop={openMultipleFeatureSelector.top} 
          anchorPositionLeft={openMultipleFeatureSelector.left} 
          handleCloseOnMap={() => {setOpenMultipleFeatureSelector({open: false, top: 0, left: 0, features: []})}}
        />
      }
    </div>
  );
};
