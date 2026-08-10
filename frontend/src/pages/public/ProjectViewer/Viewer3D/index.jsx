import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { fetchProyecto3DById } from "@/services/api";

import Viewer3D from "./Viewer3D";
import Detalles3D from "./Detalles3D";

export default function Viewer3DPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [diseno, setDiseno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [habilitarCamara, setHabilitarCamara] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchProyecto3DById(id, true);
        setDiseno(data);

        // Registrar visita silenciosamente solo si no ha sido visto antes
        const viewed = JSON.parse(localStorage.getItem("viewed_3d_projects") || "[]");
        if (!viewed.includes(id)) {
          fetch(`http://127.0.0.1:8000/api/metricas/por-proyecto/${id}/view/`, {
            method: "POST",
          }).catch(() => { });
          viewed.push(id);
          localStorage.setItem("viewed_3d_projects", JSON.stringify(viewed));
        }
      } catch (err) {
        setError("Error al cargar el modelo 3D. Puede que no exista o no sea público.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    fetch(`http://127.0.0.1:8000/api/metricas/por-proyecto/${id}/share/`, {
      method: "POST",
    }).catch(() => { });
  };

  const toggleSidebar = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setSidebarOpen((prev) => !prev);
  };

  // Estados de carga / error
  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#090D16",
        }}
      >
        <CircularProgress sx={{ color: "#22d3ee" }} />
      </Box>
    );
  }

  if (error || !diseno) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#090D16",
          color: "#fff",
        }}
      >
        <CubeIcon size={80} weight="duotone" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {error || "Diseño no encontrado"}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{
            mt: 3,
            color: "#fff",
            borderColor: "rgba(255,255,255,0.3)",
            "&:hover": { borderColor: "#fff" },
          }}
        >
          Volver al Inicio
        </Button>
      </Box>
    );
  }

  // Preparar datos del modelo
  let piezasMoviles = [];
  if (diseno.configuracion_interactiva) {
    let config = diseno.configuracion_interactiva;
    if (typeof config === "string") {
      try {
        config = JSON.parse(config);
      } catch {
        // ignore
      }
    }
    if (Array.isArray(config)) {
      piezasMoviles = config;
    } else if (config?.piezas_moviles) {
      piezasMoviles = config.piezas_moviles;
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#090D16",
      }}
    >
      <Viewer3D
        diseno={diseno}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        habilitarCamara={habilitarCamara}
        setHabilitarCamara={setHabilitarCamara}
        piezasMoviles={piezasMoviles}
      />

      <Detalles3D
        diseno={diseno}
        sidebarOpen={sidebarOpen}
        piezasMoviles={piezasMoviles}
        copied={copied}
        handleShare={handleShare}
      />
    </Box>
  );
}
