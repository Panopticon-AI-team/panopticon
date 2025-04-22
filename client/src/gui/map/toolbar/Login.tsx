import { useAuth0 } from "@auth0/auth0-react";
import { Chip } from "@mui/material";
import React from "react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Chip
      variant="outlined"
      onClick={() => loginWithRedirect()}
      label="Log In"
    />
  );
};

export default LoginButton;
