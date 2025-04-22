import React, { useState } from "react";
import { Popover } from "@/gui/shared/ui/MuiComponents";

interface FeaturePopupProps {
  anchorPositionTop: number;
  anchorPositionLeft: number;
  content: React.JSX.Element;
  handleCloseOnMap: () => void;
}

export default function FeaturePopup({
  anchorPositionTop,
  anchorPositionLeft,
  content,
  handleCloseOnMap,
}: Readonly<FeaturePopupProps>) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    handleCloseOnMap();
  };

  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Popover
        id={id}
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: anchorPositionTop, left: anchorPositionLeft }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {content}
      </Popover>
    </div>
  );
}
