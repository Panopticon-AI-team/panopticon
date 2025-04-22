import TileLayer from "ol/layer/Tile.js";
import { Projection, get as getProjection } from "ol/proj";
import OSM from "ol/source/OSM.js";
import TileJSON from "ol/source/TileJSON.js";
import { DEFAULT_OL_PROJECTION_CODE } from "@/utils/constants";

const defaultProjection = getProjection(DEFAULT_OL_PROJECTION_CODE);

export default class BaseMapLayers {
  layers: (TileLayer<OSM> | TileLayer<TileJSON>)[];
  projection: Projection;
  currentLayerIndex: number;

  constructor(
    projection?: Projection,
    mapTilerBasicUrl?: string,
    mapTilerSatelliteUrl?: string,
    zIndex?: number
  ) {
    this.layers = [];
    if (mapTilerBasicUrl) {
      this.layers.push(this.createMapTilerBasicLayer(mapTilerBasicUrl, zIndex));
    }
    if (mapTilerSatelliteUrl) {
      this.layers.push(
        this.createMapTilerSatelliteLayer(mapTilerSatelliteUrl, zIndex)
      );
    }
    this.layers.push(this.createBaseOsmLayer(zIndex));
    this.projection = projection ?? defaultProjection!;
    this.layers.forEach((layer) => layer.setZIndex(zIndex ?? -1));
    this.currentLayerIndex = this.layers.length - 1;
  }

  createBaseOsmLayer = (zIndex?: number) => {
    const osmLayer = new TileLayer({ source: new OSM() });
    osmLayer.setZIndex(zIndex ?? -1);
    return osmLayer;
  };

  createMapTilerBasicLayer = (url: string, zIndex?: number) => {
    const mapTilerBasicLayer = new TileLayer({
      source: new OSM({
        url: url,
      }),
    });
    mapTilerBasicLayer.setZIndex(zIndex ?? -1);
    return mapTilerBasicLayer;
  };

  createMapTilerSatelliteLayer = (url: string, zIndex?: number) => {
    const mapTilerSatelliteSource = new TileJSON({
      url: url,
      tileSize: 512,
      crossOrigin: "anonymous",
    });
    const mapTilerSatelliteLayer = new TileLayer({
      source: mapTilerSatelliteSource,
    });
    mapTilerSatelliteLayer.setZIndex(zIndex ?? -1);
    return mapTilerSatelliteLayer;
  };

  toggleLayer = () => {
    this.currentLayerIndex = (this.currentLayerIndex + 1) % this.layers.length;
    this.layers.forEach((layer, index) => {
      if (index === this.currentLayerIndex) layer.setVisible(true);
      else layer.setVisible(false);
    });
  };
}
