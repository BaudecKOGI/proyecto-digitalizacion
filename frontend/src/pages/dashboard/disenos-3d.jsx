import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function Page() {
	return (
		<Box sx={{ p: 3 }}>
			<Card>
				<CardContent>
					<Typography variant="h4" gutterBottom>
						Diseños 3D
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Esta es una página en blanco lista para el contenido de Diseños 3D.
					</Typography>
				</CardContent>
			</Card>
		</Box>
	);
}
