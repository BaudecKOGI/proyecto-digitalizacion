import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// === IMPORTS: TUS RUTAS (Públicas y Editor) ===
import PublicHome from './pages/PublicHome';
import EditorPanel from './pages/EditorPanel';

// === IMPORTS: RUTAS DE TU COMPAÑERO (Dashboard Admin) ===
import SignInPage from "@/pages/auth/sign-in/sign-in";
import ResetPasswordPage from "@/pages/auth/reset-password/reset-password";
import AccountPage from "@/pages/dashboard/account/account";
import DashboardOverviewPage from "@/pages/dashboard/dashboard";
import Disenos3DPage from "@/pages/dashboard/disenos-3d";
import PrevisualizacionPage from "@/pages/dashboard/previsualizacion";
import ProyectosDigitalesPage from "@/pages/dashboard/proyectos-digitales";

// === IMPORTS: LAYOUTS DE TU COMPAÑERO ===
import { Layout as AuthLayout } from "@/components/auth/layout";
import { Layout as DashboardLayout } from "@/components/dashboard/layout/layout";

export default function App() {
  return (
    <Routes>
      {/* 🌍 1. RUTA PÚBLICA (Tu Landing Page) */}
      <Route path="/" element={<PublicHome />} />

      {/* ✏️ 2. RUTA DEL EDITOR (Tu panel) */}
      <Route path="/editor" element={<EditorPanel />} />

      {/* 🔐 3. RUTAS DE AUTENTICACIÓN (De tu compañero) */}
      <Route path="/auth">
        <Route element={<AuthLayout />}>
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      {/* 🛠️ 4. RUTAS DEL PANEL ADMIN (De tu compañero) */}
      <Route path="/dashboard">
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardOverviewPage />} />
          <Route path="cuenta" element={<AccountPage />} />
          <Route path="disenos-3d" element={<Disenos3DPage />} />
          <Route path="previsualizacion" element={<PrevisualizacionPage />} />
          <Route path="proyectos-digitales" element={<ProyectosDigitalesPage />} />
        </Route>
      </Route>

      {/* ⚠️ CATCH-ALL: Si el usuario escribe una ruta que no existe, regresa al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}