import { createContext } from "react";

type ScenarioTimeContextType = number;
type SetScenarioTimeContext = (time: number) => void;

const ScenarioTimeContext = createContext<ScenarioTimeContextType>(0);
const SetScenarioTimeContext = createContext<SetScenarioTimeContext>(
  (_time: number) => {}
);

export { ScenarioTimeContext, SetScenarioTimeContext };
