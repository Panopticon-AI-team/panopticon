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
import Aircraft from "../../../game/units/Aircraft";
import ReferencePoint from "../../../game/units/ReferencePoint";

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
  createButton: {
    color: colorPalette.white,
    borderRadius: "10px",
  },
  closeButton: { position: "absolute", top: "0", right: "0" },
});

export type Object = {
  id: string;
  name: string;
};

interface MissionCreatorProps {
  aircraft: Aircraft[];
  referencePoints: ReferencePoint[];
  handleCloseOnMap: () => void;
  createPatrolMission: (
    missionName: string,
    assignedUnits: string[],
    referencePoints: string[]
  ) => void;
}

const missionTypes = ["Patrol"];

const MissionCreator = (props: MissionCreatorProps) => {
  const classes = useStyles();
  const [selectedMissionType, setSelectedMissionType] =
    useState<string>("Patrol");
  const [selectedAircraft, setSelectedAircraft] = useState<string[]>([]);
  const [selectedReferencePoints, setSelectedReferencePoints] = useState<
    string[]
  >([]);
  const [missionName, setMissionName] = useState<string>("");

  const cardStyle = {
    minWidth: "400px",
    minHeight: "200px",
    backgroundColor: colorPalette.lightGray,
    boxShadow: "none",
    borderRadius: "10px",
  };

  const validateMissionPropertiesInput = () => {
    if (missionName === "") {
      alert("Mission name cannot be empty");
      return false;
    }
    if (selectedAircraft.length === 0) {
      alert("Please select at least one unit");
      return false;
    }
    if (
      selectedMissionType === "Patrol" &&
      selectedReferencePoints.length < 3
    ) {
      alert("Please select at least three reference points to define an area");
      return false;
    }
    return true;
  };

  const handleCreatePatrolMission = () => {
    if (!validateMissionPropertiesInput()) return;
    props.createPatrolMission(
      missionName,
      selectedAircraft,
      selectedReferencePoints
    );
    props.handleCloseOnMap();
  };

  const cardContent = () => {
    const sortedAircraft = [...props.aircraft].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    const sortedReferencePoints = [...props.referencePoints].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return (
      <CardContent classes={{ root: classes.cardContentRoot }}>
        <EditorSelector
          selectId={"mission-creator-type-selector"}
          caption={"Type"}
          optionIds={missionTypes}
          optionNames={missionTypes}
          selectedOption={selectedMissionType}
          onChange={(option) => {
            setSelectedMissionType(option);
          }}
        />
        <EditorTextInputBox
          caption={"Name"}
          currentText={missionName}
          onChange={(newMissionName) => {
            setMissionName(newMissionName);
          }}
        />
        <EditorSelector
          selectId={"mission-creator-unit-selector"}
          caption={"Units"}
          optionIds={sortedAircraft.map((unit) => unit.id)}
          optionNames={sortedAircraft.map((unit) => unit.name)}
          selectedOption={selectedAircraft}
          onChange={() => {
            const aircraftSelector = document.getElementById(
              "mission-creator-unit-selector"
            ) as HTMLSelectElement;
            const selectedOptions = Array.from(
              aircraftSelector.selectedOptions
            ).map((option) => option.value);
            setSelectedAircraft(selectedOptions);
          }}
          multiple={true}
        />
        <EditorSelector
          selectId={"mission-creator-area-selector"}
          caption={"Area"}
          optionIds={sortedReferencePoints.map((point) => point.id)}
          optionNames={sortedReferencePoints.map((point) => point.name)}
          selectedOption={selectedReferencePoints}
          onChange={() => {
            const pointsSelector = document.getElementById(
              "mission-creator-area-selector"
            ) as HTMLSelectElement;
            const selectedOptions = Array.from(
              pointsSelector.selectedOptions
            ).map((option) => option.value);
            setSelectedReferencePoints(selectedOptions);
          }}
          multiple={true}
        />
        <Button
          variant="contained"
          color="primary"
          classes={{ root: classes.createButton }}
          onClick={handleCreatePatrolMission}
        >
          Create
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
            title={"Mission Creator"}
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

export default MissionCreator;
