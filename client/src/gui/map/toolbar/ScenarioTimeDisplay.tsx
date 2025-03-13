import { useContext } from "react";
import { Chip } from "@mui/material";
import { unixToLocalTime } from "@/utils/dateTimeFunctions";
import { colorPalette } from "@/utils/constants";
import { ScenarioTimeContext } from "@/gui/contextProviders/contexts/ScenarioTimeContext";

const scenarioTimeDisplayStyle = {
  backgroundColor: colorPalette.lightGray,
  color: "#000",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 400,
};

export default function ScenarioTimeDisplay() {
  const currentScenarioTime = useContext(ScenarioTimeContext);

  return (
    <Chip
      label={"Current time: " + unixToLocalTime(currentScenarioTime)}
      style={scenarioTimeDisplayStyle}
    />
  );
}
