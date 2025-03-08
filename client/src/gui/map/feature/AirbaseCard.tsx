import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Airbase from "@/game/units/Airbase";
import FeaturePopup from "@/gui/map/FeaturePopup";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@/gui/shared/ui/TextField";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import FlightIcon from "@mui/icons-material/Flight";
import TelegramIcon from "@mui/icons-material/Telegram";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CardHeader,
  Divider,
  IconButton,
  Menu,
  Tooltip,
  ListItemButton,
} from "@mui/material";
import { colorPalette } from "@/utils/constants";

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

export default function AirbaseCard(props: Readonly<AirbaseCardProps>) {
  const [editing, setEditing] = useState(false);
  const [aircraftCount, setAircraftCount] = useState(
    props.airbase.aircraft.length
  );
  const [tempEditData, setTempEditData] = useState({
    name: props.airbase.name,
  });
  const [featureEntitySideColor, setFeatureEntitySideColor] = useState<
    "primary" | "error"
  >(props.airbase.sideColor.toLowerCase() === "blue" ? "primary" : "error");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
              {props.airbase.latitude.toFixed(2)},{" "}
              {props.airbase.longitude.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Altitude:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {props.airbase.altitude.toFixed(2)} FT
            </TableCell>
          </TableRow>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Aircraft Quantity:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {aircraftCount}
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
            id="airbase-name-text-field"
            label="Name"
            defaultValue={props.airbase.name}
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
    <Stack spacing={0.5} direction="column">
      <ListItemButton onClick={_handleAddAircraft}>
        <AddIcon
          sx={{
            mr: 0.5,
          }}
          color={featureEntitySideColor}
        />
        Add Aicraft
      </ListItemButton>
      <ListItemButton onClick={_handleLaunchAircraft}>
        <FlightIcon sx={{ mr: 0.5 }} color={featureEntitySideColor} /> Launch
        Aircraft
      </ListItemButton>
      <ListItemButton onClick={_handleTeleportAirbase}>
        <TelegramIcon sx={{ mr: 0.5 }} color={featureEntitySideColor} /> Edit
        Location
      </ListItemButton>
    </Stack>
  );

  const editingCardActions = (
    <Stack direction={"row"} spacing={1} sx={{ p: 1 }}>
      <Button
        fullWidth
        variant="contained"
        size="small"
        onClick={handleSaveEditedAirbase}
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

  const airbaseCard = (
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
              {!editing && (
                <Stack direction={"row"} spacing={0}>
                  <Tooltip title={`Edit ${props.airbase.name}`}>
                    <IconButton onClick={toggleEdit}>
                      <EditIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`Delete ${props.airbase.name}`}>
                    <IconButton onClick={_handleDeleteAirbase}>
                      <DeleteIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`More Actions`}>
                    <IconButton
                      id="airbase-feature-actions-button"
                      aria-controls={
                        open ? "airbase-feature-actions-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    >
                      <MoreVertIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="airbase-feature-actions-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                      root: { sx: { ".MuiList-root": { padding: 0 } } },
                      list: {
                        "aria-labelledby": "airbase-feature-actions-button",
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
              {props.airbase.name}
            </Typography>
          }
          subheader={
            <Stack
              direction={"column"}
              spacing={0}
              sx={{ color: colorPalette.lightGray }}
            >
              <Typography variant="caption">
                Type: {props.airbase.className}
              </Typography>
              <Typography variant="caption">
                Team:{" "}
                <Typography
                  variant="caption"
                  component={"span"}
                  color={featureEntitySideColor}
                >
                  {props.airbase.sideName}
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
          {!editing && airbaseDataContent}
          {editing && editingContent()}
        </CardContent>
        {editing && editingCardActions}
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
