import { tableCellClasses } from "@mui/material/TableCell";

export const MuiTableHead = {
	styleOverrides: {
		root: {
			backgroundColor: "#FFFFFF",
			[`& .${tableCellClasses.root}, & .${tableCellClasses.head}`]: {
				backgroundColor: "#FFFFFF !important",
				color: "#000000 !important",
				fontWeight: "700 !important",
				fontSize: "0.85rem",
				textTransform: "none !important",
				borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
			},
		},
	},
};
