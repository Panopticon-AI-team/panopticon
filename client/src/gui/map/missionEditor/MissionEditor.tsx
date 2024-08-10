import React, { useState } from "react";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { makeStyles } from "@material-ui/styles";
import { colorPalette } from "../../../utils/constants";
import { InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";

const useStyles = makeStyles({
  cardHeaderRoot: {
    textAlign: "left",
    backgroundColor: colorPalette.white,
    color: "black",
    height: "5px",
    borderRadius: "10px",
  },
});

const MissionEditor = () => {
  const classes = useStyles();

  const cardStyle = {
    minWidth: "400px",
    minHeight: "200px",
    backgroundColor: colorPalette.lightGray,
    boxShadow: "none",
    borderRadius: "10px",
  };

  const cardContent = () => {
    return (
      <CardContent>
        <TextField id="outlined-basic" label="Name" variant="outlined" />
        <Stack direction="row" spacing={2}>
          <InputLabel id="label-for-mission-type-select">
            Mission Type
          </InputLabel>
          <Select
            labelId="label-for-mission-type-select"
            id="mission-type-select"
            value={"patrol"}
            label="Mission Type"
            onChange={() => {}}
          >
            <MenuItem value={"patrol"}>Patrol</MenuItem>
            <MenuItem value={"strike"}>Strike</MenuItem>
          </Select>
        </Stack>
        <Stack direction="row" spacing={2}>
          <label htmlFor="mission-assigned-units-selector">Units</label>
          <select
            id="mission-assigned-units-selector"
            value={""}
            onChange={(event) => {}}
            aria-label="MissionAssignedUnits"
            style={{
              width: "112px",
              height: "30px",
              marginTop: "10px",
            }}
          >
            {/* {FacilityDb.map((facility) => (
              <option key={facility.className} value={facility.className}>
                {facility.className}
              </option>
            ))} */}
          </select>
        </Stack>
        <Stack direction="row" spacing={2}>
          <label htmlFor="mission-assigned-area-input">Area</label>
          <input
            type="text"
            id="mission-assigned-area-input"
            placeholder="Enter coordinates"
          />
        </Stack>
      </CardContent>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "20em",
        top: "5em",
        zIndex: "1001",
      }}
    >
      <Draggable>
        <Card sx={cardStyle}>
          <CardHeader
            title={"Mission Creator"}
            // avatar={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            classes={{
              root: classes.cardHeaderRoot,
            }}
            titleTypographyProps={{ variant: "body1" }}
          ></CardHeader>
          {cardContent()}
        </Card>
      </Draggable>
    </div>
  );
};

export default MissionEditor;
