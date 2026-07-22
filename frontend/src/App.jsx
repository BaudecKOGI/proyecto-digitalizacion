import * as React from "react";
import SignInPage from "@/pages/auth/sign-in/sign-in";
import ResetPasswordPage from "@/pages/auth/reset-password/reset-password";
import AccountPage from "@/pages/dashboard/account/account";
import DashboardOverviewPage from "@/pages/dashboard/dashboard";
import Disenos3DPage from "@/pages/dashboard/disenos-3d";
import PrevisualizacionPage from "@/pages/dashboard/previsualizacion";
import ProyectosDigitalesPage from "@/pages/dashboard/proyectos-digitales";
import { Navigate, Route, Routes } from "react-router-dom";

// Layouts
import { Layout as AuthLayout } from "@/components/auth/layout";
import { Layout as DashboardLayout } from "@/components/dashboard/layout/layout";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/dashboard" replace />} />

			<Route path="/auth">
				<Route element={<AuthLayout />}>
					<Route path="sign-in" element={<SignInPage />} />
					<Route path="reset-password" element={<ResetPasswordPage />} />
				</Route>
			</Route>

			<Route path="/dashboard">
				<Route element={<DashboardLayout />}>
					<Route index element={<DashboardOverviewPage />} />
					<Route path="cuenta" element={<AccountPage />} />
					<Route path="disenos-3d" element={<Disenos3DPage />} />
					<Route path="previsualizacion" element={<PrevisualizacionPage />} />
					<Route path="proyectos-digitales" element={<ProyectosDigitalesPage />} />
				</Route>
			</Route>

			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}
