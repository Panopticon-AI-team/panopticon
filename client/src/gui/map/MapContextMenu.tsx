import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import FeaturePopup from "@/gui/map/FeaturePopup";

interface MapContextMenuProps {
  anchorPositionTop: number;
  anchorPositionLeft: number;
  handleCloseOnMap: () => void;
}

export default function MapContextMenu(props: Readonly<MapContextMenuProps>) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const content = (
    <Box sx={{ minWidth: 150 }}>
      <Card
        sx={{
          backgroundColor: "#282c34",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "left",
        }}
      >
        <p>lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec</p>
      </Card>
    </Box>
  );

  return (
    <FeaturePopup
      transformOriginVertical="top"
      anchorPositionTop={props.anchorPositionTop}
      anchorPositionLeft={props.anchorPositionLeft}
      content={content}
      handleCloseOnMap={props.handleCloseOnMap}
    ></FeaturePopup>
  );
}
