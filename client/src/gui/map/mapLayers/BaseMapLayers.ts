import TileLayer from 'ol/layer/Tile.js';
import { Projection } from 'ol/proj';
import OSM from 'ol/source/OSM.js';
import { DEFAULT_OL_PROJECTION_CODE } from '../../../utils/constants';

const mapTilerKey = 'KSJDrRj74VJSIlWTIIap'
const osmLayer = new TileLayer({source: new OSM()});
const mapTilerLayer = new TileLayer({source: new OSM({url: `https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${mapTilerKey}`})});

export default class BaseMapLayers {
  layers: (TileLayer<OSM>)[];
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});
  currentLayerIndex: number = 1

  constructor(projection: Projection) {
    this.layers = [mapTilerLayer, osmLayer];
    if (projection) this.projection = projection;
  };

  toggleLayer = () => {
    this.currentLayerIndex = (this.currentLayerIndex + 1) % this.layers.length;
    this.layers.forEach((layer, index) => {
      if (index === this.currentLayerIndex) layer.setVisible(true);
      else layer.setVisible(false);
    })
  }
}
