import { FeatureLike } from "ol/Feature.js";
import { Style, Icon, Fill, Stroke, Text } from "ol/style.js";

import { colorNameToColorArray, toRadians } from "@/utils/mapFunctions";

import FlightIconSvg from "@/gui/assets/flight_black_24dp.svg";
import RadarIconSvg from "@/gui/assets/radar_black_24dp.svg";
import FlightTakeoffSvg from "@/gui/assets/flight_takeoff_black_24dp.svg";
import ChevronRightSvg from "@/gui/assets/chevron_right_black_24dp.svg";
import WeaponSvg from "@/gui/assets/keyboard_double_arrow_up_black_24dp.svg";
import DirectionsBoatSvg from "@/gui/assets/directions_boat_black_24dp.svg";
import PinDropSvg from "@/gui/assets/pin_drop_24dp_E8EAED.svg";
import { LineString, Point } from "ol/geom";

export const aircraftStyle = function (feature: FeatureLike) {
  return new Style({
    image: new Icon({
      opacity: feature.getProperties().selected ? 0.5 : 1,
      src: FlightIconSvg,
      rotation: toRadians(feature.getProperties().heading),
      color: feature.getProperties().sideColor,
    }),
  });
};

export const facilityStyle = function (feature: FeatureLike) {
  return new Style({
    image: new Icon({
      opacity: 1,
      src: RadarIconSvg,
      color: feature.getProperties().sideColor,
    }),
  });
};

export const airbasesStyle = function (feature: FeatureLike) {
  return new Style({
    image: new Icon({
      opacity: 1,
      src: FlightTakeoffSvg,
      color: feature.getProperties().sideColor,
    }),
  });
};

export const threatRangeStyle = function (feature: FeatureLike) {
  const colorArray = colorNameToColorArray(
    feature.getProperties().sideColor,
    0.1
  );
  return new Style({
    stroke: new Stroke({
      color: feature.getProperties().sideColor,
      width: 3,
    }),
    fill: new Fill({
      color: colorArray ?? "rgba(255, 0, 0, 0.1)",
    }),
  });
};

export const routeStyle = function (feature: FeatureLike) {
  const colorArray = colorNameToColorArray(
    feature.getProperties().sideColor,
    0.5
  );
  const styles = [
    new Style({
      stroke: new Stroke({
        color: colorArray ?? "rgba(0, 0, 0, 0.5)",
        width: 1.5,
      }),
    }),
  ];

  const lineString = feature.getGeometry() as LineString;
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
  });

  return styles;
};

export const routeDrawLineStyle = function (feature: FeatureLike) {
  if (feature.getGeometry()?.getType() !== "LineString") return [];

  const colorArray = colorNameToColorArray(
    feature.getProperties().sideColor ?? "black",
    0.5
  );
  const styles = [
    new Style({
      stroke: new Stroke({
        color: colorArray ?? "rgba(0, 0, 0, 0.5)",
        width: 1.5,
        lineDash: [10, 10],
      }),
    }),
  ];

  return styles;
};

export const weaponStyle = function (feature: FeatureLike) {
  return new Style({
    image: new Icon({
      src: WeaponSvg,
      rotation: toRadians(feature.getProperties().heading),
      color: feature.getProperties().sideColor,
    }),
  });
};

export const featureLabelStyle = function (feature: FeatureLike) {
  return new Style({
    text: new Text({
      font: "18px Calibri",
      text: feature.getProperties().name,
      placement: "point",
      fill: new Fill({
        color: feature.getProperties().sideColor,
      }),
      stroke: new Stroke({
        color: "#000",
        width: 1,
      }),
      offsetY: 20,
    }),
  });
};

export const shipStyle = function (feature: FeatureLike) {
  return new Style({
    image: new Icon({
      opacity: feature.getProperties().selected ? 0.5 : 1,
      src: DirectionsBoatSvg,
      // rotation: toRadians(feature.getProperties().heading),
      color: feature.getProperties().sideColor,
    }),
  });
};

export const referencePointStyle = function (feature: FeatureLike) {
  return new Style({
    image: new Icon({
      src: PinDropSvg,
      color: feature.getProperties().sideColor,
    }),
  });
};
