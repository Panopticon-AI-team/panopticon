import React, { useState } from "react";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { colorPalette } from "@/utils/constants";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CardContent,
  FormControl,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import PatrolMission from "@/game/mission/PatrolMission";
import Aircraft from "@/game/units/Aircraft";
import ReferencePoint from "@/game/units/ReferencePoint";
import StrikeMission from "@/game/mission/StrikeMission";
import { Target } from "@/game/engine/weaponEngagement";
import SelectField from "@/gui/shared/ui/SelectField";
import TextField from "@/gui/shared/ui/TextField";
import { Mission } from "@/game/Game";

interface MissionEditorCardProps {
  missions: Mission[];
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

const cardContentStyle = {
  display: "flex",
  flexDirection: "column",
  rowGap: "10px",
};

const closeButtonStyle = {
  bottom: 5.5,
};

const cardStyle = {
  minWidth: "400px",
  maxWidth: "400px",
  minHeight: "200px",
  backgroundColor: colorPalette.lightGray,
  boxShadow: "none",
  borderRadius: "10px",
};

const cardHeaderStyle = {
  backgroundColor: colorPalette.white,
  color: "black",
  height: "50px",
};

const bottomButtonsStackStyle = {
  display: "flex",
  justifyContent: "center",
};

const editorButtonStyle = {
  color: colorPalette.white,
};

const parseSelectedMissionType = (selectedMission: Mission): string => {
  return selectedMission instanceof PatrolMission ? "Patrol" : "Strike";
};

const MissionEditorCard = (props: MissionEditorCardProps) => {
  const nodeRef = React.useRef(null);
  const [selectedMission, setSelectedMission] = useState<Mission>(
    props.missions[0]
  );
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
      ? selectedMission.assignedArea.map((point) => point.id)
      : []
  );
  const [selectedTargets, setSelectedTargets] = useState<string[]>(
    selectedMission instanceof StrikeMission
      ? selectedMission.assignedTargetIds
      : []
  );
  const [missionName, setMissionName] = useState<string>(selectedMission.name);

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

  const handleClose = () => {
    props.handleCloseOnMap();
  };

  const handleMissionChange = (newSelectedMission: string) => {
    const searchedSelectedMission = props.missions.find(
      (mission) => mission.id === newSelectedMission
    );

    if (!searchedSelectedMission) return;

    setSelectedMission(searchedSelectedMission);
    setMissionName(searchedSelectedMission.name);
    setSelectedAircraft(searchedSelectedMission.assignedUnitIds);

    if (searchedSelectedMission instanceof PatrolMission) {
      setSelectedReferencePoints(
        searchedSelectedMission.assignedArea.map((point) => point.id)
      );
    } else if (searchedSelectedMission instanceof StrikeMission) {
      setSelectedTargets(searchedSelectedMission.assignedTargetIds);
    }

    setSelectedMissionType(parseSelectedMissionType(searchedSelectedMission));
  };

  const patrolMissionEditorContent = (
    sortedReferencePoints: ReferencePoint[]
  ) => {
    return (
      <FormControl fullWidth sx={{ mb: 2 }}>
        <SelectField
          id="mission-editor-area-selector"
          labelId="mission-editor-area-selector-label"
          label="Area"
          selectItems={sortedReferencePoints.map((item) => {
            return {
              name: item.name,
              value: item.id,
            };
          })}
          value={selectedReferencePoints}
          onChange={(value) => {
            setSelectedReferencePoints(value as string[]);
          }}
          multiple
        />
      </FormControl>
    );
  };

  const StrikeMissionEditorContent = (sortedTargets: Target[]) => {
    return (
      <FormControl fullWidth sx={{ mb: 2 }}>
        <SelectField
          id="mission-editor-target-selector"
          labelId="mission-editor-target-selector-label"
          label="Target"
          selectItems={sortedTargets.map((item) => {
            return {
              name: item.name,
              value: item.id,
            };
          })}
          value={selectedTargets}
          onChange={(value) => {
            setSelectedTargets([value] as string[]);
          }}
        />
      </FormControl>
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
      <CardContent sx={cardContentStyle}>
        {/** Missions Select Field */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <SelectField
            id="mission-editor-mission-selector"
            label="Mission"
            labelId="mission-editor-mission-selector-label"
            selectItems={missionNames.map((item, index) => {
              return {
                name: item,
                value: missionIds[index],
              };
            })}
            value={selectedMission.id}
            onChange={(value) => {
              handleMissionChange(value as string);
            }}
          />
        </FormControl>
        {/** Mission Type Select Field */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <SelectField
            id="mission-editor-type-selector"
            label="Type"
            labelId="mission-editor-type-selector-label"
            selectItems={missionTypes.map((item) => {
              return {
                name: item,
                value: item,
              };
            })}
            value={selectedMissionType}
            onChange={() => {}}
          />
        </FormControl>
        {/** Mission Name Text Field */}
        <TextField
          id="mission-name"
          label="Name"
          value={missionName}
          onChange={(event) => {
            setMissionName(event.target.value);
          }}
        />
        {/** Mission Unit Select Field */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <SelectField
            id="mission-editor-unit-selector"
            label="Units"
            labelId="mission-editor-unit-selector-label"
            selectItems={sortedAircraft.map((item) => {
              return {
                name: item.name,
                value: item.id,
              };
            })}
            value={selectedAircraft}
            onChange={(value) => {
              setSelectedAircraft(value as string[]);
            }}
            multiple
          />
        </FormControl>
        {/** Mission Specific Select Fields: Patrol Or Strike */}
        {missionSpecificComponent}
        {/* Form Action/Buttons */}
        <Stack sx={bottomButtonsStackStyle} direction="row" spacing={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleUpdateMission}
            sx={editorButtonStyle}
          >
            UPDATE
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleDeleteMission}
            sx={editorButtonStyle}
          >
            Delete
          </Button>
        </Stack>
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
      <Draggable nodeRef={nodeRef}>
        <Card ref={nodeRef} sx={cardStyle}>
          <CardHeader
            sx={cardHeaderStyle}
            action={
              <IconButton
                type="button"
                sx={closeButtonStyle}
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon color="error" />
              </IconButton>
            }
            title={
              <Typography variant="body1" component="h1" sx={{ pl: 1 }}>
                Mission Editor
              </Typography>
            }
          />
          {cardContent()}
        </Card>
      </Draggable>
    </div>
  );
};

export default MissionEditorCard;
