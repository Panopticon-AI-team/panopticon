import React, { useState } from "react";
import Popover from '@mui/material/Popover';

interface MapPopupProps {
    anchorPositionTop: number;
    anchorPositionLeft: number;
    content: JSX.Element;
    handleCloseOnMap: () => void;
}

export default function BasicPopover({ anchorPositionTop, anchorPositionLeft, content, handleCloseOnMap }: Readonly<MapPopupProps>) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    handleCloseOnMap();
  };

  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Popover
        id={id}
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: anchorPositionTop, left: anchorPositionLeft }}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
      >
        {content}
      </Popover>
    </div>
  );
}