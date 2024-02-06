import Feature, { FeatureLike } from 'ol/Feature.js';
import { Circle, Geometry, Polygon } from "ol/geom";
import Point from 'ol/geom/Point.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import {
  Style,
  Icon,
  Fill,
  Stroke,
} from 'ol/style.js';
import { fromLonLat } from 'ol/proj';

import Aircraft from '../../game/Aircraft';
import Facility from '../../game/Facility';
import Base from '../../game/Base';
import { toRadians } from "../../utils/utils";

import FlightIconSvg from '../assets/flight_black_24dp.svg';
import RadarIconSvg from '../assets/radar_black_24dp.svg';
import FlightTakeoffSvg from '../assets/flight_takeoff_black_24dp.svg';

const aircraftStyle = function(feature: FeatureLike) {
  return new Style({
    image: new Icon({
      opacity: feature.getProperties().selected ? 1 : 1,
      src: FlightIconSvg,
      rotation: toRadians(feature.getProperties().heading),
    }),
  })
}

const facilityStyle = function(feature: FeatureLike) {
  return new Style({
    image: new Icon({
      opacity: 1,
      src: RadarIconSvg,
    }),
  })
}

const baseStyle = function(feature: FeatureLike) {
  return new Style({
    image: new Icon({
      opacity: 1,
      src: FlightTakeoffSvg,
    }),
  })
}

export class AircraftLayer {
  layerSource: VectorSource;
  layer: VectorLayer<VectorSource<Geometry>>;

  constructor() {
    this.layerSource = new VectorSource({
      features: []
    });
    this.layer = new VectorLayer({
      source: this.layerSource,
      style: (feature) => aircraftStyle(feature),
    });
  };

  refresh(aircraft: Aircraft[]) {
    this.layerSource.clear();
    aircraft.forEach((aircraft) => {
      const feature = new Feature({
        type: 'aircraft',
        geometry: new Point(fromLonLat([aircraft.longitude, aircraft.latitude])),
        id: aircraft.id,
        name: aircraft.name,
        heading: aircraft.heading,
      });
      this.layerSource.addFeature(feature);
    });
  }
}

export class FacilityLayer {
  layerSource: VectorSource;
  layer: VectorLayer<VectorSource<Geometry>>;

  constructor() {
    this.layerSource = new VectorSource({
      features: []
    });
    this.layer = new VectorLayer({
      source: this.layerSource,
      style: (feature) => facilityStyle(feature),
    });
  };

  refresh(facilities: Facility[]) {
    this.layerSource.clear();
    facilities.forEach((facility) => {
      const feature = new Feature({
        type: 'facility',
        geometry: new Point(fromLonLat([facility.latitude, facility.longitude])),
        id: facility.id,
        name: facility.name,
      });
      this.layerSource.addFeature(feature);
    });
  }
}

export class RangeLayer {
  layerSource: VectorSource;
  layer: VectorLayer<VectorSource<Geometry>>;

  constructor() {
    this.layerSource = new VectorSource({
      features: []
    });
    this.layer = new VectorLayer({
      source: this.layerSource,
      style: [
        new Style({
          stroke: new Stroke({
            color: 'red',
            width: 3
          }),
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.1)'
          })
        })
      ]
    });
  };

  refresh(entities: (Aircraft | Facility)[]) {
    this.layerSource.clear();
    entities.forEach((entity) => {
      const coordinatesLatLon = fromLonLat([entity.latitude, entity.longitude]);
      const rangeRing = new Feature(new Circle(coordinatesLatLon, entity.range * 1852));
      this.layerSource.addFeature(rangeRing);
    });
  }
}

export class BaseLayer {
  layerSource: VectorSource;
  layer: VectorLayer<VectorSource<Geometry>>;

  constructor() {
    this.layerSource = new VectorSource({
      features: []
    });
    this.layer = new VectorLayer({
      source: this.layerSource,
      style: (feature) => baseStyle(feature),
    });
  };

  refresh(bases: Base[]) {
    this.layerSource.clear();
    bases.forEach((base) => {
      const feature = new Feature({
        type: 'base',
        geometry: new Point(fromLonLat([base.latitude, base.longitude])),
        id: base.id,
        name: base.name,
      });
      this.layerSource.addFeature(feature);
    });
  }
}