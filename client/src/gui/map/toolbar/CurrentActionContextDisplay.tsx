import { useContext } from "react";
import { Typography } from "@mui/material";
import { CurrentGameStatus } from "@/gui/map/contextProviders/GameStatusProvider";

const currentActionContextStyle = {
  textAlign: "center",
  padding: "2px",
  color: "#4F4F4F",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 400,
};

export default function CurrentActionContextDisplay() {
  const CurrentGameStatusFromContext = useContext(CurrentGameStatus);

  return (
    <Typography variant="body2" component="h6" sx={currentActionContextStyle}>
      {CurrentGameStatusFromContext}
    </Typography>
  );
}
