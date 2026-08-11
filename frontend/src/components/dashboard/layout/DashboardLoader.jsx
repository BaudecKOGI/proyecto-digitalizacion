import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/system";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export function DashboardLoader({ text = "Cargando..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 400,
        bgcolor: "transparent",
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          border: "4px solid rgba(0, 43, 73, 0.1)",
          borderLeftColor: "#22d3ee",
          borderRadius: "50%",
          animation: `${spin} 1s linear infinite`,
          mb: 2,
        }}
      />
      <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, textTransform: "uppercase" }}>
        {text}
      </Typography>
    </Box>
  );
}
