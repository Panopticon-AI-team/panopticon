import { useContext } from "react";
import { Typography } from "@mui/material";
import { GameStatusContext } from "@/gui/contextProviders/contexts/GameStatusContext";

const currentActionContextDisplayStyle = {
  textAlign: "center",
  padding: "2px",
  color: "#4F4F4F",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 400,
};

export default function CurrentActionContextDisplay() {
  const CurrentGameStatusFromContext = useContext(GameStatusContext);

  return (
    <Typography
      variant="body2"
      component="p"
      sx={currentActionContextDisplayStyle}
    >
      {CurrentGameStatusFromContext}
    </Typography>
  );
}
