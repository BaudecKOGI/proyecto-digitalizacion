import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Stack, Chip, Divider, Button } from "@mui/material";
import { Monitor } from "lucide-react";
import { ODS_LIST } from "@/pages/dashboard/digitalProjects/odsData";

export default function DetallesDigital({ proyecto, sidebarOpen }) {
  const odsList = proyecto.ods_detalle || [];
  const techs = proyecto.tecnologias_detalle || proyecto.tecnologias || [];

  return (
    <Box
      sx={{
        width: { xs: "100%", md: sidebarOpen ? 400 : 0 },
        minWidth: { xs: "100%", md: sidebarOpen ? 400 : 0 },
        height: { xs: sidebarOpen ? "50vh" : 0, md: "100vh" },
        bgcolor: "#FFFFFF",
        borderLeft: {
          md: sidebarOpen ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
        },
        borderTop: {
          xs: sidebarOpen ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
          md: "none",
        },
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header del sidebar */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "#111827", fontWeight: 800 }}>
          Detalles del Proyecto
        </Typography>
        <Link to="/" style={{ display: "inline-flex" }} title="Volver a la página principal">
          <img
            src="/assets/logos/logo-continental-negro.png"
            alt="Universidad Continental"
            style={{ height: 32, objectFit: "contain", opacity: 0.85 }}
          />
        </Link>
      </Box>

      {/* Contenido scrolleable */}
      <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        {/* Etiqueta / Categoría */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            {proyecto.categoria_nombre && (
              <>
                <Chip label={proyecto.categoria_nombre} size="small" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, borderRadius: 1, bgcolor: "rgba(0,0,0,0.04)", color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }} />
              </>
            )}
          </Stack>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
            {proyecto.titulo}
          </Typography>
        </Box>

        <Divider sx={{ my: 2.5, borderColor: "rgba(0, 0, 0, 0.08)" }} />

        <Stack spacing={2.5}>
          <Box>
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block", mb: 1 }}>
              DESCRIPCIÓN DEL PROYECTO
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7, color: "#475569", whiteSpace: "pre-line" }}>
              {proyecto.descripcion || "No se ha proporcionado una descripción detallada para este proyecto."}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block" }}>
              CREADOR
            </Typography>
            <Typography variant="body1" sx={{ color: "#111827", fontWeight: 700, mt: 0.3 }}>
              {proyecto.autor_nombre || "Sin autor"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block" }}>
              CARRERA Y CICLO
            </Typography>
            <Typography variant="body1" sx={{ color: "#111827", fontWeight: 600, mt: 0.3 }}>
              {proyecto.carrera_nombre || "N/A"} - {proyecto.ciclo_romano ? `Ciclo ${proyecto.ciclo_romano}` : "N/A"}
            </Typography>
          </Box>

          {odsList.length > 0 && (
            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block", mb: 1 }}>
                ODS RELACIONADOS
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {odsList.map((ods) => (
                  <Chip
                    key={ods.id}
                    label={ods.label}
                    size="small"
                    sx={{
                      borderRadius: 1,
                      fontWeight: 600,
                      bgcolor: "rgba(0,0,0,0.04)",
                      color: "#111827",
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {techs.length > 0 && (
            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block", mb: 1 }}>
                TECNOLOGÍAS
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {techs.map((tech, i) => (
                  <Chip
                    key={tech.id || i}
                    label={typeof tech === 'string' ? tech : tech.nombre}
                    size="small"
                    sx={{
                      borderRadius: 1,
                      fontWeight: 600,
                      bgcolor: "rgba(0,0,0,0.04)",
                      color: "#111827",
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {(proyecto.url_repositorio || proyecto.url_demo_live) && (
            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block", mb: 1 }}>
                RECURSOS
              </Typography>
              <Stack spacing={1.5}>
                {proyecto.url_repositorio && (
                  <Button
                    variant="outlined"
                    href={proyecto.url_repositorio}
                    target="_blank"
                    startIcon={<img src="/assets/icons/github.png" alt="GitHub" style={{ width: 18, height: 18, objectFit: 'contain' }} />}
                    sx={{
                      justifyContent: "flex-start",
                      color: "#111827",
                      borderColor: "rgba(0,0,0,0.15)",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.3)" },
                    }}
                  >
                    Ver Repositorio GitHub
                  </Button>
                )}
                {proyecto.url_demo_live && (
                  <Button
                    variant="contained"
                    href={proyecto.url_demo_live}
                    target="_blank"
                    startIcon={<Monitor size={16} />}
                    sx={{
                      justifyContent: "flex-start",
                      bgcolor: "#002B49",
                      color: "#FFFFFF",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#001A2C" },
                    }}
                  >
                    Ver Demo en Vivo
                  </Button>
                )}
              </Stack>
            </Box>
          )}
        </Stack>

        <Divider sx={{ my: 2.5, borderColor: "rgba(0, 0, 0, 0.08)" }} />

        {proyecto.created_at && (
          <Typography variant="body2" sx={{ color: "#64748B", textAlign: "center", fontWeight: 600, display: "block" }}>
            Publicado el {new Date(proyecto.created_at).toLocaleDateString("es-PE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
