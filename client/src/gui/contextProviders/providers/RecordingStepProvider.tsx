import React, { useState } from "react";
import {
  RecordingStepContext,
  SetRecordingStepContext,
} from "@/gui/contextProviders/contexts/RecordingStepContext";

export const RecordingStepProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentRecordingStep, setCurrentRecordingStep] = useState<number>(0);

  return (
    <RecordingStepContext.Provider value={currentRecordingStep}>
      <SetRecordingStepContext.Provider value={setCurrentRecordingStep}>
        {children}
      </SetRecordingStepContext.Provider>
    </RecordingStepContext.Provider>
  );
};
