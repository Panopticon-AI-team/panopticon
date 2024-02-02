import React, { useEffect, useRef, useState } from "react";

import { Pixel } from "ol/pixel";
import { Feature, MapBrowserEvent, Map as OlMap } from "ol";
import View from "ol/View";
import { fromLonLat, toLonLat } from "ol/proj";

import "../styles/ScenarioMap.css";
import { AircraftLayer, BaseLayer, FacilityLayer, RangeLayer } from "./FeatureLayers";
import BaseMapLayers from "./MapLayers";
import Game from "../../game/Game";
import ToolBar from "../ToolBar";

interface ScenarioMapProps {
  zoom: number;
  center: number[];
  game: Game;
}

export default function ScenarioMap({ zoom, center, game }: Readonly<ScenarioMapProps>) {
  const [currentScenarioTime, setCurrentScenarioTime] = useState(game.currentScenario.currentTime);
  const [prevSelectedFeatureId, setPrevSelectedFeatureId] = useState('');

  const mapId = useRef(null);
  const baseMapLayers = new BaseMapLayers();
  const aircraftLayer = new AircraftLayer();
  const facilityLayer = new FacilityLayer();
  const rangeLayer = new RangeLayer();
  const basesLayer = new BaseLayer();

  const theMap = new OlMap({
    layers: [...baseMapLayers.layers, aircraftLayer.layer, facilityLayer.layer, rangeLayer.layer, basesLayer.layer],
    view: new View({
      center: center,
      zoom: zoom,
    }),
  });

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
    const currentSelectedFeatures = getSelectedFeatures(theMap.getEventPixel(event.originalEvent));
    if (prevSelectedFeatureId) {
      moveAircraft(prevSelectedFeatureId, event.coordinate);
      aircraftLayer.refresh(game.currentScenario.aircraft);
      setPrevSelectedFeatureId('');
    } else if (currentSelectedFeatures.length === 1) {
      const currentSelectedFeatureId = currentSelectedFeatures[0].getProperties()?.id;
      const currentSelectedFeatureType = currentSelectedFeatures[0].getProperties()?.type;
      if (currentSelectedFeatureId && currentSelectedFeatureType === 'aircraft') setPrevSelectedFeatureId(currentSelectedFeatureId);
    } else if (currentSelectedFeatures.length > 1) {
      // pass
    } else {
      handleAddUnit(event.coordinate);
    }
    event.preventDefault(); // avoid bubbling 
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

  function getSelectedFeatures(pixel: Pixel): Feature[] {
    const selectedFeatures: Feature[] = [];
    theMap.forEachFeatureAtPixel(pixel, function (feature) {
      selectedFeatures.push(feature as Feature);
    })
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

  function setGamePlaying() {
    game.scenarioPaused = false;
    game.startScenario(() => {setCurrentScenarioTime(game.currentScenario.currentTime);});
  }

  function setGamePaused() {
    game.pauseScenario();
  }

  function addAircraft(coordinates: number[]) {
    coordinates = toLonLat(coordinates);
    const aircraftName = 'Dummy';
    const className = 'F-16C';
    const latitude = coordinates[0];
    const longitude = coordinates[1];
    game.addAircraft(aircraftName, className, latitude, longitude);
  }

  function addFacility(coordinates: number[]) {
    coordinates = toLonLat(coordinates);
    const facilityName = 'Threat';
    const className = 'SA-20';
    const latitude = coordinates[0];
    const longitude = coordinates[1];
    game.addFacility(facilityName, className, latitude, longitude);
  }

  function addBase(coordinates: number[]) {
    coordinates = toLonLat(coordinates);
    const baseName = 'Floridistan';
    const className = 'Airfield';
    const latitude = coordinates[0];
    const longitude = coordinates[1];
    game.addBase(baseName, className, latitude, longitude);
  }

  function moveAircraft(aircraftId: string, coordinates: number[]) {
    coordinates = toLonLat(coordinates);
    game.moveAircraft(aircraftId, coordinates[0], coordinates[1]);
    // const aircraft = game.currentScenario.getAircraft(aircraftId);
    // if (aircraft) {
    //   aircraft.route.forEach((waypoint) => {
    //     addAircraft(fromLonLat(waypoint));
    //   })
    // }
  }

  return (
    <div>
      <ToolBar addAircraftOnClick={setAddingAircraft} addFacilityOnClick={setAddingFacility} addBaseOnClick={setAddingBase} playOnClick={setGamePlaying} pauseOnClick={setGamePaused} scenarioCurrentTime={currentScenarioTime}></ToolBar>
      <div ref={mapId} className='map'></div>
    </div>
  );
};
