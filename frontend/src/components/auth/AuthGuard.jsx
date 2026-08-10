import * as React from "react";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

import { paths } from "@/paths";
import { logger } from "@/lib/default-logger";
import { useUser } from "@/hooks/use-user";

export function AuthGuard({ children, requiredRole }) {
	const navigate = useNavigate();
	const { user, error, isLoading } = useUser();
	const [isChecking, setIsChecking] = React.useState(true);

	const checkPermissions = async () => {
		if (isLoading) {
			return;
		}

		if (error) {
			setIsChecking(false);
			return;
		}

		if (!user) {
			logger.debug("[AuthGuard]: User is not logged in, redirecting to sign in");
			navigate(paths.auth.signIn, { replace: true });
			return;
		}

		// Validación estricta por rol (ADMIN vs EDITOR)
		if (requiredRole) {
			const userRol = (user.rol || "").toUpperCase();
			const allowedRoles = Array.isArray(requiredRole)
				? requiredRole.map((r) => r.toUpperCase())
				: [requiredRole.toUpperCase()];

			if (!allowedRoles.includes(userRol)) {
				logger.debug(`[AuthGuard]: User role ${userRol} not allowed for ${requiredRole}`);
				if (userRol === "EDITOR") {
					navigate("/editor/hub", { replace: true });
				} else {
					navigate(paths.dashboard.overview, { replace: true });
				}
				return;
			}
		}

		setIsChecking(false);
	};

	React.useEffect(() => {
		checkPermissions().catch(() => {
		});
	}, [user, error, isLoading]);

	if (isChecking) {
		return null;
	}

	if (error) {
		return <Alert color="error">{error}</Alert>;
	}

	return <React.Fragment>{children}</React.Fragment>;
}
