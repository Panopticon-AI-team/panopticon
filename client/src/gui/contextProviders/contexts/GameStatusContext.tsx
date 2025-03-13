import { createContext } from "react";

type GameStatusContextType = string;
type SetGameStatusContextType = (status: string) => void;

const GameStatusContext =
  createContext<GameStatusContextType>("Scenario paused");
const SetGameStatusContext = createContext<SetGameStatusContextType>(
  (_status: string) => {}
);

export { GameStatusContext, SetGameStatusContext };
