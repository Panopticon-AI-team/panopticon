import { SimulationLog } from "@/game/log/SimulationLogs";
import { createContext } from "react";

type SimulationLogsContextType = SimulationLog[];
type SetSimulationLogsContext = (simulationLogs: SimulationLog[]) => void;

const SimulationLogsContext = createContext<SimulationLogsContextType>([]);
const SetSimulationLogsContext = createContext<SetSimulationLogsContext>(
  (_simulationLogs: SimulationLog[]) => {}
);

export { SimulationLogsContext, SetSimulationLogsContext };
