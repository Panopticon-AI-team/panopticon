import React, { useState } from "react";
import {
  ScenarioSidesContext,
  SetScenarioSidesContext,
} from "@/gui/contextProviders/contexts/ScenarioSidesContext";
import Side from "@/game/Side";

export const ScenarioSidesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentScenarioSides, setCurrentScenarioSides] = useState<Side[]>([]);

  return (
    <ScenarioSidesContext.Provider value={currentScenarioSides}>
      <SetScenarioSidesContext.Provider value={setCurrentScenarioSides}>
        {children}
      </SetScenarioSidesContext.Provider>
    </ScenarioSidesContext.Provider>
  );
};
