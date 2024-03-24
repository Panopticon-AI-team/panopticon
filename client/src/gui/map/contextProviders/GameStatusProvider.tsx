import React, { createContext, useState } from "react";

const CurrentGameStatus = createContext("Scenario paused");
const SetCurrentGameStatus = createContext((status: string) => {});

const CurrentGameStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentGameStatus, setCurrentGameStatus] = useState("Scenario paused");

  return (
    <CurrentGameStatus.Provider value={currentGameStatus}>
      <SetCurrentGameStatus.Provider value={setCurrentGameStatus}>
        {children}
      </SetCurrentGameStatus.Provider>
    </CurrentGameStatus.Provider>
  );
};

export { CurrentGameStatus, SetCurrentGameStatus, CurrentGameStatusProvider };
