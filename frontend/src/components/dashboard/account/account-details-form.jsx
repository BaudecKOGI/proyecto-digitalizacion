"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";

const states = [
	{ value: "distrito-capital", label: "Distrito Capital" },
	{ value: "miranda", label: "Miranda" },
	{ value: "zulia", label: "Zulia" },
	{ value: "carabobo", label: "Carabobo" },
];

export function AccountDetailsForm() {
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
			}}
		>
			<Card>
				<CardHeader subheader="La información puede ser editada" title="Perfil" />
				<Divider />
				<CardContent>
					<Grid container spacing={3}>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth required>
								<InputLabel>Nombre</InputLabel>
								<OutlinedInput defaultValue="Jonel" label="Nombre" name="firstName" />
							</FormControl>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth required>
								<InputLabel>Apellido</InputLabel>
								<OutlinedInput defaultValue="Villanueva" label="Apellido" name="lastName" />
							</FormControl>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth required>
								<InputLabel>Correo electronico</InputLabel>
								<OutlinedInput defaultValue="jonel@joarvi.io" label="Correo electronico" name="email" />
							</FormControl>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth>
								<InputLabel>Teléfono</InputLabel>
								<OutlinedInput label="Teléfono" name="phone" type="tel" />
							</FormControl>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth>
								<InputLabel>Estado</InputLabel>
								<Select defaultValue="Distrito Capital" label="Estado" name="state" variant="outlined">
									{states.map((option) => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth>
								<InputLabel>Ciudad</InputLabel>
								<OutlinedInput label="Ciudad" />
							</FormControl>
						</Grid>
					</Grid>
				</CardContent>
				<Divider />
				<CardActions sx={{ justifyContent: "flex-end" }}>
					<Button variant="contained">Guardar cambios</Button>
				</CardActions>
			</Card>
		</form>
	);
}
