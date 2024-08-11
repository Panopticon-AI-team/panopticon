import React, { useState } from "react";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { makeStyles } from "@material-ui/styles";
import { colorPalette } from "../../../utils/constants";
import EditorSelector from "./EditorSelector";
import EditorTextInputBox from "./EditorTextInputBox";
import { Button } from "@mui/material";
import PatrolMission from "../../../game/mission/PatrolMission";
import Aircraft from "../../../game/units/Aircraft";

const useStyles = makeStyles({
  cardHeaderRoot: {
    textAlign: "left",
    backgroundColor: colorPalette.white,
    color: "black",
    height: "5px",
    borderRadius: "10px",
  },
  cardContentRoot: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
  deleteMissionButton: {
    color: colorPalette.white,
    borderRadius: "10px",
  },
  closeButton: { position: "absolute", top: "0", right: "0" },
});

interface MissionViewerProps {
  missions: PatrolMission[];
  aircraft: Aircraft[];
  deleteMission: (missionId: string) => void;
  handleCloseOnMap: () => void;
}

const MissionViewer = (props: MissionViewerProps) => {
  const classes = useStyles();
  const [selectedMission, setSelectedMission] = useState<PatrolMission>(
    props.missions[0]
  );

  const cardStyle = {
    minWidth: "400px",
    minHeight: "200px",
    backgroundColor: colorPalette.lightGray,
    boxShadow: "none",
    borderRadius: "10px",
  };

  const cardContent = () => {
    const missionIds = props.missions.map((mission) => mission.id);
    const missionNames = props.missions.map((mission) => mission.name);
    return (
      <CardContent classes={{ root: classes.cardContentRoot }}>
        <EditorSelector
          selectId={"mission-viewer-mission-selector"}
          caption={"Mission"}
          optionIds={missionIds}
          optionNames={missionNames}
          selectedOption={selectedMission.id}
          onChange={(newSelectedMission) => {
            setSelectedMission(
              props.missions.find(
                (mission) => mission.id === newSelectedMission
              ) as PatrolMission
            );
          }}
        />
        <EditorTextInputBox
          caption={"Assigned Units"}
          currentText={props.aircraft
            .filter((aircraft) =>
              selectedMission.assignedUnitIds.includes(aircraft.id)
            )
            .map((aircraft) => aircraft.name)
            .join(", ")}
          onChange={() => {}}
        />
        <EditorTextInputBox
          caption={"Assigned Area"}
          currentText={selectedMission.assignedArea
            .map(
              (referencePoint) =>
                `[${referencePoint[1].toFixed(2)}, ${referencePoint[0].toFixed(
                  2
                )}]`
            )
            .join(", ")}
          onChange={() => {}}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.deleteMissionButton}
          onClick={() => props.deleteMission(selectedMission.id)}
        >
          Delete
        </Button>
      </CardContent>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "20em",
        top: "5em",
        zIndex: "1001",
      }}
    >
      <Draggable>
        <Card sx={cardStyle}>
          <CardHeader
            title={"Mission Viewer"}
            classes={{
              root: classes.cardHeaderRoot,
            }}
            titleTypographyProps={{ variant: "body1" }}
            avatar={
              <Button
                onClick={props.handleCloseOnMap}
                style={{ position: "absolute", top: "0", right: "0" }}
              >
                X
              </Button>
            }
          ></CardHeader>
          {cardContent()}
        </Card>
      </Draggable>
    </div>
  );
};

export default MissionViewer;
