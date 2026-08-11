import * as React from "react";
import { Card, Box, Typography, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/**
 * TARJETA DE ESTADÍSTICA 
 */
export default function SummaryStatCard({
  title,
  value,
  icon,
  bgIcon,
  color = "#6366F1",
}) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        bgcolor: "background.paper",
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        p: 2.5,
        overflow: "hidden",
        height: "100%",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[4],
          borderColor: color,
          "& .accent-bar": {
            height: "6px",
          },
          "& .bg-icon": {
            opacity: 0.12,
            transform: "rotate(8deg) scale(1.08)",
          },
        },
      }}
    >
      {/* Barra superior */}
      <Box
        className="accent-bar"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "3px",
          bgcolor: color,
          transition: "height 0.3s ease",
        }}
      />

      {/* Icono de fondo */}
      <Box
        className="bg-icon"
        sx={{
          position: "absolute",
          right: -20,
          bottom: -20,
          color: color,
          opacity: 0.04,
          transition: "all 0.5s ease",
          "& svg": {
            fontSize: 130,
          },
        }}
      >
        {bgIcon}
      </Box>

      {/* Contenido */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontSize: "0.7rem",
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              p: 0.6,
              borderRadius: "8px",
              bgcolor: `${color}10`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Stack>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            fontSize: "2.2rem",
            lineHeight: 1.2,
            mt: 0.5,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Card>
  );
}