import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { ReactComponent as FlightIcon } from './assets/flight_black_24dp.svg';
import { ReactComponent as RadarIcon } from './assets/radar_black_24dp.svg';
import { ReactComponent as FlightTakeoffIcon } from './assets/flight_takeoff_black_24dp.svg';
import Chip from '@mui/material/Chip';

interface ToolBarProps {
    addAircraftOnClick: () => void;
    addFacilityOnClick: () => void;
    addBaseOnClick: () => void;
    playOnClick: () => void;
    pauseOnClick: () => void;
    scenarioCurrentTime: number;
}

export default function ToolBar({ addAircraftOnClick, addFacilityOnClick, addBaseOnClick, playOnClick, pauseOnClick, scenarioCurrentTime }: Readonly<ToolBarProps>) {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained" color="success" onClick={playOnClick} startIcon={<PlayArrowIcon/>}>PLAY</Button>
      <Button variant="contained" color="error" onClick={pauseOnClick} startIcon={<PauseIcon/>}>PAUSE</Button>
      <Button variant="contained" onClick={addAircraftOnClick} startIcon={<FlightIcon/>}>Add aircraft</Button>
      <Button variant="contained" onClick={addBaseOnClick} startIcon={<FlightTakeoffIcon/>}>Add base</Button>
      <Button variant="contained" onClick={addFacilityOnClick} startIcon={<RadarIcon/>}>Add SAM</Button>
      <Chip label={"Current time: " + scenarioCurrentTime.toString()} />
    </Stack>
  );
}
