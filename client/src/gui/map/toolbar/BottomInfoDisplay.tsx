import { Stack } from "@mui/material";
import MouseMapCoordinatesDisplay from "@/gui/map/toolbar/MouseMapCoordinatesDisplay";
import ScenarioTimeDisplay from "@/gui/map/toolbar/ScenarioTimeDisplay";

interface IBottomInfoDisplay {
  mobileView: boolean;
}

export default function BottomInfoDisplay(props: Readonly<IBottomInfoDisplay>) {
  return (
    <div
      style={{
        position: "absolute",
        right: "1em",
        bottom: "1em",
        zIndex: 1000,
      }}
    >
      <Stack
        direction={props.mobileView ? "column" : "row"}
        sx={
          props.mobileView
            ? { flexDirection: "column-reverse", gap: 1.5 }
            : null
        }
        spacing={1.5}
      >
        <MouseMapCoordinatesDisplay />
        <ScenarioTimeDisplay />
      </Stack>
    </div>
  );
}
