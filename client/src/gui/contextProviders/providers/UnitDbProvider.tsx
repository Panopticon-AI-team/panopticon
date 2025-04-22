import React, { useState } from "react";
import {
  UnitDbContext,
  SetUnitDbContext,
} from "@/gui/contextProviders/contexts/UnitDbContext";
import Dba from "@/game/db/Dba";

export const UnitDbProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUnitDb, setCurrentUnitDb] = useState<Dba>(new Dba());

  return (
    <UnitDbContext.Provider value={currentUnitDb}>
      <SetUnitDbContext.Provider value={setCurrentUnitDb}>
        {children}
      </SetUnitDbContext.Provider>
    </UnitDbContext.Provider>
  );
};
