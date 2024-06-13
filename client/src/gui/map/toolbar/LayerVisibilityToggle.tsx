import LayersIcon from "@mui/icons-material/Layers";
import { Box, Popover, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import React, { useState } from "react";
import { colorPalette } from "../../../utils/constants";

interface LayerVisibilityPanelToggleProps {
  featureLabelVisibility: boolean;
  toggleFeatureLabelVisibility: (featureLabelVisibility: boolean) => void;
  threatRangeVisibility: boolean;
  toggleThreatRangeVisibility: (threatRangeVisibility: boolean) => void;
  routeVisibility: boolean;
  toggleRouteVisibility: (routeVisibility: boolean) => void;
  toggleBaseMapLayer: () => void;
}

export default function LayerVisibilityPanelToggle(
  props: Readonly<LayerVisibilityPanelToggleProps>
) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "layer-visibility-panel" : undefined;

  const toggleStyle = {
    border: 1,
    backgroundColor: colorPalette.white,
    color: colorPalette.black,
    borderRadius: "16px",
    borderColor: "black",
    borderWidth: "2px",
    justifyContent: "left",
    textTransform: "none",
    fontStyle: "normal",
    lineHeight: "normal",
  };
  const openLayersPanelButtonStyle = {
    border: 1,
    backgroundColor: colorPalette.lightGray,
    borderRadius: "8px",
    borderColor: "black",
    borderWidth: "2px",
  };
  const layersVisibilityPanelStyle = {
    backgroundColor: colorPalette.lightGray,
    borderRadius: "5px",
    borderColor: "black",
    borderWidth: "2px",
  };

  const layerVisibilityPanelCard = (
    <Card variant="outlined" sx={layersVisibilityPanelStyle}>
      <CardActions>
        <Stack spacing={1} direction="column">
          <Tooltip title="Switch maps. Shortcut: 5" placement="right">
            <Button
              variant="outlined"
              sx={toggleStyle}
              onClick={props.toggleBaseMapLayer}
            >
              Toggle Base Map
            </Button>
          </Tooltip>
          <Tooltip title="Toggle routes. Shortcut: 6" placement="right">
            <Button
              variant="outlined"
              sx={toggleStyle}
              onClick={() => {
                props.toggleRouteVisibility(!props.routeVisibility);
              }}
            >
              Toggle Routes
            </Button>
          </Tooltip>
          <Tooltip
            title="Toggle threat range rings. Shortcut: 7"
            placement="right"
          >
            <Button
              variant="outlined"
              sx={toggleStyle}
              onClick={() => {
                props.toggleThreatRangeVisibility(!props.threatRangeVisibility);
              }}
            >
              Toggle Threat Range
            </Button>
          </Tooltip>
          <Tooltip title="Toggle labels. Shortcut: 8" placement="right">
            <Button
              variant="outlined"
              sx={toggleStyle}
              onClick={() => {
                props.toggleFeatureLabelVisibility(
                  !props.featureLabelVisibility
                );
              }}
            >
              Toggle Labels
            </Button>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: "25em",
          top: "1em",
          fontSize: "small",
          zIndex: 1000,
        }}
      >
        <Box sx={openLayersPanelButtonStyle}>
          <IconButton onClick={handleClick} size="medium">
            <LayersIcon />
          </IconButton>
        </Box>
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 50,
          horizontal: "left",
        }}
      >
        {layerVisibilityPanelCard}
      </Popover>
    </>
  );
}
