import React, { Suspense, useRef, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ChevronRight, ChevronLeft, Home, ZoomIn, ZoomOut, Rotate3D, Pause, Maximize, Minimize, HelpCircle } from "lucide-react";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  Html,
  GizmoHelper,
  GizmoViewcube,
  GizmoViewport,
} from "@react-three/drei";
import FBXInteractiveModel, {
  FBXErrorBoundary,
} from "@/pages/dashboard/3DDesigns/FBXInteractiveModel";

// Componente utilitario para guardar la cámara inicial una vez que el modelo carga
function CameraSaver({ controlsRef }) {
  React.useEffect(() => {
    let timeout;
    if (controlsRef.current) {
      // Esperamos a que Stage termine de acomodar la cámara (suele ser instantáneo pero damos un pequeño margen)
      timeout = setTimeout(() => {
        if (controlsRef.current) {
          controlsRef.current.saveState();
        }
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [controlsRef]);
  return null;
}

export default function Viewer3D({
  diseno,
  sidebarOpen,
  toggleSidebar,
  habilitarCamara,
  setHabilitarCamara,
  piezasMoviles,
}) {
  const fbxUrl = diseno.archivo_fbx;
  const controlsRef = useRef(null);
  const containerRef = useRef(null);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [bgColor, setBgColor] = useState("#090D16");
  const [isFullscreen, setIsFullscreen] = useState(false);

  React.useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen?.();
    }
  };

  const backgroundColors = [
    "#090D16", // Por defecto (Azul muy oscuro)
    "#1F2937", // Gris oscuro
    "#9CA3AF", // Gris medio
    "#E5E7EB", // Gris claro
    "#FFFFFF", // Blanco
  ];

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleZoom = (inward) => {
    if (controlsRef.current && controlsRef.current.object) {
      const camera = controlsRef.current.object;
      const target = controlsRef.current.target;

      const direction = camera.position.clone().sub(target);
      if (inward) {
        direction.multiplyScalar(0.8);
      } else {
        direction.multiplyScalar(1.2);
      }
      camera.position.copy(target).add(direction);
      controlsRef.current.update();
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        flexGrow: 1,
        position: "relative",
        height: { xs: sidebarOpen ? "50vh" : "100vh", md: "100vh" },
        transition: "height 0.3s ease",
        minWidth: 0,
      }}
    >
      {/* Etiqueta superior izquierda */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 12, sm: 20 },
          left: { xs: 12, sm: 24 },
          zIndex: 10,
          bgcolor: "rgba(15, 23, 42, 0.85)",
          px: { xs: 2, sm: 3 },
          py: { xs: 0.8, sm: 1.2 },
          borderRadius: 1.5,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          display: "block",
          pointerEvents: "auto",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.7)",
            fontWeight: 600,
            display: "block",
            mb: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.65rem", sm: "0.75rem" }
          }}
        >
          Exploración 3D · Entorno de Diseño
        </Typography>

        {/* Paleta de colores de fondo */}
        <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} alignItems="center">
          {backgroundColors.map((c) => (
            <Box
              key={c}
              onClick={() => setBgColor(c)}
              sx={{
                width: { xs: 16, sm: 22 },
                height: { xs: 16, sm: 22 },
                borderRadius: "50%",
                bgcolor: c,
                cursor: "pointer",
                border: bgColor === c ? "2px solid #22d3ee" : "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: bgColor === c ? "0 0 8px rgba(34, 211, 238, 0.6)" : "none",
                transition: "all 0.2s ease",
                "&:hover": { transform: "scale(1.15)" }
              }}
              title={`Color de fondo: ${c}`}
            />
          ))}
        </Stack>
      </Box>

      {/* ── Botón de ocultar / abrir sidebar ── */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          right: 16,
          transform: "translateY(-50%)",
          zIndex: 10000, // muy alto para estar por encima del Canvas
          display: { xs: "none", md: "block" }, // ocultar en móviles
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Ocultar panel de detalles" : "Mostrar panel de detalles"}
          size="small"
          sx={{
            bgcolor: "rgba(15, 23, 42, 0.9)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(12px)",
            width: 40,
            height: 40,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            "&:hover": {
              bgcolor: "rgba(15, 23, 42, 1)",
              borderColor: "rgba(255, 255, 255, 0.35)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          {sidebarOpen ? (
            <ChevronLeft size={20} strokeWidth={2.5} />
          ) : (
            <ChevronRight size={20} strokeWidth={2.5} />
          )}
        </IconButton>
      </Box>

      {/* Canvas 3D */}
      {fbxUrl ? (
        <Canvas
          shadows
          camera={{ position: [0, 2, 6], fov: 50 }}
          style={{ width: "100%", height: "100%" }}
        >
          <color attach="background" args={[bgColor]} />

          <Suspense
            fallback={
              <Html center>
                <Stack alignItems="center" spacing={2}>
                  <CircularProgress size={44} sx={{ color: "#22d3ee" }} />
                  <Typography
                    variant="body1"
                    sx={{ color: "#22d3ee", fontWeight: 700, textAlign: "center" }}
                  >
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
            <CameraSaver controlsRef={controlsRef} />
          </Suspense>

          <OrbitControls ref={controlsRef} makeDefault enabled={habilitarCamara} autoRotate={isAutoRotate} autoRotateSpeed={2} />
          <GizmoHelper alignment="top-right" margin={[60, 60]}>
            <GizmoViewcube
              faces={["Derecha", "Izquierda", "Arriba", "Abajo", "Frente", "Atrás"]}
            />
          </GizmoHelper>

          <GizmoHelper alignment="bottom-left" margin={[80, 80]} renderPriority={2}>
            <GizmoViewport axisColors={['#ff3b30', '#34c759', '#007aff']} labelColor="white" />
          </GizmoHelper>
        </Canvas>
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ height: "100%", color: "white" }}
        >
          <CubeIcon size={80} weight="duotone" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            No hay modelo FBX cargado
          </Typography>
        </Stack>
      )}

      {/* Hint inferior */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "rgba(15, 23, 42, 0.8)",
          px: 3,
          py: 0.8,
          borderRadius: 1,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          color: "rgba(255,255,255,0.85)",
          fontSize: "0.78rem",
          fontWeight: 600,
          pointerEvents: "none",
          display: { xs: "none", md: "block" },
          whiteSpace: "nowrap",
        }}>
        Mantén presionado y arrastra para rotar el modelo 3D
      </Box>

      {/* Controles de cámara flotantes */}
      <Stack
        spacing={1}
        sx={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 10,
        }}
      >
        {/* Ayuda / Controles */}
        <Tooltip title={
          <Box sx={{ p: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>Controles de navegación</Typography>
            <Typography variant="caption" display="block">• <b>Rotar:</b> Click izquierdo y arrastrar</Typography>
            <Typography variant="caption" display="block">• <b>Mover:</b> Click derecho y arrastrar</Typography>
            <Typography variant="caption" display="block">• <b>Zoom:</b> Rueda del ratón</Typography>
          </Box>
        } placement="left" arrow>
          <IconButton
            sx={{
              bgcolor: "rgba(15, 23, 42, 0.85)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              "&:hover": { bgcolor: "rgba(15, 23, 42, 1)" },
            }}
          >
            <HelpCircle size={20} />
          </IconButton>
        </Tooltip>

        {/* Fullscreen */}
        <IconButton
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          sx={{
            bgcolor: "rgba(15, 23, 42, 0.85)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            "&:hover": { bgcolor: "rgba(15, 23, 42, 1)" },
          }}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </IconButton>

        {/* Zoom In */}
        <IconButton
          onClick={() => handleZoom(true)}
          aria-label="Acercar"
          sx={{
            bgcolor: "rgba(15, 23, 42, 0.85)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            "&:hover": { bgcolor: "rgba(15, 23, 42, 1)" },
          }}
        >
          <ZoomIn size={20} />
        </IconButton>

        {/* Zoom Out */}
        <IconButton
          onClick={() => handleZoom(false)}
          aria-label="Alejar"
          sx={{
            bgcolor: "rgba(15, 23, 42, 0.85)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            "&:hover": { bgcolor: "rgba(15, 23, 42, 1)" },
          }}
        >
          <ZoomOut size={20} />
        </IconButton>

        {/* Auto Rotate */}
        <IconButton
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          aria-label="Rotación automática"
          sx={{
            bgcolor: isAutoRotate ? "rgba(34, 211, 238, 0.2)" : "rgba(15, 23, 42, 0.85)",
            color: isAutoRotate ? "#22d3ee" : "white",
            border: "1px solid",
            borderColor: isAutoRotate ? "#22d3ee" : "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            "&:hover": { bgcolor: isAutoRotate ? "rgba(34, 211, 238, 0.3)" : "rgba(15, 23, 42, 1)" },
          }}
        >
          {isAutoRotate ? <Pause size={20} /> : <Rotate3D size={20} />}
        </IconButton>

        {/* Botón de restablecer cámara */}
        <IconButton
          onClick={resetCamera}
          aria-label="Restablecer vista"
          sx={{
            bgcolor: "rgba(15, 23, 42, 0.85)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            "&:hover": { bgcolor: "rgba(15, 23, 42, 1)" },
          }}
        >
          <Home size={20} />
        </IconButton>
      </Stack>
    </Box>

  );
}
