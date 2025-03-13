import React, { useState } from "react";
import {
  MouseMapCoordinatesContext,
  SetMouseMapCoordinatesContext,
} from "@/gui/contextProviders/contexts/MouseMapCoordinatesContext";

export const MouseMapCoordinatesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentMouseMapCoordinates, setCurrentMouseMapCoordinates] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });

  return (
    <MouseMapCoordinatesContext.Provider value={currentMouseMapCoordinates}>
      <SetMouseMapCoordinatesContext.Provider
        value={setCurrentMouseMapCoordinates}
      >
        {children}
      </SetMouseMapCoordinatesContext.Provider>
    </MouseMapCoordinatesContext.Provider>
  );
};
