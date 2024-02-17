import TileLayer from 'ol/layer/Tile.js';
import { Projection } from 'ol/proj';
import OSM from 'ol/source/OSM.js';
import { DEFAULT_OL_PROJECTION_CODE } from '../../utils/constants';

const osmLayer = new TileLayer({source: new OSM()});

export default class BaseMapLayers {
  layers: (TileLayer<OSM>)[];
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});

  constructor(projection: Projection) {
    this.layers = [osmLayer];
    if (projection) this.projection = projection;
  };
}
