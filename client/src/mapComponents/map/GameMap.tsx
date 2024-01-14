import "./GameMap.css";
import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';

interface GameMapProps {
  // children: React.ReactNode;
  zoom: number;
  center: number[];
}

export default function GameMap({ zoom, center }: Readonly<GameMapProps>) {
  const mapId = useRef(null);

  useEffect(() => {
    const theMap = new Map({
      layers: [new TileLayer({source: new OSM()}),],
      view: new View({
        center,
        zoom,
      }),
    });
    theMap.setTarget(mapId.current!);
    return () => {
      if (!theMap) return;
      theMap.setTarget();
    }
  }, []);

  return (
    <div ref={mapId} className='map'>
      {/* {children} */}
    </div>
  );
};
