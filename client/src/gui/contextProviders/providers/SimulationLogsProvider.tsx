import React, { useState } from "react";
import {
  SimulationLogsContext,
  SetSimulationLogsContext,
} from "@/gui/contextProviders/contexts/SimulationLogsContext";
import { SimulationLog } from "@/game/log/SimulationLogs";

export const SimulationLogsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentSimulationLogs, setCurrentSimulationLogs] = useState<
    SimulationLog[]
  >([]);

  return (
    <SimulationLogsContext.Provider value={currentSimulationLogs}>
      <SetSimulationLogsContext.Provider value={setCurrentSimulationLogs}>
        {children}
      </SetSimulationLogsContext.Provider>
    </SimulationLogsContext.Provider>
  );
};
