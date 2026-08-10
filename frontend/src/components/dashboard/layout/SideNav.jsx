"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { SignOutIcon } from "@phosphor-icons/react/dist/ssr/SignOut";

import { paths } from "@/paths";
import { isNavItemActive } from "@/lib/is-nav-item-active";
import { Logo } from "@/components/core/logo";
import { authClient } from "@/lib/auth/client";
import { logger } from "@/lib/default-logger";
import { useUser } from "@/hooks/use-user";

import { getNavItems } from "./config";
import { navIcons } from "./NavIcons";

export function SideNav() {
	const location = useLocation();
	const pathname = location.pathname;
	const navigate = useNavigate();
	const { checkSession } = useUser();
	const [openLogoutModal, setOpenLogoutModal] = React.useState(false);

	const handleConfirmSignOut = React.useCallback(async () => {
		try {
			const { error } = await authClient.signOut();

			if (error) {
				logger.error("Sign out error", error);
				return;
			}

			await checkSession?.();
			navigate(paths.auth.signIn);
		} catch (error) {
			logger.error("Sign out error", error);
		}
	}, [checkSession, navigate]);

	return (
		<Box
			sx={{
				"--SideNav-background": "var(--mui-palette-neutral-950)",
				"--SideNav-color": "var(--mui-palette-common-white)",
				"--NavItem-color": "var(--mui-palette-neutral-300)",
				"--NavItem-hover-background": "rgba(255, 255, 255, 0.04)",
				"--NavItem-active-background": "var(--mui-palette-primary-main)",
				"--NavItem-active-color": "var(--mui-palette-primary-contrastText)",
				"--NavItem-disabled-color": "var(--mui-palette-neutral-500)",
				"--NavItem-icon-color": "var(--mui-palette-neutral-400)",
				"--NavItem-icon-active-color": "var(--mui-palette-primary-contrastText)",
				"--NavItem-icon-disabled-color": "var(--mui-palette-neutral-600)",
				bgcolor: "var(--SideNav-background)",
				color: "var(--SideNav-color)",
				display: { xs: "none", lg: "flex" },
				flexDirection: "column",
				height: "100%",
				left: 0,
				maxWidth: "100%",
				position: "fixed",
				scrollbarWidth: "none",
				top: 0,
				width: "var(--SideNav-width)",
				zIndex: "var(--SideNav-zIndex)",
				"&::-webkit-scrollbar": { display: "none" },
			}}
		>
			{/* Logo continental-blanco.png centrado y enlaza al Dashboard */}
			<Box
				sx={{
					p: 3,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "100%"
				}}
			>
				<Box
					component={RouterLink}
					to={paths.dashboard.overview}
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						textDecoration: "none"
					}}
				>
					<Logo color="light" height={48} width={155} />
				</Box>
			</Box>

			<Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />

			<Box component="nav" sx={{ flex: "1 1 auto", p: "12px" }}>
				{renderNavItems({ pathname, items: getNavItems() })}
			</Box>

			{/* Botón de Cierre de sesión al pie de la barra lateral (punteagudo y sin bordes) */}
			<Divider sx={{ borderColor: "var(--mui-palette-neutral-800)" }} />
			<Box sx={{ p: "12px" }}>
				<Box
					role="button"
					onClick={() => setOpenLogoutModal(true)}
					sx={{
						alignItems: "center",
						borderRadius: 0,
						border: "none",
						boxShadow: "none",
						color: "var(--NavItem-color)",
						cursor: "pointer",
						display: "flex",
						gap: 1.5,
						p: "10px 16px",
						textDecoration: "none",
						transition: "background-color 0.2s ease, color 0.2s ease",
						"&:hover": {
							bgcolor: "rgba(0, 241, 255, 0.12)",
							color: "#FFFFFF",
							"& svg": {
								color: "#FFFFFF"
							}
						}
					}}
				>
					<Box sx={{ alignItems: "center", display: "flex", justifyContent: "center" }}>
						<SignOutIcon fontSize="var(--icon-fontSize-md)" />
					</Box>
					<Typography
						component="span"
						sx={{ color: "inherit", fontSize: "0.875rem", fontWeight: 500, lineHeight: "28px" }}
					>
						Cerrar sesión
					</Typography>
				</Box>
			</Box>

			{/* Modal de confirmación para cerrar sesión estilo imagen y adaptable en responsive */}
			<Dialog
				open={openLogoutModal}
				onClose={() => setOpenLogoutModal(false)}
				PaperProps={{
					sx: {
						borderRadius: "10px",
						p: { xs: 2.5, sm: 3 },
						m: { xs: 2, sm: 3 },
						maxWidth: "420px",
						width: "calc(100% - 32px)",
						boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
					}
				}}
			>
				<DialogContent sx={{ p: 0, pt: 1, pb: 3, textAlign: "center" }}>
					<Typography variant="h6" sx={{ fontWeight: 700, color: "#000000", fontSize: { xs: "1.05rem", sm: "1.2rem" }, lineHeight: 1.4 }}>
						¿Estás seguro que deseas salir?
					</Typography>
				</DialogContent>
				<DialogActions
					sx={{
						p: 0,
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						justifyContent: "center",
						gap: { xs: 1.5, sm: 2.5 },
						width: "100%"
					}}
				>
					<Button
						onClick={() => setOpenLogoutModal(false)}
						variant="outlined"
						sx={{
							borderRadius: "2px",
							textTransform: "none",
							fontWeight: 600,
							fontSize: "0.95rem",
							color: "#002B49",
							borderColor: "#002B49",
							px: 4.5,
							py: 0.9,
							width: { xs: "100%", sm: "auto" },
							minWidth: { xs: "100%", sm: "135px" },
							"&:hover": { borderColor: "#002B49", bgcolor: "rgba(0, 43, 73, 0.04)" }
						}}
					>
						Cancelar
					</Button>
					<Button
						onClick={handleConfirmSignOut}
						variant="contained"
						sx={{
							borderRadius: "2px",
							textTransform: "none",
							fontWeight: 600,
							fontSize: "0.95rem",
							bgcolor: "#002B49",
							color: "#FFFFFF",
							px: 4.5,
							py: 0.9,
							width: { xs: "100%", sm: "auto" },
							minWidth: { xs: "100%", sm: "135px" },
							boxShadow: "none",
							"&:hover": { bgcolor: "#001e33", boxShadow: "none" }
						}}
					>
						Aceptar
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

function renderNavItems({ items = [], pathname }) {
	const children = items.reduce((acc, curr) => {
		const { key, ...item } = curr;

		acc.push(<NavItem key={key} pathname={pathname} {...item} />);

		return acc;
	}, []);

	return (
		<Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
			{children}
		</Stack>
	);
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title }) {
	const active = isNavItemActive({ disabled, external, href, matcher, pathname });
	const Icon = icon ? navIcons[icon] : null;

	return (
		<li>
			<Box
				{...(href
					? {
						component: external ? "a" : RouterLink,
						to: href,
						target: external ? "_blank" : undefined,
						rel: external ? "noreferrer" : undefined,
					}
					: { role: "button" })}
				sx={{
					alignItems: "center",
					borderRadius: 0,
					border: "none",
					boxShadow: "none",
					color: "var(--NavItem-color)",
					cursor: "pointer",
					display: "flex",
					flex: "0 0 auto",
					gap: 1.5,
					p: "8px 16px",
					position: "relative",
					textDecoration: "none",
					whiteSpace: "nowrap",
					transition: "background-color 0.2s ease, color 0.2s ease",
					"&:hover": {
						bgcolor: "var(--NavItem-hover-background)",
						color: "var(--mui-palette-common-white)",
						"& svg": {
							color: "var(--mui-palette-common-white)"
						}
					},
					...(disabled && {
						bgcolor: "var(--NavItem-disabled-background)",
						color: "var(--NavItem-disabled-color)",
						cursor: "not-allowed",
					}),
					...(active && {
						bgcolor: "var(--NavItem-active-background)",
						color: "var(--NavItem-active-color)",
						borderRadius: 0,
						border: "none",
						"&:hover": {
							bgcolor: "var(--NavItem-active-background)",
							color: "var(--NavItem-active-color)"
						}
					}),
				}}
			>
				<Box sx={{ alignItems: "center", display: "flex", justifyContent: "center", flex: "0 0 auto" }}>
					{Icon ? (
						<Icon
							fill={active ? "var(--NavItem-icon-active-color)" : "var(--NavItem-icon-color)"}
							fontSize="var(--icon-fontSize-md)"
							weight={active ? "fill" : undefined}
						/>
					) : null}
				</Box>
				<Box sx={{ flex: "1 1 auto" }}>
					<Typography
						component="span"
						sx={{ color: "inherit", fontSize: "0.875rem", fontWeight: 500, lineHeight: "28px" }}
					>
						{title}
					</Typography>
				</Box>
			</Box>
		</li>
	);
}
