import Feature, { FeatureLike } from 'ol/Feature.js';
import { Circle, Geometry, LineString } from "ol/geom";
import Point from 'ol/geom/Point.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import { Projection, fromLonLat } from 'ol/proj';
import { Style } from 'ol/style';

import Aircraft from '../../game/Aircraft';
import Facility from '../../game/Facility';
import Airbase from '../../game/Airbase';
import { DEFAULT_OL_PROJECTION_CODE, NAUTICAL_MILES_TO_METERS } from '../../utils/constants';
import { aircraftRouteStyle, aircraftStyle, airbasesStyle, facilityStyle, rangeStyle, weaponStyle } from './FeatureLayerStyles';
import Weapon from '../../game/Weapon';

class FeatureLayer {
  layerSource: VectorSource;
  layer: VectorLayer<VectorSource<Geometry>>;
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection, styleFunction: (feature: FeatureLike) => Style | Style[]) {
    this.layerSource = new VectorSource({
      features: []
    });
    this.layer = new VectorLayer({
      source: this.layerSource,
      style: styleFunction,
    });
    this.projection = projection;
  };
}

export class AircraftLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection) {
    super(projection, aircraftStyle);
  }

  refresh(aircraftList: Aircraft[]) {
    this.layerSource.clear();
    aircraftList.forEach((aircraft) => {
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

export class FacilityLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection) {
    super(projection, facilityStyle);
  }

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

export class AirbasesLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection) {
    super(projection, airbasesStyle);
  }

  refresh(airbases: Airbase[]) {
    this.layerSource.clear();
    airbases.forEach((airbase) => {
      const feature = new Feature({
        type: 'airbase',
        geometry: new Point(fromLonLat([airbase.longitude, airbase.latitude], this.projection)),
        id: airbase.id,
        name: airbase.name,
        sideName: airbase.sideName,
        sideColor: airbase.sideColor,
      });
      this.layerSource.addFeature(feature);
    });
  }
}

export class RangeLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection) {
    super(projection, rangeStyle);
  }

  refresh(entities: (Aircraft | Facility)[]) {
    this.layerSource.clear();
    entities.forEach((entity) => {
      const rangeRing = new Feature({
        type: 'rangeRing',
        geometry: new Circle(fromLonLat([entity.longitude, entity.latitude], this.projection), entity.range * NAUTICAL_MILES_TO_METERS),
        sideColor: entity.sideColor,
      });
      this.layerSource.addFeature(rangeRing);
    });
  }
}

export class AircraftRouteLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection) {
    super(projection, aircraftRouteStyle);
  }

  refresh(aircraftList: Aircraft[]) {
    this.layerSource.clear();
    aircraftList.forEach((aircraft) => {
      if (aircraft.route.length > 1) {
        const aircraftLocation = fromLonLat([aircraft.longitude, aircraft.latitude], this.projection);
        const destinationLatitude = aircraft.route[aircraft.route.length - 1][0];
        const destinationLongitude = aircraft.route[aircraft.route.length - 1][1];
        const destinationLocation = fromLonLat([destinationLongitude, destinationLatitude], this.projection);
        const aircraftRoute = new Feature({
          type: 'aircraftRoute',
          geometry: new LineString([aircraftLocation, destinationLocation]),
          sideColor: aircraft.sideColor,
        });
        this.layerSource.addFeature(aircraftRoute);
      }
    });
  }
}

export class WeaponLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection) {
    super(projection, weaponStyle);
  }

  refresh(weaponList: Weapon[]) {
    this.layerSource.clear();
    weaponList.forEach((weapon) => {
      const feature = new Feature({
        type: 'weapon',
        geometry: new Point(fromLonLat([weapon.longitude, weapon.latitude], this.projection)),
        id: weapon.id,
        name: weapon.name,
        heading: weapon.heading,
        sideName: weapon.sideName,
        sideColor: weapon.sideColor,
      });
      this.layerSource.addFeature(feature);
    });
  }
}
