import * as React from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";

// Importación de las rutas del editor y la landing page
import PublicHome from "./pages/PublicHome";
import PublicViewer3DPage from "./pages/public/Viewer3D/PublicViewer3DPage";
import Gallery3DPage from "./pages/public/Gallery/Gallery3DPage";
import GallerySoftwarePage from "./pages/public/Gallery/GallerySoftwarePage";
import PublicODSPage from "./pages/public/ODS/PublicODSPage";
import PublicFabLabPage from "./pages/public/FabLab/PublicFabLabPage";
import EditorLayout from "./layouts/EditorLayout";
import { Hub as EditorHub } from "./pages/editor/Hub";
import { AssistantWidget } from "./components/assistant";

// RUTAS DE 3D
import { Overview as EditorOverview } from "./pages/editor/3d/Dashboard3D";
import { ProjectsList3D as EditorProjectsList } from "./pages/editor/3d/ProjectsList3D";
import { NewProject3D as EditorNewProject } from "./pages/editor/3d/NewProject3D";
import { EditProject3D as EditorEditProject } from "./pages/editor/3d/EditProject3D";
import { ProjectDetailView3D } from "./pages/editor/3d/ProjectDetailView3D";
import { Careers3D } from "./pages/editor/3d/Careers3D";

// RUTAS DE SOFTWARE 
import { DashboardSoftware } from "./pages/editor/software/DashboardSoftware";
import ProjectsListSoftware from "./pages/editor/software/ProjectsListSoftware";
import NewProjectSoftware from "./pages/editor/software/NewProjectSoftware";
import EditProjectSoftware from "./pages/editor/software/EditProjectSoftware";
import CareersSoftware from "./pages/editor/software/CareersSoftware";

// Perfil
import { Profile as EditorProfile } from "./pages/editor/Profile";

// Dashboard Admin
import SignInPage from "@/pages/auth/sign-in/SignIn";
import ResetPasswordPage from "@/pages/auth/reset-password/ResetPassword";
import AccountPage from "@/pages/dashboard/account/Account";
import DashboardOverviewPage from "@/pages/dashboard/dashboard/Dashboard";
import Disenos3DPage from "@/pages/dashboard/3DDesigns/Disenos3D";
import ProyectosDigitalesPage from "@/pages/dashboard/digitalProjects/ProyectosDigitales";
import EditoresPage from "@/pages/dashboard/editores/Editores";
import CategoriasPage from "@/pages/dashboard/categorias/Categorias";
import VisualizacionesPage from "@/pages/dashboard/visualizaciones/Visualizaciones";

// Layouts
import { Layout as AuthLayout } from "@/layouts/AuthLayout";
import { Layout as DashboardLayout } from "@/layouts/DashboardLayout";

export default function App() {
  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route
          element={
            <>
              <Outlet />
              <AssistantWidget />
            </>
          }
        >
          <Route path="/" element={<PublicHome />} />
          <Route path="/proyecto/3d/:id" element={<PublicViewer3DPage />} />
          <Route path="/galeria/3d" element={<Gallery3DPage />} />
          <Route path="/galeria/software" element={<GallerySoftwarePage />} />
          <Route path="/ods" element={<PublicODSPage />} />
          <Route path="/fablab" element={<PublicFabLabPage />} />
        </Route>

        {/* Editor */}
        <Route path="/editor">
          {/* Sin Layout */}
          <Route index element={<Navigate to="/auth/sign-in" replace />} />
          <Route path="login" element={<Navigate to="/auth/sign-in" replace />} />
          <Route path="hub" element={<EditorHub />} />

          {/* Con Layout */}
          <Route element={<EditorLayout />}>
            {/* ==================== 3D ==================== */}
            <Route path="3d">
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route
                path="dashboard"
                element={<EditorOverview isDig={false} projectsCount={0} />}
              />

              <Route
                path="proyectos"
                element={<EditorProjectsList mode="3d" projects={[]} />}
              />

              <Route path="nuevo" element={<EditorNewProject />} />
              <Route path="editar/:id" element={<EditorEditProject />} />
              <Route path="detalle/:id" element={<ProjectDetailView3D />} />

              <Route path="carreras" element={<Careers3D />} />
              <Route path="carreras/:carrera" element={<Careers3D />} />
              <Route
                path="carreras/:carrera/:ciclo"
                element={<Careers3D />}
              />

              <Route path="perfil" element={<EditorProfile />} />
            </Route>

            {/* ==================== SOFTWARE ==================== */}
            <Route path="software">
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route
                path="dashboard"
                element={<DashboardSoftware />}
              />

              <Route
                path="proyectos"
                element={<ProjectsListSoftware />}
              />

              <Route path="nuevo" element={<NewProjectSoftware />} />
              <Route path="editar/:id" element={<EditProjectSoftware />} />

              <Route path="carreras" element={<CareersSoftware />} />
              <Route
                path="carreras/:carrera"
                element={<CareersSoftware />}
              />
              <Route
                path="carreras/:carrera/:ciclo"
                element={<CareersSoftware />}
              />

              <Route path="perfil" element={<EditorProfile />} />
            </Route>
          </Route>
        </Route>

        {/* Autenticación */}
        <Route path="/auth">
          <Route element={<AuthLayout />}>
            <Route path="sign-in" element={<SignInPage />} />
            <Route
              path="reset-password"
              element={<ResetPasswordPage />}
            />
          </Route>
        </Route>

        {/* Dashboard */}
        <Route path="/dashboard">
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardOverviewPage />} />
            <Route path="cuenta" element={<AccountPage />} />
            <Route path="disenos-3d" element={<Disenos3DPage />} />
            <Route
              path="proyectos-digitales"
              element={<ProyectosDigitalesPage />}
            />
            <Route path="editores" element={<EditoresPage />} />
            <Route path="categorias" element={<CategoriasPage />} />
            <Route
              path="visualizaciones"
              element={<VisualizacionesPage />}
            />
          </Route>
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}