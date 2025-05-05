import { useContext, useRef } from "react";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import { SimulationLogsContext } from "@/gui/contextProviders/contexts/SimulationLogsContext";
import { colorPalette } from "@/utils/constants";
import { CardHeader, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export enum SimulationLogType {
  WEAPON_LAUNCHED = "WEAPON_LAUNCHED",
  WEAPON_HIT = "WEAPON_HIT",
  WEAPON_MISSED = "WEAPON_MISSED",
  WEAPON_EXPENDED = "WEAPON_EXPENDED",
  WEAPON_CRASHED = "WEAPON_CRASHED",
  STRIKE_MISSION_SUCCESS = "STRIKE_MISSION_SUCCESS",
  STRIKE_MISSION_ABORTED = "STRIKE_MISSION_ABORTED",
  RETURN_TO_BASE = "RETURN_TO_BASE",
  AIRCRAFT_CRASHED = "AIRCRAFT_CRASHED",
  OTHER = "OTHER",
}

export interface SimulationLog {
  id: string;
  timestamp: number;
  type: SimulationLogType;
  sideId: string;
  message: string;
}

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
  height: "50px",
};

interface SimulationLogsProps {
  handleCloseOnMap: () => void;
}

export default function SimulationLogs(props: SimulationLogsProps) {
  const nodeRef = useRef(null);
  const simulationLogs = useContext(SimulationLogsContext);

  const cardContent = () => {
    return <></>;
  };

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
                Mission Creator
              </Typography>
            }
          />
          {cardContent()}
        </Card>
      </Draggable>
    </div>
  );
}
