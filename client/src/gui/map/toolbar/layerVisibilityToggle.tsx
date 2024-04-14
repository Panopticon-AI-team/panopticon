import React from "react";
import Button from "@mui/material/Button";
import LayersIcon from "@mui/icons-material/Layers";

interface LayerVisibilityPanelToggleProps {
  toggleLayerVisibilityPanelOnClick: () => void;
}

export default function LayerVisibilityPanelToggle(
  props: Readonly<LayerVisibilityPanelToggleProps>
) {
  const defaultButtonColor = "#676767";
  const buttonStyle = (backgroundColor: string) => {
    return {
      backgroundColor: backgroundColor,
    };
  };

  return (
    <Button
      variant="contained"
      style={buttonStyle(defaultButtonColor)}
      onClick={props.toggleLayerVisibilityPanelOnClick}
      startIcon={<LayersIcon />}
    >
      Layers
    </Button>
  );
}
