import { createContext } from "react";

type MouseMapCoordinates = { latitude: number; longitude: number };

type MouseMapCoordinatesContextType = MouseMapCoordinates;
type SetMouseMapCoordinatesContextType = (
  coordinates: MouseMapCoordinates
) => void;

const MouseMapCoordinatesContext =
  createContext<MouseMapCoordinatesContextType>({
    latitude: 0,
    longitude: 0,
  });
const SetMouseMapCoordinatesContext =
  createContext<SetMouseMapCoordinatesContextType>(
    (_coordinates: MouseMapCoordinates) => {}
  );

export { MouseMapCoordinatesContext, SetMouseMapCoordinatesContext };
