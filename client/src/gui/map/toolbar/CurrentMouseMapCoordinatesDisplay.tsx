import React, { useContext } from "react";
import { Typography } from "@mui/material";
import { CurrentMouseMapCoordinates } from "../contextProviders/MouseMapCoordinatesProvider";

interface CurrentMouseMapCoordinatesDisplayProps {}

const currentMouseMapCoordinatesDisplayStyle = {
  color: "white",
};

export default function CurrentMouseMapCoordinatesDisplay() {
  const CurrentMouseMapCoordinatesFromContext = useContext(
    CurrentMouseMapCoordinates
  );

  return (
    <Typography
      variant="h6"
      component="h6"
      style={currentMouseMapCoordinatesDisplayStyle}
    >
      {"Coordinates: " +
        CurrentMouseMapCoordinatesFromContext.latitude.toFixed(2) +
        ", " +
        CurrentMouseMapCoordinatesFromContext.longitude.toFixed(2)}
    </Typography>
  );
}
