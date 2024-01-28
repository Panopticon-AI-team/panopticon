import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface ToolBarProps {
    addAircraftOnClick: () => void;
    addFacilityOnClick: () => void;
    addBaseOnClick: () => void;
    playOnClick: () => void;
    pauseOnClick: () => void;
}

export default function ToolBar({ addAircraftOnClick, addFacilityOnClick, addBaseOnClick, playOnClick, pauseOnClick }: Readonly<ToolBarProps>) {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained" color="success" onClick={playOnClick}>PLAY</Button>
      <Button variant="contained" color="error" onClick={pauseOnClick}>PAUSE</Button>
      <Button variant="contained" onClick={addAircraftOnClick}>Add aircraft</Button>
      <Button variant="contained" onClick={addBaseOnClick}>Add base</Button>
      <Button variant="contained" onClick={addFacilityOnClick}>Add SAM</Button>
    </Stack>
  );
}
