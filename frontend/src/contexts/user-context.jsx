"use client";

import * as React from "react";

import { authClient } from "@/lib/auth/client";
import { logger } from "@/lib/default-logger";

export const UserContext = React.createContext(undefined);

export function UserProvider({ children }) {
	const [state, setState] = React.useState({
		user: null,
		error: null,
		isLoading: true,
	});

	const checkSession = React.useCallback(async () => {
		try {
			const { data, error } = await authClient.getUser();

			if (error) {
				logger.error(error);
				setState((prev) => ({ ...prev, user: null, error: "Something went wrong", isLoading: false }));
				return;
			}

			setState((prev) => ({ ...prev, user: data ?? null, error: null, isLoading: false }));
		} catch (error) {
			logger.error(error);
			setState((prev) => ({ ...prev, user: null, error: "Something went wrong", isLoading: false }));
		}
	}, []);

	React.useEffect(() => {
		checkSession().catch((error) => {
			logger.error(error);
			// noop
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
	}, []);

	return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
