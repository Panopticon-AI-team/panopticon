import { FeatureLike } from 'ol/Feature.js';
import {
  Style,
  Icon,
  Fill,
  Stroke,
} from 'ol/style.js';
import { asArray} from 'ol/color';

import { colorNameToHex, toRadians } from "../../utils/utils";

import FlightIconSvg from '../assets/flight_black_24dp.svg';
import RadarIconSvg from '../assets/radar_black_24dp.svg';
import FlightTakeoffSvg from '../assets/flight_takeoff_black_24dp.svg';

export const aircraftStyle = function(feature: FeatureLike) {
  return new Style({
    image: new Icon({
      opacity: feature.getProperties().selected ? 0.5 : 1,
      src: FlightIconSvg,
      rotation: toRadians(feature.getProperties().heading),
      color: feature.getProperties().sideColor,
    }),
  })
}

export const facilityStyle = function(feature: FeatureLike) {
  return new Style({
    image: new Icon({
      opacity: 1,
      src: RadarIconSvg,
      color: feature.getProperties().sideColor,
    }),
  })
}

export const basesStyle = function(feature: FeatureLike) {
  return new Style({
    image: new Icon({
      opacity: 1,
      src: FlightTakeoffSvg,
      color: feature.getProperties().sideColor,
    }),
  })
}

export const rangeStyle = function(feature: FeatureLike) {
  const colorHexCode = colorNameToHex(feature.getProperties().sideColor);
  let colorArray;
  if (colorHexCode) {
    colorArray = asArray(colorHexCode);
    colorArray = colorArray.slice();
    colorArray[3] = 0.1;  // change the alpha of the color
  }

  return new Style({
    stroke: new Stroke({
      color: feature.getProperties().sideColor,
      width: 3
    }),
    fill: new Fill({
      color: colorArray ?? 'rgba(255, 0, 0, 0.1)',
    })
  })
}