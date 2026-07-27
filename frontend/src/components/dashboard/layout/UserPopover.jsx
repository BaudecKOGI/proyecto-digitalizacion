import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { GearSixIcon } from "@phosphor-icons/react/dist/ssr/GearSix";
import { SignOutIcon } from "@phosphor-icons/react/dist/ssr/SignOut";
import { UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { paths } from "@/paths";
import { authClient } from "@/lib/auth/client";
import { logger } from "@/lib/default-logger";
import { useUser } from "@/hooks/use-user";

export function UserPopover({ anchorEl, onClose, open }) {
	const { user, checkSession } = useUser();

	const navigate = useNavigate();

	const handleSignOut = React.useCallback(async () => {
		try {
			const { error } = await authClient.signOut();

			if (error) {
				logger.error("Sign out error", error);
				return;
			}

			// Refresh the auth state
			await checkSession?.();

			// UserProvider, for this case, will not refresh the router and we need to do it manually
			navigate(paths.auth.signIn);
			// no-op for now, error is handled, AuthGuard will handle the redirect
		} catch (error) {
			logger.error("Sign out error", error);
		}
	}, [checkSession, navigate]);

	return (
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
			onClose={onClose}
			open={open}
			slotProps={{ paper: { sx: { width: "240px" } } }}
		>
			<Box sx={{ p: "16px 20px", display: "flex", alignItems: "center", gap: 1.5 }}>
				<Avatar
					src={user?.avatar || "/assets/avatar_jonel.png"}
					sx={{ width: 44, height: 44, bgcolor: "primary.main", fontWeight: 700 }}
				>
					{(user?.name || "A").charAt(0).toUpperCase()}
				</Avatar>
				<Box sx={{ minWidth: 0 }}>
					<Typography variant="subtitle1" noWrap>{user?.name || user?.firstName || "Usuario"}</Typography>
					<Typography color="text.secondary" variant="body2" noWrap>
						{user?.email || "correo@continental.edu.pe"}
					</Typography>
				</Box>
			</Box>
			<Divider />
			<MenuList disablePadding sx={{ p: "8px", "& .MuiMenuItem-root": { borderRadius: 1 } }}>
				<MenuItem component={RouterLink} to={paths.dashboard.cuenta} onClick={onClose}>
					<ListItemIcon>
						<UserIcon fontSize="var(--icon-fontSize-md)" />
					</ListItemIcon>
					Perfil
				</MenuItem>
				<MenuItem onClick={handleSignOut}>
					<ListItemIcon>
						<SignOutIcon fontSize="var(--icon-fontSize-md)" />
					</ListItemIcon>
					Cerrar sesión
				</MenuItem>
			</MenuList>
		</Popover>
	);
}
