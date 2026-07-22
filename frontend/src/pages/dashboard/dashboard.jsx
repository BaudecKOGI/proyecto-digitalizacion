import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function Page() {
	return (
		<Grid container spacing={3}>
			<Grid size={{ xs: 12 }}>
				<Card>
					<CardContent>
						<Typography variant="h4" gutterBottom>
							Panel de Control FAB LAB
						</Typography>
						<Typography variant="body1" color="text.secondary">
							Este es tu espacio de trabajo. Aquí puedes comenzar a construir las herramientas y tablas necesarias para la gestión del laboratorio.
						</Typography>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}
