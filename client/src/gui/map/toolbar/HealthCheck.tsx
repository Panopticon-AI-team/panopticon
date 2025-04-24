import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const TIMEOUT_MS = 30000;

export default function HealthCheck() {
  const env = import.meta.env.VITE_ENV;
  const apiUrl = import.meta.env.VITE_API_SERVER_URL;

  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!env || env === "standalone") return;
    let active = true;
    setStatus("checking");

    const timer = setTimeout(() => {
      if (active) setStatus("down");
    }, TIMEOUT_MS);

    fetch(`${apiUrl}/health`)
      .then((res) => {
        if (!active) return;
        clearTimeout(timer);
        setStatus(res.ok ? "connected" : "down");
      })
      .catch(() => {
        if (!active) return;
        clearTimeout(timer);
        setStatus("down");
      });

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [apiUrl]);

  let content;
  if (!env || env === "standalone") {
    content = <Typography>Running in standalone mode</Typography>;
  } else if (status === "checking") {
    content = (
      <Box display="flex" alignItems="center" gap={1}>
        <CircularProgress size={24} />
        <Typography>Connecting to server...</Typography>
      </Box>
    );
  } else if (status === "connected") {
    content = <Typography>Server connected</Typography>;
  } else {
    content = <Typography>Server down</Typography>;
  }

  return (
    <Box
      sx={{
        color: "#000",
        padding: "0 1em",
      }}
    >
      {content}
    </Box>
  );
}
