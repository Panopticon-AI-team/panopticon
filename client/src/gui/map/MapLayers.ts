import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';

const osmLayer = new TileLayer({source: new OSM()});

export default class BaseMapLayers {
  layers: (TileLayer<OSM>)[];

  constructor() {
    this.layers = [osmLayer];
  };
}
