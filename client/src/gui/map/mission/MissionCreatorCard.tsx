import { useRef, useState } from "react";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import { colorPalette } from "@/utils/constants";
import Aircraft from "@/game/units/Aircraft";
import ReferencePoint from "@/game/units/ReferencePoint";
import { Target } from "@/game/engine/weaponEngagement";
import {
  Button,
  CardContent,
  CardHeader,
  FormControl,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SelectField from "@/gui/shared/ui/SelectField";
import TextField from "@/gui/shared/ui/TextField";

interface MissionCreatorCardProps {
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

const cardContentStyle = {
  display: "flex",
  flexDirection: "column",
  rowGap: "10px",
};

const closeButtonStyle = {
  bottom: 5.5,
};

const cardHeaderStyle = {
  backgroundColor: colorPalette.white,
  color: "black",
  height: "20px",
};

const cardStyle = {
  minWidth: "400px",
  maxWidth: "400px",
  minHeight: "200px",
  backgroundColor: colorPalette.lightGray,
  boxShadow: "none",
  borderRadius: "10px",
};

const MissionCreatorCard = (props: MissionCreatorCardProps) => {
  const nodeRef = useRef(null);
  const [selectedMissionType, setSelectedMissionType] = useState<
    "Patrol" | "Strike" // TODO: Create enum for mission types
  >("Patrol");
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
      <FormControl fullWidth sx={{ mb: 2 }}>
        <SelectField
          id="mission-creator-area-selector"
          labelId="mission-creator-area-selector-label"
          label="Area"
          value={selectedReferencePoints}
          selectItems={sortedReferencePoints.map((item) => {
            return {
              name: item.name,
              value: item.id,
            };
          })}
          onChange={(value) => {
            setSelectedReferencePoints(value as string[]);
          }}
          multiple
        />
      </FormControl>
    );
  };

  const StrikeMissionCreatorContent = (sortedTargets: Target[]) => {
    return (
      <FormControl fullWidth sx={{ mb: 2 }}>
        <SelectField
          id="mission-creator-target-selector"
          labelId="mission-creator-target-selector-label"
          label="Target"
          value={selectedTargets}
          selectItems={sortedTargets.map((item) => {
            return {
              name: item.name,
              value: item.id,
            };
          })}
          onChange={(value) => {
            setSelectedTargets([value] as string[]);
          }}
        />
      </FormControl>
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
      <CardContent sx={cardContentStyle}>
        {/** Mission Type Select Field */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <SelectField
            id="mission-creator-type-selector"
            selectItems={[
              { name: "Patrol", value: "Patrol" },
              { name: "Strike", value: "Strike" },
            ]}
            labelId="mission-creator-type-selector-label"
            label="Mission Type"
            value={selectedMissionType}
            onChange={(value) => {
              setSelectedMissionType(value as "Patrol" | "Strike");
            }}
          />
        </FormControl>
        {/** Mission Name Text Field */}
        <TextField
          id="mission-name"
          label="Mission Name"
          value={missionName}
          onChange={(event) => {
            setMissionName(event.target.value);
          }}
        />
        {/** Mission Unit Select Field */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <SelectField
            id="mission-creator-unit-selector"
            labelId="mission-creator-unit-selector-label"
            label="Units"
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
        {/** Create Mission Button */}
        <Stack spacing={2} direction={"row"} sx={{ justifyContent: "center" }}>
          <Button onClick={handleCreateMission} fullWidth variant="contained">
            Create
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
};

export default MissionCreatorCard;
