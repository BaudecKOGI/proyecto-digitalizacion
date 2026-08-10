"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { ListIcon } from "@phosphor-icons/react/dist/ssr/List";
import { UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { useLocation, Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import { usePopover } from "@/hooks/use-popover";
import { useUser } from "@/hooks/use-user";

import { MobileNav } from "./MobileNav";
import { UserPopover } from "./UserPopover";

const BREADCRUMB_MAP = {
  "disenos-3d": "Modelos 3D",
  "proyectos-digitales": "Proyectos Digitales",
  "editores": "Editores",
  "categorias": "Categorías",
  "carreras": "Carreras",
  "visualizaciones": "Visualizaciones",
  "cuenta": "Perfil",
};

export function MainNav() {
	const [openNav, setOpenNav] = React.useState(false);
	const { user } = useUser();
	const location = useLocation();

	const userPopover = usePopover();

	const getBreadcrumb = () => {
		const parts = location.pathname.split("/").filter(Boolean);
		if (parts[0] !== "dashboard" || parts.length < 2) return null;
		
		let title = BREADCRUMB_MAP[parts[1]] || "";
		if (!title) return null;

		if (parts.length > 2 && parts[2] === "detalle") {
			title += " / Detalles";
		}

		return (
			<Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500, display: "block", fontSize: "0.95rem" }}>
				<Link component={RouterLink} to="/dashboard" color="inherit" underline="hover">Inicio</Link> / {title}
			</Typography>
		);
	};

	return (
		<React.Fragment>
			<Box
				component="header"
				sx={{
					borderBottom: "1px solid var(--mui-palette-divider)",
					backgroundColor: "var(--mui-palette-background-paper)",
					position: "sticky",
					top: 0,
					zIndex: "var(--mui-zIndex-appBar)",
				}}
			>
				<Stack
					direction="row"
					spacing={2}
					sx={{ alignItems: "center", justifyContent: "space-between", minHeight: "64px", px: 2 }}
				>
					<Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
						<IconButton
							onClick={() => {
								setOpenNav(true);
							}}
							sx={{ display: { lg: "none" } }}
						>
							<ListIcon />
						</IconButton>
						{getBreadcrumb()}
					</Stack>
					<Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
						<Avatar
							onClick={userPopover.handleOpen}
							ref={userPopover.anchorRef}
							src={user?.avatar || "/assets/user.png"}
							sx={{ cursor: "pointer" }}
						>
							{(user?.name || "A").charAt(0).toUpperCase()}
						</Avatar>
					</Stack>
				</Stack>
			</Box>
			<UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
			<MobileNav
				onClose={() => {
					setOpenNav(false);
				}}
				open={openNav}
			/>
		</React.Fragment>
	);
}
