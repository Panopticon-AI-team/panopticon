import React, { useState } from "react";
import {
  GameStatusContext,
  SetGameStatusContext,
} from "@/gui/contexts/GameStatusContext";

export const GameStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentGameStatus, setCurrentGameStatus] =
    useState<string>("Scenario paused");

  return (
    <GameStatusContext.Provider value={currentGameStatus}>
      <SetGameStatusContext.Provider value={setCurrentGameStatus}>
        {children}
      </SetGameStatusContext.Provider>
    </GameStatusContext.Provider>
  );
};
