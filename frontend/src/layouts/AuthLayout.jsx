import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Outlet, Link as RouterLink } from "react-router-dom";

import { paths } from "@/paths";
import Spline from "@splinetool/react-spline";

export function Layout({ children }) {
	return (
		<Box
			sx={{
				display: { xs: "flex", lg: "grid" },
				flexDirection: "column",
				gridTemplateColumns: { lg: "1fr 1.5fr", xl: "1fr 2fr" },
				minHeight: "100vh",
				height: { lg: "100vh" },
				overflow: { lg: "hidden" }
			}}
		>
			<Box sx={{ display: "flex", flex: "1 1 auto", flexDirection: "column", position: "relative" }}>
				<Box sx={{ p: 3, position: "absolute", top: 0, left: 0 }}>
					<Box component={RouterLink} to={paths.home} sx={{ display: "inline-block", fontSize: 0 }}>
						<Box component="img" src="/assets/logos/logo-continental-negro.png" alt="Universidad Continental Logo" sx={{ height: { xs: 30, md: 40, lg: 50 }, maxWidth: "100%", width: "auto", objectFit: "contain" }} />
					</Box>
				</Box>
				<Box sx={{ alignItems: "center", display: "flex", flex: "1 1 auto", justifyContent: "center", p: 3 }}>
					<Box sx={{ maxWidth: "450px", width: "100%" }}>{children || <Outlet />}</Box>
				</Box>
			</Box>
			<Box
				sx={{
					alignItems: "center",
					background: "radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)",
					color: "var(--mui-palette-common-white)",
					display: { xs: "none", lg: "flex" },
					flexDirection: "column",
					p: 0,
				}}
			>
				<Stack spacing={1} sx={{ pt: 8, px: 3, pb: 4, width: "100%" }}>
					<Typography color="inherit" sx={{ fontSize: "28px", lineHeight: "36px", textAlign: "center" }} variant="h1">
						Bienvenido al{" "}
						<Box component="span" sx={{ color: "#15b79e" }}>
							FAB LAB
						</Box>
					</Typography>
					<Typography align="center" variant="subtitle1">
						Plataforma de gestión y control para el laboratorio de fabricación.
					</Typography>
				</Stack>
				<Box sx={{
					flex: 1,
					width: "100%",
					minHeight: 0,
					overflow: "hidden",
					display: "flex",
					WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
					maskImage: "radial-gradient(circle at center, black 30%, transparent 80%)"
				}}>
					<Spline scene="https://prod.spline.design/Ku7X21pZXzCCrnPv/scene.splinecode" style={{ width: '100%', height: '100%' }} />
				</Box>
			</Box>
		</Box>
	);
}
