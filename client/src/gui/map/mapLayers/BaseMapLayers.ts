import TileLayer from "ol/layer/Tile.js";
import { Projection, get as getProjection } from "ol/proj";
import OSM from "ol/source/OSM.js";
import TileJSON from "ol/source/TileJSON.js";
import { DEFAULT_OL_PROJECTION_CODE } from "@/utils/constants";

const devMode = false;
const defaultProjection = getProjection(DEFAULT_OL_PROJECTION_CODE);

const layers: (TileLayer<OSM> | TileLayer<TileJSON>)[] = [];
if (!devMode) {
  const mapTilerKey = "";
  const mapTilerBasicLayer = new TileLayer({
    source: new OSM({
      url: `https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${mapTilerKey}`,
    }),
  });
  const mapTilerSatelliteSource = new TileJSON({
    url: `https://api.maptiler.com/maps/satellite/tiles.json?key=${mapTilerKey}`,
    tileSize: 512,
    crossOrigin: "anonymous",
  });
  const mapTilerSatelliteLayer = new TileLayer({
    source: mapTilerSatelliteSource,
  });
  layers.push(mapTilerBasicLayer);
  layers.push(mapTilerSatelliteLayer);
}
const osmLayer = new TileLayer({ source: new OSM() });
layers.push(osmLayer);

export default class BaseMapLayers {
  layers: (TileLayer<OSM> | TileLayer<TileJSON>)[];
  projection: Projection;
  currentLayerIndex: number;

  constructor(projection?: Projection, zIndex?: number) {
    this.layers = layers;
    this.projection = projection ?? defaultProjection!;
    this.layers.forEach((layer) => layer.setZIndex(zIndex ?? -1));
    this.currentLayerIndex = this.layers.length - 1;
  }

  toggleLayer = () => {
    this.currentLayerIndex = (this.currentLayerIndex + 1) % this.layers.length;
    this.layers.forEach((layer, index) => {
      if (index === this.currentLayerIndex) layer.setVisible(true);
      else layer.setVisible(false);
    });
  };
}
