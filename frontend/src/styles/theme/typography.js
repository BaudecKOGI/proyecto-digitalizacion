const primaryFont = '"Roboto", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
const secondaryFont = '"Poppins", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

export const typography = {
	fontFamily: primaryFont,
	body1: { fontFamily: primaryFont, fontSize: "1rem", fontWeight: 400, lineHeight: 1.5 },
	body2: { fontFamily: primaryFont, fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.57 },
	button: { fontFamily: primaryFont, fontWeight: 500 },
	caption: { fontFamily: primaryFont, fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.66 },
	subtitle1: { fontFamily: secondaryFont, fontSize: "1rem", fontWeight: 600, lineHeight: 1.57 },
	subtitle2: { fontFamily: secondaryFont, fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.57 },
	overline: {
		fontFamily: primaryFont,
		fontSize: "0.75rem",
		fontWeight: 600,
		letterSpacing: "0.5px",
		lineHeight: 2.5,
		textTransform: "uppercase",
	},
	h1: { fontFamily: secondaryFont, fontSize: "3.5rem", fontWeight: 600, lineHeight: 1.2 },
	h2: { fontFamily: secondaryFont, fontSize: "3rem", fontWeight: 600, lineHeight: 1.2 },
	h3: { fontFamily: secondaryFont, fontSize: "2.25rem", fontWeight: 600, lineHeight: 1.2 },
	h4: { fontFamily: secondaryFont, fontSize: "2rem", fontWeight: 600, lineHeight: 1.2 },
	h5: { fontFamily: secondaryFont, fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2 },
	h6: { fontFamily: secondaryFont, fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.2 },
};
