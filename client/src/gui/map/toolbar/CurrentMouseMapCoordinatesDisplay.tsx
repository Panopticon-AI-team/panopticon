import { useContext } from "react";
import { Chip } from "@mui/material";
import { CurrentMouseMapCoordinates } from "@/gui/map/contextProviders/MouseMapCoordinatesProvider";
import { colorPalette } from "@/utils/constants";

const currentMouseMapCoordinatesDisplayStyle = {
  backgroundColor: colorPalette.lightGray,
  color: "#000",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 400,
};

export default function CurrentMouseMapCoordinatesDisplay() {
  const CurrentMouseMapCoordinatesFromContext = useContext(
    CurrentMouseMapCoordinates
  );

  return (
    <Chip
      label={
        "Coordinates: " +
        CurrentMouseMapCoordinatesFromContext.latitude.toFixed(2) +
        ", " +
        CurrentMouseMapCoordinatesFromContext.longitude.toFixed(2)
      }
      style={currentMouseMapCoordinatesDisplayStyle}
    />
  );
}
