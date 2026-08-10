import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Estilos globales
import "./styles/index.css"; //Para la landing page
import "@/styles/global.css"; //Para el dashboard

// importación de contextos y providers
import { UserProvider } from "@/contexts/user-context";
import { ThemeProvider } from "@/components/core/theme-provider/ThemeProvider";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);