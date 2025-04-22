import { useAuth0 } from "@auth0/auth0-react";
import { Chip, Tooltip } from "@mui/material";
import React from "react";

const LogoutButton = () => {
  const { user, logout } = useAuth0();

  return (
    <Tooltip title={"Logged in as " + (user ? user.name : "Unknown User")}>
      <Chip
        variant="outlined"
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
        label="Log Out"
      />
    </Tooltip>
  );
};

export default LogoutButton;
