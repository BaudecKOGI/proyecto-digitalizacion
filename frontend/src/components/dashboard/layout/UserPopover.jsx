import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
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

	const [openLogoutModal, setOpenLogoutModal] = React.useState(false);

	const handleSignOut = React.useCallback(async () => {
		setOpenLogoutModal(false);
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
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
			onClose={onClose}
			open={open}
			slotProps={{ paper: { sx: { width: "240px" } } }}
		>
			<Box sx={{ p: "16px 20px", display: "flex", alignItems: "center", gap: 1.5 }}>
				<Avatar
					src={user?.avatar || "/assets/user.png"}
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
				<MenuItem onClick={() => setOpenLogoutModal(true)}>
					<ListItemIcon>
						<SignOutIcon fontSize="var(--icon-fontSize-md)" />
					</ListItemIcon>
					Cerrar sesión
				</MenuItem>
			</MenuList>

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
						onClick={handleSignOut}
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
		</Popover>
	);
}
