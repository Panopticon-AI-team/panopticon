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

interface AircraftCardProps {
    aircraft: Aircraft,
    handleDeleteAircraft: (aircraftId: string) => void;
    handleMoveAircraft: (aircraftId: string) => void;
    handleAircraftAttack: (aircraftId: string) => void;
    handleCloseOnMap: () => void;
    anchorPositionTop: number;
    anchorPositionLeft: number;
}
  
export default function AircraftCard(props: Readonly<AircraftCardProps>) {
    const [weaponCount, setWeaponCount] = useState(props.aircraft.getTotalWeaponQuantity());

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

    const aircraftCard = (
        <Box sx={{ minWidth: 150 }}>
        <Card variant="outlined" sx={{ backgroundColor: "#282c34", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "left"}}>
            <CardContent>
                <Typography variant="h5" component="div">{props.aircraft.name}</Typography>
                <Typography variant="h6">Type: {props.aircraft.className}</Typography>
                <Typography variant="h6">Coordinates: {props.aircraft.latitude.toFixed(2)}, {props.aircraft.longitude.toFixed(2)}</Typography>
                <Typography variant="h6">Altitude: {props.aircraft.altitude.toFixed(2)} FT</Typography>
                <Typography variant="h6">Heading: {props.aircraft.heading.toFixed(2)}</Typography>
                <Typography variant="h6">Speed: {props.aircraft.speed.toFixed(0)} KTS</Typography>
                <Typography variant="h6">Fuel: {props.aircraft.fuel.toFixed(2)}</Typography>
                <Typography variant="h6">Side: {props.aircraft.sideName}</Typography>
                <Typography variant="h6">Weapon Quantity: {weaponCount}</Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" size="small" onClick={_handleMoveAircraft} startIcon={<PinDropIcon/>}>PLOT COURSE</Button>
                <Button variant="contained" color="error" size="small" onClick={_handleAircraftAttack} startIcon={<RocketLaunchIcon/>}>ATTACK</Button>
                <Button variant="contained" color="error" size="small" onClick={_handleDeleteAircraft} startIcon={<DeleteIcon/>}>DELETE</Button>
            </CardActions>
        </Card>
        </Box>
    )

    return (
        <FeaturePopup anchorPositionTop={props.anchorPositionTop} anchorPositionLeft={props.anchorPositionLeft} content={aircraftCard} handleCloseOnMap={props.handleCloseOnMap}></FeaturePopup>
    );
}