import * as React from "react";
import { useState, Suspense } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress
} from "@mui/material";
import { ArrowLeft as BackIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { PencilSimple as EditIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { Maximize2 } from "lucide-react";
import { OdsBadge } from "@/pages/dashboard/digitalProjects/odsData";

// IMPORTACIONES 3D Y COMPONENTES MODULARES
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Html } from "@react-three/drei";
import FBXInteractiveModel, { FBXErrorBoundary } from "./FBXInteractiveModel";
import Diseno3DFullscreenModal from "./Diseno3DFullscreenModal";

export default function Diseno3DDetailView({
  diseno,
  categorias = [],
  onBack,
  onEdit,
  onDelete
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [habilitarCamara, setHabilitarCamara] = useState(true);

  if (!diseno) return null;

  const fbxUrl = diseno.archivo_fbx;
  const piezasMoviles = diseno.configuracion_interactiva?.piezas_moviles || [];

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
      {/* 1. BARRA SUPERIOR DE NAVEGACIÓN */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexWrap: "wrap",
          gap: 2
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="outlined"
            size="small"
            startIcon={<BackIcon />}
            onClick={onBack}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              borderColor: "divider",
              color: "text.primary"
            }}
          >
            Volver al listado
          </Button>
          <Typography variant="body2" color="text.secondary">
            / Modelos 3D / Detalle de Modelo
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => onEdit(diseno)}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 1.5 }}
          >
            Editar Diseño
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<TrashIcon />}
            onClick={() => onDelete(diseno)}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 1.5 }}
          >
            Eliminar
          </Button>
        </Stack>
      </Box>

      {/* CONTENIDO PRINCIPAL EN DOS COLUMNAS */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          width: "100%",
          alignItems: "stretch"
        }}
      >
        {/* COLUMNA IZQUIERDA: VISOR 3D EN VIVO  */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "0 0 calc(50% - 12px)" },
            maxWidth: { xs: "100%", md: "calc(50% - 12px)" },
            display: "flex"
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              width: "100%",
              borderRadius: "6px",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                width: "100%",
                flexGrow: 1,
                minHeight: { xs: 360, md: 480 },
                borderRadius: 2,
                bgcolor: "#1e293b",
                border: "1px solid #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Botón de cuadrito para expandir en toda la pantalla */}
              {fbxUrl && (
                <Tooltip title="Expandir modelo en pantalla completa">
                  <IconButton
                    onClick={() => setIsFullScreen(true)}
                    sx={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      zIndex: 10,
                      bgcolor: "rgba(15, 23, 42, 0.75)",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      "&:hover": {
                        bgcolor: "rgba(15, 23, 42, 0.95)",
                        borderColor: "rgba(255, 255, 255, 0.4)"
                      }
                    }}
                  >
                    <Maximize2 size={18} />
                  </IconButton>
                </Tooltip>
              )}

              {!fbxUrl ? (
                <Stack alignItems="center" spacing={1.5} sx={{ color: "rgba(255,255,255,0.4)", p: 4, textAlign: "center" }}>
                  <CubeIcon size={64} weight="duotone" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Sin modelo 3D FBX adjunto
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)" }}>
                    Sube un archivo .fbx desde la opción "Editar Diseño"
                  </Typography>
                </Stack>
              ) : (
                <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }} style={{ width: "100%", height: "100%" }}>
                  <color attach="background" args={["#1e293b"]} />
                  <Suspense
                    fallback={
                      <Html center>
                        <Stack alignItems="center" spacing={1.5}>
                          <CircularProgress size={32} sx={{ color: "#22d3ee" }} />
                          <Typography variant="caption" sx={{ color: "#22d3ee", fontWeight: 700 }}>
                            Cargando modelo 3D en vivo...
                          </Typography>
                        </Stack>
                      </Html>
                    }
                  >
                    <FBXErrorBoundary>
                      <Stage environment="city" intensity={0.6}>
                        <FBXInteractiveModel
                          url={fbxUrl}
                          piezasMoviles={piezasMoviles}
                          setHabilitarCamara={setHabilitarCamara}
                        />
                      </Stage>
                    </FBXErrorBoundary>
                  </Suspense>
                  <OrbitControls makeDefault enabled={habilitarCamara} />
                </Canvas>
              )}
            </Box>

            <Box sx={{ mt: 1.5, px: 0.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {fbxUrl
                  ? "💡 Mantén presionado y arrastra para rotar el modelo"
                  : "Modelo no disponible"}
              </Typography>
              {fbxUrl && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Maximize2 size={14} />}
                  onClick={() => setIsFullScreen(true)}
                  sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.75rem" }}
                >
                  Expandir a Pantalla Completa
                </Button>
              )}
            </Box>
          </Paper>
        </Box>

        {/* COLUMNA DERECHA: DATOS GENERALES DEL PROYECTO 3D */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "0 0 calc(50% - 12px)" },
            maxWidth: { xs: "100%", md: "calc(50% - 12px)" },
            display: "flex"
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              width: "100%",
              borderRadius: "6px",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="h4" fontWeight={800} sx={{ color: "text.primary", mb: 0 }}>
                  {diseno.titulo}
                </Typography>
                <Chip
                  label={diseno.estado_publicacion || "BORRADOR"}
                  size="small"
                  color={diseno.estado_publicacion === "PUBLICADO" ? "success" : "default"}
                  sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                />
              </Stack>

              {diseno.ods && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  <OdsBadge odsNum={diseno.ods} />
                </Box>
              )}

              {diseno.categoria && (
                <Chip
                  label={
                    typeof diseno.categoria === "object"
                      ? diseno.categoria.nombre
                      : categorias.find((c) => c.id === Number(diseno.categoria))?.nombre
                        || `Categoría #${diseno.categoria}`
                  }
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                />
              )}

              <Divider sx={{ my: 2.5 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">
                    AUTOR / CREADOR
                  </Typography>
                  <Typography variant="body1" fontWeight={700} sx={{ mt: 0.3 }}>
                    {diseno.autor_nombre || "Sin autor"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">
                    CARRERA Y CICLO
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                    {diseno.carrera || "N/A"} - {diseno.ciclo || "N/A"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">
                    ARCHIVO 3D REGISTRADO
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.3, wordBreak: "break-all" }}>
                    {diseno.archivo_fbx ? (
                      <a
                        href={diseno.archivo_fbx}
                        download
                        style={{ color: "#0066FF", fontWeight: 600 }}
                      >
                        Descargar Modelo (.fbx/.glb)
                      </a>
                    ) : (
                      "No adjunto"
                    )}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">
                    FECHA DE REGISTRO
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.3 }}>
                    {diseno.created_at ? new Date(diseno.created_at).toLocaleDateString("es-PE") : "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2.5 }} />

              <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 1 }}>
                DESCRIPCIÓN DEL DISEÑO
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7, color: "text.primary", whiteSpace: "pre-line" }}>
                {diseno.descripcion || "No se ha proporcionado una descripción detallada para este proyecto 3D."}
              </Typography>
            </Box>

            {/* Miniatura adicional o información extra inferior */}
            {diseno.imagen_miniatura && (
              <Box sx={{ mt: 3, pt: 2, borderTop: "1px dashed", borderColor: "divider" }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 1 }}>
                  MINIATURA DEL DISEÑO
                </Typography>
                <Box
                  component="img"
                  src={diseno.imagen_miniatura}
                  alt={diseno.titulo}
                  sx={{
                    height: 80,
                    width: 140,
                    objectFit: "cover",
                    border: "1px solid",
                    borderColor: "divider"
                  }}
                />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* 3. MODAL DE PANTALLA COMPLETA 3D MODULAR */}
      <Diseno3DFullscreenModal
        open={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        diseno={diseno}
        fbxUrl={fbxUrl}
        piezasMoviles={piezasMoviles}
        categorias={categorias}
      />
    </Box>
  );
}
