import React, { useContext } from "react";
import { Typography } from "@mui/material";
import { CurrentGameStatus } from "../contextProviders/GameStatusProvider";

interface CurrentActionContextDisplayProps {}

const currentActionContextStyle = {
  color: "white",
  textAlign: "left",
  padding: "5px",
};

export default function CurrentActionContextDisplay() {
  const CurrentGameStatusFromContext = useContext(CurrentGameStatus);

  return (
    <Typography variant="body2" component="h6" sx={currentActionContextStyle}>
      {CurrentGameStatusFromContext}
    </Typography>
  );
}
