import Feature, { FeatureLike } from 'ol/Feature.js';
import { Circle, Geometry } from "ol/geom";
import Point from 'ol/geom/Point.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import { Projection, fromLonLat } from 'ol/proj';
import { Style } from 'ol/style';

import Aircraft from '../../game/Aircraft';
import Facility from '../../game/Facility';
import Base from '../../game/Base';
import { DEFAULT_OL_PROJECTION_CODE, NAUTICAL_MILES_TO_METERS } from '../../utils/constants';
import { aircraftStyle, basesStyle, facilityStyle, rangeStyle } from './FeatureLayerStyles';

class FeatureLayer {
  layerSource: VectorSource;
  layer: VectorLayer<VectorSource<Geometry>>;
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection, styleFunction: (feature: FeatureLike) => Style) {
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

export class BasesLayer extends FeatureLayer {
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection) {
    super(projection, basesStyle);
  }

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