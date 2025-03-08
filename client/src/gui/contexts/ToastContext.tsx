import { createContext } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface IToast {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export { ToastContext };
