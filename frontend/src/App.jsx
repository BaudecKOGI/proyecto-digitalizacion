import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Importación de las rutas del editor y la landing page
import PublicHome from './pages/PublicHome';
import EditorLayout from './layouts/EditorLayout';
import { Hub as EditorHub } from './pages/editor/Hub';

// --- RUTAS DE 3D ---
import { Overview as EditorOverview } from './pages/editor/3d/Dashboard3D';
import { ProjectsList3D as EditorProjectsList } from './pages/editor/3d/ProjectsList3D';
import { NewProject3D as EditorNewProject } from './pages/editor/3d/NewProject3D';
import { EditProject3D as EditorEditProject } from './pages/editor/3d/EditProject3D';

// --- RUTAS DE SOFTWARE (DESARROLLO DIGITAL) ---
import { DashboardSoftware } from './pages/editor/software/DashboardSoftware';
import ProjectsListSoftware from './pages/editor/software/ProjectsListSoftware';
import NewProjectSoftware from './pages/editor/software/NewProjectSoftware';
import EditProjectSoftware from './pages/editor/software/EditProjectSoftware';

// Ruta de Perfil compartida por el editor
import { Profile as EditorProfile } from './pages/editor/Profile';

// Importaciones del dashboard y la autenticación del Admin
import SignInPage from "@/pages/auth/sign-in/SignIn";
import ResetPasswordPage from "@/pages/auth/reset-password/ResetPassword";
import AccountPage from "@/pages/dashboard/account/Account";
import DashboardOverviewPage from "@/pages/dashboard/dashboard/Dashboard";
import Disenos3DPage from "@/pages/dashboard/3DDesigns/Disenos3D";
import ProyectosDigitalesPage from "@/pages/dashboard/digitalProjects/ProyectosDigitales";
import EditoresPage from "@/pages/dashboard/editores/Editores";
import CategoriasPage from "@/pages/dashboard/categorias/Categorias";
import VisualizacionesPage from "@/pages/dashboard/Visualizaciones";

// Importación de los layouts para la autenticación y el dashboard
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
        <Route index element={<Navigate to="/auth/sign-in" replace />} />
        <Route path="login" element={<Navigate to="/auth/sign-in" replace />} />
        <Route path="hub" element={<EditorHub />} />

        {/* Rutas CON el Sidebar/Navbar (el EditorLayout) */}
        <Route element={<EditorLayout />}>
          
          {/* SECCIÓN 3D */}
          <Route path="3d">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EditorOverview isDig={false} projectsCount={0} />} />
            <Route path="proyectos" element={<EditorProjectsList mode="3d" projects={[]} />} />
            <Route path="nuevo" element={<EditorNewProject />} />
            <Route path="editar/:id" element={<EditorEditProject />} />
            <Route path="perfil" element={<EditorProfile />} />
          </Route>

          {/* SECCIÓN SOFTWARE (PROYECTOS DIGITALES) */}
          <Route path="software">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardSoftware />} />
            <Route path="proyectos" element={<ProjectsListSoftware />} />
            <Route path="nuevo" element={<NewProjectSoftware />} />
            <Route path="editar/:id" element={<EditProjectSoftware />} />
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
          <Route path="proyectos-digitales" element={<ProyectosDigitalesPage />} />
          <Route path="editores" element={<EditoresPage />} />
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="visualizaciones" element={<VisualizacionesPage />} />
        </Route>
      </Route>

      {/* CATCH-ALL: Si el usuario escribe una ruta que no existe, regresa al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}