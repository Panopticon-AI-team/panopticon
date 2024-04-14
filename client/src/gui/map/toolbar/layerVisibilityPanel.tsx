import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import FeaturePopup from "../FeaturePopup";
import Stack from "@mui/material/Stack";
import { Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface LayerVisibilityPanelProps {
  featureLabelVisibility: boolean;
  toggleFeatureLabelVisibility: (featureLabelVisibility: boolean) => void;
  threatRangeVisibility: boolean;
  toggleThreatRangeVisibility: (threatRangeVisibility: boolean) => void;
  routeVisibility: boolean;
  toggleRouteVisibility: (routeVisibility: boolean) => void;
  toggleBaseMapLayer: () => void;
  handleCloseOnMap: () => void;
  anchorPositionTop: number;
  anchorPositionLeft: number;
}

export default function LayerVisibilityPanel(
  props: Readonly<LayerVisibilityPanelProps>
) {
  const defaultButtonColor = "#676767";
  const buttonStyle = (backgroundColor: string) => {
    return {
      backgroundColor: backgroundColor,
      justifyContent: "left",
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
    <FeaturePopup
      anchorPositionTop={props.anchorPositionTop}
      anchorPositionLeft={props.anchorPositionLeft}
      content={layerVisibilityPanelCard}
      handleCloseOnMap={props.handleCloseOnMap}
    ></FeaturePopup>
  );
}
