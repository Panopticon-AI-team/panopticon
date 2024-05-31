import React, { useContext } from "react";
import { Chip, Typography } from "@mui/material";
import { CurrentMouseMapCoordinates } from "../contextProviders/MouseMapCoordinatesProvider";

interface CurrentMouseMapCoordinatesDisplayProps {}

const currentMouseMapCoordinatesDisplayStyle = {
  backgroundColor: "#dddddd",
  color: "black",
};

export default function CurrentMouseMapCoordinatesDisplay() {
  const CurrentMouseMapCoordinatesFromContext = useContext(
    CurrentMouseMapCoordinates
  );

  return (
    <Chip
      label={"Coordinates: " +
        CurrentMouseMapCoordinatesFromContext.latitude.toFixed(2) +
        ", " +
        CurrentMouseMapCoordinatesFromContext.longitude.toFixed(2)}
      style={currentMouseMapCoordinatesDisplayStyle}
    />
  );
}
