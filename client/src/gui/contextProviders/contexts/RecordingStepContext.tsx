import { createContext } from "react";

type RecordingStepContextType = number;
type SetRecordingStepContext = (step: number) => void;

const RecordingStepContext = createContext<RecordingStepContextType>(0);
const SetRecordingStepContext = createContext<SetRecordingStepContext>(
  (_step: number) => {}
);

export { RecordingStepContext, SetRecordingStepContext };
