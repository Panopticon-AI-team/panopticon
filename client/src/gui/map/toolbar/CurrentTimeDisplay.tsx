import React, { useContext } from "react";
import { Chip } from "@mui/material";
import { unixToLocalTime } from "../../../utils/utils";
import { CurrentScenarioTimeContext } from "../contextProviders/ScenarioTimeProvider";
import { colorPalette } from "../../../utils/constants";

const currentTimeChipStyle = {
  backgroundColor: colorPalette.lightGray,
  color: "#000",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 400,
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
