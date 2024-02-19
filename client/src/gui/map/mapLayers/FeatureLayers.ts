import Feature, { FeatureLike } from 'ol/Feature.js';
import { Circle, Geometry, LineString } from "ol/geom";
import Point from 'ol/geom/Point.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import { Projection, fromLonLat } from 'ol/proj';
import { Style } from 'ol/style';

import Aircraft from '../../../game/units/Aircraft';
import Facility from '../../../game/units/Facility';
import Airbase from '../../../game/units/Airbase';
import { DEFAULT_OL_PROJECTION_CODE, NAUTICAL_MILES_TO_METERS } from '../../../utils/constants';
import { aircraftRouteStyle, aircraftStyle, airbasesStyle, facilityStyle, rangeStyle, weaponStyle, featureLabelStyle } from './FeatureLayerStyles';
import Weapon from '../../../game/units/Weapon';

type GameEntity = Aircraft | Facility | Airbase

class FeatureLayer {
  layerSource: VectorSource;
  layer: VectorLayer<VectorSource<Geometry>>;
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});
  featureCount: number = 0

  constructor(projection: Projection, styleFunction: (feature: FeatureLike) => Style | Style[], zIndex?: number) {
    this.layerSource = new VectorSource({
      features: []
    });
    this.layer = new VectorLayer({
      source: this.layerSource,
      style: styleFunction,
    });
    this.projection = projection;
    this.layer.setZIndex(zIndex ?? 0);
  };

  findFeatureByKey(key: string, value: any) {
    return this.layerSource.getFeatures().find((feature) => feature.getProperties()[key] === value);
  }

  removeFeatureById(id: string) {
    const feature = this.findFeatureByKey('id', id);
    if (feature) {
      this.layerSource.removeFeature(feature);
      this.featureCount -= 1
    }
  }
}

export class AircraftLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection, zIndex?: number) {
    super(projection, aircraftStyle, zIndex);
  }

  createAircraftFeature(aircraft: Aircraft) {
    return new Feature({
      type: 'aircraft',
      geometry: new Point(fromLonLat([aircraft.longitude, aircraft.latitude], this.projection)),
      id: aircraft.id,
      name: aircraft.name,
      heading: aircraft.heading,
      selected: aircraft.selected,
      sideName: aircraft.sideName,
      sideColor: aircraft.sideColor,
    });
  }

  refresh(aircraftList: Aircraft[]) {
    this.layerSource.clear(true);
    aircraftList.forEach((aircraft) => {
      this.layerSource.addFeature(this.createAircraftFeature(aircraft));
    });
    this.featureCount = aircraftList.length
  }

  addAircraftFeature(aircraft: Aircraft) {
    this.layerSource.addFeature(this.createAircraftFeature(aircraft));
    this.featureCount += 1
  }

  updateAircraftFeature(aircraftId: string, aircraftSelected: boolean, aircraftHeading: number) {
    const feature = this.findFeatureByKey('id', aircraftId);
    if (feature) {
      feature.set('selected', aircraftSelected);
      feature.set('heading', aircraftHeading);
    }
  }
}

export class FacilityLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection, zIndex?: number) {
    super(projection, facilityStyle, zIndex);
  }

  createFacilityFeature(facility: Facility) {
    return new Feature({
      type: 'facility',
      geometry: new Point(fromLonLat([facility.longitude, facility.latitude], this.projection)),
      id: facility.id,
      name: facility.name,
      sideName: facility.sideName,
      sideColor: facility.sideColor,
    });
  }

  refresh(facilities: Facility[]) {
    this.layerSource.clear(true);
    facilities.forEach((facility) => {
      this.layerSource.addFeature(this.createFacilityFeature(facility));
    });
    this.featureCount = facilities.length
  }

  addFacilityFeature(facility: Facility) {
    this.layerSource.addFeature(this.createFacilityFeature(facility));
    this.featureCount += 1
  }
}

export class AirbasesLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection, zIndex?: number) {
    super(projection, airbasesStyle, zIndex);
  }

  createAirbaseFeature(airbase: Airbase) {
    return new Feature({
      type: 'airbase',
      geometry: new Point(fromLonLat([airbase.longitude, airbase.latitude], this.projection)),
      id: airbase.id,
      name: airbase.name,
      sideName: airbase.sideName,
      sideColor: airbase.sideColor,
    });
  }

  refresh(airbases: Airbase[]) {
    this.layerSource.clear(true);
    airbases.forEach((airbase) => {
      this.layerSource.addFeature(this.createAirbaseFeature(airbase));
    });
    this.featureCount = airbases.length
  }

  addAirbaseFeature(airbase: Airbase) {
    this.layerSource.addFeature(this.createAirbaseFeature(airbase));
    this.featureCount += 1
  }
}

export class RangeLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection, zIndex?: number) {
    super(projection, rangeStyle, zIndex);
  }

  createRangeFeature(entity: Aircraft | Facility) {
    return new Feature({
      type: 'rangeRing',
      id: entity.id,
      geometry: new Circle(fromLonLat([entity.longitude, entity.latitude], this.projection), entity.range * NAUTICAL_MILES_TO_METERS),
      sideColor: entity.sideColor,
    });
  }

  refresh(entities: (Aircraft | Facility)[]) {
    this.layerSource.clear(true);
    entities.forEach((entity) => {
      this.layerSource.addFeature(this.createRangeFeature(entity));
    });
    this.featureCount = entities.length
  }

  addRangeFeature(entity: Aircraft | Facility) {
    this.layerSource.addFeature(this.createRangeFeature(entity));
    this.featureCount += 1
  }

  updateRangeFeature(facilityId: string, facilityRange: number) {
    const feature = this.findFeatureByKey('id', facilityId);
    if (feature) {
      const featureGeometry = feature.getGeometry() as Circle
      feature.setGeometry(new Circle(featureGeometry.getCenter(), facilityRange * NAUTICAL_MILES_TO_METERS));
    }
  }
}

export class AircraftRouteLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection, zIndex?: number) {
    super(projection, aircraftRouteStyle, zIndex);
  }

  createAircraftRouteFeature(aircraft: Aircraft) {
    const aircraftLocation = fromLonLat([aircraft.longitude, aircraft.latitude], this.projection);
    const destinationLatitude = aircraft.route[aircraft.route.length - 1][0];
    const destinationLongitude = aircraft.route[aircraft.route.length - 1][1];
    const destinationLocation = fromLonLat([destinationLongitude, destinationLatitude], this.projection);
    return new Feature({
      type: 'aircraftRoute',
      id: aircraft.id,
      geometry: new LineString([aircraftLocation, destinationLocation]),
      sideColor: aircraft.sideColor,
    });
  }

  refresh(aircraftList: Aircraft[]) {
    this.layerSource.clear(true);
    aircraftList.forEach((aircraft) => {
      if (aircraft.route.length > 1) {
        this.layerSource.addFeature(this.createAircraftRouteFeature(aircraft));
        this.featureCount += 1
      }
    });
  }

  addAircraftRouteFeature(aircraft: Aircraft) {
    if (aircraft.route.length > 0) {
      this.layerSource.addFeature(this.createAircraftRouteFeature(aircraft));
      this.featureCount += 1
    }
  }

  updateAircraftRouteFeature(aircraft: Aircraft) {
    const feature = this.findFeatureByKey('id', aircraft.id);
    if (feature && aircraft.route.length > 0) {
      const aircraftLocation = fromLonLat([aircraft.longitude, aircraft.latitude], this.projection);
      const destinationLatitude = aircraft.route[aircraft.route.length - 1][0];
      const destinationLongitude = aircraft.route[aircraft.route.length - 1][1];
      const destinationLocation = fromLonLat([destinationLongitude, destinationLatitude], this.projection);
      feature.setGeometry(new LineString([aircraftLocation, destinationLocation]));
    }
  }
}

export class WeaponLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection, zIndex?: number) {
    super(projection, weaponStyle, zIndex);
  }

  createWeaponFeature(weapon: Weapon) {
    return new Feature({
      type: 'weapon',
      geometry: new Point(fromLonLat([weapon.longitude, weapon.latitude], this.projection)),
      id: weapon.id,
      name: weapon.name,
      heading: weapon.heading,
      sideName: weapon.sideName,
      sideColor: weapon.sideColor,
    });
  }

  refresh(weaponList: Weapon[]) {
    this.layerSource.clear(true);
    weaponList.forEach((weapon) => {
      this.layerSource.addFeature(this.createWeaponFeature(weapon));
    });
    this.featureCount = weaponList.length
  }
}

export class FeatureLabelLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection, zIndex?: number) {
    super(projection, featureLabelStyle, zIndex);
  }

  getFeatureType(entity: GameEntity) {
    if (entity instanceof Aircraft) {
      return 'aircraft'
    } else if (entity instanceof Facility) {
      return 'facility'
    } else {
      return 'airbase'
    }
  }

  createFeatureLabelFeature(entity: GameEntity) {
    return new Feature({
      type: this.getFeatureType(entity) + 'FeatureLabel',
      id: entity.id,
      name: entity.name,
      geometry: new Point(fromLonLat([entity.longitude, entity.latitude], this.projection)),
      sideColor: entity.sideColor,
    });
  }

  refresh(entities: (GameEntity)[]) {
    this.layerSource.clear(true);
    entities.forEach((entity) => {
      this.layerSource.addFeature(this.createFeatureLabelFeature(entity));
    });
    this.featureCount = entities.length
  }

  refreshSubset(entities: (GameEntity)[], entityType: string) {
    const featureType = entityType + 'FeatureLabel'
    this.layerSource.getFeatures().forEach((feature) => {
      if (feature.getProperties().type === featureType) {
        this.layerSource.removeFeature(feature);
        this.featureCount -= 1
      }
    });
    entities.forEach((entity) => {
      this.layerSource.addFeature(this.createFeatureLabelFeature(entity));
    });
    this.featureCount += entities.length
  }

  addFeatureLabelFeature(entity: GameEntity) {
    this.layerSource.addFeature(this.createFeatureLabelFeature(entity));
    this.featureCount += 1
  }
}
