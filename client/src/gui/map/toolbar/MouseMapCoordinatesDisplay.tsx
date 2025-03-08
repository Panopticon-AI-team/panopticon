import { useContext } from "react";
import { Chip } from "@mui/material";
import { colorPalette } from "@/utils/constants";
import { MouseMapCoordinatesContext } from "@/gui/contexts/MouseMapCoordinatesContext";

const mouseMapCoordinatesDisplayStyle = {
  backgroundColor: colorPalette.lightGray,
  color: "#000",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 400,
};

export default function MouseMapCoordinatesDisplay() {
  const { latitude, longitude } = useContext(MouseMapCoordinatesContext);

  return (
    <Chip
      label={
        "Coordinates: " + latitude.toFixed(2) + ", " + longitude.toFixed(2)
      }
      style={mouseMapCoordinatesDisplayStyle}
    />
  );
}
