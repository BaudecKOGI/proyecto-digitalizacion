export function getSiteURL() {
	let url =
		import.meta.env.VITE_SITE_URL ??
		import.meta.env.VITE_VERCEL_URL ??
		"http://localhost:5173/";
	url = url.includes("http") ? url : `https://${url}`;
	url = url.endsWith("/") ? url : `${url}/`;
	return url;
}
