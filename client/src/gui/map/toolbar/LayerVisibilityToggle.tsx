import LayersIcon from "@mui/icons-material/Layers";
import { Box, Tooltip } from "@mui/material";
import { Popover } from "@/gui/shared/ui/MuiComponents";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import React, { useState } from "react";
import { colorPalette } from "@/utils/constants";
import { useAuth0 } from "@auth0/auth0-react";

interface LayerVisibilityPanelToggleProps {
  featureLabelVisibility: boolean;
  toggleFeatureLabelVisibility: (featureLabelVisibility: boolean) => void;
  threatRangeVisibility: boolean;
  toggleThreatRangeVisibility: (threatRangeVisibility: boolean) => void;
  routeVisibility: boolean;
  toggleRouteVisibility: (routeVisibility: boolean) => void;
  toggleBaseMapLayer: () => void;
  toggleReferencePointVisibility: (referencePointVisibility: boolean) => void;
  referencePointVisibility: boolean;
}

export default function LayerVisibilityPanelToggle(
  props: Readonly<LayerVisibilityPanelToggleProps>
) {
  const { isAuthenticated } = useAuth0();

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
    border: `1px solid ${colorPalette.darkGray}`,
    backgroundColor: colorPalette.lightGray,
    borderRadius: "8px",
    position: "absolute",
    top: "4em",
    right: "0.2em",
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
          <Tooltip
            title={
              isAuthenticated
                ? "Switch maps. Shortcut: 5"
                : "Log in to access more map layers"
            }
            placement="right"
          >
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
          <Button
            variant="outlined"
            sx={toggleStyle}
            onClick={() => {
              props.toggleReferencePointVisibility(
                !props.referencePointVisibility
              );
            }}
          >
            Toggle Reference Points
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "1em",
          right: "1em",
          fontSize: "small",
          zIndex: 1000,
        }}
      >
        <Box sx={openLayersPanelButtonStyle}>
          <Tooltip title="Layer Controls" placement="left">
            <IconButton disableRipple onClick={handleClick} size="medium">
              <LayersIcon />
            </IconButton>
          </Tooltip>
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
