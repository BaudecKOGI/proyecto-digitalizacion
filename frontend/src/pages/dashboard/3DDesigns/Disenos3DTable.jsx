import * as React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Stack,
  Button
} from "@mui/material";

import { Eye as ViewIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { PencilSimple as EditIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";

import { OdsBadge } from "@/pages/dashboard/digitalProjects/odsData";

export default function Disenos3DTable({
  disenos,
  loading,
  viewMode,
  onView,
  onEdit,
  onDelete
}) {
  if (loading) {
    return (
      <Box sx={{ p: 6, textAlign: "center", color: "text.secondary" }}>
        <Typography variant="body1">Cargando catálogo de diseños 3D...</Typography>
      </Box>
    );
  }

  if (!disenos || disenos.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 3,
          border: "1px dashed",
          borderColor: "divider",
          bgcolor: "background.paper"
        }}
      >
        <CubeIcon size={48} weight="duotone" color="#9CA3AF" style={{ margin: "0 auto 12px" }} />
        <Typography variant="h6" fontWeight={700} gutterBottom>
          No hay modelos 3D registrados
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Crea un nuevo diseño 3D o ajusta los filtros de búsqueda para encontrar resultados.
        </Typography>
      </Paper>
    );
  }

  // ==========================================
  // VISTA 1: TABLA
  // ==========================================
  if (viewMode === "table") {
    return (
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden"
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "background.default" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, width: 80 }}>MINIATURA</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>TÍTULO DEL DISEÑO & AUTOR</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>CATEGORÍA</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>ODS</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>MODELO 3D</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>ESTADO</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disenos.map((item) => (
              <TableRow
                key={item.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color 0.2s"
                }}
              >
                {/* Miniatura */}
                <TableCell>
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 2,
                      bgcolor: item.imagen_miniatura ? "transparent" : "#F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider"
                    }}
                  >
                    {item.imagen_miniatura ? (
                      <img
                        src={item.imagen_miniatura}
                        alt={item.titulo}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <CubeIcon size={26} weight="duotone" color="#6B7280" />
                    )}
                  </Box>
                </TableCell>

                {/* Título & Autor */}
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: "text.primary" }}>
                    {item.titulo}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Por: {item.autor_nombre || "Autor anónimo"} ({item.carrera || "Sin carrera"})
                  </Typography>
                </TableCell>

                {/* Categoría */}
                <TableCell>
                  {item.categoria ? (
                    <Chip
                      label={typeof item.categoria === "object" ? item.categoria.nombre : `Categoría #${item.categoria}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.disabled">
                      Sin categoría
                    </Typography>
                  )}
                </TableCell>

                {/* ODS */}
                <TableCell>
                  {item.ods ? (
                    <OdsBadge odsNum={item.ods} />
                  ) : (
                    <Typography variant="caption" color="text.disabled">
                      -
                    </Typography>
                  )}
                </TableCell>

                {/* Archivo 3D FBX */}
                <TableCell>
                  {item.archivo_fbx ? (
                    <Chip
                      icon={<CubeIcon size={16} weight="fill" />}
                      label="3D Listo"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                    />
                  ) : (
                    <Chip label="Sin FBX" size="small" sx={{ fontSize: "0.75rem" }} />
                  )}
                </TableCell>

                {/* Estado */}
                <TableCell>
                  <Chip
                    label={item.estado_publicacion || "BORRADOR"}
                    size="small"
                    color={
                      item.estado_publicacion === "PUBLICADO"
                        ? "success"
                        : item.estado_publicacion === "ARCHIVADO"
                        ? "warning"
                        : "default"
                    }
                    sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                  />
                </TableCell>

                {/* Acciones */}
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Ver Detalles y Modelo 3D">
                      <IconButton
                        size="small"
                        onClick={() => onView(item)}
                        sx={{ color: "primary.main", bgcolor: "primary.50", "&:hover": { bgcolor: "primary.100" } }}
                      >
                        <ViewIcon size={18} weight="bold" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar Diseño">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(item)}
                        sx={{ color: "info.main", bgcolor: "info.50", "&:hover": { bgcolor: "info.100" } }}
                      >
                        <EditIcon size={18} weight="bold" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(item)}
                        sx={{ color: "error.main", bgcolor: "error.50", "&:hover": { bgcolor: "error.100" } }}
                      >
                        <TrashIcon size={18} weight="bold" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // ==========================================
  // VISTA 2: CUADRICULA / TARJETAS (GRID)
  // ==========================================
  return (
    <Grid container spacing={3} alignItems="stretch">
      {disenos.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id} sx={{ display: "flex" }}>
          <Card
            elevation={0}
            sx={{
              width: "100%",
              height: 430,
              minHeight: 430,
              maxHeight: 430,
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 12px 24px -10px rgba(0,0,0,0.15)"
              }
            }}
          >
            {/* Imagen miniatura - Altura estricta de 200px sin distorsión */}
            <Box
              sx={{
                width: "100%",
                height: 200,
                minHeight: 200,
                maxHeight: 200,
                flex: "0 0 200px",
                bgcolor: item.imagen_miniatura ? "transparent" : "#1e293b",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {item.imagen_miniatura ? (
                <img
                  src={item.imagen_miniatura}
                  alt={item.titulo}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block"
                  }}
                />
              ) : (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", color: "rgba(255,255,255,0.4)" }}>
                  <CubeIcon size={52} weight="duotone" />
                  <Typography variant="caption" sx={{ mt: 1 }}>
                    Sin miniatura
                  </Typography>
                </Stack>
              )}

              {/* Badges superiores en tarjeta */}
              <Box sx={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 1 }}>
                <Chip
                  label={item.estado_publicacion || "BORRADOR"}
                  size="small"
                  color={
                    item.estado_publicacion === "PUBLICADO"
                      ? "success"
                      : item.estado_publicacion === "ARCHIVADO"
                      ? "warning"
                      : "default"
                  }
                  sx={{ fontWeight: 700, fontSize: "0.7rem", backdropFilter: "blur(6px)" }}
                />
              </Box>
            </Box>

            <CardContent
              sx={{
                flexGrow: 1,
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden"
              }}
            >
              <Box>
                <Stack direction="row" spacing={1} sx={{ mb: 1, minHeight: 24 }}>
                  {item.categoria ? (
                    <Chip
                      label={typeof item.categoria === "object" ? item.categoria.nombre : `Cat #${item.categoria}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                    />
                  ) : null}
                  {item.archivo_fbx ? (
                    <Chip
                      icon={<CubeIcon size={14} weight="fill" />}
                      label="FBX Listo"
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                    />
                  ) : null}
                </Stack>

                <Typography
                  variant="h6"
                  fontWeight={800}
                  title={item.titulo}
                  sx={{
                    lineHeight: 1.3,
                    mb: 0.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    height: "2.6em"
                  }}
                >
                  {item.titulo}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  Autor: {item.autor_nombre || "Anónimo"} ({item.carrera || "N/A"})
                </Typography>
              </Box>

              <Box sx={{ mt: 1, minHeight: 28, display: "flex", alignItems: "center" }}>
                {item.ods ? (
                  <OdsBadge odsNum={item.ods} />
                ) : (
                  <Typography variant="caption" color="text.disabled">
                    Sin ODS asignado
                  </Typography>
                )}
              </Box>
            </CardContent>

            <CardActions
              sx={{
                px: 2.5,
                py: 1.5,
                borderTop: "1px solid",
                borderColor: "divider",
                justifyContent: "space-between",
                bgcolor: "background.default",
                minHeight: 52,
                flexShrink: 0
              }}
            >
              <Button
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => onView(item)}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Ver modelo
              </Button>
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Editar">
                  <IconButton size="small" onClick={() => onEdit(item)} color="info">
                    <EditIcon size={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton size="small" onClick={() => onDelete(item)} color="error">
                    <TrashIcon size={18} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
