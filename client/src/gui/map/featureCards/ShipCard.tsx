import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Ship from "../../../game/units/Ship";
import FeaturePopup from "../FeaturePopup";
import DeleteIcon from "@mui/icons-material/Delete";
import PinDropIcon from "@mui/icons-material/PinDrop";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import FlightIcon from "@mui/icons-material/Flight";
import TelegramIcon from "@mui/icons-material/Telegram";

interface ShipCardProps {
  ship: Ship;
  handleAddAircraft: (shipId: string) => void;
  handleLaunchAircraft: (shipId: string) => void;
  handleDeleteShip: (shipId: string) => void;
  handleMoveShip: (shipId: string) => void;
  handleShipAttack: (shipId: string) => void;
  handleTeleportUnit: (unitId: string) => void;
  handleEditShip: (
    shipId: string,
    shipName: string,
    shipClassName: string,
    shipSpeed: number,
    shipWeaponQuantity: number,
    shipCurrentFuel: number,
    shipRange: number
  ) => void;
  handleCloseOnMap: () => void;
  anchorPositionTop: number;
  anchorPositionLeft: number;
}

export default function ShipCard(props: Readonly<ShipCardProps>) {
  const [editing, setEditing] = useState(false);
  const [tempEditData, setTempEditData] = useState({
    name: props.ship.name,
    className: props.ship.className,
    speed: props.ship.speed,
    currentFuel: props.ship.currentFuel,
    range: props.ship.range,
    weaponQuantity: props.ship.getTotalWeaponQuantity(),
  });
  const [aircraftCount, setAircraftCount] = useState(
    props.ship.aircraft.length
  );

  const _handleAddAircraft = () => {
    props.handleAddAircraft(props.ship.id);
    setAircraftCount(props.ship.aircraft.length);
  };

  const _handleLaunchAircraft = () => {
    props.handleLaunchAircraft(props.ship.id);
    setAircraftCount(props.ship.aircraft.length);
  };

  const _handleDeleteShip = () => {
    props.handleCloseOnMap();
    props.handleDeleteShip(props.ship.id);
  };

  const _handleMoveShip = () => {
    props.handleCloseOnMap();
    props.handleMoveShip(props.ship.id);
  };

  const _handleShipAttack = () => {
    props.handleCloseOnMap();
    props.handleShipAttack(props.ship.id);
  };

  const _handleTeleportShip = () => {
    props.handleCloseOnMap();
    props.handleTeleportUnit(props.ship.id);
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const handleSaveEditedShip = () => {
    props.handleEditShip(
      props.ship.id,
      tempEditData.name,
      tempEditData.className,
      tempEditData.speed,
      tempEditData.weaponQuantity,
      tempEditData.currentFuel,
      tempEditData.range
    );
    toggleEdit();
  };

  const _handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    switch (event.target.id) {
      case "ship-name-text-field": {
        setTempEditData({ ...tempEditData, name: event.target.value });
        break;
      }
      case "ship-type-text-field": {
        setTempEditData({ ...tempEditData, className: event.target.value });
        break;
      }
      case "ship-speed-text-field": {
        const newSpeed = parseInt(event.target.value);
        if (newSpeed) setTempEditData({ ...tempEditData, speed: newSpeed });
        break;
      }
      case "ship-weapon-quantity-text-field": {
        const newWeaponCount = parseInt(event.target.value);
        if (newWeaponCount)
          setTempEditData({ ...tempEditData, weaponQuantity: newWeaponCount });
        break;
      }
      case "ship-current-fuel-text-field": {
        const newFuel = parseInt(event.target.value);
        if (newFuel) setTempEditData({ ...tempEditData, currentFuel: newFuel });
        break;
      }
      case "ship-range-text-field": {
        const newRange = parseInt(event.target.value);
        if (newRange) setTempEditData({ ...tempEditData, range: newRange });
        break;
      }
      case "default": {
        break;
      }
    }
  };

  const shipDataContent = (
    <>
      <Typography variant="h5" component="div">
        {props.ship.name}
      </Typography>
      <Typography variant="h6">Type: {props.ship.className}</Typography>
      <Typography variant="h6">
        Coordinates: {props.ship.latitude.toFixed(2)},{" "}
        {props.ship.longitude.toFixed(2)}
      </Typography>
      <Typography variant="h6">
        Heading: {props.ship.heading.toFixed(2)}
      </Typography>
      <Typography variant="h6">
        Speed: {props.ship.speed.toFixed(0)} KTS
      </Typography>
      <Typography variant="h6">
        Range: {props.ship.range.toFixed(0)} NM
      </Typography>
      <Typography variant="h6">
        Fuel: {props.ship.currentFuel.toFixed(0)} /{" "}
        {props.ship.maxFuel.toFixed(0) + " LBS"}
      </Typography>
      <Typography variant="h6">Side: {props.ship.sideName}</Typography>
      <Typography variant="h6">
        Weapon Quantity: {props.ship.getTotalWeaponQuantity()}
      </Typography>
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
            EDIT SHIP
          </Typography>
          <TextField
            autoComplete="off"
            id="ship-name-text-field"
            label="Name"
            defaultValue={props.ship.name}
            onChange={_handleTextFieldChange}
            variant="outlined"
            sx={inputStyle}
            InputLabelProps={inputLabelStyle}
          />
          <TextField
            autoComplete="off"
            id="ship-type-text-field"
            label="Type"
            defaultValue={props.ship.className}
            onChange={_handleTextFieldChange}
            variant="outlined"
            sx={inputStyle}
            InputLabelProps={inputLabelStyle}
          />
          <TextField
            autoComplete="off"
            id="ship-speed-text-field"
            label="Speed"
            defaultValue={props.ship.speed.toFixed(0)}
            onChange={_handleTextFieldChange}
            variant="outlined"
            sx={inputStyle}
            InputLabelProps={inputLabelStyle}
          />
          <TextField
            autoComplete="off"
            id="ship-weapon-quantity-text-field"
            label="Weapon Quantity"
            defaultValue={props.ship.getTotalWeaponQuantity().toString()}
            onChange={_handleTextFieldChange}
            variant="outlined"
            sx={inputStyle}
            InputLabelProps={inputLabelStyle}
          />
          <TextField
            autoComplete="off"
            id="ship-current-fuel-text-field"
            label="Current Fuel"
            defaultValue={props.ship.currentFuel.toFixed(0)}
            onChange={_handleTextFieldChange}
            variant="outlined"
            sx={inputStyle}
            InputLabelProps={inputLabelStyle}
          />
          <TextField
            autoComplete="off"
            id="ship-range-text-field"
            label="Range"
            defaultValue={props.ship.range}
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
          onClick={_handleMoveShip}
          startIcon={<PinDropIcon />}
        >
          PLOT COURSE
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={_handleShipAttack}
          startIcon={<RocketLaunchIcon />}
        >
          ATTACK
        </Button>
      </Stack>
      <Stack spacing={1} direction="row">
        <Button
          variant="contained"
          size="small"
          onClick={_handleAddAircraft}
          startIcon={<AddIcon />}
        >
          ADD AIRCRAFT
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={_handleLaunchAircraft}
          startIcon={<FlightIcon />}
        >
          LAUNCH AIRCRAFT
        </Button>
      </Stack>
      <Stack spacing={1} direction="row">
        <Button
          variant="contained"
          size="small"
          onClick={_handleTeleportShip}
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
          onClick={_handleDeleteShip}
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
          onClick={handleSaveEditedShip}
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

  const shipCard = (
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
          {!editing && shipDataContent}
          {editing && editingContent()}
        </CardContent>
        <CardActions>
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
      content={shipCard}
      handleCloseOnMap={props.handleCloseOnMap}
    ></FeaturePopup>
  );
}
