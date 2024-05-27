import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import LayersIcon from "@mui/icons-material/Layers";
import { Box, Popover, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
  const id = open ? 'layer-visibility-panel' : undefined;

  const defaultButtonColor = "#676767";
  const buttonStyle = (backgroundColor: string) => {
    return {
      border: 1,
      backgroundColor: backgroundColor, 
      borderRadius: "16px",
      borderColor: "black",
    };
  };

  const layerVisibilityPanelCard = (
    <Box sx={{ minWidth: 150 }}>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: "#282c34",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "left",
        }}
      >
        <CardActions
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack spacing={1} direction="column">
            <Tooltip title="Toggle labels. Shortcut: 5" placement="right">
              <Button
                variant="contained"
                style={buttonStyle(defaultButtonColor)}
                onClick={() => {
                  props.toggleFeatureLabelVisibility(
                    !props.featureLabelVisibility
                  );
                }}
                startIcon={
                  props.featureLabelVisibility ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )
                }
              >
                {"LABELS " + (props.featureLabelVisibility ? "ON" : "OFF")}
              </Button>
            </Tooltip>
            <Tooltip
              title="Toggle threat range rings. Shortcut: 6"
              placement="right"
            >
              <Button
                variant="contained"
                style={buttonStyle(defaultButtonColor)}
                onClick={() => {
                  props.toggleThreatRangeVisibility(
                    !props.threatRangeVisibility
                  );
                }}
                startIcon={
                  props.threatRangeVisibility ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )
                }
              >
                {"THREAT RANGE " + (props.threatRangeVisibility ? "ON" : "OFF")}
              </Button>
            </Tooltip>
            <Tooltip title="Toggle routes. Shortcut: 7" placement="right">
              <Button
                variant="contained"
                style={buttonStyle(defaultButtonColor)}
                onClick={() => {
                  props.toggleRouteVisibility(!props.routeVisibility);
                }}
                startIcon={
                  props.routeVisibility ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )
                }
              >
                {"ROUTES " + (props.routeVisibility ? "ON" : "OFF")}
              </Button>
            </Tooltip>
            <Tooltip title="Switch maps. Shortcut: 8" placement="right">
              <Button
                variant="contained"
                style={buttonStyle(defaultButtonColor)}
                onClick={props.toggleBaseMapLayer}
                startIcon={<VisibilityIcon />}
              >
                SWITCH MAP
              </Button>
            </Tooltip>
          </Stack>
        </CardActions>
      </Card>
    </Box>
  );  

  return (
    <>
    <div style={{
      position: "absolute",
      left: "25em",
      top: "1em",
      color: "white",
      fontSize: "small",
      zIndex: 1000
    }}>
      <Box sx={buttonStyle("#dddddd")}>
        <IconButton
          onClick={handleClick}
          size="large"
        >
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
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {layerVisibilityPanelCard}
    </Popover>  
    </>   
  );
}
