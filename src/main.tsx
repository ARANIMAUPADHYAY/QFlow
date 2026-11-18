import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "./router";
import { QueueProvider } from "./context/QueueContext";
import { ToastProvider } from "./context/ToastContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueueProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </QueueProvider>
  </StrictMode>,
);
