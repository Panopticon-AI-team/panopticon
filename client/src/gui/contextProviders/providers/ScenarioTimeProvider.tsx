import React, { useState } from "react";
import {
  ScenarioTimeContext,
  SetScenarioTimeContext,
} from "@/gui/contextProviders/contexts/ScenarioTimeContext";

export const ScenarioTimeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentScenarioTime, setCurrentScenarioTime] = useState<number>(0);

  return (
    <ScenarioTimeContext.Provider value={currentScenarioTime}>
      <SetScenarioTimeContext.Provider value={setCurrentScenarioTime}>
        {children}
      </SetScenarioTimeContext.Provider>
    </ScenarioTimeContext.Provider>
  );
};
