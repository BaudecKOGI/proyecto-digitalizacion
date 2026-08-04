import * as React from "react";
import { Card, Box, Typography } from "@mui/material";

/**
 * TARJETA DE ESTADÍSTICA (KPI) DEL DASHBOARD
 */
export default function SummaryStatCard({
  title,
  value,
  icon,
  color = "#6366F1",
  trend,
  subtitle
}) {
  const renderFooterText = () => {
    if (subtitle) return subtitle;
    if (trend) {
      const sign = trend.direction === "up" ? "+" : "-";
      return `${sign}${trend.value}% este último mes`;
    }
    return "Actualizado en tiempo real";
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.75,
        px: 2.25,
        borderRadius: "6px",
        backgroundColor: color,
        color: "#ffffff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        border: "none",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Columna Izquierda: Título, Valor, Subtítulo */}
      <Box sx={{ display: "flex", flexDirection: "column", zIndex: 1, pr: 1.5 }}>
        <Typography
          sx={{
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.9)",
            mb: 0.5,
            lineHeight: 1.2
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: "1.65rem",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            mb: 0.5
          }}
        >
          {value}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.85)",
            lineHeight: 1.2
          }}
        >
          {renderFooterText()}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255, 255, 255, 0.25)",
          zIndex: 0,
          flexShrink: 0
        }}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(icon, { size: 52, weight: "regular" })
          : icon}
      </Box>
    </Card>
  );
}
