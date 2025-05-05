import { useContext, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { SimulationLogsContext } from "@/gui/contextProviders/contexts/SimulationLogsContext";
import { colorPalette } from "@/utils/constants";
import { CardHeader, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { unixToLocalTime } from "@/utils/dateTimeFunctions";
import { ScenarioSidesContext } from "@/gui/contextProviders/contexts/ScenarioSidesContext";
import Side from "@/game/Side";

const cardStyle = {
  minWidth: "400px",
  maxWidth: "400px",
  minHeight: "200px",
  backgroundColor: colorPalette.lightGray,
  boxShadow: "none",
  borderRadius: "10px",
};

const closeButtonStyle = {
  bottom: 5.5,
};

const cardHeaderStyle = {
  backgroundColor: colorPalette.white,
  color: "black",
};

const logsContainerStyle = {
  height: "300px",
  overflowY: "auto" as const,
  padding: "1em",
  backgroundColor: colorPalette.lightGray,
};

interface SimulationLogsProps {
  handleCloseOnMap: () => void;
}

export default function SimulationLogs(props: SimulationLogsProps) {
  const nodeRef = useRef(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const simulationLogs = useContext(SimulationLogsContext);
  const scenarioSides = useContext(ScenarioSidesContext);
  const [scenarioSidesMap, setScenarioSidesMap] = useState<
    Record<string, Side>
  >({});

  useEffect(() => {
    const container = logsContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [simulationLogs]);

  useEffect(() => {
    const sidesMap: Record<string, Side> = {};
    scenarioSides.forEach((side) => {
      sidesMap[side.id] = side;
    });
    setScenarioSidesMap(sidesMap);
  }, [scenarioSides]);

  return (
    <div
      style={{
        position: "absolute",
        right: "1em",
        bottom: "5em",
        zIndex: "1005",
      }}
    >
      <Draggable nodeRef={nodeRef}>
        <Card ref={nodeRef} sx={cardStyle}>
          <CardHeader
            sx={cardHeaderStyle}
            action={
              <IconButton
                sx={closeButtonStyle}
                onClick={props.handleCloseOnMap}
                aria-label="close"
              >
                <CloseIcon color="error" />
              </IconButton>
            }
            title={
              <Typography variant="body1" component="h1" sx={{ pl: 1 }}>
                Simulation Logs
              </Typography>
            }
          />
          <CardContent sx={{ p: 0 }}>
            <Box ref={logsContainerRef} sx={logsContainerStyle}>
              {simulationLogs.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No logs yet.
                </Typography>
              ) : (
                simulationLogs.map((log) => (
                  <Typography
                    key={log.id}
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", mb: 0.5 }}
                  >
                    [{unixToLocalTime(log.timestamp)}][
                    {scenarioSidesMap[log.sideId]?.name ?? "UNKNOWN"}]{" "}
                    {log.message}
                  </Typography>
                ))
              )}
            </Box>
          </CardContent>
        </Card>
      </Draggable>
    </div>
  );
}
