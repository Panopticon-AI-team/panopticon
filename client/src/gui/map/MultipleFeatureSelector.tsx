import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import FeaturePopup from "@/gui/map/FeaturePopup";
import Stack from "@mui/material/Stack";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Geometry } from "ol/geom";
import { Feature } from "ol";
import EntityIcon from "@/gui/map/toolbar/EntityIcon";

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

  const getFeatureIcon = (
    // TODO: Create feature/entity type enum
    featureType:
      | "aircraft"
      | "airbase"
      | "ship"
      | "facility"
      | "referencePoint"
      | undefined
  ) => {
    if (featureType) {
      return <EntityIcon type={featureType} defaultColor="white" />;
    }
    return <HelpOutlineIcon />;
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
