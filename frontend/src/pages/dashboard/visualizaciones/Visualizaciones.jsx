import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Link
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { ArrowClockwise as RefreshIcon } from "@phosphor-icons/react/dist/ssr/ArrowClockwise";

import VisualizacionesChart from "./VisualizacionesChart";
import MetricasRankingTable from "./MetricasRankingTable";

export default function VisualizacionesPage() {
  const [metricas, setMetricas] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchMetricas = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/metricas/");
      if (res.ok) {
        const data = await res.json();
        const lista = Array.isArray(data) ? data : data.results || [];
        if (lista.length > 0) {
          setMetricas(lista);
        }
      }
    } catch (err) {
      console.error("No se pudieron cargar las métricas desde el servidor:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMetricas();
  }, [fetchMetricas]);

  const syncButton = (
    <Button
      variant="outlined"
      startIcon={<RefreshIcon weight="bold" />}
      onClick={fetchMetricas}
      disabled={loading}
      sx={{
        textTransform: "none",
        fontWeight: 700,
        borderRadius: "4px",
        borderColor: "rgba(0,0,0,0.15)",
        color: "#002B49",
        px: 2.5,
        py: 1,
        "&:hover": {
          borderColor: "#002B49",
          bgcolor: "rgba(0, 43, 73, 0.04)"
        }
      }}
    >
      {loading ? "Actualizando..." : "Sincronizar Métricas"}
    </Button>
  );

  return (
    <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
      <Box sx={{ width: "100%" }}>
        <VisualizacionesChart metricas={metricas} syncButton={syncButton} />
        <MetricasRankingTable metricas={metricas} />
      </Box>
    </Box>
  );
}
