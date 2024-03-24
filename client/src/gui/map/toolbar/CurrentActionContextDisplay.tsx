import React, { useContext } from "react";
import { Typography } from "@mui/material";
import { CurrentGameStatus } from "../contextProviders/GameStatusProvider";

interface CurrentActionContextDisplayProps {}

const currentActionContextStyle = {
  color: "white",
};

export default function CurrentActionContextDisplay() {
  const CurrentGameStatusFromContext = useContext(CurrentGameStatus);

  return (
    <Typography variant="h6" component="h6" style={currentActionContextStyle}>
      {CurrentGameStatusFromContext}
    </Typography>
  );
}
