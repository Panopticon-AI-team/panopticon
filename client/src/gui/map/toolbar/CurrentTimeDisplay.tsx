import React, { useContext } from "react";
import Chip from "@mui/material/Chip";
import { unixToLocalTime } from "../../../utils/utils";
import { CurrentScenarioTimeContext } from "../contextProviders/ScenarioTimeProvider";

interface CurrentTimeDisplayProps {}

const currentTimeChipStyle = {
  backgroundColor: "white",
};

export default function CurrentTimeDisplay() {
  const currentScenarioTimeFromContext = useContext(CurrentScenarioTimeContext);

  return (
    <Chip
      label={"Current time: " + unixToLocalTime(currentScenarioTimeFromContext)}
      style={currentTimeChipStyle}
    />
  );
}
