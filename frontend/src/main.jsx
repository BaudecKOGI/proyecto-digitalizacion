import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// === IMPORTS DE ESTILOS ===
import "./styles/index.css"; // 🎨 Estilos globales de la Landing Page
import "@/styles/global.css"; // 🎨 Estilos globales del Dashboard / Admin

// === IMPORTS DE CONTEXTOS Y COMPONENTES ===
import { UserProvider } from "@/contexts/user-context";
import { ThemeProvider } from "@/components/core/theme-provider/theme-provider";
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