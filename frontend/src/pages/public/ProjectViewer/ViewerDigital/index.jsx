import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Monitor } from "lucide-react";
import { fetchProyectoSoftwareById } from "@/services/api";

import DigitalCanvas from "./DigitalCanvas";
import DetallesDigital from "./DetallesDigital";

export default function ViewerDigitalPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchProyectoSoftwareById(id, true);
        setProyecto(data);

        fetch(`http://127.0.0.1:8000/api/metricas/por-proyecto/${id}/view/`, {
          method: "POST",
        }).catch(() => { });
      } catch (err) {
        setError("Error al cargar el proyecto. Puede que no exista o no sea público.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const toggleSidebar = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setSidebarOpen((prev) => !prev);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", bgcolor: "#090D16", flexDirection: "column", gap: 3 }}>
        <CircularProgress size={48} sx={{ color: "#22d3ee" }} />
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>
          Cargando proyecto...
        </Typography>
      </Box>
    );
  }

  if (error || !proyecto) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", bgcolor: "#090D16", flexDirection: "column", gap: 2, textAlign: "center", px: 4 }}>
        <Monitor size={56} color="rgba(255,255,255,0.3)" />
        <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mt: 1 }}>
          {error || "Proyecto no encontrado"}
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
          El proyecto puede no existir o no estar publicado.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        bgcolor: "#090D16",
        overflow: "hidden",
      }}
    >
      <DigitalCanvas
        proyecto={proyecto}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      <DetallesDigital
        proyecto={proyecto}
        sidebarOpen={sidebarOpen}
      />
    </Box>
  );
}
