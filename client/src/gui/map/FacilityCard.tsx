import React, { useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Facility from "../../game/Facility";
import FeaturePopup from "./FeaturePopup";
import DeleteIcon from '@mui/icons-material/Delete';

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
        <Card variant="outlined" sx={{ backgroundColor: "#282c34", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <CardContent>
                <Typography variant="h5" component="div">{facility.name}</Typography>
                <Typography variant="body2">Weapons: {weaponCount}</Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" color="error" size="small" onClick={_handleDeleteFacility} startIcon={<DeleteIcon/>}>DELETE</Button>
            </CardActions>
        </Card>
        </Box>
    )

    return (
        <FeaturePopup anchorPositionTop={anchorPositionTop} anchorPositionLeft={anchorPositionLeft} content={facilityCard} handleCloseOnMap={handleCloseOnMap}></FeaturePopup>
    );
}