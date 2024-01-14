import React, {  useEffect } from "react";
import TileLayer from "ol/layer/Tile";
import Map from "ol/Map";
import TileSource from "ol/source/Tile";

interface OlTileLayerProps {
    map: Map;
    source: TileSource;
}

export default function OlTileLayer({ map, source }: OlTileLayerProps) {
  useEffect(() => {
    const tileLayer = new TileLayer({source: source});

    map.addLayer(tileLayer);

    return () => {map.removeLayer(tileLayer)};
  }, []);

  return null;
}; 