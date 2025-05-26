import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Facility from "@/game/units/Facility";
import FeaturePopup from "@/gui/map/FeaturePopup";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@/gui/shared/ui/TextField";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
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
} from "@mui/material";
import { Menu } from "@/gui/shared/ui/MuiComponents";
import { colorPalette } from "@/utils/constants";
import { RocketLaunch } from "@mui/icons-material";
import Weapon from "@/game/units/Weapon";
import WeaponTable from "@/gui/map/feature/shared/WeaponTable";

interface FacilityCardProps {
  facility: Facility;
  sideName: string;
  handleTeleportUnit: (unitId: string) => void;
  handleDeleteFacility: (facilityId: string) => void;
  handleCloseOnMap: () => void;
  handleEditFacility: (
    facilityId: string,
    facilityName: string,
    facilityClassName: string,
    facilityRange: number
  ) => void;
  handleAddWeapon: (facilityId: string, weaponClassName: string) => Weapon[];
  handleDeleteWeapon: (facilityId: string, weaponId: string) => Weapon[];
  handleUpdateWeaponQuantity: (
    facilityId: string,
    weaponId: string,
    increment: number
  ) => Weapon[];
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

export default function FacilityCard(props: Readonly<FacilityCardProps>) {
  const [cardContentContext, setCardContentContext] =
    useState<CARD_CONTENT_CONTEXT>("default");
  const [tempEditData, setTempEditData] = useState({
    name: props.facility.name,
    className: props.facility.className,
    range: props.facility.range,
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const _handleTeleportFacility = () => {
    props.handleCloseOnMap();
    props.handleTeleportUnit(props.facility.id);
  };

  const _handleDeleteFacility = () => {
    props.handleCloseOnMap();
    props.handleDeleteFacility(props.facility.id);
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

  const handleSaveEditedFacility = () => {
    props.handleEditFacility(
      props.facility.id,
      tempEditData.name,
      tempEditData.className,
      tempEditData.range
    );
    toggleEdit();
  };

  const _handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    switch (event.target.id) {
      case "facility-name-text-field": {
        setTempEditData({ ...tempEditData, name: event.target.value });
        break;
      }
      case "facility-type-text-field": {
        setTempEditData({ ...tempEditData, className: event.target.value });
        break;
      }
      case "facility-range-text-field": {
        const newRange = parseInt(event.target.value);
        if (newRange) setTempEditData({ ...tempEditData, range: newRange });
        break;
      }
      case "default": {
        break;
      }
    }
  };

  const facilityDataContent = (
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
      <Table size="small" aria-label="facility-feature-table">
        <TableBody>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Coordinates:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {props.facility.latitude.toFixed(2)},{" "}
              {props.facility.longitude.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Altitude:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {props.facility.altitude.toFixed(2)} FT
            </TableCell>
          </TableRow>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Detection Range:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {props.facility.range.toFixed(0)} NM
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
            id="facility-name-text-field"
            label="Name"
            defaultValue={props.facility.name}
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
            id="facility-type-text-field"
            label="Type"
            defaultValue={props.facility.className}
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
            id="facility-range-text-field"
            label="Range"
            defaultValue={props.facility.range}
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
      <ListItemButton onClick={toggleWeapons}>
        <RocketLaunch sx={{ mr: 0.5 }} /> Attack
      </ListItemButton>
      <ListItemButton onClick={_handleTeleportFacility}>
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
        onClick={handleSaveEditedFacility}
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

  const facilityCard = (
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
                  <Tooltip title={`Edit ${props.facility.name}`}>
                    <IconButton onClick={toggleEdit}>
                      <EditIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`Delete ${props.facility.name}`}>
                    <IconButton onClick={_handleDeleteFacility}>
                      <DeleteIcon sx={{ color: "red" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`More Actions`}>
                    <Button
                      id="facility-feature-actions-button"
                      aria-controls={
                        open ? "facility-feature-actions-menu" : undefined
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
                    id="facility-feature-actions-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                      root: { sx: { ".MuiList-root": { padding: 0 } } },
                      list: {
                        "aria-labelledby": "facility-feature-actions-button",
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
              {props.facility.name}
            </Typography>
          }
          subheader={
            <Stack
              direction={"column"}
              spacing={0}
              sx={{ color: colorPalette.lightGray }}
            >
              <Typography variant="caption">
                Type: {props.facility.className}
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
          {cardContentContext === "default" && facilityDataContent}
          {cardContentContext === "editing" && editingContent()}
          {cardContentContext === "weapons" && (
            <WeaponTable
              unitWithWeapon={props.facility}
              handleAddWeapon={props.handleAddWeapon}
              handleDeleteWeapon={props.handleDeleteWeapon}
              handleUpdateWeaponQuantity={props.handleUpdateWeaponQuantity}
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
      content={facilityCard}
      handleCloseOnMap={props.handleCloseOnMap}
    ></FeaturePopup>
  );
}
