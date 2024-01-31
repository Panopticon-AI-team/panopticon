import React, { useEffect, useRef, useState } from "react";

import { Pixel } from "ol/pixel";
import { Feature, Map as OlMap } from "ol";
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
  const mapId = useRef(null);
  const baseMapLayers = new BaseMapLayers();
  const aircraftLayer = new AircraftLayer();
  const facilityLayer = new FacilityLayer();
  const rangeLayer = new RangeLayer();
  const basesLayer = new BaseLayer();
  let prevSelectedFeatureId = '';
  let addingAircraft = false;
  let addingFacility = false;
  let addingBase = false;
  let gamePlaying = false;
  let gamePaused = true;

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

  theMap.on('click', function(event) {
    const currentSelectedFeatures = getSelectedFeatures(theMap.getEventPixel(event.originalEvent));
    if (prevSelectedFeatureId) {
      moveAircraft(prevSelectedFeatureId, event.coordinate);
      aircraftLayer.refresh(game.currentScenario.aircraft);
      prevSelectedFeatureId = '';
    } else if (currentSelectedFeatures.length === 1) {
      const currentSelectedFeatureId = currentSelectedFeatures[0].getProperties()?.id;
      const currentSelectedFeatureType = currentSelectedFeatures[0].getProperties()?.type;
      if (currentSelectedFeatureId && currentSelectedFeatureType === 'aircraft') prevSelectedFeatureId = currentSelectedFeatureId;
    } else if (currentSelectedFeatures.length > 1) {
      // pass
    } else {
      if (addingAircraft) {
        addAircraft(event.coordinate);
        aircraftLayer.refresh(game.currentScenario.aircraft);
        addingAircraft = false;
      } else if (addingFacility) {
        addFacility(event.coordinate);
        facilityLayer.refresh(game.currentScenario.facilities);
        rangeLayer.refresh(game.currentScenario.facilities);
        addingFacility = false;
      } else if (addingBase) {
        addBase(event.coordinate);
        basesLayer.refresh(game.currentScenario.bases);
        addingBase = false;
      }
    }
  });

  // theMap.getViewport().addEventListener('contextmenu', function (evt) {
  //   evt.preventDefault();
  //   console.log(theMap.getEventPixel(evt));
  // });

  function getSelectedFeatures(pixel: Pixel): Feature[] {
    const selectedFeatures: Feature[] = [];
    theMap.forEachFeatureAtPixel(pixel, function (feature) {
      selectedFeatures.push(feature as Feature);
    })
    return selectedFeatures;
  }

  function setAddingAircraft() {
    addingAircraft = !addingAircraft;
  }

  function setAddingFacility() {
    addingFacility = !addingFacility;
  }

  function setAddingBase() {
    addingBase = !addingBase;
  }

  function setGamePlaying() {
    gamePlaying = !gamePlaying;
  }

  function setGamePaused() {
    gamePaused = !gamePaused;
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
      <ToolBar addAircraftOnClick={setAddingAircraft} addFacilityOnClick={setAddingFacility} addBaseOnClick={setAddingBase} playOnClick={setGamePlaying} pauseOnClick={setGamePaused}></ToolBar>
      <div ref={mapId} className='map'></div>
    </div>
  );
};
