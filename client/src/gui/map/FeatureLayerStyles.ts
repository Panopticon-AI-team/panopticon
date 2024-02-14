import { FeatureLike } from 'ol/Feature.js';
import {
  Style,
  Icon,
  Fill,
  Stroke,
} from 'ol/style.js';

import { colorNameToColorArray, toRadians } from "../../utils/utils";

import FlightIconSvg from '../assets/flight_black_24dp.svg';
import RadarIconSvg from '../assets/radar_black_24dp.svg';
import FlightTakeoffSvg from '../assets/flight_takeoff_black_24dp.svg';
import ChevronRightSvg from '../assets/chevron_right_black_24dp.svg';
import { LineString, Point } from 'ol/geom';

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
  const colorArray = colorNameToColorArray(feature.getProperties().sideColor, 0.1);
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

export const aircraftRouteStyle = function(feature: FeatureLike) {
  const colorArray = colorNameToColorArray(feature.getProperties().sideColor, 0.5);
    const styles = [
      new Style({
        stroke: new Stroke({
          color: colorArray ?? 'rgba(0, 0, 0, 0.5)',
          width: 1.5,
        }),
      }),
    ];

    const lineString = feature.getGeometry() as LineString
    lineString.forEachSegment(function (start, end) {
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];
      const rotation = Math.atan2(dy, dx);
      styles.push(
        new Style({
          geometry: new Point(end),
          image: new Icon({
            src: ChevronRightSvg,
            anchor: [0.75, 0.5],
            rotateWithView: true,
            rotation: -rotation,
            color: feature.getProperties().sideColor,
          }),
        })
      );
    })
  
    return styles;
}
