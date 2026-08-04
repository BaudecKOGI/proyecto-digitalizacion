import * as React from "react";
import { Suspense, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";
import { Minimize2, Share2 } from "lucide-react";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { OdsBadge } from "@/pages/dashboard/digitalProjects/odsData";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Html, GizmoHelper, GizmoViewcube } from "@react-three/drei";
import FBXInteractiveModel, { FBXErrorBoundary } from "@/pages/dashboard/3DDesigns/FBXInteractiveModel";
import { fetchProyecto3DById } from "@/services/api";

export default function PublicViewer3DPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diseno, setDiseno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [habilitarCamara, setHabilitarCamara] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchProyecto3DById(id);
        setDiseno(data);
        
        // Registrar visita silenciosamente si es posible
        fetch(`http://127.0.0.1:8000/api/metricas/por-proyecto/${id}/view/`, {
          method: 'POST',
        }).catch(() => {});
      } catch (err) {
        setError("Error al cargar el diseño 3D. Puede que no exista o no sea público.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    fetch(`http://127.0.0.1:8000/api/metricas/por-proyecto/${id}/share/`, {
      method: 'POST',
    }).catch(() => {});
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#090D16", color: "#fff" }}>
        <CircularProgress sx={{ color: "#22d3ee" }} />
      </Box>
    );
  }

  if (error || !diseno) {
    return (
      <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "#090D16", color: "#fff" }}>
        <CubeIcon size={80} weight="duotone" />
        <Typography variant="h6" sx={{ mt: 2 }}>{error || "Diseño no encontrado"}</Typography>
        <Button variant="outlined" onClick={() => navigate("/")} sx={{ mt: 3, color: "#fff", borderColor: "rgba(255,255,255,0.3)", "&:hover": { borderColor: "#fff" } }}>
          Volver al Inicio
        </Button>
      </Box>
    );
  }

  const fbxUrl = diseno.archivo_fbx;
  
  let piezasMoviles = [];
  if (diseno.configuracion_interactiva) {
    let config = diseno.configuracion_interactiva;
    if (typeof config === "string") {
      try { config = JSON.parse(config); } catch(e){}
    }
    if (Array.isArray(config)) {
      piezasMoviles = config;
    } else if (config && config.piezas_moviles) {
      piezasMoviles = config.piezas_moviles;
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, width: "100vw", height: "100vh", overflow: "hidden", bgcolor: "#090D16" }}>
      {/* ÁREA IZQUIERDA: VISOR 3D */}
      <Box sx={{ flexGrow: 1, position: "relative", height: { xs: "50vh", md: "100vh" } }}>
        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: 24,
            zIndex: 10,
            bgcolor: "rgba(15, 23, 42, 0.85)",
            px: 3,
            py: 1.2,
            borderRadius: 1.5,
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            display: { xs: "none", sm: "block" }
          }}
        >
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
            Exploración 3D - Entorno de Diseño
          </Typography>
        </Box>

        {fbxUrl ? (
          <Canvas shadows camera={{ position: [0, 2, 6], fov: 50 }} style={{ width: "100%", height: "100%" }}>
            <color attach="background" args={["#090D16"]} />
            
            <Suspense
              fallback={
                <Html center>
                  <Stack alignItems="center" spacing={2}>
                    <CircularProgress size={44} sx={{ color: "#22d3ee" }} />
                    <Typography variant="body1" sx={{ color: "#22d3ee", fontWeight: 700, textAlign: "center" }}>
                      Cargando modelo...
                    </Typography>
                  </Stack>
                </Html>
              }
            >
              <FBXErrorBoundary>
                <Stage environment="city" intensity={0.7}>
                  <FBXInteractiveModel
                    url={fbxUrl}
                    piezasMoviles={piezasMoviles}
                    setHabilitarCamara={setHabilitarCamara}
                  />
                </Stage>
              </FBXErrorBoundary>
            </Suspense>
            


            <OrbitControls makeDefault enabled={habilitarCamara} />
            <GizmoHelper alignment="top-right" margin={[60, 60]}>
              <GizmoViewcube faces={['Derecha', 'Izquierda', 'Arriba', 'Abajo', 'Frente', 'Atrás']} />
            </GizmoHelper>
          </Canvas>
        ) : (
          <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", color: "white" }}>
            <CubeIcon size={80} weight="duotone" />
            <Typography variant="h6" sx={{ mt: 2 }}>
              No hay modelo FBX cargado
            </Typography>
          </Stack>
        )}

        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "rgba(15, 23, 42, 0.8)",
            px: 3,
            py: 0.8,
            borderRadius: 6,
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "rgba(255,255,255,0.85)",
            fontSize: "0.78rem",
            fontWeight: 600,
            pointerEvents: "none",
            display: { xs: "none", md: "block" }
          }}
        >
          Mantén presionado y arrastra para rotar el modelo 3D
        </Box>
      </Box>

      {/* ÁREA DERECHA: BARRA LATERAL */}
      <Box
        sx={{
          width: { xs: "100%", md: 400 },
          height: { xs: "50vh", md: "100vh" },
          bgcolor: "#FFFFFF",
          borderLeft: { md: "1px solid rgba(0, 0, 0, 0.08)" },
          borderTop: { xs: "1px solid rgba(0, 0, 0, 0.08)", md: "none" },
          display: "flex",
          flexDirection: "column",
          flexShrink: 0
        }}
      >
        <Box sx={{ p: 2.5, borderBottom: "1px solid rgba(0, 0, 0, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ color: "#111827", fontWeight: 800 }}>
            Detalles del Diseño 3D
          </Typography>

          <Button
            variant="contained"
            size="small"
            startIcon={<Minimize2 size={16} />}
            onClick={() => window.close()}
            sx={{ fontWeight: 600, borderRadius: "2px", bgcolor: "#002B49", color: "#FFFFFF", textTransform: "none", boxShadow: "none", "&:hover": { bgcolor: "#001e33", boxShadow: "none" } }}
          >
            Cerrar Pestaña
          </Button>
        </Box>

        <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto", color: "#111827" }}>
          <Typography variant="h5" fontWeight={800} sx={{ color: "#111827", mb: 2 }}>
            {diseno.titulo}
          </Typography>

          {diseno.ods && (
            <Box sx={{ mb: 2.5 }}>
              <OdsBadge odsNum={diseno.ods} />
            </Box>
          )}

          {diseno.categoria_nombre && (
            <Chip
              label={diseno.categoria_nombre}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: "0.75rem", color: "#111827", borderColor: "rgba(0,0,0,0.23)", mb: 2 }}
            />
          )}

          <Button
            variant="outlined"
            size="small"
            startIcon={<Share2 size={16} />}
            onClick={handleShare}
            sx={{ fontWeight: 600, borderRadius: "2px", textTransform: "none", borderColor: "#002B49", color: "#002B49", mb: 2, display: 'flex', width: 'fit-content', "&:hover": { bgcolor: "rgba(0,43,73,0.04)" } }}
          >
            {copied ? "¡Enlace copiado!" : "Compartir Diseño (Copiar Enlace)"}
          </Button>

          <Divider sx={{ my: 2.5, borderColor: "rgba(0, 0, 0, 0.08)" }} />

          <Stack spacing={2.5}>
            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block" }}>
                AUTOR / CREADOR
              </Typography>
              <Typography variant="body1" sx={{ color: "#111827", fontWeight: 700, mt: 0.3 }}>
                {diseno.autor_nombre || "Sin autor"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block" }}>
                CARRERA Y CICLO
              </Typography>
              <Typography variant="body1" sx={{ color: "#111827", fontWeight: 600, mt: 0.3 }}>
                {diseno.carrera || "N/A"} - {diseno.ciclo || "N/A"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block" }}>
                ARCHIVO 3D (.FBX/.GLB)
              </Typography>
              {diseno.archivo_fbx ? (
                <a href={diseno.archivo_fbx} download style={{ color: "#0066FF", fontWeight: 600, display: "inline-block", marginTop: "4px" }}>
                  Descargar Modelo
                </a>
              ) : (
                <Typography variant="body2" sx={{ color: "#64748b", mt: 0.3 }}>No adjunto</Typography>
              )}
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block" }}>
                FECHA DE REGISTRO
              </Typography>
              <Typography variant="body2" sx={{ color: "#475569", mt: 0.3 }}>
                {diseno.created_at ? new Date(diseno.created_at).toLocaleDateString("es-PE") : "N/A"}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 2.5, borderColor: "rgba(0, 0, 0, 0.08)" }} />

          <Box>
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block", mb: 1 }}>
              DESCRIPCIÓN DEL DISEÑO
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7, color: "#475569", whiteSpace: "pre-line" }}>
              {diseno.descripcion || "No se ha proporcionado una descripción detallada para este proyecto 3D."}
            </Typography>
          </Box>

          {piezasMoviles.length > 0 && (
            <Box sx={{ mt: 3, p: 2.5, borderRadius: 2, bgcolor: "rgba(0, 43, 73, 0.06)", border: "1px solid rgba(0, 43, 73, 0.2)" }}>
              <Typography variant="subtitle2" sx={{ color: "#002B49", fontWeight: 800, mb: 0.5 }}>
                ⚙️ {piezasMoviles.length} Pieza(s) Mecánica(s) Interactiva(s)
              </Typography>
              <Typography variant="caption" sx={{ color: "#475569", lineHeight: 1.5, display: "block" }}>
                Haz clic y arrastra directamente sobre las partes mecánicas del modelo para accionar su movimiento en 3D.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
