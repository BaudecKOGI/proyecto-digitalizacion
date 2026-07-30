import * as React from "react";
import { Card, CardContent, Typography, Box, Avatar, LinearProgress, Stack } from "@mui/material";
import { ArrowUp as ArrowUpIcon } from "@phosphor-icons/react/dist/ssr/ArrowUp";
import { ArrowDown as ArrowDownIcon } from "@phosphor-icons/react/dist/ssr/ArrowDown";

/**
 * TARJETA DE ESTADÍSTICA (KPI) DEL DASHBOARD
 * Estilo visual limpio y fiel a la referencia (sin exceso de texto, icono circular sólido, indicador de tendencia o progreso).
 */
export default function SummaryStatCard({
  title,
  value,
  icon,
  color = "#6366F1",
  trend,
  progress
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0px 12px 28px rgba(0, 0, 0, 0.08)"
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography
              color="text.secondary"
              variant="overline"
              sx={{
                fontWeight: 700,
                letterSpacing: 1,
                mb: 1,
                display: "block",
                fontSize: "0.75rem",
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
              {value}
            </Typography>
          </Box>

          <Avatar
            sx={{
              backgroundColor: color,
              color: "#ffffff",
              height: 56,
              width: 56
            }}
          >
            {icon}
          </Avatar>
        </Box>

        {trend && (
          <Box sx={{ mt: 3, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ color: trend.direction === "up" ? "success.main" : "error.main", fontWeight: 700 }}
            >
              {trend.direction === "up" ? <ArrowUpIcon weight="bold" /> : <ArrowDownIcon weight="bold" />}
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {trend.value}%
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 500 }}>
              Desde el mes pasado
            </Typography>
          </Box>
        )}

        {progress !== undefined && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress
              value={progress}
              variant="determinate"
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "action.hover",
                "& .MuiLinearProgress-bar": { backgroundColor: color, borderRadius: 3 }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
