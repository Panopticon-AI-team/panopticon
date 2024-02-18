import React, { useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Airbase from "../../../game/units/Airbase";
import FeaturePopup from "../FeaturePopup";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';

interface AirbaseCardProps {
    airbase: Airbase,
    handleAddAircraft: (airbaseId: string) => void;
    handleLaunchAircraft: (airbaseId: string) => void;
    handleDeleteAirbase: (airbaseId: string) => void;
    handleCloseOnMap: () => void;
    anchorPositionTop: number;
    anchorPositionLeft: number;
}
  
export default function AirbaseCard({ airbase, handleAddAircraft, handleLaunchAircraft, handleDeleteAirbase, handleCloseOnMap, anchorPositionTop, anchorPositionLeft }: Readonly<AirbaseCardProps>) {
    const [aircraftCount, setAircraftCount] = useState(airbase.aircraft.length);

    const _handleAddAircraft = () => {
        handleAddAircraft(airbase.id);
        setAircraftCount(airbase.aircraft.length);
    }

    const _handleLaunchAircraft = () => {
        handleLaunchAircraft(airbase.id);
        setAircraftCount(airbase.aircraft.length);
    }

    const _handleDeleteAirbase = () => {
        handleCloseOnMap();
        handleDeleteAirbase(airbase.id);
    }

    const airbaseCard = (
        <Box sx={{ minWidth: 150 }}>
        <Card variant="outlined" sx={{ backgroundColor: "#282c34", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "left"}}>
            <CardContent>
                <Typography variant="h5" component="div">{airbase.name}</Typography>
                <Typography variant="h6">Coordinates: {airbase.latitude.toFixed(2)}, {airbase.longitude.toFixed(2)}</Typography>
                <Typography variant="h6">Altitude: {airbase.altitude.toFixed(2)} FT</Typography>
                <Typography variant="h6">Side: {airbase.sideName}</Typography>
                <Typography variant="h6">Aircraft Quantity: {aircraftCount}</Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <Stack spacing={1} direction="row">
                    <Button variant="contained" size="small" onClick={_handleAddAircraft}>Add aicraft</Button>
                    <Button variant="contained" size="small" onClick={_handleLaunchAircraft}>Launch aicraft</Button>
                    <Button variant="contained" size="small" onClick={_handleDeleteAirbase} startIcon={<EditIcon/>}>EDIT</Button>
                    <Button variant="contained" color="error" size="small" onClick={_handleDeleteAirbase} startIcon={<DeleteIcon/>}>DELETE</Button>
                </Stack>
            </CardActions>
        </Card>
        </Box>
    )

    return (
        <FeaturePopup anchorPositionTop={anchorPositionTop} anchorPositionLeft={anchorPositionLeft} content={airbaseCard} handleCloseOnMap={handleCloseOnMap}></FeaturePopup>
    );
}