import { useContext, useEffect, useState } from "react";
import { randomUUID } from "@/utils/generateUUID";
import { get as getProjection, transform } from "ol/proj.js";
import ScenarioMap from "@/gui/map/ScenarioMap";
import Scenario from "@/game/Scenario";
import Game from "@/game/Game";
import { DEFAULT_OL_PROJECTION_CODE } from "@/utils/constants";
import SCSScenarioJson from "@/scenarios/SCS.json";
import Box from "@mui/material/Box";
import { useMediaQuery } from "@mui/material";
import WelcomePopover from "@/WelcomePopover";
import { useAuth0 } from "@auth0/auth0-react";
import { SetScenarioSidesContext } from "@/gui/contextProviders/contexts/ScenarioSidesContext";

export default function App() {
  const { isAuthenticated } = useAuth0();
  const [openWelcomePopover, setOpenWelcomePopover] = useState(
    import.meta.env.VITE_ENV === "production"
  );
  const setCurrentScenarioSidesToContext = useContext(SetScenarioSidesContext);

  useEffect(() => {
    if (isAuthenticated) {
      setOpenWelcomePopover(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setCurrentScenarioSidesToContext(theGame.currentScenario.sides);
  });

  const isMobile = useMediaQuery("(max-width:600px)");
  const currentScenario = new Scenario({
    id: randomUUID(),
    name: "New Scenario",
    startTime: 1699073110,
    duration: 14400,
  });
  const theGame = new Game(currentScenario);
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
      <WelcomePopover
        open={openWelcomePopover}
        onClose={() => setOpenWelcomePopover(false)}
      />
    </Box>
  );
}
