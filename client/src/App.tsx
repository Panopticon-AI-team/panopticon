import { randomUUID } from "@/utils/generateUUID";
import { get as getProjection, transform } from "ol/proj.js";
import ScenarioMap from "@/gui/map/ScenarioMap";
import Side from "@/game/Side";
import Scenario from "@/game/Scenario";
import Game from "@/game/Game";
import { DEFAULT_OL_PROJECTION_CODE } from "@/utils/constants";
import SCSScenarioJson from "@/scenarios/SCS.json";
import Box from "@mui/material/Box";
import { useMediaQuery } from "@mui/material";

export default function App() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const sideBlue = new Side({
    id: randomUUID(),
    name: "BLUE",
    sideColor: "blue", // TODO: create enum for side colors
  });
  const sideRed = new Side({
    id: randomUUID(),
    name: "RED",
    sideColor: "red",
  });
  const currentScenario = new Scenario({
    id: randomUUID(),
    name: "New Scenario",
    startTime: 1699073110,
    currentTime: 1699073110,
    duration: 14400,
    sides: [sideBlue, sideRed],
    timeCompression: 1,
  });
  const theGame = new Game(currentScenario);
  theGame.currentSideName = sideBlue.name;
  const projection = getProjection(DEFAULT_OL_PROJECTION_CODE) ?? undefined;

  theGame.loadScenario(JSON.stringify(SCSScenarioJson)); // loads default scenario for easier testing

  return (
    <Box className="App" sx={{ display: "flex" }}>
      <ScenarioMap
        center={transform(
          theGame.mapView.currentCameraCenter,
          "EPSG:4326",
          DEFAULT_OL_PROJECTION_CODE
        )}
        zoom={theGame.mapView.currentCameraZoom}
        game={theGame}
        projection={projection}
        mobileView={isMobile}
      />
    </Box>
  );
}
