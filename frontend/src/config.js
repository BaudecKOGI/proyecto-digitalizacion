import { getSiteURL } from "@/lib/get-site-url";
import { LogLevel } from "@/lib/logger";

export const config = {
	site: { name: "FAB LAB", description: "", themeColor: "#090a0b", url: getSiteURL() },
	logLevel: import.meta.env.VITE_LOG_LEVEL ?? LogLevel.ALL,
};
