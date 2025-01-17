import React, { useState } from "react";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { makeStyles } from "@material-ui/styles";
import { colorPalette } from "../../../utils/constants";
import EditorSelector from "./EditorSelector";
import EditorTextInputBox from "./EditorTextInputBox";
import { Button, Stack } from "@mui/material";
import PatrolMission from "../../../game/mission/PatrolMission";
import Aircraft from "../../../game/units/Aircraft";
import ReferencePoint from "../../../game/units/ReferencePoint";
import StrikeMission from "../../../game/mission/StrikeMission";
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
  bottomButtonsStack: {
    justifyContent: "center",
  },
  editorButton: {
    color: colorPalette.white,
    borderRadius: "10px",
  },
  closeButton: { position: "absolute", top: "0", right: "0" },
});

interface MissionEditorProps {
  missions: (PatrolMission | StrikeMission)[];
  aircraft: Aircraft[];
  referencePoints: ReferencePoint[];
  targets: Target[];
  updatePatrolMission: (
    missionId: string,
    missionName: string,
    assignedUnits: string[],
    referencePoints: string[]
  ) => void;
  updateStrikeMission: (
    missionId: string,
    missionName: string,
    assignedUnits: string[],
    targetIds: string[]
  ) => void;
  deleteMission: (missionId: string) => void;
  handleCloseOnMap: () => void;
}

const missionTypes = ["Patrol", "Strike"];

const findReferencePointsForAssignedArea = (
  area: number[][],
  referencePoints: ReferencePoint[]
): string[] => {
  return area.map((coordinates) => {
    const searchedReferencePoint = referencePoints.find(
      (referencePoint) =>
        referencePoint.latitude === coordinates[0] &&
        referencePoint.longitude === coordinates[1]
    );
    return searchedReferencePoint ? searchedReferencePoint.id : "";
  });
};

const parseSelectedMissionType = (
  selectedMission: PatrolMission | StrikeMission
): string => {
  return selectedMission instanceof PatrolMission ? "Patrol" : "Strike";
};

const MissionEditor = (props: MissionEditorProps) => {
  const classes = useStyles();
  const [selectedMission, setSelectedMission] = useState<
    PatrolMission | StrikeMission
  >(props.missions[0]);
  const [selectedMissionType, setSelectedMissionType] = useState<string>(
    parseSelectedMissionType(selectedMission)
  );
  const [selectedAircraft, setSelectedAircraft] = useState<string[]>(
    selectedMission.assignedUnitIds
  );
  const [selectedReferencePoints, setSelectedReferencePoints] = useState<
    string[]
  >(
    selectedMission instanceof PatrolMission
      ? findReferencePointsForAssignedArea(
          selectedMission.assignedArea,
          props.referencePoints
        )
      : []
  );
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [missionName, setMissionName] = useState<string>(selectedMission.name);

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
      selectedMission instanceof PatrolMission &&
      selectedReferencePoints.length < 3
    ) {
      alert("Please select at least three reference points to define an area");
      return false;
    }
    if (
      selectedMission instanceof StrikeMission &&
      selectedTargets.length === 0
    ) {
      alert("Please select at least one target");
      return false;
    }
    return true;
  };

  const handleDeleteMission = () => {
    props.deleteMission(selectedMission.id);
    props.handleCloseOnMap();
  };

  const handleUpdateMission = () => {
    if (!validateMissionPropertiesInput()) return;
    if (selectedMissionType === "Patrol") {
      props.updatePatrolMission(
        selectedMission.id,
        missionName,
        selectedAircraft,
        selectedReferencePoints
      );
    } else if (selectedMissionType === "Strike") {
      props.updateStrikeMission(
        selectedMission.id,
        missionName,
        selectedAircraft,
        selectedTargets
      );
    }
    props.handleCloseOnMap();
  };

  const patrolMissionEditorContent = (
    sortedReferencePoints: ReferencePoint[]
  ) => {
    return (
      <EditorSelector
        selectId={"mission-editor-area-selector"}
        caption={"Area"}
        optionIds={sortedReferencePoints.map((point) => point.id)}
        optionNames={sortedReferencePoints.map((point) => point.name)}
        selectedOption={selectedReferencePoints}
        onChange={() => {
          const pointsSelector = document.getElementById(
            "mission-editor-area-selector"
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

  const StrikeMissionEditorContent = (sortedTargets: Target[]) => {
    return (
      <EditorSelector
        selectId={"mission-editor-target-selector"}
        caption={"Target"}
        optionIds={sortedTargets.map((target) => target.id)}
        optionNames={sortedTargets.map((target) => target.name)}
        selectedOption={selectedTargets}
        onChange={() => {
          const pointsSelector = document.getElementById(
            "mission-editor-target-selector"
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
    const missionIds = props.missions.map((mission) => mission.id);
    const missionNames = props.missions.map((mission) => mission.name);
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
      missionSpecificComponent = patrolMissionEditorContent(
        sortedReferencePoints
      );
    } else if (selectedMissionType === "Strike") {
      missionSpecificComponent = StrikeMissionEditorContent(sortedTargets);
    }

    return (
      <CardContent classes={{ root: classes.cardContentRoot }}>
        <EditorSelector
          selectId={"mission-editor-mission-selector"}
          caption={"Mission"}
          optionIds={missionIds}
          optionNames={missionNames}
          selectedOption={selectedMission.id}
          onChange={(newSelectedMission) => {
            const searchedSelectedMission = props.missions.find(
              (mission) => mission.id === newSelectedMission
            );
            if (!searchedSelectedMission) return;
            setSelectedMission(searchedSelectedMission);
            setMissionName(searchedSelectedMission.name);
            setSelectedAircraft(searchedSelectedMission.assignedUnitIds);
            searchedSelectedMission instanceof PatrolMission &&
              setSelectedReferencePoints(
                findReferencePointsForAssignedArea(
                  searchedSelectedMission.assignedArea,
                  props.referencePoints
                )
              );
            searchedSelectedMission instanceof StrikeMission &&
              setSelectedTargets(searchedSelectedMission.assignedTargetIds);
            setSelectedMissionType(
              parseSelectedMissionType(searchedSelectedMission)
            );
          }}
        />
        <EditorSelector
          selectId={"mission-editor-type-selector"}
          caption={"Type"}
          optionIds={missionTypes}
          optionNames={missionTypes}
          selectedOption={selectedMissionType}
          onChange={() => {}}
        />
        <EditorTextInputBox
          caption={"Name"}
          currentText={missionName}
          onChange={(newMissionName) => {
            setMissionName(newMissionName);
          }}
        />
        <EditorSelector
          selectId={"mission-editor-unit-selector"}
          caption={"Units"}
          optionIds={sortedAircraft.map((unit) => unit.id)}
          optionNames={sortedAircraft.map((unit) => unit.name)}
          selectedOption={selectedAircraft}
          onChange={() => {
            const aircraftSelector = document.getElementById(
              "mission-editor-unit-selector"
            ) as HTMLSelectElement;
            const selectedOptions = Array.from(
              aircraftSelector.selectedOptions
            ).map((option) => option.value);
            setSelectedAircraft(selectedOptions);
          }}
          multiple={true}
        />
        {missionSpecificComponent}
        <Stack
          direction="row"
          spacing={2}
          className={classes.bottomButtonsStack}
        >
          <Button
            variant="contained"
            color="primary"
            className={classes.editorButton}
            onClick={handleUpdateMission}
          >
            UPDATE
          </Button>
          <Button
            variant="contained"
            color="error"
            className={classes.editorButton}
            onClick={handleDeleteMission}
          >
            Delete
          </Button>
        </Stack>
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
            title={"Mission Editor"}
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

export default MissionEditor;
