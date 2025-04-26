import React, { useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Chip, Popover, Link, Box, Typography } from "@mui/material";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  const chipRef = useRef<HTMLSpanElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => {
    sessionStorage.setItem("privacySeen", "true");
    setAnchorEl(null);
  };

  const handleLogin = () => {
    const seen = sessionStorage.getItem("privacySeen");
    if (!seen && chipRef.current) {
      setAnchorEl(chipRef.current);
    } else {
      loginWithRedirect();
    }
  };

  return (
    <>
      <Box component="span" ref={chipRef}>
        <Chip
          variant="outlined"
          label="Log In"
          onClick={handleLogin}
          sx={{ marginRight: "1em" }}
        />
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box p={2} maxWidth={300}>
          <Typography variant="body2">
            By logging in you agree to our{" "}
            <Link
              href="/privacy-policy"
              target="_blank"
              rel="noopener"
              underline="hover"
            >
              Privacy Policy
            </Link>
            .
          </Typography>
        </Box>
      </Popover>
    </>
  );
};

export default LoginButton;
