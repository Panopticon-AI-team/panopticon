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

interface AircraftCardProps {
    aircraft: Aircraft,
    handleDeleteAircraft: (aircraftId: string) => void;
    handleMoveAircraft: (aircraftId: string) => void;
    handleCloseOnMap: () => void;
    anchorPositionTop: number;
    anchorPositionLeft: number;
}
  
export default function AircraftCard({ aircraft, handleDeleteAircraft, handleMoveAircraft, handleCloseOnMap, anchorPositionTop, anchorPositionLeft }: Readonly<AircraftCardProps>) {
    const [weaponCount, setWeaponCount] = useState(aircraft.getTotalWeaponQuantity());

    const _handleDeleteAircraft = () => {
        handleCloseOnMap();
        handleDeleteAircraft(aircraft.id);
    }

    const _handleMoveAircraft = () => {
        handleCloseOnMap();
        handleMoveAircraft(aircraft.id);
    }

    const aircraftCard = (
        <Box sx={{ minWidth: 150 }}>
        <Card variant="outlined" sx={{ backgroundColor: "#282c34", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "left"}}>
            <CardContent>
                <Typography variant="h5" component="div">{aircraft.name}</Typography>
                <Typography variant="h6">Type: {aircraft.className}</Typography>
                <Typography variant="h6">Coordinates: {aircraft.latitude.toFixed(2)}, {aircraft.longitude.toFixed(2)}</Typography>
                <Typography variant="h6">Altitude: {aircraft.altitude.toFixed(2)} FT</Typography>
                <Typography variant="h6">Heading: {aircraft.heading.toFixed(2)}</Typography>
                <Typography variant="h6">Speed: {aircraft.speed.toFixed(0)} KTS</Typography>
                <Typography variant="h6">Fuel: {aircraft.fuel.toFixed(2)}</Typography>
                <Typography variant="h6">Side: {aircraft.sideName}</Typography>
                <Typography variant="h6">Weapon Quantity: {weaponCount}</Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" size="small" onClick={_handleMoveAircraft} startIcon={<PinDropIcon/>}>PLOT COURSE</Button>
                <Button variant="contained" color="error" size="small" onClick={_handleDeleteAircraft} startIcon={<DeleteIcon/>}>DELETE</Button>
            </CardActions>
        </Card>
        </Box>
    )

    return (
        <FeaturePopup anchorPositionTop={anchorPositionTop} anchorPositionLeft={anchorPositionLeft} content={aircraftCard} handleCloseOnMap={handleCloseOnMap}></FeaturePopup>
    );
}