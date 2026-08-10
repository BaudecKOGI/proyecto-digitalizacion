import * as React from "react";
import { Suspense, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";
import { Minimize2 } from "lucide-react";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { OdsBadge } from "@/pages/dashboard/digitalProjects/odsData";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Html } from "@react-three/drei";
import FBXInteractiveModel, { FBXErrorBoundary } from "./FBXInteractiveModel";

/**
 * COMPONENTE MODULAR PARA EL MODAL DE PANTALLA COMPLETA 3D
 */
export default function Diseno3DFullscreenModal({
  open,
  onClose,
  diseno,
  fbxUrl,
  piezasMoviles,
  categorias = []
}) {
  const [habilitarCamara, setHabilitarCamara] = useState(true);

  if (!diseno) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: "#090D16",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "row"
        }
      }}
    >
      {/* ÁREA IZQUIERDA: VISOR 3D EN TODA SU AMPLITUD */}
      <Box sx={{ flexGrow: 1, height: "100vh", position: "relative", bgcolor: "#090D16" }}>
        {/* Indicador superior del modelo */}
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
            backdropFilter: "blur(10px)"
          }}
        >
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Exploración 3D en Pantalla Completa
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
                    <Typography variant="body1" sx={{ color: "#22d3ee", fontWeight: 700 }}>
                      Cargando modelo en pantalla completa...
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
          </Canvas>
        ) : (
          <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", color: "white" }}>
            <CubeIcon size={80} weight="duotone" />
            <Typography variant="h6" sx={{ mt: 2 }}>
              No hay modelo FBX cargado para este diseño
            </Typography>
          </Stack>
        )}

        {/* Helper de rotación inferior */}
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
            pointerEvents: "none"
          }}
        >
          Mantén presionado y arrastra para rotar o inspeccionar el modelo 3D
        </Box>
      </Box>

      {/* ÁREA DERECHA: BARRA LATERAL CON DETALLES Y BOTÓN SALIR */}
      <Box
        sx={{
          width: { xs: "100%", md: 400 },
          height: "100vh",
          bgcolor: "#FFFFFF",
          borderLeft: "1px solid rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflow: "hidden"
        }}
      >
        {/* Encabezado de la barra lateral derecha */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#FFFFFF"
          }}
        >
          <Typography variant="subtitle1" sx={{ color: "#111827", fontWeight: 800 }}>
            Detalles del Modelo 3D
          </Typography>

          <Button
            variant="contained"
            size="medium"
            startIcon={<Minimize2 size={16} />}
            onClick={onClose}
            sx={{
              fontWeight: 600,
              borderRadius: "2px",
              px: 3.5,
              py: 1,
              bgcolor: "#002B49",
              color: "#FFFFFF",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#001e33",
                boxShadow: "none"
              }
            }}
          >
            Salir
          </Button>
        </Box>

        {/* Cuerpo scrollable con información */}
        <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto", color: "#111827" }}>
          <Typography variant="h5" fontWeight={800} sx={{ color: "#111827", mb: 2 }}>
            {diseno.titulo}
          </Typography>

          {diseno.ods && (
            <Box sx={{ mb: 2.5 }}>
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
              sx={{ fontWeight: 600, fontSize: "0.75rem", color: "#111827", borderColor: "rgba(0,0,0,0.23)" }}
            />
          )}

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
                <a
                  href={diseno.archivo_fbx}
                  download
                  style={{ color: "#0066FF", fontWeight: 600, display: "inline-block", marginTop: "4px" }}
                >
                  Descargar Modelo Registrado
                </a>
              ) : (
                <Typography variant="body2" sx={{ color: "#64748b", mt: 0.3 }}>
                  No adjunto
                </Typography>
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
    </Dialog>
  );
}
