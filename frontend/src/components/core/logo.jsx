"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import { useColorScheme } from "@mui/material/styles";


const HEIGHT = 60;
const WIDTH = 60;

export function Logo({ height = HEIGHT, width = WIDTH, color = "dark" }) {
	const url = color === "light" ? "/assets/logos/continental-blanco.png" : "/assets/logos/logo-continental-negro.png";
	return (
		<Box
			alt="FAB LAB Logo"
			component="img"
			height={height}
			width={width}
			src={url}
			sx={{ objectFit: "contain", maxWidth: "100%" }}
		/>
	);
}

export function DynamicLogo({ colorDark = "light", colorLight = "dark", height = HEIGHT, width = WIDTH, ...props }) {
	const { colorScheme } = useColorScheme();
	const color = colorScheme === "dark" ? colorDark : colorLight;

	return (
		<Logo color={color} height={height} width={width} {...props} />
	);
}
