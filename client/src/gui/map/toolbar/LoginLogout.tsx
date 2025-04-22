import LoginButton from "@/gui/map/toolbar/Login";
import LogoutButton from "@/gui/map/toolbar/Logout";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginLogout = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <LoginButton />;
  }

  return (
    <div style={{ margin: "0 0.5em" }}>
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </div>
  );
};

export default LoginLogout;
