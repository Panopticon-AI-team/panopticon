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
import { Target } from "../../../game/engine/weaponEngagement";

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
  targets: Target[];
  handleCloseOnMap: () => void;
  createPatrolMission: (
    missionName: string,
    assignedUnits: string[],
    referencePoints: string[]
  ) => void;
  createStrikeMission: (
    missionName: string,
    assignedUnits: string[],
    targetIds: string[]
  ) => void;
}

const missionTypes = ["Patrol", "Strike"];

const MissionCreator = (props: MissionCreatorProps) => {
  const classes = useStyles();
  const [selectedMissionType, setSelectedMissionType] =
    useState<string>("Patrol");
  const [selectedAircraft, setSelectedAircraft] = useState<string[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([
    [...props.targets].sort((a, b) => {
      return a.name.localeCompare(b.name);
    })[0]?.id,
  ]);
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
    if (selectedMissionType === "Strike" && selectedTargets.length === 0) {
      alert("Please select at least one target");
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

  const handleCreateStrikeMission = () => {
    if (!validateMissionPropertiesInput()) return;
    props.createStrikeMission(missionName, selectedAircraft, selectedTargets);
    props.handleCloseOnMap();
  };

  const handleCreateMission = () => {
    if (selectedMissionType === "Patrol") {
      handleCreatePatrolMission();
    } else if (selectedMissionType === "Strike") {
      handleCreateStrikeMission();
    }
  };

  const patrolMissionCreatorContent = (
    sortedReferencePoints: ReferencePoint[]
  ) => {
    return (
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
    );
  };

  const StrikeMissionCreatorContent = (sortedTargets: Target[]) => {
    return (
      <EditorSelector
        selectId={"mission-creator-target-selector"}
        caption={"Target"}
        optionIds={sortedTargets.map((target) => target.id)}
        optionNames={sortedTargets.map((target) => target.name)}
        selectedOption={selectedTargets}
        onChange={() => {
          const pointsSelector = document.getElementById(
            "mission-creator-target-selector"
          ) as HTMLSelectElement;
          const selectedOptions = Array.from(
            pointsSelector.selectedOptions
          ).map((option) => option.value);
          setSelectedTargets(selectedOptions);
        }}
        multiple={false}
      />
    );
  };

  const cardContent = () => {
    const sortedAircraft = [...props.aircraft].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    const sortedReferencePoints = [...props.referencePoints].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    const sortedTargets = [...props.targets].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    let missionSpecificComponent = null;
    if (selectedMissionType === "Patrol") {
      missionSpecificComponent = patrolMissionCreatorContent(
        sortedReferencePoints
      );
    } else if (selectedMissionType === "Strike") {
      missionSpecificComponent = StrikeMissionCreatorContent(sortedTargets);
    }

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
        {missionSpecificComponent}
        <Button
          variant="contained"
          color="primary"
          classes={{ root: classes.createButton }}
          onClick={handleCreateMission}
        >
          Create
        </Button>
      </CardContent>
    );
  };

  // this is needed because of the Draggable component
  // If running in React Strict mode, ReactDOM.findDOMNode() is deprecated.
  // Unfortunately, in order for <Draggable> to work properly, we need raw access to the underlying DOM node.
  const nodeRef = React.useRef(null);

  return (
    <div
      style={{
        position: "absolute",
        left: "20em",
        top: "5em",
        zIndex: "1001",
      }}
    >
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment  */}
      {/* @ts-ignore */}
      <Draggable nodeRef={nodeRef}>
        <Card sx={cardStyle} ref={nodeRef}>
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
