import Side from "@/game/Side";
import { createContext } from "react";

type ScenarioSidesContextType = Side[];
type SetScenarioSidesContext = (sides: Side[]) => void;

const ScenarioSidesContext = createContext<ScenarioSidesContextType>([]);
const SetScenarioSidesContext = createContext<SetScenarioSidesContext>(
  (_sides: Side[]) => {}
);

export { ScenarioSidesContext, SetScenarioSidesContext };
