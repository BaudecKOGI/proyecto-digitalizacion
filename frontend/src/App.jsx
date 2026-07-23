import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Importacion de las rutas del editor y la landing page
import PublicHome from './pages/PublicHome';
import EditorLayout from './layouts/EditorLayout';
import { Login as EditorLogin } from './pages/editor/Login';
import { Hub as EditorHub } from './pages/editor/Hub';
import { Overview as EditorOverview } from './pages/editor/Overview';
import { ProjectsList as EditorProjectsList } from './pages/editor/ProjectsList';
import { NewProject as EditorNewProject } from './pages/editor/NewProject';
import { Profile as EditorProfile } from './pages/editor/Profile';

// Importaciones del dashboard y la autenticación del Admin
import SignInPage from "@/pages/auth/sign-in/SignIn";
import ResetPasswordPage from "@/pages/auth/reset-password/ResetPassword";
import AccountPage from "@/pages/dashboard/account/Account";
import DashboardOverviewPage from "@/pages/dashboard/Dashboard";
import Disenos3DPage from "@/pages/dashboard/Disenos3d";
import PrevisualizacionPage from "@/pages/dashboard/Previsualizacion";
import ProyectosDigitalesPage from "@/pages/dashboard/ProyectosDigitales";

// Imortación de los layouts para la autenticación y el dashboard
import { Layout as AuthLayout } from "@/layouts/AuthLayout";
import { Layout as DashboardLayout } from "@/layouts/DashboardLayout";

export default function App() {
  return (
    <Routes>
      {/* Ruta del landing page */}
      <Route path="/" element={<PublicHome />} />

      {/* Ruta del editor o encargado */}
      <Route path="/editor">
        {/* Rutas sin el Sidebar/Navbar */}
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<EditorLogin />} />
        <Route path="hub" element={<EditorHub />} />

        {/* Rutas CON el Sidebar/Navbar (el EditorLayout) */}
        <Route element={<EditorLayout />}>
          {/* Rutas 3D */}
          <Route path="3d">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EditorOverview isDig={false} projectsCount={0} />} />
            <Route path="proyectos" element={<EditorProjectsList mode="3d" projects={[]} />} />
            <Route path="nuevo" element={<EditorNewProject />} />
            <Route path="perfil" element={<EditorProfile />} />
          </Route>
          
          {/* Rutas Digitales */}
          <Route path="software">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EditorOverview isDig={true} projectsCount={0} />} />
            <Route path="proyectos" element={<EditorProjectsList mode="dig" projects={[]} />} />
            <Route path="nuevo" element={<EditorNewProject />} />
            <Route path="perfil" element={<EditorProfile />} />
          </Route>
        </Route>
      </Route>

      {/* Ruta de autenticación del Admin */}
      <Route path="/auth">
        <Route element={<AuthLayout />}>
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      {/* Rutas del panel del Admin o dashboard */}
      <Route path="/dashboard">
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardOverviewPage />} />
          <Route path="cuenta" element={<AccountPage />} />
          <Route path="disenos-3d" element={<Disenos3DPage />} />
          <Route path="previsualizacion" element={<PrevisualizacionPage />} />
          <Route path="proyectos-digitales" element={<ProyectosDigitalesPage />} />
        </Route>
      </Route>

      {/*CATCH-ALL: Si el usuario escribe una ruta que no existe, regresa al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}