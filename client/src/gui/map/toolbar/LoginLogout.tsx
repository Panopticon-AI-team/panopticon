import LoginButton from "@/gui/map/toolbar/Login";
import LogoutButton from "@/gui/map/toolbar/Logout";
import { useAuth0 } from "@auth0/auth0-react";
import Box from "@mui/material/Box";
import React from "react";

const LoginLogout = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <LoginButton />;
  }

  return <Box>{isAuthenticated ? <LogoutButton /> : <LoginButton />}</Box>;
};

export default LoginLogout;
