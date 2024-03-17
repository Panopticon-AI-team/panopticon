import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Facility from "../../../game/units/Facility";
import FeaturePopup from "../FeaturePopup";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

interface FacilityCardProps {
  facility: Facility;
  handleDeleteFacility: (facilityId: string) => void;
  handleCloseOnMap: () => void;
  handleEditFacility: (
    facilityId: string,
    facilityName: string,
    facilityClassName: string,
    facilityRange: number,
    facilityWeaponQuantity: number
  ) => void;
  anchorPositionTop: number;
  anchorPositionLeft: number;
}

export default function FacilityCard(props: Readonly<FacilityCardProps>) {
  const [editing, setEditing] = useState(false);
  const [tempEditData, setTempEditData] = useState({
    name: props.facility.name,
    className: props.facility.className,
    range: props.facility.range,
    weaponQuantity: props.facility.getTotalWeaponQuantity(),
  });

  const _handleDeleteFacility = () => {
    props.handleCloseOnMap();
    props.handleDeleteFacility(props.facility.id);
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const handleSaveEditedFacility = () => {
    props.handleEditFacility(
      props.facility.id,
      tempEditData.name,
      tempEditData.className,
      tempEditData.range,
      tempEditData.weaponQuantity
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
      case "facility-weapon-quantity-text-field": {
        const newWeaponCount = parseInt(event.target.value);
        if (newWeaponCount)
          setTempEditData({ ...tempEditData, weaponQuantity: newWeaponCount });
        break;
      }
      case "default": {
        break;
      }
    }
  };

  const facilityDataContent = (
    <>
      <Typography variant="h5" component="div">
        {props.facility.name}
      </Typography>
      <Typography variant="h6">Type: {props.facility.className}</Typography>
      <Typography variant="h6">
        Coordinates: {props.facility.latitude.toFixed(2)},{" "}
        {props.facility.longitude.toFixed(2)}
      </Typography>
      <Typography variant="h6">
        Altitude: {props.facility.altitude.toFixed(2)} FT
      </Typography>
      <Typography variant="h6">
        Range: {props.facility.range.toFixed(0)} NM
      </Typography>
      <Typography variant="h6">Side: {props.facility.sideName}</Typography>
      <Typography variant="h6">
        Weapon Quantity: {props.facility.getTotalWeaponQuantity()}
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
            EDIT FACILITY
          </Typography>
          <TextField
            autoComplete="off"
            id="facility-name-text-field"
            label="Name"
            defaultValue={props.facility.name}
            onChange={_handleTextFieldChange}
            variant="outlined"
            sx={inputStyle}
            InputLabelProps={inputLabelStyle}
          />
          <TextField
            autoComplete="off"
            id="facility-type-text-field"
            label="Type"
            defaultValue={props.facility.className}
            onChange={_handleTextFieldChange}
            variant="outlined"
            sx={inputStyle}
            InputLabelProps={inputLabelStyle}
          />
          <TextField
            autoComplete="off"
            id="facility-range-text-field"
            label="Range"
            defaultValue={props.facility.range}
            onChange={_handleTextFieldChange}
            variant="outlined"
            sx={inputStyle}
            InputLabelProps={inputLabelStyle}
          />
          <TextField
            autoComplete="off"
            id="facility-weapon-quantity-text-field"
            label="Weapon Quantity"
            defaultValue={props.facility.getTotalWeaponQuantity().toString()}
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
          onClick={toggleEdit}
          startIcon={<EditIcon />}
        >
          EDIT
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={_handleDeleteFacility}
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
          onClick={handleSaveEditedFacility}
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

  const facilityCard = (
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
          {!editing && facilityDataContent}
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
      content={facilityCard}
      handleCloseOnMap={props.handleCloseOnMap}
    ></FeaturePopup>
  );
}
