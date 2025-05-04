import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@/gui/shared/ui/TextField";
import Ship from "@/game/units/Ship";
import FeaturePopup from "@/gui/map/FeaturePopup";
import DeleteIcon from "@mui/icons-material/Delete";
import PinDropIcon from "@mui/icons-material/PinDrop";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import FlightIcon from "@mui/icons-material/Flight";
import TelegramIcon from "@mui/icons-material/Telegram";
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  ListItemButton,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Menu } from "@/gui/shared/ui/MuiComponents";
import { colorPalette } from "@/utils/constants";
import Weapon from "@/game/units/Weapon";
import WeaponTable from "@/gui/map/feature/shared/WeaponTable";
import Aircraft from "@/game/units/Aircraft";
import AircraftTable from "@/gui/map/feature/shared/AircraftTable";

interface ShipCardProps {
  ship: Ship;
  sideName: string;
  handleAddAircraft: (
    airbaseId: string,
    aircraftClassName: string
  ) => Aircraft[];
  handleDeleteAircraft: (
    airbaseId: string,
    aircraftIds: string[]
  ) => Aircraft[];
  handleLaunchAircraft: (
    airbaseId: string,
    aircraftIds: string[]
  ) => Aircraft[];
  handleDeleteShip: (shipId: string) => void;
  handleMoveShip: (shipId: string) => void;
  handleShipAttack: (
    shipId: string,
    weaponId: string,
    weaponQuantity: number
  ) => void;
  handleTeleportUnit: (unitId: string) => void;
  handleEditShip: (
    shipId: string,
    shipName: string,
    shipClassName: string,
    shipSpeed: number,
    shipCurrentFuel: number,
    shipRange: number
  ) => void;
  handleAddWeapon: (shipId: string, weaponClassName: string) => Weapon[];
  handleDeleteWeapon: (shipId: string, weaponId: string) => Weapon[];
  handleUpdateWeaponQuantity: (
    shipId: string,
    weaponId: string,
    increment: number
  ) => Weapon[];
  handleCloseOnMap: () => void;
  anchorPositionTop: number;
  anchorPositionLeft: number;
}

const tableRowStyle = {
  border: 0,
};

const tableKeyCellStyle = {
  whiteSpace: "nowrap",
  color: "white",
  border: "none",
  p: 0.5,
  typography: "body1",
};

const tableValueCellStyle = {
  wordBreak: "break-word",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 200,
  color: "white",
  border: "none",
  p: 0.5,
  typography: "body1",
};

type CARD_CONTENT_CONTEXT = "default" | "editing" | "weapons" | "aircraft";

export default function ShipCard(props: Readonly<ShipCardProps>) {
  const [cardContentContext, setCardContentContext] =
    useState<CARD_CONTENT_CONTEXT>("default");
  const [tempEditData, setTempEditData] = useState({
    name: props.ship.name,
    className: props.ship.className,
    speed: props.ship.speed,
    currentFuel: props.ship.currentFuel,
    range: props.ship.range,
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [aircraftCount, setAircraftCount] = useState(
    props.ship.aircraft.length
  );

  const _handleDeleteShip = () => {
    props.handleCloseOnMap();
    props.handleDeleteShip(props.ship.id);
  };

  const _handleMoveShip = () => {
    props.handleCloseOnMap();
    props.handleMoveShip(props.ship.id);
  };

  const _handleTeleportShip = () => {
    props.handleCloseOnMap();
    props.handleTeleportUnit(props.ship.id);
  };

  const toggleEdit = () => {
    setCardContentContext(
      cardContentContext !== "editing" ? "editing" : "default"
    );
  };

  const toggleWeapons = () => {
    handleClose();
    setCardContentContext(
      cardContentContext !== "weapons" ? "weapons" : "default"
    );
  };

  const toggleAircraft = () => {
    handleClose();
    setCardContentContext(
      cardContentContext !== "aircraft" ? "aircraft" : "default"
    );
  };

  const handleSaveEditedShip = () => {
    props.handleEditShip(
      props.ship.id,
      tempEditData.name,
      tempEditData.className,
      tempEditData.speed,
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
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        maxWidth: 600,
        minWidth: 350,
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Table size="small" aria-label="aircraft-feature-table">
        <TableBody>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Coordinates:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {props.ship.latitude.toFixed(2)},{" "}
              {props.ship.longitude.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Heading:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {props.ship.heading.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Speed:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {props.ship.speed.toFixed(0)} KTS
            </TableCell>
          </TableRow>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Detection Range:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {props.ship.range.toFixed(0)} NM
            </TableCell>
          </TableRow>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Fuel:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {props.ship.currentFuel.toFixed(0)} /{" "}
              {props.ship.maxFuel.toFixed(0) + " LBS"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
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
      <form style={{ width: "100%", maxWidth: 600, minWidth: 350 }}>
        <Stack spacing={1} direction="column" sx={{ pt: 2 }}>
          <TextField
            autoComplete="off"
            id="ship-name-text-field"
            label="Name"
            defaultValue={props.ship.name}
            onChange={_handleTextFieldChange}
            sx={inputStyle}
            slotProps={{
              inputLabel: {
                ...inputLabelStyle,
              },
            }}
          />
          <TextField
            autoComplete="off"
            id="ship-type-text-field"
            label="Type"
            defaultValue={props.ship.className}
            onChange={_handleTextFieldChange}
            sx={inputStyle}
            slotProps={{
              inputLabel: {
                ...inputLabelStyle,
              },
            }}
          />
          <TextField
            autoComplete="off"
            id="ship-speed-text-field"
            label="Speed"
            defaultValue={props.ship.speed.toFixed(0)}
            onChange={_handleTextFieldChange}
            sx={inputStyle}
            slotProps={{
              inputLabel: {
                ...inputLabelStyle,
              },
            }}
          />
          <TextField
            autoComplete="off"
            id="ship-current-fuel-text-field"
            label="Current Fuel"
            defaultValue={props.ship.currentFuel.toFixed(0)}
            onChange={_handleTextFieldChange}
            sx={inputStyle}
            slotProps={{
              inputLabel: {
                ...inputLabelStyle,
              },
            }}
          />
          <TextField
            autoComplete="off"
            id="ship-range-text-field"
            label="Range"
            defaultValue={props.ship.range}
            onChange={_handleTextFieldChange}
            sx={inputStyle}
            slotProps={{
              inputLabel: {
                ...inputLabelStyle,
              },
            }}
          />
        </Stack>
      </form>
    );
  };

  const defaultCardActions = (
    <Stack spacing={0.5} direction="column" onMouseLeave={handleClose}>
      <ListItemButton onClick={_handleMoveShip}>
        <PinDropIcon
          sx={{
            mr: 0.5,
          }}
        />
        Plot Course
      </ListItemButton>
      <ListItemButton onClick={toggleAircraft}>
        <FlightIcon sx={{ mr: 0.5 }} /> View Aircraft
      </ListItemButton>
      <ListItemButton onClick={toggleWeapons}>
        <RocketLaunchIcon sx={{ mr: 0.5 }} /> View Weapons
      </ListItemButton>
      <ListItemButton onClick={_handleTeleportShip}>
        <TelegramIcon sx={{ mr: 0.5 }} /> Edit Location
      </ListItemButton>
    </Stack>
  );

  const editingCardActions = (
    <Stack direction={"row"} spacing={1} sx={{ p: 1 }}>
      <Button
        fullWidth
        variant="contained"
        size="small"
        onClick={handleSaveEditedShip}
        startIcon={<SaveIcon />}
      >
        Save
      </Button>
      <Button
        fullWidth
        variant="contained"
        size="small"
        color="error"
        onClick={toggleEdit}
        startIcon={<CancelIcon />}
      >
        Cancel
      </Button>
    </Stack>
  );

  const weaponsCardActions = (
    <Stack direction={"row"} spacing={1} sx={{ p: 1, m: 1 }}>
      <Button
        fullWidth
        variant="outlined"
        size="small"
        sx={{ color: "white", borderColor: "white" }}
        onClick={toggleWeapons}
      >
        Back
      </Button>
    </Stack>
  );

  const aircraftCardActions = (
    <Stack direction={"row"} spacing={1} sx={{ p: 1, m: 1 }}>
      <Button
        fullWidth
        variant="outlined"
        size="small"
        sx={{ color: "white", borderColor: "white" }}
        onClick={toggleAircraft}
      >
        Back
      </Button>
    </Stack>
  );

  const shipCard = (
    <Box sx={{ minWidth: 150 }}>
      <Card
        sx={{
          backgroundColor: "#282c34",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "left",
        }}
      >
        <CardHeader
          action={
            <>
              {cardContentContext === "default" && (
                <Stack direction={"row"} spacing={0}>
                  <Tooltip title={`Edit ${props.ship.name}`}>
                    <IconButton onClick={toggleEdit}>
                      <EditIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`Delete ${props.ship.name}`}>
                    <IconButton onClick={_handleDeleteShip}>
                      <DeleteIcon sx={{ color: "red" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`More Actions`}>
                    <Button
                      id="ship-feature-actions-button"
                      aria-controls={
                        open ? "ship-feature-actions-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                      variant="outlined"
                      size="small"
                      color="inherit"
                    >
                      Actions
                    </Button>
                  </Tooltip>
                  <Menu
                    id="ship-feature-actions-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                      root: { sx: { ".MuiList-root": { padding: 0 } } },
                      list: {
                        "aria-labelledby": "ship-feature-actions-button",
                      },
                    }}
                  >
                    {defaultCardActions}
                  </Menu>
                </Stack>
              )}
            </>
          }
          title={
            <Typography variant="h6" component="div">
              {props.ship.name}
            </Typography>
          }
          subheader={
            <Stack
              direction={"column"}
              spacing={0}
              sx={{ color: colorPalette.lightGray }}
            >
              <Typography variant="caption">
                Type: {props.ship.className}
              </Typography>
              <Typography variant="caption">
                Side:{" "}
                <Typography variant="caption" component={"span"}>
                  {props.sideName}
                </Typography>
              </Typography>
            </Stack>
          }
        />
        <Divider
          orientation="horizontal"
          variant="middle"
          flexItem
          sx={{ borderColor: "white", mb: 1 }}
        />
        <CardContent sx={{ pt: 0 }}>
          {cardContentContext === "default" && shipDataContent}
          {cardContentContext === "editing" && editingContent()}
          {cardContentContext === "weapons" && (
            <WeaponTable
              unitWithWeapon={props.ship}
              handleAddWeapon={props.handleAddWeapon}
              handleDeleteWeapon={props.handleDeleteWeapon}
              handleUpdateWeaponQuantity={props.handleUpdateWeaponQuantity}
              handleUnitAttack={props.handleShipAttack}
              handleCloseOnMap={props.handleCloseOnMap}
            />
          )}
          {cardContentContext === "aircraft" && (
            <AircraftTable
              unitWithAircraft={props.ship}
              handleAddAircraft={props.handleAddAircraft}
              handleDeleteAircraft={props.handleDeleteAircraft}
              handleLaunchAircraft={props.handleLaunchAircraft}
            />
          )}
        </CardContent>
        {cardContentContext === "editing" && editingCardActions}
        {cardContentContext === "weapons" && weaponsCardActions}
        {cardContentContext === "aircraft" && aircraftCardActions}
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
