import React, { useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Facility from "../../../game/units/Facility";
import FeaturePopup from "../FeaturePopup";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';

interface FacilityCardProps {
    facility: Facility,
    handleDeleteFacility: (facilityId: string) => void;
    handleCloseOnMap: () => void;
    anchorPositionTop: number;
    anchorPositionLeft: number;
}
  
export default function FacilityCard({ facility, handleDeleteFacility, handleCloseOnMap, anchorPositionTop, anchorPositionLeft }: Readonly<FacilityCardProps>) {
    const [weaponCount, setWeaponCount] = useState(facility.getTotalWeaponQuantity());

    const _handleDeleteFacility = () => {
        handleCloseOnMap();
        handleDeleteFacility(facility.id);
    }

    const facilityCard = (
        <Box sx={{ minWidth: 150 }}>
        <Card variant="outlined" sx={{ backgroundColor: "#282c34", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "left"}}>
            <CardContent>
                <Typography variant="h5" component="div">{facility.name}</Typography>
                <Typography variant="h6">Type: {facility.className}</Typography>
                <Typography variant="h6">Coordinates: {facility.latitude.toFixed(2)}, {facility.longitude.toFixed(2)}</Typography>
                <Typography variant="h6">Altitude: {facility.altitude.toFixed(2)} FT</Typography>
                <Typography variant="h6">Range: {facility.range.toFixed(0)} NM</Typography>
                <Typography variant="h6">Side: {facility.sideName}</Typography>
                <Typography variant="h6">Weapon Quantity: {weaponCount}</Typography>
            </CardContent>
            <CardActions>
                <Stack spacing={1} direction="column">
                    <Stack spacing={1} direction="row">
                    </Stack>
                    <Stack spacing={1} direction="row">
                        <Button variant="contained" size="small" onClick={_handleDeleteFacility} startIcon={<EditIcon/>}>EDIT</Button>
                        <Button variant="contained" color="error" size="small" onClick={_handleDeleteFacility} startIcon={<DeleteIcon/>}>DELETE</Button>
                    </Stack>
                </Stack>
            </CardActions>
        </Card>
        </Box>
    )

    return (
        <FeaturePopup anchorPositionTop={anchorPositionTop} anchorPositionLeft={anchorPositionLeft} content={facilityCard} handleCloseOnMap={handleCloseOnMap}></FeaturePopup>
    );
}