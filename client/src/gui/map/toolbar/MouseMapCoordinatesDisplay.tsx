import { useContext } from "react";
import { Chip } from "@mui/material";
import { COLOR_PALETTE } from "@/utils/colors";
import { MouseMapCoordinatesContext } from "@/gui/contextProviders/contexts/MouseMapCoordinatesContext";

const mouseMapCoordinatesDisplayStyle = {
  backgroundColor: COLOR_PALETTE.LIGHT_GRAY,
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
