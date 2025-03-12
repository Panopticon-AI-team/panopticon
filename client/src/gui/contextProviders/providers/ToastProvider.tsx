import { useState, useCallback } from "react";
import {
  Toast,
  ToastContext,
  ToastType,
} from "@/gui/contextProviders/contexts/ToastContext";
import { randomUUID } from "@/utils/generateUUID";
import CloseIcon from "@mui/icons-material/Clear";
import { Alert, IconButton } from "@mui/material";
import { createPortal } from "react-dom";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastContainerEl =
    document.getElementById("toast-container") || document.body || null;

  const addToast = useCallback(
    (
      message: string,
      type: ToastType = "info",
      duration: number = 5000
    ): void => {
      const id = randomUUID();
      const delay = duration < 0 ? 5000 : duration;
      const newToast = { id, message, type, duration: delay };

      setToasts((prevToasts) => {
        // TODO: Prevent more toasts If latest toast will be outside of screen bounds
        return prevToasts.length >= 14 ? prevToasts : [...prevToasts, newToast];
      });

      setTimeout(() => {
        removeToast(id);
      }, delay);
    },
    []
  );

  const removeToast = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getToastPosition = (index: number) => {
    const basePosition = 20;
    const verticalSpacing = 60;
    return basePosition + index * verticalSpacing; // Stack toasts from bottom up
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toastContainerEl &&
        createPortal(
          toasts.map((toast, index) => (
            <div
              id={`toast-${toast.id.slice(-9)}${index}`}
              key={toast.id}
              style={{
                position: "fixed",
                bottom: `${getToastPosition(index)}px`,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1500,
                width: "min(90%, 400px)",
                maxWidth: "600px",
                boxSizing: "border-box",
              }}
            >
              <Alert
                severity={toast.type}
                variant="filled"
                sx={{ width: "100%" }}
                action={
                  <IconButton
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    color="inherit"
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                }
              >
                {toast.message}
              </Alert>
            </div>
          )),
          toastContainerEl
        )}
    </ToastContext.Provider>
  );
};
