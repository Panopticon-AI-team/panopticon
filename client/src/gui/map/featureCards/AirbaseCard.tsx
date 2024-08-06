import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Airbase from "../../../game/units/Airbase";
import FeaturePopup from "../FeaturePopup";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import FlightIcon from "@mui/icons-material/Flight";
import TelegramIcon from "@mui/icons-material/Telegram";

interface AirbaseCardProps {
  airbase: Airbase;
  handleAddAircraft: (airbaseId: string) => void;
  handleLaunchAircraft: (airbaseId: string) => void;
  handleTeleportUnit: (unitId: string) => void;
  handleDeleteAirbase: (airbaseId: string) => void;
  handleCloseOnMap: () => void;
  handleEditAirbase: (airbaseId: string, airbaseName: string) => void;
  anchorPositionTop: number;
  anchorPositionLeft: number;
}

export default function AirbaseCard(props: Readonly<AirbaseCardProps>) {
  const [editing, setEditing] = useState(false);
  const [aircraftCount, setAircraftCount] = useState(
    props.airbase.aircraft.length
  );
  const [tempEditData, setTempEditData] = useState({
    name: props.airbase.name,
  });

  const _handleAddAircraft = () => {
    props.handleAddAircraft(props.airbase.id);
    setAircraftCount(props.airbase.aircraft.length);
  };

  const _handleLaunchAircraft = () => {
    props.handleLaunchAircraft(props.airbase.id);
    setAircraftCount(props.airbase.aircraft.length);
  };

  const _handleDeleteAirbase = () => {
    props.handleCloseOnMap();
    props.handleDeleteAirbase(props.airbase.id);
  };

  const _handleTeleportAirbase = () => {
    props.handleCloseOnMap();
    props.handleTeleportUnit(props.airbase.id);
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const handleSaveEditedAirbase = () => {
    props.handleEditAirbase(props.airbase.id, tempEditData.name);
    toggleEdit();
  };

  const _handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    switch (event.target.id) {
      case "airbase-name-text-field": {
        setTempEditData({ ...tempEditData, name: event.target.value });
        break;
      }
      case "default": {
        break;
      }
    }
  };

  const airbaseDataContent = (
    <>
      <Typography variant="h5" component="div">
        {props.airbase.name}
      </Typography>
      <Typography variant="h6">
        Coordinates: {props.airbase.latitude.toFixed(2)},{" "}
        {props.airbase.longitude.toFixed(2)}
      </Typography>
      <Typography variant="h6">
        Altitude: {props.airbase.altitude.toFixed(2)} FT
      </Typography>
      <Typography variant="h6">Side: {props.airbase.sideName}</Typography>
      <Typography variant="h6">Aircraft Quantity: {aircraftCount}</Typography>
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
            EDIT AIRBASE
          </Typography>
          <TextField
            autoComplete="off"
            id="airbase-name-text-field"
            label="Name"
            defaultValue={props.airbase.name}
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
          onClick={_handleAddAircraft}
          startIcon={<AddIcon />}
        >
          Add aicraft
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={_handleLaunchAircraft}
          startIcon={<FlightIcon />}
        >
          Launch aicraft
        </Button>
      </Stack>
      <Stack spacing={1} direction="row">
        <Button
          variant="contained"
          size="small"
          onClick={_handleTeleportAirbase}
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
          onClick={_handleDeleteAirbase}
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
          onClick={handleSaveEditedAirbase}
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

  const airbaseCard = (
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
          {!editing && airbaseDataContent}
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
      content={airbaseCard}
      handleCloseOnMap={props.handleCloseOnMap}
    ></FeaturePopup>
  );
}
