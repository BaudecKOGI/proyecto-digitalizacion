import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { GitBranch as GitIcon } from "@phosphor-icons/react/dist/ssr/GitBranch";
import { Globe as GlobeIcon } from "@phosphor-icons/react/dist/ssr/Globe";
import { VideoCameraSlash as NoVideoIcon } from "@phosphor-icons/react/dist/ssr/VideoCameraSlash";
import { getODSById } from "./odsData";

import { fetchProyectoSoftwareById } from "@/services/api";

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

export default function ProjectDetailView({ proyecto: propProyecto, onBack, onEdit, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [proyecto, setProyecto] = useState(propProyecto || null);
  const [loading, setLoading] = useState(!propProyecto);
  const [error, setError] = useState('');

  useEffect(() => {
    if (propProyecto) {
      setProyecto(propProyecto);
      setLoading(false);
      return;
    }

    const loadProject = async () => {
      if (!id) {
        setError('ID de proyecto no válido');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchProyectoSoftwareById(id);
        // Procesar URLs de imágenes antes de guardar
        if (data) {
          if (data.imagen_portada && data.imagen_portada.startsWith('/')) {
            data.imagen_portada = `${API_BASE}${data.imagen_portada}`;
          }
          if (data.archivo_video && data.archivo_video.startsWith('/')) {
            data.archivo_video = `${API_BASE}${data.archivo_video}`;
          }
        }
        setProyecto(data);
      } catch (err) {
        console.error('Error cargando proyecto de software:', err);
        setError('No se pudo cargar el proyecto de software');
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id, propProyecto]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard/proyectos-digitales');
    }
  };

  const handleEdit = () => {
    if (onEdit && proyecto) {
      onEdit(proyecto);
    } else if (proyecto) {
      navigate(`/dashboard/proyectos-digitales/editar/${proyecto.id}`);
    }
  };

  const handleDelete = () => {
    if (onDelete && proyecto) {
      onDelete(proyecto.id);
    } else {
      navigate('/dashboard/proyectos-digitales');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !proyecto) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error || 'Proyecto no encontrado'}</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleBack}>
          Volver a la lista
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
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
            onClick={handleBack}
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
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            / Proyectos Digitales / <strong style={{ color: "inherit" }}>{proyecto.titulo}</strong>
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<img src="/assets/icons/actions/pencil.png" alt="Editar" style={{ width: 16, height: 16, objectFit: 'contain' }} />}
            onClick={handleEdit}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}
          >
            Editar proyecto
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<img src="/assets/icons/actions/delete.png" alt="Eliminar" style={{ width: 16, height: 16, objectFit: 'contain' }} />}
            onClick={handleDelete}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}
          >
            Eliminar
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }} flexWrap="wrap" useFlexGap>
          <Chip
            label={proyecto.estado_publicacion}
            size="small"
            color={
              proyecto.estado_publicacion === "PUBLICADO"
                ? "success"
                : proyecto.estado_publicacion === "BORRADOR"
                  ? "warning"
                  : "default"
            }
            sx={{ fontWeight: 700, borderRadius: 1, fontSize: "0.75rem" }}
          />

          {/* ODS MÚLTIPLES */}
          {proyecto.ods_detalle && proyecto.ods_detalle.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {proyecto.ods_detalle.map((ods) => {
                const odsColor = getODSById(ods.id)?.color || '#6b7280';
                return (
                  <Chip
                    key={ods.id}
                    label={ods.label}
                    size="small"
                    sx={{ bgcolor: '#E2E8F0', color: '#475569', fontWeight: 600 }}
                  />
                );
              })}
            </Box>
          )}

          {proyecto.categoria_nombre && (
            <Chip
              label={proyecto.categoria_nombre}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, borderRadius: 1 }}
            />
          )}
        </Stack>

        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 1, letterSpacing: "-0.02em" }}>
          {proyecto.titulo}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 400 }}>
          Desarrollado por <strong>{proyecto.autor_nombre}</strong> • {proyecto.carrera_nombre || proyecto.carrera} (Ciclo {proyecto.ciclo})
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "6px",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
              overflow: "hidden",
              mb: 4,
              bgcolor: "#090D16"
            }}
          >
            {proyecto.archivo_video ? (
              <Box sx={{ width: "100%", bgcolor: "#000" }}>
                <video
                  src={proyecto.archivo_video}
                  controls
                  poster={proyecto.imagen_portada}
                  style={{
                    width: "100%",
                    maxHeight: 480,
                    display: "block",
                    backgroundColor: "#000"
                  }}
                >
                  Tu navegador no soporta la reproducción de video HTML5.
                </video>
              </Box>
            ) : proyecto.imagen_portada ? (
              <Box
                component="img"
                src={proyecto.imagen_portada}
                alt={proyecto.titulo}
                sx={{
                  width: "100%",
                  maxHeight: 460,
                  objectFit: "cover",
                  display: "block"
                }}
              />
            ) : (
              <Box
                sx={{
                  py: 10,
                  px: 4,
                  color: "text.secondary",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center"
                }}
              >
                <NoVideoIcon
                  size={40}
                  sx={{ opacity: 0.4, mb: 1.5 }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Sin archivo de video ni imagen portada
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  Edita el proyecto para subir una captura de pantalla o un video MP4 en vivo.
                </Typography>
              </Box>
            )}
          </Paper>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 2 }}>
              Descripción del Proyecto & Alcance
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "6px",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                bgcolor: "#FFFFFF"
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  lineHeight: 1.8,
                  whiteSpace: "pre-line"
                }}
              >
                {proyecto.descripcion || "Sin especificaciones detalladas registradas para este proyecto."}
              </Typography>
            </Paper>
          </Box>
        </Grid>

        {/* COLUMNA DERECHA */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "6px",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                bgcolor: "#FFFFFF"
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.secondary" }}>
                Ficha Técnica
              </Typography>

              <Stack spacing={2} divider={<Divider />}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Responsable / Autor
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {proyecto.autor_nombre}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Carrera Profesional
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {proyecto.carrera_nombre || proyecto.carrera}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ciclo Académico
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Ciclo {proyecto.ciclo}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Área / Categoría
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {proyecto.categoria_nombre || "Sin Categoría"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Fecha de Registro
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {proyecto.created_at ? new Date(proyecto.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "6px",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                bgcolor: "#FFFFFF"
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.secondary" }}>
                Stack Tecnológico
              </Typography>

              <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                {(proyecto.tecnologias_detalle || []).length > 0 ? (
                  (proyecto.tecnologias_detalle || []).map((t) => (
                    <Chip
                      key={t.id}
                      label={t.nombre}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        borderRadius: 1,
                        borderColor: "divider",
                        color: "text.primary"
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    No se declararon tecnologías en este proyecto.
                  </Typography>
                )}
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "6px",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                bgcolor: "#FFFFFF"
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.secondary" }}>
                Repositorios y Enlaces
              </Typography>

              <Stack spacing={1.5}>
                {proyecto.url_repositorio ? (
                  <Button
                    variant="outlined"
                    fullWidth
                    component="a"
                    href={proyecto.url_repositorio}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<GitIcon />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      justifyContent: "flex-start",
                      borderRadius: 1.5,
                      borderColor: "divider",
                      color: "text.primary"
                    }}
                  >
                    Ver Repositorio Git
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    • Repositorio Git no adjuntado
                  </Typography>
                )}

                {proyecto.url_demo_live ? (
                  <Button
                    variant="contained"
                    fullWidth
                    component="a"
                    href={proyecto.url_demo_live}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<GlobeIcon />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      justifyContent: "flex-start",
                      borderRadius: 1.5
                    }}
                  >
                    Abrir Demo en Vivo
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    • Demo en línea no disponible
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}