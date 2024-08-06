import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ReferencePoint from "../../../game/units/ReferencePoint";
import FeaturePopup from "../FeaturePopup";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import TelegramIcon from "@mui/icons-material/Telegram";

interface ReferencePointCardProps {
  referencePoint: ReferencePoint;
  handleTeleportUnit: (unitId: string) => void;
  handleDeleteReferencePoint: (referencePointId: string) => void;
  handleCloseOnMap: () => void;
  handleEditReferencePoint: (
    referencePointId: string,
    referencePointName: string
  ) => void;
  anchorPositionTop: number;
  anchorPositionLeft: number;
}

export default function ReferencePointCard(
  props: Readonly<ReferencePointCardProps>
) {
  const [editing, setEditing] = useState(false);
  const [tempEditData, setTempEditData] = useState({
    name: props.referencePoint.name,
  });

  const _handleDeleteReferencePoint = () => {
    props.handleCloseOnMap();
    props.handleDeleteReferencePoint(props.referencePoint.id);
  };

  const _handleTeleportReferencePoint = () => {
    props.handleCloseOnMap();
    props.handleTeleportUnit(props.referencePoint.id);
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const handleSaveEditedReferencePoint = () => {
    props.handleEditReferencePoint(props.referencePoint.id, tempEditData.name);
    toggleEdit();
  };

  const _handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    switch (event.target.id) {
      case "referencePoint-name-text-field": {
        setTempEditData({ ...tempEditData, name: event.target.value });
        break;
      }
      case "default": {
        break;
      }
    }
  };

  const referencePointDataContent = (
    <>
      <Typography variant="h5" component="div">
        {props.referencePoint.name}
      </Typography>
      <Typography variant="h6">
        Coordinates: {props.referencePoint.latitude.toFixed(2)},{" "}
        {props.referencePoint.longitude.toFixed(2)}
      </Typography>
      <Typography variant="h6">
        Altitude: {props.referencePoint.altitude.toFixed(2)} FT
      </Typography>
      <Typography variant="h6">
        Side: {props.referencePoint.sideName}
      </Typography>
    </>
  );

  const editingContent = () => {
    const inputStyle = {
      input: {
        color: "white",
      },
    };
    const inputLabelStyle = {
      style: {
        color: "white",
      },
    };
    return (
      <form>
        <Stack spacing={1} direction="column">
          <Typography variant="h5" component="div">
            EDIT POINT
          </Typography>
          <TextField
            autoComplete="off"
            id="referencePoint-name-text-field"
            label="Name"
            defaultValue={props.referencePoint.name}
            onChange={_handleTextFieldChange}
            variant="outlined"
            sx={inputStyle}
            InputLabelProps={inputLabelStyle}
          />
        </Stack>
      </form>
    );
  };

  const defaultCardActions = (
    <Stack spacing={1} direction="column">
      <Stack spacing={1} direction="row">
        <Button
          variant="contained"
          size="small"
          onClick={_handleTeleportReferencePoint}
          startIcon={<TelegramIcon />}
        >
          TELEPORT
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={toggleEdit}
          startIcon={<EditIcon />}
        >
          EDIT
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={_handleDeleteReferencePoint}
          startIcon={<DeleteIcon />}
        >
          DELETE
        </Button>
      </Stack>
    </Stack>
  );

  const editingCardActions = (
    <Stack spacing={1} direction="column">
      <Stack spacing={1} direction="row">
        <Button
          variant="contained"
          size="small"
          onClick={handleSaveEditedReferencePoint}
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={toggleEdit}
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );

  const referencePointCard = (
    <Box sx={{ minWidth: 150 }}>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: "#282c34",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "left",
        }}
      >
        <CardContent>
          {!editing && referencePointDataContent}
          {editing && editingContent()}
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!editing && defaultCardActions}
          {editing && editingCardActions}
        </CardActions>
      </Card>
    </Box>
  );

  return (
    <FeaturePopup
      anchorPositionTop={props.anchorPositionTop}
      anchorPositionLeft={props.anchorPositionLeft}
      content={referencePointCard}
      handleCloseOnMap={props.handleCloseOnMap}
    ></FeaturePopup>
  );
}
