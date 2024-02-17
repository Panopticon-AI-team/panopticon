import React, { useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Airbase from "../../game/Airbase";

interface AirbaseCardProps {
    airbase: Airbase,
    handleAddAircraftProp: () => void;
    handleLaunchAircraftProp: () => void;
}
  
export default function AirbaseCard({ airbase, handleAddAircraftProp, handleLaunchAircraftProp }: Readonly<AirbaseCardProps>) {
    const [aircraftCount, setAircraftCount] = useState(airbase.aircraft.length);

    const handleAddAircraft = () => {
        handleAddAircraftProp();
        setAircraftCount(airbase.aircraft.length);
    }

    const handleLaunchAircraft = () => {
        handleLaunchAircraftProp();
        setAircraftCount(airbase.aircraft.length);
    }

    return (
        <Box sx={{ minWidth: 150 }}>
        <Card variant="outlined" sx={{ backgroundColor: "#282c34", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <CardContent>
                <Typography variant="h5" component="div">{airbase.name}</Typography>
                <Typography variant="body2">Aircraft: {aircraftCount}</Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" size="small" onClick={handleAddAircraft}>Add aicraft</Button>
                <Button variant="contained" size="small" onClick={handleLaunchAircraft}>Launch aicraft</Button>
            </CardActions>
        </Card>
        </Box>
    );
}