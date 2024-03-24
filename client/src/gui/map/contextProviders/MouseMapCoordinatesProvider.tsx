import React, { createContext, useState } from "react";

const CurrentMouseMapCoordinates = createContext({ latitude: 0, longitude: 0 });
const SetCurrentMouseMapCoordinates = createContext(
  (coordinates: { latitude: number; longitude: number }) => {}
);

const CurrentMouseMapCoordinatesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentMouseMapCoordinates, setCurrentMouseMapCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });

  return (
    <CurrentMouseMapCoordinates.Provider value={currentMouseMapCoordinates}>
      <SetCurrentMouseMapCoordinates.Provider
        value={setCurrentMouseMapCoordinates}
      >
        {children}
      </SetCurrentMouseMapCoordinates.Provider>
    </CurrentMouseMapCoordinates.Provider>
  );
};

export {
  CurrentMouseMapCoordinates,
  SetCurrentMouseMapCoordinates,
  CurrentMouseMapCoordinatesProvider,
};
