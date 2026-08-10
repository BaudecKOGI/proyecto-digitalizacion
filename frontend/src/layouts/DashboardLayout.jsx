import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import GlobalStyles from "@mui/material/GlobalStyles";
import { Outlet, useLocation } from "react-router-dom";

import { AuthGuard } from "@/components/auth/AuthGuard";

import { MainNav } from "@/components/dashboard/layout/MainNav";
import { SideNav } from "@/components/dashboard/layout/SideNav";


export function Layout({ children }) {
	const location = useLocation();

	// Scroll al inicio cada vez que cambia la ruta del dashboard
	React.useEffect(() => {
		window.scrollTo({ top: 0, behavior: "instant" });
	}, [location.pathname]);

	return (
		<AuthGuard requiredRole="ADMIN">
			<GlobalStyles
				styles={{
					body: {
						"--MainNav-height": "56px",
						"--MainNav-zIndex": 1000,
						"--SideNav-width": "236px",
						"--SideNav-zIndex": 1100,
						"--MobileNav-width": "260px",
						"--MobileNav-zIndex": 1100,
					},
				}}
			/>

			<Box
				sx={{
					bgcolor: "#F8FAFC",
					display: "flex",
					flexDirection: "column",
					position: "relative",
					minHeight: "100vh",
				}}
			>
				<SideNav />
				<Box sx={{ display: "flex", flex: "1 1 auto", flexDirection: "column", pl: { lg: "var(--SideNav-width)" }, bgcolor: "#F8FAFC" }}>
					<MainNav />
					<Box component="main" sx={{ flexGrow: 1, bgcolor: "#F8FAFC", minHeight: "calc(100vh - 64px)" }}>
						<Container maxWidth="xl" sx={{ pt: { xs: "8px", md: "12px" }, px: { xs: 1.5, sm: 2.5, md: 3 }, pb: "64px" }}>
							{children || <Outlet />}
						</Container>
					</Box>
				</Box>
			</Box>
		</AuthGuard>
	);
}
