import Feature, { FeatureLike } from 'ol/Feature.js';
import { Circle, Geometry } from "ol/geom";
import Point from 'ol/geom/Point.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import {
  Style,
  Icon,
  Fill,
  Stroke,
} from 'ol/style.js';
import { Projection, fromLonLat } from 'ol/proj';

import Aircraft from '../../game/Aircraft';
import Facility from '../../game/Facility';
import Base from '../../game/Base';
import { toRadians } from "../../utils/utils";

import FlightIconSvg from '../assets/flight_black_24dp.svg';
import RadarIconSvg from '../assets/radar_black_24dp.svg';
import FlightTakeoffSvg from '../assets/flight_takeoff_black_24dp.svg';
import { DEFAULT_OL_PROJECTION_CODE, NAUTICAL_MILES_TO_METERS } from '../../utils/constants';

const aircraftStyle = function(feature: FeatureLike) {
  return new Style({
    image: new Icon({
      opacity: feature.getProperties().selected ? 1 : 0.5,
      src: FlightIconSvg,
      rotation: toRadians(feature.getProperties().heading),
      color: feature.getProperties().sideColor,
    }),
  })
}

const facilityStyle = function(feature: FeatureLike) {
  return new Style({
    image: new Icon({
      opacity: 1,
      src: RadarIconSvg,
      color: feature.getProperties().sideColor,
    }),
  })
}

const baseStyle = function(feature: FeatureLike) {
  return new Style({
    image: new Icon({
      opacity: 1,
      src: FlightTakeoffSvg,
      color: feature.getProperties().sideColor,
    }),
  })
}

export class AircraftLayer {
  layerSource: VectorSource;
  layer: VectorLayer<VectorSource<Geometry>>;
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection) {
    this.layerSource = new VectorSource({
      features: []
    });
    this.layer = new VectorLayer({
      source: this.layerSource,
      style: function(feature) {
        return aircraftStyle(feature);
      },
    });
    this.projection = projection;
  };

  refresh(aircraft: Aircraft[]) {
    this.layerSource.clear();
    aircraft.forEach((aircraft) => {
      const feature = new Feature({
        type: 'aircraft',
        geometry: new Point(fromLonLat([aircraft.longitude, aircraft.latitude], this.projection)),
        id: aircraft.id,
        name: aircraft.name,
        heading: aircraft.heading,
        selected: aircraft.selected,
        sideName: aircraft.sideName,
        sideColor: aircraft.sideColor,
      });
      this.layerSource.addFeature(feature);
    });
  }
}

export class FacilityLayer {
  layerSource: VectorSource;
  layer: VectorLayer<VectorSource<Geometry>>;
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection) {
    this.layerSource = new VectorSource({
      features: []
    });
    this.layer = new VectorLayer({
      source: this.layerSource,
      style: (feature) => facilityStyle(feature),
    });
    if (projection) this.projection = projection;
  };

  refresh(facilities: Facility[]) {
    this.layerSource.clear();
    facilities.forEach((facility) => {
      const feature = new Feature({
        type: 'facility',
        geometry: new Point(fromLonLat([facility.longitude, facility.latitude], this.projection)),
        id: facility.id,
        name: facility.name,
        sideName: facility.sideName,
        sideColor: facility.sideColor,
      });
      this.layerSource.addFeature(feature);
    });
  }
}

export class RangeLayer {
  layerSource: VectorSource;
  layer: VectorLayer<VectorSource<Geometry>>;
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection) {
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
    if (projection) this.projection = projection;
  };

  refresh(entities: (Aircraft | Facility)[]) {
    this.layerSource.clear();
    entities.forEach((entity) => {
      const coordinatesLatLon = fromLonLat([entity.longitude, entity.latitude], this.projection);
      const rangeRing = new Feature(new Circle(coordinatesLatLon, entity.range * NAUTICAL_MILES_TO_METERS));
      this.layerSource.addFeature(rangeRing);
    });
  }
}

export class BaseLayer {
  layerSource: VectorSource;
  layer: VectorLayer<VectorSource<Geometry>>;
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection) {
    this.layerSource = new VectorSource({
      features: []
    });
    this.layer = new VectorLayer({
      source: this.layerSource,
      style: (feature) => baseStyle(feature),
    });
    if (projection) this.projection = projection;
  };

  refresh(bases: Base[]) {
    this.layerSource.clear();
    bases.forEach((base) => {
      const feature = new Feature({
        type: 'base',
        geometry: new Point(fromLonLat([base.longitude, base.latitude], this.projection)),
        id: base.id,
        name: base.name,
        sideName: base.sideName,
        sideColor: base.sideColor,
      });
      this.layerSource.addFeature(feature);
    });
  }
}