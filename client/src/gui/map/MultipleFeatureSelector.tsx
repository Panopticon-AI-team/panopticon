import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import FeaturePopup from "./FeaturePopup";
import Stack from "@mui/material/Stack";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import { ReactComponent as FlightIcon } from "../assets/flight_black_24dp.svg";
import { ReactComponent as RadarIcon } from "../assets/radar_black_24dp.svg";
import { ReactComponent as FlightTakeoffIcon } from "../assets/flight_takeoff_black_24dp.svg";

import { Geometry } from "ol/geom";
import { Feature } from "ol";

interface MultipleFeatureSelectorProps {
  features: Feature<Geometry>[];
  handleSelectSingleFeature: (feature: Feature<Geometry>) => void;
  handleCloseOnMap: () => void;
  anchorPositionTop: number;
  anchorPositionLeft: number;
}

export default function MultipleFeatureSelector({
  features,
  handleSelectSingleFeature,
  handleCloseOnMap,
  anchorPositionTop,
  anchorPositionLeft,
}: Readonly<MultipleFeatureSelectorProps>) {
  const _handleSelectFeature = (event: React.MouseEvent<HTMLButtonElement>) => {
    const selectedElement = event.target as HTMLElement;
    const selectedFeatureId = selectedElement.getAttribute("id")?.toLowerCase();
    const selectedFeature = features.find(
      (feature) => feature.getProperties()?.id === selectedFeatureId
    );
    if (selectedFeature) handleSelectSingleFeature(selectedFeature);
    handleCloseOnMap();
  };

  const getFeatureIcon = (featureType: string) => {
    switch (featureType) {
      case "airbase":
        return <FlightTakeoffIcon />;
      case "facility":
        return <RadarIcon />;
      case "aircraft":
        return <FlightIcon />;
      case "ship":
        return <DirectionsBoatIcon />;
      default:
        return <HelpOutlineIcon />;
    }
  };

  const featureButtons = [];
  for (const feature of features) {
    featureButtons.push(
      <Button
        variant="contained"
        size="small"
        onClick={_handleSelectFeature}
        key={feature.getProperties()?.id}
        id={feature.getProperties()?.id}
        startIcon={getFeatureIcon(feature.getProperties()?.type)}
      >
        {feature.getProperties()?.name}
      </Button>
    );
  }

  const multipleFeatureSelector = (
    <Box sx={{ minWidth: 150 }}>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: "#282c34",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardActions>
          <Stack spacing={2} direction="column">
            {featureButtons}
          </Stack>
        </CardActions>
      </Card>
    </Box>
  );

  return (
    <FeaturePopup
      anchorPositionTop={anchorPositionTop}
      anchorPositionLeft={anchorPositionLeft}
      content={multipleFeatureSelector}
      handleCloseOnMap={handleCloseOnMap}
    ></FeaturePopup>
  );
}
