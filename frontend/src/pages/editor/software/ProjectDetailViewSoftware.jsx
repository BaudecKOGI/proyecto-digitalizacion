import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import { ArrowLeft as BackIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { GitBranch as GitIcon } from "@phosphor-icons/react/dist/ssr/GitBranch";
import { Globe as GlobeIcon } from "@phosphor-icons/react/dist/ssr/Globe";
import { VideoCameraSlash as NoVideoIcon } from "@phosphor-icons/react/dist/ssr/VideoCameraSlash";
import { OdsBadge } from "@/pages/dashboard/digitalProjects/odsData";

export default function ProjectDetailViewSoftware({ proyecto, onBack }) {
  if (!proyecto) return null;

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", pb: 8, pt: 2 }}>

      {/* 1. NAVEGACIÓN SUPERIOR */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="text"
          startIcon={<BackIcon />}
          onClick={onBack}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "text.secondary",
            "&:hover": { color: "primary.main", bgcolor: "transparent" },
            px: 0,
            ml: "-8px",
          }}
        >
          Volver a los proyectos
        </Button>
      </Box>

      {/* 2. ENCABEZADO DEL PROYECTO */}
      <Box sx={{ mb: 5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
          <OdsBadge odsNum={proyecto.ods} />
          {proyecto.categoria_nombre && (
            <Chip
              label={proyecto.categoria_nombre}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, borderRadius: 1.5 }}
            />
          )}
        </Stack>

        <Typography variant="h3" sx={{ fontWeight: 800, color: "text.primary", mb: 1, letterSpacing: "-0.02em" }}>
          {proyecto.titulo}
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
          Desarrollado por <strong style={{ color: "inherit", opacity: 1 }}>{proyecto.autor_nombre}</strong> • {proyecto.carrera} (Ciclo {proyecto.ciclo})
        </Typography>
      </Box>

      {/* 3. CONTENIDO PRINCIPAL
          OJO: aquí estaba el bug. En vez de <Grid container>/<Grid item xs={12} md={8}>
          (que en algunas versiones de MUI deja de repartir el ancho como flex y cada
          columna se encoge a su contenido — el "todo pegado a la izquierda" de tu captura),
          uso CSS Grid nativo con Box. Así el reparto 8/4 siempre funciona, sin depender
          de qué versión de @mui/material tengan instalada. */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 4,
          alignItems: "start",
        }}
      >

        {/* COLUMNA IZQUIERDA (Visual y Descripción) */}
        <Box sx={{ minWidth: 0 /* evita que el grid empuje el ancho por contenido largo */ }}>

          {/* REPRODUCTOR DE VIDEO O PORTADA */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              mb: 4,
              width: "100%",
              bgcolor: "#050505",
              height: { xs: 280, sm: 360, md: 460 },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {proyecto.archivo_video ? (
              <video
                src={proyecto.archivo_video}
                controls
                poster={proyecto.imagen_portada}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  backgroundColor: "#000",
                }}
              >
                Tu navegador no soporta la reproducción de video HTML5.
              </video>
            ) : proyecto.imagen_portada ? (
              <Box
                component="img"
                src={proyecto.imagen_portada}
                alt={proyecto.titulo}
                sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block", p: 2 }}
              />
            ) : (
              <Box sx={{ textAlign: "center", color: "text.secondary" }}>
                <NoVideoIcon size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Sin previsualización
                </Typography>
              </Box>
            )}
          </Paper>

          {/* DESCRIPCIÓN DEL PROYECTO */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 2 }}>
              Acerca del Proyecto
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", lineHeight: 1.8, whiteSpace: "pre-line", fontSize: "1.05rem" }}
            >
              {proyecto.descripcion || "El autor aún no ha proporcionado una descripción detallada de este proyecto."}
            </Typography>
          </Box>
        </Box>

        {/* COLUMNA DERECHA (Información Técnica) — sticky para que acompañe el scroll */}
        <Box sx={{ minWidth: 0, position: { md: "sticky" }, top: { md: 24 } }}>
          <Stack spacing={2.5}>

            {/* BOTONES DE ACCIÓN */}
            <Stack spacing={1.5}>
              {proyecto.url_demo_live && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  component="a"
                  href={proyecto.url_demo_live}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<GlobeIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1.5,
                    boxShadow: "none",
                    "&:hover": { boxShadow: 2 },
                  }}
                >
                  Visitar Proyecto en Vivo
                </Button>
              )}

              {proyecto.url_repositorio && (
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  component="a"
                  href={proyecto.url_repositorio}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<GitIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1.5,
                    borderWidth: 2,
                    borderColor: "divider",
                    color: "text.primary",
                    "&:hover": { borderColor: "primary.main", borderWidth: 2, bgcolor: "transparent" },
                  }}
                >
                  Ver Repositorio
                </Button>
              )}
            </Stack>

            {/* STACK TECNOLÓGICO */}
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
            >
              <Typography variant="overline" sx={{ fontWeight: 700, display: "block", mb: 2, color: "text.secondary" }}>
                Tecnologías Utilizadas
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(proyecto.tecnologias_detalle || []).length > 0 ? (
                  (proyecto.tecnologias_detalle || []).map((t) => (
                    <Chip
                      key={t.id}
                      label={t.nombre}
                      size="small"
                      sx={{ fontWeight: 600, borderRadius: 1.5, bgcolor: "action.hover", color: "text.primary", mb: 1 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    No se especificaron tecnologías.
                  </Typography>
                )}
              </Stack>
            </Paper>

            {/* FICHA RESUMEN */}
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
            >
              <Typography variant="overline" sx={{ fontWeight: 700, display: "block", mb: 2, color: "text.secondary" }}>
                Ficha Técnica
              </Typography>

              <Stack spacing={2} divider={<Divider sx={{ borderStyle: "dashed" }} />}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Autor
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {proyecto.autor_nombre}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Programa Académico
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {proyecto.carrera} - Ciclo {proyecto.ciclo}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Fecha de Publicación
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {proyecto.created_at
                      ? new Date(proyecto.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
                      : "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

          </Stack>
        </Box>
      </Box>
    </Box>
  );
}