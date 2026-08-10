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
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";

import { usePopover } from "@/hooks/use-popover";
import { useUser } from "@/hooks/use-user";

import { MobileNav } from "./MobileNav";
import { UserPopover } from "./UserPopover";

export function MainNav() {
	const [openNav, setOpenNav] = React.useState(false);
	const { user } = useUser();

	const userPopover = usePopover();

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
						<Tooltip title="Buscar">
							<IconButton>
								<MagnifyingGlassIcon />
							</IconButton>
						</Tooltip>
					</Stack>
					<Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
						<Tooltip title="Contactos">
							<IconButton>
								<UsersIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title="Notificaciones">
							<Badge badgeContent={4} color="success" variant="dot">
								<IconButton>
									<BellIcon />
								</IconButton>
							</Badge>
						</Tooltip>
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
