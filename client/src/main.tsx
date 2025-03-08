import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "@/gui/providers/AppProvider.tsx";
import { CssBaseline } from "@mui/material";
import "@/styles/index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <CssBaseline />
      <App />
    </AppProvider>
  </StrictMode>
);
