import { Stack } from "@mui/material";

import CurrentMouseMapCoordinatesDisplay from "@/gui/map/toolbar/CurrentMouseMapCoordinatesDisplay";
import CurrentTimeDisplay from "@/gui/map/toolbar/CurrentTimeDisplay";

export default function BottomCornerInfoDisplay() {
  return (
    <div
      style={{
        position: "absolute",
        right: "1em",
        bottom: "1em",
        zIndex: 1000,
      }}
    >
      <Stack direction="row" spacing={1}>
        <CurrentMouseMapCoordinatesDisplay />
        <CurrentTimeDisplay />
      </Stack>
    </div>
  );
}
