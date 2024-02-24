import React, { useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Aircraft from "../../../game/units/Aircraft";
import FeaturePopup from "../FeaturePopup";
import DeleteIcon from '@mui/icons-material/Delete';
import PinDropIcon from '@mui/icons-material/PinDrop';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import TextField from "@mui/material/TextField";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface AircraftCardProps {
    aircraft: Aircraft,
    handleDeleteAircraft: (aircraftId: string) => void;
    handleMoveAircraft: (aircraftId: string) => void;
    handleAircraftAttack: (aircraftId: string) => void;
    handleEditAircraft: (aircraftId: string, aircraftName: string, aircraftClassName: string, aircraftSpeed: number, aircraftWeaponQuantity: number) => void;
    handleCloseOnMap: () => void;
    anchorPositionTop: number;
    anchorPositionLeft: number;
}
  
export default function AircraftCard(props: Readonly<AircraftCardProps>) {
    const [editing, setEditing] = useState(false);
    const [tempEditData, setTempEditData] = useState({
        name: props.aircraft.name,
        className: props.aircraft.className,
        speed: props.aircraft.speed,
        weaponQuantity: props.aircraft.getTotalWeaponQuantity()
    })

    const _handleDeleteAircraft = () => {
        props.handleCloseOnMap();
        props.handleDeleteAircraft(props.aircraft.id);
    }

    const _handleMoveAircraft = () => {
        props.handleCloseOnMap();
        props.handleMoveAircraft(props.aircraft.id);
    }

    const _handleAircraftAttack = () => {
        props.handleCloseOnMap();
        props.handleAircraftAttack(props.aircraft.id);
    }

    const toggleEdit = () => {
        setEditing(!editing);
    }

    const handleSaveEditedAircraft = () => {
        props.handleEditAircraft(props.aircraft.id, tempEditData.name, tempEditData.className, tempEditData.speed, tempEditData.weaponQuantity)
        toggleEdit();
    }

    const _handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.id) {
            case "aircraft-name-text-field": {
                setTempEditData({...tempEditData, name: event.target.value})
                break;
            }
            case "aircraft-type-text-field": {
                setTempEditData({...tempEditData, className: event.target.value})
                break;
            }
            case "aircraft-speed-text-field": {
                const newSpeed = parseInt(event.target.value)
                if (newSpeed) setTempEditData({...tempEditData, speed: newSpeed})
                break;
            }
            case "aircraft-weapon-quantity-text-field": {
                const newWeaponCount = parseInt(event.target.value)
                if (newWeaponCount) setTempEditData({...tempEditData, weaponQuantity: newWeaponCount})
                break;
            }
            case "default": {
                break;
            }
        }
    }

    const aircraftDataContent = (
        <>
            <Typography variant="h5" component="div">{props.aircraft.name}</Typography>
            <Typography variant="h6">Type: {props.aircraft.className}</Typography>
            <Typography variant="h6">Coordinates: {props.aircraft.latitude.toFixed(2)}, {props.aircraft.longitude.toFixed(2)}</Typography>
            <Typography variant="h6">Altitude: {props.aircraft.altitude.toFixed(2)} FT</Typography>
            <Typography variant="h6">Heading: {props.aircraft.heading.toFixed(2)}</Typography>
            <Typography variant="h6">Speed: {props.aircraft.speed.toFixed(0)} KTS</Typography>
            <Typography variant="h6">Fuel: {props.aircraft.fuel.toFixed(2)}</Typography>
            <Typography variant="h6">Side: {props.aircraft.sideName}</Typography>
            <Typography variant="h6">Weapon Quantity: {props.aircraft.getTotalWeaponQuantity()}</Typography>
        </>
    )

    const editingContent = () => {
        const inputStyle = { 
            input: { 
                color: 'white', 
            },
        }
        const inputLabelStyle = {
            style: {
                color: 'white'
            }
        }
        return (
            <form>
                <Stack spacing={1} direction="column">
                    <Typography variant="h5" component="div">EDIT AIRCRAFT</Typography>
                    <TextField autoComplete='off' id="aircraft-name-text-field" label="Name" defaultValue={props.aircraft.name} onChange={_handleTextFieldChange} variant="outlined" sx={inputStyle} InputLabelProps={inputLabelStyle}/>
                    <TextField autoComplete='off' id="aircraft-type-text-field" label="Type" defaultValue={props.aircraft.className} onChange={_handleTextFieldChange} variant="outlined" sx={inputStyle} InputLabelProps={inputLabelStyle}/>
                    <TextField autoComplete='off' id="aircraft-speed-text-field" label="Speed" defaultValue={props.aircraft.speed.toFixed(0)} onChange={_handleTextFieldChange} variant="outlined" sx={inputStyle} InputLabelProps={inputLabelStyle}/>
                    <TextField autoComplete='off' id="aircraft-weapon-quantity-text-field" label="Weapon Quantity" defaultValue={props.aircraft.getTotalWeaponQuantity().toString()} onChange={_handleTextFieldChange} variant="outlined" sx={inputStyle} InputLabelProps={inputLabelStyle}/>
                </Stack>
            </form>
        )
    }

    const defaultCardActions = (
        <Stack spacing={1} direction="column">
            <Stack spacing={1} direction="row">
                <Button variant="contained" size="small" onClick={_handleMoveAircraft} startIcon={<PinDropIcon/>}>PLOT COURSE</Button>
                <Button variant="contained" color="error" size="small" onClick={_handleAircraftAttack} startIcon={<RocketLaunchIcon/>}>ATTACK</Button>
            </Stack>
            <Stack spacing={1} direction="row">
                <Button variant="contained" size="small" onClick={toggleEdit} startIcon={<EditIcon/>}>EDIT</Button>
                <Button variant="contained" color="error" size="small" onClick={_handleDeleteAircraft} startIcon={<DeleteIcon/>}>DELETE</Button>
            </Stack>
        </Stack>
    )

    const editingCardActions = (
        <Stack spacing={1} direction="column">
            <Stack spacing={1} direction="row">
                <Button variant="contained" size="small" onClick={handleSaveEditedAircraft} startIcon={<SaveIcon/>}>Save</Button>
                <Button variant="contained" size="small" color="error" onClick={toggleEdit} startIcon={<CancelIcon/>}>Cancel</Button>
            </Stack>
        </Stack>  
    )

    const aircraftCard = (
        <Box sx={{ minWidth: 150 }}>
        <Card variant="outlined" sx={{ backgroundColor: "#282c34", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "left"}}>
            <CardContent>
                {!editing && aircraftDataContent}
                {editing && editingContent()}
            </CardContent>
            <CardActions>
                {!editing && defaultCardActions}
                {editing && editingCardActions}
            </CardActions>
        </Card>
        </Box>
    )

    return (
        <FeaturePopup anchorPositionTop={props.anchorPositionTop} anchorPositionLeft={props.anchorPositionLeft} content={aircraftCard} handleCloseOnMap={props.handleCloseOnMap}></FeaturePopup>
    );
}