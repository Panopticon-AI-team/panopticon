import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Aircraft from "@/game/units/Aircraft";
import FeaturePopup from "@/gui/map/FeaturePopup";
import PinDropIcon from "@mui/icons-material/PinDrop";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Stack from "@mui/material/Stack";
import TextField from "@/gui/shared/ui/TextField";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import TelegramIcon from "@mui/icons-material/Telegram";
import {
  CardHeader,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Divider,
  Tooltip,
  ListItemButton,
} from "@mui/material";
import { Menu } from "@/gui/shared/ui/MuiComponents";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { colorPalette } from "@/utils/constants";
import Weapon from "@/game/units/Weapon";
import WeaponTable from "@/gui/map/feature/shared/WeaponTable";

interface AircraftCardProps {
  aircraft: Aircraft;
  sideName: string;
  currentMissionName: string | null;
  currentMissionId: string;
  openMissionEditor: (selectedMissionId: string) => void;
  handleDeleteAircraft: (aircraftId: string) => void;
  handleMoveAircraft: (aircraftId: string) => void;
  handleAircraftAttack: (
    aircraftId: string,
    weaponId: string,
    weaponQuantity: number
  ) => void;
  handleAircraftRtb: (aircraftId: string) => void;
  handleDuplicateAircraft: (aircraftId: string) => void;
  handleTeleportUnit: (unitId: string) => void;
  handleEditAircraft: (
    aircraftId: string,
    aircraftName: string,
    aircraftClassName: string,
    aircraftSpeed: number,
    aircraftCurrentFuel: number,
    aircraftCurrentFuelRate: number,
    aircraftRange: number
  ) => void;
  handleAddWeapon: (aircraftId: string, weaponClassName: string) => Weapon[];
  handleDeleteWeapon: (aircraftId: string, weaponId: string) => Weapon[];
  handleUpdateWeaponQuantity: (
    aircraftId: string,
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

type CARD_CONTENT_CONTEXT = "default" | "editing" | "weapons";

export default function AircraftCard(props: Readonly<AircraftCardProps>) {
  const [cardContentContext, setCardContentContext] =
    useState<CARD_CONTENT_CONTEXT>("default");
  const [tempEditData, setTempEditData] = useState({
    name: props.aircraft.name,
    className: props.aircraft.className,
    speed: props.aircraft.speed,
    currentFuel: props.aircraft.currentFuel,
    currentFuelRate: props.aircraft.fuelRate,
    range: props.aircraft.range,
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const _handleDeleteAircraft = () => {
    props.handleCloseOnMap();
    props.handleDeleteAircraft(props.aircraft.id);
  };

  const _handleMoveAircraft = () => {
    props.handleCloseOnMap();
    props.handleMoveAircraft(props.aircraft.id);
  };

  const _handleAircraftRtb = () => {
    props.handleCloseOnMap();
    props.handleAircraftRtb(props.aircraft.id);
  };

  const _handleDuplicateAircraft = () => {
    props.handleDuplicateAircraft(props.aircraft.id);
  };

  const _handleTeleportAircraft = () => {
    props.handleCloseOnMap();
    props.handleTeleportUnit(props.aircraft.id);
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

  const handleSaveEditedAircraft = () => {
    props.handleEditAircraft(
      props.aircraft.id,
      tempEditData.name,
      tempEditData.className,
      tempEditData.speed,
      tempEditData.currentFuel,
      tempEditData.currentFuelRate,
      tempEditData.range
    );
    toggleEdit();
  };

  const _handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    switch (event.target.id) {
      case "aircraft-name-text-field": {
        setTempEditData({ ...tempEditData, name: event.target.value });
        break;
      }
      case "aircraft-type-text-field": {
        setTempEditData({ ...tempEditData, className: event.target.value });
        break;
      }
      case "aircraft-speed-text-field": {
        const newSpeed = parseInt(event.target.value);
        if (newSpeed) setTempEditData({ ...tempEditData, speed: newSpeed });
        break;
      }
      case "aircraft-current-fuel-text-field": {
        const newFuel = parseInt(event.target.value);
        if (newFuel) setTempEditData({ ...tempEditData, currentFuel: newFuel });
        break;
      }
      case "aircraft-current-fuel-rate-text-field": {
        const newFuelRate = parseInt(event.target.value);
        if (newFuelRate)
          setTempEditData({ ...tempEditData, currentFuelRate: newFuelRate });
        break;
      }
      case "aircraft-range-text-field": {
        const newRange = parseInt(event.target.value);
        if (newRange) setTempEditData({ ...tempEditData, range: newRange });
        break;
      }
      case "default": {
        break;
      }
    }
  };

  const aircraftDataContent = () => {
    const transformValues = (obj: Aircraft) => {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          let transformedValue = value || "N/A";

          if (["latitude", "altitude", "heading", "longitude"].includes(key)) {
            if (key === "altitude") {
              transformedValue = `${value.toFixed(0)} FT`;
            } else {
              transformedValue = value.toFixed(2);
            }
          }

          if (
            ["speed", "currentFuel", "fuelRate", "maxFuel", "range"].includes(
              key
            )
          ) {
            if (key === "speed") {
              transformedValue = `${value.toFixed(0)} KTS`;
            } else if (key === "maxFuel") {
              transformedValue = `${value.toFixed(0)} LBS`;
            } else if (key === "fuelRate") {
              transformedValue = `${value.toFixed(0)} LBS/HR`;
            } else if (key === "currentFuel") {
              transformedValue = value.toFixed(2);
            } else if (key === "range") {
              transformedValue = `${value.toFixed(0)} NM`;
            }
          }

          return [key, transformedValue];
        })
      );
    };

    const data = transformValues(props.aircraft);

    return (
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
                {data.latitude}, {data.longitude}
              </TableCell>
            </TableRow>
            <TableRow sx={tableRowStyle}>
              <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
                Altitude:
              </TableCell>
              <TableCell align="right" sx={tableValueCellStyle}>
                {data.altitude}
              </TableCell>
            </TableRow>
            <TableRow sx={tableRowStyle}>
              <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
                Heading:
              </TableCell>
              <TableCell align="right" sx={tableValueCellStyle}>
                {data.heading}
              </TableCell>
            </TableRow>
            <TableRow sx={tableRowStyle}>
              <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
                Speed:
              </TableCell>
              <TableCell align="right" sx={tableValueCellStyle}>
                {data.speed}
              </TableCell>
            </TableRow>
            <TableRow sx={tableRowStyle}>
              <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
                Fuel:
              </TableCell>
              <TableCell align="right" sx={tableValueCellStyle}>
                {props.aircraft.currentFuel.toFixed(0)} /{" "}
                {props.aircraft.maxFuel.toFixed(0)} LBS
              </TableCell>
            </TableRow>
            <TableRow sx={tableRowStyle}>
              <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
                Fuel Consumption:
              </TableCell>
              <TableCell align="right" sx={tableValueCellStyle}>
                {props.aircraft.fuelRate.toFixed(2)} LBS/HR
              </TableCell>
            </TableRow>
            <TableRow sx={tableRowStyle}>
              <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
                Detection Range:
              </TableCell>
              <TableCell align="right" sx={tableValueCellStyle}>
                {props.aircraft.range.toFixed(0)} NM
              </TableCell>
            </TableRow>
            <TableRow sx={tableRowStyle}>
              <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
                Mission:
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  ...tableValueCellStyle,
                  cursor: props.currentMissionName ? "pointer" : "default",
                  textDecoration: props.currentMissionName
                    ? "underline"
                    : "none",
                }}
                onClick={
                  props.currentMissionName
                    ? () => {
                        props.handleCloseOnMap();
                        props.openMissionEditor(props.currentMissionId);
                      }
                    : () => {}
                }
              >
                {props.currentMissionName ?? "N/A"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const editingContent = () => {
    const inputStyle = {
      input: {
        color: "white",
        pl: 2,
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
            id="aircraft-name-text-field"
            label="Name"
            defaultValue={props.aircraft.name}
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
            id="aircraft-type-text-field"
            label="Type"
            defaultValue={props.aircraft.className}
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
            id="aircraft-speed-text-field"
            label="Speed"
            defaultValue={props.aircraft.speed.toFixed(0)}
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
            id="aircraft-current-fuel-text-field"
            label="Current Fuel"
            defaultValue={props.aircraft.currentFuel.toFixed(0)}
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
            id="aircraft-current-fuel-rate-text-field"
            label="Fuel Consumption"
            defaultValue={props.aircraft.fuelRate.toFixed(0)}
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
            id="aircraft-range-text-field"
            label="Range"
            defaultValue={props.aircraft.range.toFixed(0)}
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
      <ListItemButton onClick={_handleMoveAircraft}>
        <PinDropIcon
          sx={{
            mr: 0.5,
          }}
        />
        Plot Course
      </ListItemButton>
      <ListItemButton onClick={toggleWeapons}>
        <RocketLaunchIcon sx={{ mr: 0.5 }} />
        Attack
      </ListItemButton>
      <ListItemButton onClick={_handleAircraftRtb}>
        <HomeIcon sx={{ mr: 0.5 }} /> Return To Base
      </ListItemButton>
      <ListItemButton onClick={_handleDuplicateAircraft}>
        <AddIcon sx={{ mr: 0.5 }} /> Duplicate
      </ListItemButton>
      <ListItemButton onClick={_handleTeleportAircraft}>
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
        onClick={handleSaveEditedAircraft}
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

  const aircraftCard = (
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
                  <Tooltip title={`Edit ${props.aircraft.name}`}>
                    <IconButton onClick={toggleEdit}>
                      <EditIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`Delete ${props.aircraft.name}`}>
                    <IconButton onClick={_handleDeleteAircraft}>
                      <DeleteIcon sx={{ color: "red" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`More Actions`}>
                    <Button
                      id="aircraft-feature-actions-button"
                      aria-controls={
                        open ? "aircraft-feature-actions-menu" : undefined
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
                    id="aircraft-feature-actions-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                      root: { sx: { ".MuiList-root": { padding: 0 } } },
                      list: {
                        "aria-labelledby": "aircraft-feature-actions-button",
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
              {props.aircraft.name}
            </Typography>
          }
          subheader={
            <Stack
              direction={"column"}
              spacing={0}
              sx={{ color: colorPalette.lightGray }}
            >
              <Typography variant="caption">
                Type: {props.aircraft.className}
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
          {cardContentContext === "default" && aircraftDataContent()}
          {cardContentContext === "editing" && editingContent()}
          {cardContentContext === "weapons" && (
            <WeaponTable
              unitWithWeapon={props.aircraft}
              handleAddWeapon={props.handleAddWeapon}
              handleDeleteWeapon={props.handleDeleteWeapon}
              handleUpdateWeaponQuantity={props.handleUpdateWeaponQuantity}
              handleUnitAttack={props.handleAircraftAttack}
              handleCloseOnMap={props.handleCloseOnMap}
            />
          )}
        </CardContent>
        {cardContentContext === "editing" && editingCardActions}
        {cardContentContext === "weapons" && weaponsCardActions}
      </Card>
    </Box>
  );

  return (
    <FeaturePopup
      anchorPositionTop={props.anchorPositionTop}
      anchorPositionLeft={props.anchorPositionLeft}
      content={aircraftCard}
      handleCloseOnMap={props.handleCloseOnMap}
    ></FeaturePopup>
  );
}
