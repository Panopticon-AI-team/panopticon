import React, { useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Aircraft from "../../game/Aircraft";
import FeaturePopup from "./FeaturePopup";
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
        <Card variant="outlined" sx={{ backgroundColor: "#282c34", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <CardContent>
                <Typography variant="h5" component="div">{aircraft.name}</Typography>
                <Typography variant="body2">Weapons: {weaponCount}</Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" size="small" onClick={_handleMoveAircraft} startIcon={<PinDropIcon/>}>MOVE</Button>
                <Button variant="contained" color="error" size="small" onClick={_handleDeleteAircraft} startIcon={<DeleteIcon/>}>DELETE</Button>
            </CardActions>
        </Card>
        </Box>
    )

    return (
        <FeaturePopup anchorPositionTop={anchorPositionTop} anchorPositionLeft={anchorPositionLeft} content={aircraftCard} handleCloseOnMap={handleCloseOnMap}></FeaturePopup>
    );
}