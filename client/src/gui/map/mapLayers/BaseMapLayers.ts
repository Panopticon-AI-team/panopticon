import TileLayer from 'ol/layer/Tile.js';
import { Projection } from 'ol/proj';
import OSM from 'ol/source/OSM.js';
import TileJSON from 'ol/source/TileJSON.js';
import { DEFAULT_OL_PROJECTION_CODE } from '../../../utils/constants';

const devMode = false;
let mapTilerBasicLayer: TileLayer<OSM>;
let mapTilerSatelliteLayer: TileLayer<TileJSON>;
if (!devMode) {
  const mapTilerKey = 'KSJDrRj74VJSIlWTIIap'
  mapTilerBasicLayer = new TileLayer({source: new OSM({url: `https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${mapTilerKey}`})});
  const mapTilerSatelliteSource = new TileJSON({
    url: `https://api.maptiler.com/maps/satellite/tiles.json?key=${mapTilerKey}`,
    tileSize: 512,
    crossOrigin: 'anonymous'
  })
  mapTilerSatelliteLayer = new TileLayer({source: mapTilerSatelliteSource})
}
const osmLayer = new TileLayer({source: new OSM()});

export default class BaseMapLayers {
  layers: (TileLayer<OSM> | TileLayer<TileJSON>)[];
  projection: Projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE});
  currentLayerIndex: number

  constructor(projection: Projection) {
    if (!devMode) this.layers = [mapTilerBasicLayer, mapTilerSatelliteLayer, osmLayer];
    else this.layers = [osmLayer];
    if (projection) this.projection = projection;
    this.currentLayerIndex = this.layers.length - 1;
  };

  toggleLayer = () => {
    this.currentLayerIndex = (this.currentLayerIndex + 1) % this.layers.length;
    this.layers.forEach((layer, index) => {
      if (index === this.currentLayerIndex) layer.setVisible(true);
      else layer.setVisible(false);
    })
  }
}
