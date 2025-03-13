import { createContext } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
};

type ToastContextType = {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export { ToastContext };
