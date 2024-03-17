import Feature, { FeatureLike } from "ol/Feature.js";
import { Circle, Geometry, LineString } from "ol/geom";
import Point from "ol/geom/Point.js";
import { Vector as VectorLayer } from "ol/layer.js";
import VectorSource from "ol/source/Vector.js";
import { Projection, fromLonLat, get as getProjection } from "ol/proj";
import { Style } from "ol/style";

import Aircraft from "../../../game/units/Aircraft";
import Facility from "../../../game/units/Facility";
import Airbase from "../../../game/units/Airbase";
import {
  DEFAULT_OL_PROJECTION_CODE,
  NAUTICAL_MILES_TO_METERS,
} from "../../../utils/constants";
import {
  aircraftRouteStyle,
  aircraftStyle,
  airbasesStyle,
  facilityStyle,
  rangeStyle,
  weaponStyle,
  featureLabelStyle,
} from "./FeatureLayerStyles";
import Weapon from "../../../game/units/Weapon";

type GameEntity = Aircraft | Facility | Airbase | Weapon;

const defaultProjection = getProjection(DEFAULT_OL_PROJECTION_CODE);

class FeatureLayer {
  layerSource: VectorSource;
  layer: VectorLayer<VectorSource<Geometry>>;
  projection: Projection;
  featureCount: number = 0;

  constructor(
    styleFunction: (feature: FeatureLike) => Style | Style[],
    projection?: Projection,
    zIndex?: number
  ) {
    this.layerSource = new VectorSource({
      features: [],
    });
    this.layer = new VectorLayer({
      source: this.layerSource,
      style: styleFunction,
    });
    this.projection = projection ?? defaultProjection!;
    this.layer.setZIndex(zIndex ?? 0);
  }

  refreshFeatures(features: Feature[]) {
    this.layerSource.clear();
    this.layerSource.addFeatures(features);
    this.featureCount = features.length;
  }

  findFeatureByKey(key: string, value: any) {
    return this.layerSource
      .getFeatures()
      .find((feature) => feature.getProperties()[key] === value);
  }

  removeFeatureById(id: string) {
    const feature = this.findFeatureByKey("id", id);
    if (feature) {
      this.layerSource.removeFeature(feature);
      this.featureCount -= 1;
    }
  }
}

export class AircraftLayer extends FeatureLayer {
  constructor(projection?: Projection, zIndex?: number) {
    super(aircraftStyle, projection, zIndex);
    this.layer.set("name", "aircraftLayer");
  }

  createAircraftFeature(aircraft: Aircraft) {
    const aircraftFeature = new Feature({
      type: "aircraft",
      geometry: new Point(
        fromLonLat([aircraft.longitude, aircraft.latitude], this.projection)
      ),
      id: aircraft.id,
      name: aircraft.name,
      heading: aircraft.heading,
      selected: aircraft.selected,
      sideName: aircraft.sideName,
      sideColor: aircraft.sideColor,
    });
    aircraftFeature.setId(aircraft.id);
    return aircraftFeature;
  }

  refresh(aircraftList: Aircraft[]) {
    const aircraftFeatures = aircraftList.map((aircraft) =>
      this.createAircraftFeature(aircraft)
    );
    this.refreshFeatures(aircraftFeatures);
  }

  updateAircraftGeometry(aircraftList: Aircraft[]) {
    aircraftList.forEach((aircraft) => {
      const feature = this.layerSource.getFeatureById(aircraft.id);
      if (feature) {
        feature.setGeometry(
          new Point(
            fromLonLat([aircraft.longitude, aircraft.latitude], this.projection)
          )
        );
      }
    });
  }

  addAircraftFeature(aircraft: Aircraft) {
    this.layerSource.addFeature(this.createAircraftFeature(aircraft));
    this.featureCount += 1;
  }

  updateAircraftFeature(
    aircraftId: string,
    aircraftSelected: boolean,
    aircraftHeading: number
  ) {
    const feature = this.findFeatureByKey("id", aircraftId);
    if (feature) {
      feature.set("selected", aircraftSelected);
      feature.set("heading", aircraftHeading);
    }
  }
}

export class FacilityLayer extends FeatureLayer {
  constructor(projection?: Projection, zIndex?: number) {
    super(facilityStyle, projection, zIndex);
    this.layer.set("name", "facilityLayer");
  }

  createFacilityFeature(facility: Facility) {
    return new Feature({
      type: "facility",
      geometry: new Point(
        fromLonLat([facility.longitude, facility.latitude], this.projection)
      ),
      id: facility.id,
      name: facility.name,
      sideName: facility.sideName,
      sideColor: facility.sideColor,
    });
  }

  refresh(facilities: Facility[]) {
    const facilityFeatures = facilities.map((facility) =>
      this.createFacilityFeature(facility)
    );
    this.refreshFeatures(facilityFeatures);
  }

  addFacilityFeature(facility: Facility) {
    this.layerSource.addFeature(this.createFacilityFeature(facility));
    this.featureCount += 1;
  }
}

export class AirbasesLayer extends FeatureLayer {
  constructor(projection?: Projection, zIndex?: number) {
    super(airbasesStyle, projection, zIndex);
    this.layer.set("name", "airbasesLayer");
  }

  createAirbaseFeature(airbase: Airbase) {
    return new Feature({
      type: "airbase",
      geometry: new Point(
        fromLonLat([airbase.longitude, airbase.latitude], this.projection)
      ),
      id: airbase.id,
      name: airbase.name,
      sideName: airbase.sideName,
      sideColor: airbase.sideColor,
    });
  }

  refresh(airbases: Airbase[]) {
    const airbaseFeatures = airbases.map((airbase) =>
      this.createAirbaseFeature(airbase)
    );
    this.refreshFeatures(airbaseFeatures);
  }

  addAirbaseFeature(airbase: Airbase) {
    this.layerSource.addFeature(this.createAirbaseFeature(airbase));
    this.featureCount += 1;
  }
}

export class RangeLayer extends FeatureLayer {
  constructor(projection?: Projection, zIndex?: number) {
    super(rangeStyle, projection, zIndex);
    this.layer.set("name", "rangeRingLayer");
  }

  createRangeFeature(entity: Aircraft | Facility) {
    return new Feature({
      type: "rangeRing",
      id: entity.id,
      geometry: new Circle(
        fromLonLat([entity.longitude, entity.latitude], this.projection),
        entity.range * NAUTICAL_MILES_TO_METERS
      ),
      sideColor: entity.sideColor,
    });
  }

  refresh(entities: (Aircraft | Facility)[]) {
    const entityFeatures = entities.map((entity) =>
      this.createRangeFeature(entity)
    );
    this.refreshFeatures(entityFeatures);
  }

  addRangeFeature(entity: Aircraft | Facility) {
    this.layerSource.addFeature(this.createRangeFeature(entity));
    this.featureCount += 1;
  }

  updateRangeFeature(facilityId: string, facilityRange: number) {
    const feature = this.findFeatureByKey("id", facilityId);
    if (feature) {
      const featureGeometry = feature.getGeometry() as Circle;
      feature.setGeometry(
        new Circle(
          featureGeometry.getCenter(),
          facilityRange * NAUTICAL_MILES_TO_METERS
        )
      );
    }
  }
}

export class AircraftRouteLayer extends FeatureLayer {
  constructor(projection?: Projection, zIndex?: number) {
    super(aircraftRouteStyle, projection, zIndex);
    this.layer.set("name", "aircraftRouteLayer");
  }

  createAircraftRouteFeature(aircraft: Aircraft) {
    const aircraftLocation = fromLonLat(
      [aircraft.longitude, aircraft.latitude],
      this.projection
    );
    const destinationLatitude = aircraft.route[aircraft.route.length - 1][0];
    const destinationLongitude = aircraft.route[aircraft.route.length - 1][1];
    const destinationLocation = fromLonLat(
      [destinationLongitude, destinationLatitude],
      this.projection
    );
    const aircraftRouteFeature = new Feature({
      type: "aircraftRoute",
      id: aircraft.id,
      geometry: new LineString([aircraftLocation, destinationLocation]),
      sideColor: aircraft.sideColor,
    });
    aircraftRouteFeature.setId(aircraft.id);
    return aircraftRouteFeature;
  }

  refresh(aircraftList: Aircraft[]) {
    const aircraftRouteFeatures: Feature<LineString>[] = [];
    aircraftList.forEach((aircraft) => {
      if (aircraft.route.length > 0) {
        aircraftRouteFeatures.push(this.createAircraftRouteFeature(aircraft));
      }
    });
    this.refreshFeatures(aircraftRouteFeatures);
  }

  addAircraftRouteFeature(aircraft: Aircraft) {
    if (aircraft.route.length > 0) {
      const previousFeature = this.findFeatureByKey("id", aircraft.id);
      if (previousFeature) {
        this.layerSource.removeFeature(previousFeature);
        this.featureCount -= 1;
      }
      this.layerSource.addFeature(this.createAircraftRouteFeature(aircraft));
      this.featureCount += 1;
    }
  }

  updateAircraftRouteFeature(aircraft: Aircraft) {
    const feature = this.findFeatureByKey("id", aircraft.id);
    if (feature && aircraft.route.length > 0) {
      const aircraftLocation = fromLonLat(
        [aircraft.longitude, aircraft.latitude],
        this.projection
      );
      const destinationLatitude = aircraft.route[aircraft.route.length - 1][0];
      const destinationLongitude = aircraft.route[aircraft.route.length - 1][1];
      const destinationLocation = fromLonLat(
        [destinationLongitude, destinationLatitude],
        this.projection
      );
      feature.setGeometry(
        new LineString([aircraftLocation, destinationLocation])
      );
    }
  }
}

export class WeaponLayer extends FeatureLayer {
  constructor(projection?: Projection, zIndex?: number) {
    super(weaponStyle, projection, zIndex);
    this.layer.set("name", "weaponLayer");
  }

  createWeaponFeature(weapon: Weapon) {
    return new Feature({
      type: "weapon",
      geometry: new Point(
        fromLonLat([weapon.longitude, weapon.latitude], this.projection)
      ),
      id: weapon.id,
      name: weapon.name,
      heading: weapon.heading,
      sideName: weapon.sideName,
      sideColor: weapon.sideColor,
    });
  }

  refresh(weaponList: Weapon[]) {
    const weaponFeatures = weaponList.map((weapon) =>
      this.createWeaponFeature(weapon)
    );
    this.refreshFeatures(weaponFeatures);
  }
}

export class FeatureLabelLayer extends FeatureLayer {
  constructor(projection?: Projection, zIndex?: number) {
    super(featureLabelStyle, projection, zIndex);
    this.layer.set("name", "featureLabelLayer");
  }

  getFeatureType(entity: GameEntity) {
    if (entity instanceof Aircraft) {
      return "aircraft";
    } else if (entity instanceof Facility) {
      return "facility";
    } else if (entity instanceof Airbase) {
      return "airbase";
    } else if (entity instanceof Weapon) {
      return "weapon";
    } else {
      return "unknown";
    }
  }

  createFeatureLabelFeature(entity: GameEntity) {
    return new Feature({
      type: this.getFeatureType(entity) + "FeatureLabel",
      id: entity.id,
      name: entity.name,
      geometry: new Point(
        fromLonLat([entity.longitude, entity.latitude], this.projection)
      ),
      sideColor: entity.sideColor,
    });
  }

  refresh(entities: GameEntity[]) {
    const entityFeatures = entities.map((entity) =>
      this.createFeatureLabelFeature(entity)
    );
    this.refreshFeatures(entityFeatures);
  }

  refreshSubset(entities: GameEntity[], entityType: string) {
    const featureType = entityType + "FeatureLabel";
    this.layerSource.getFeatures().forEach((feature) => {
      if (feature.getProperties().type === featureType) {
        this.layerSource.removeFeature(feature);
        this.featureCount -= 1;
      }
    });
    entities.forEach((entity) => {
      this.layerSource.addFeature(this.createFeatureLabelFeature(entity));
    });
    this.featureCount += entities.length;
  }

  addFeatureLabelFeature(entity: GameEntity) {
    this.layerSource.addFeature(this.createFeatureLabelFeature(entity));
    this.featureCount += 1;
  }

  updateFeatureLabelFeature(entityId: string, newLabel: string) {
    const feature = this.findFeatureByKey("id", entityId);
    if (feature) {
      feature.set("name", newLabel);
    }
  }
}
