import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Stack,
  Card,
  Grid,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { PencilSimple as EditIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { Code as CodeIcon } from "@phosphor-icons/react/dist/ssr/Code";
import { Globe as GlobeIcon } from "@phosphor-icons/react/dist/ssr/Globe";
import { GitBranch as GitIcon } from "@phosphor-icons/react/dist/ssr/GitBranch";
import { PlayCircle as PlayIcon } from "@phosphor-icons/react/dist/ssr/PlayCircle";
import { OdsBadge } from "./odsData";

export default function ProyectosTable({
  proyectos,
  onOpenCreate,
  onView,
  onEdit,
  onDelete,
  onPlayVideo
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (proyectos.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 4,
          border: "1px dashed",
          borderColor: "divider"
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            margin: "0 auto 16px",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            color: "#6366F1"
          }}
        >
          <CodeIcon size={32} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          No hay proyectos digitales registrados
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Comienza publicando el primer proyecto de software o aplicación con repositorios y ODS.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<PlusIcon />}
          onClick={onOpenCreate}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          Crear primer proyecto software
        </Button>
      </Card>
    );
  }

  // VISTA MÓVIL RESPONSIVA (Tarjetas)
  if (isMobile) {
    return (
      <Grid container spacing={2}>
        {proyectos.map((p) => (
          <Grid item xs={12} key={p.id}>
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider"
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Box
                  onClick={() => p.archivo_video && onPlayVideo && onPlayVideo(p)}
                  sx={{
                    position: "relative",
                    cursor: p.archivo_video ? "pointer" : "default"
                  }}
                >
                  <Avatar
                    src={p.imagen_portada}
                    variant="rounded"
                    sx={{ width: 56, height: 56, bgcolor: "primary.main" }}
                  >
                    <CodeIcon size={28} />
                  </Avatar>
                  {p.archivo_video && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -4,
                        right: -4,
                        bgcolor: "#6366F1",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff"
                      }}
                    >
                      <PlayIcon size={16} weight="fill" />
                    </Box>
                  )}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {p.titulo}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Por: {p.autor_nombre} • {p.carrera} (Ciclo {p.ciclo})
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
                <OdsBadge odsNum={p.ods} />
                <Chip
                  label={p.categoria_nombre || "Sin Categoría"}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.72rem", fontWeight: 600 }}
                />
                <Chip
                  label={p.estado_publicacion}
                  size="small"
                  color={
                    p.estado_publicacion === "PUBLICADO"
                      ? "success"
                      : p.estado_publicacion === "BORRADOR"
                      ? "warning"
                      : "default"
                  }
                  sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                />
              </Stack>

              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                {(p.tecnologias_detalle || []).map((t) => (
                  <Chip
                    key={t.id}
                    label={t.nombre}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.68rem" }}
                  />
                ))}
              </Stack>

              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EyeIcon />}
                  onClick={() => onView(p)}
                  sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                >
                  Ver Detalle
                </Button>
                <IconButton size="small" onClick={() => onEdit(p)} sx={{ color: "primary.main" }}>
                  <EditIcon size={18} />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(p.id)} sx={{ color: "error.main" }}>
                  <TrashIcon size={18} />
                </IconButton>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // VISTA ESCRITORIO (Tabla elegante)
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflowX: "auto"
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead sx={{ backgroundColor: "action.hover" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, py: 2 }}>PROYECTO & AUTOR</TableCell>
            <TableCell sx={{ fontWeight: 700, py: 2 }}>CARRERA / CATEGORÍA</TableCell>
            <TableCell sx={{ fontWeight: 700, py: 2 }}>ODS DE IMPACTO</TableCell>
            <TableCell sx={{ fontWeight: 700, py: 2 }}>TECNOLOGÍAS</TableCell>
            <TableCell sx={{ fontWeight: 700, py: 2 }}>ESTADO</TableCell>
            <TableCell sx={{ fontWeight: 700, py: 2, textAlign: "right" }}>ACCIONES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proyectos.map((p) => (
            <TableRow key={p.id} hover>
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Tooltip title={p.archivo_video ? "Haz clic para ver el video en vivo" : "Sin video MP4"}>
                    <Box
                      onClick={() => p.archivo_video && onPlayVideo && onPlayVideo(p)}
                      sx={{
                        position: "relative",
                        cursor: p.archivo_video ? "pointer" : "default",
                        display: "inline-flex",
                        "&:hover .play-overlay": {
                          opacity: 1,
                          transform: "scale(1.1)"
                        }
                      }}
                    >
                      <Avatar
                        src={p.imagen_portada}
                        variant="rounded"
                        sx={{ width: 48, height: 48, bgcolor: "primary.main" }}
                      >
                        <CodeIcon size={24} />
                      </Avatar>
                      {p.archivo_video && (
                        <Box
                          className="play-overlay"
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "rgba(0,0,0,0.65)",
                            borderRadius: "50%",
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <PlayIcon size={18} weight="fill" />
                        </Box>
                      )}
                    </Box>
                  </Tooltip>

                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {p.titulo}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Por: {p.autor_nombre} • Ciclo {p.ciclo}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      {p.url_repositorio && (
                        <Tooltip title="Repositorio Git">
                          <IconButton
                            size="small"
                            component="a"
                            href={p.url_repositorio}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <GitIcon size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                      {p.url_demo_live && (
                        <Tooltip title="Demo en Vivo">
                          <IconButton
                            size="small"
                            component="a"
                            href={p.url_demo_live}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <GlobeIcon size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </TableCell>

              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {p.carrera}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {p.categoria_nombre || "Sin Categoría"}
                </Typography>
              </TableCell>

              <TableCell>
                {p.ods ? <OdsBadge odsNum={p.ods} /> : (
                  <Typography variant="caption" color="text.disabled">
                    No asignado
                  </Typography>
                )}
              </TableCell>

              <TableCell>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {(p.tecnologias_detalle || []).map((t) => (
                    <Chip
                      key={t.id}
                      label={t.nombre}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem", fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              </TableCell>

              <TableCell>
                <Chip
                  label={p.estado_publicacion}
                  size="small"
                  color={
                    p.estado_publicacion === "PUBLICADO"
                      ? "success"
                      : p.estado_publicacion === "BORRADOR"
                      ? "warning"
                      : "default"
                  }
                  sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                />
              </TableCell>

              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
                  <Tooltip title="Vista detallada (Otro fondo)">
                    <IconButton
                      size="small"
                      onClick={() => onView(p)}
                      sx={{
                        color: "primary.main",
                        bgcolor: "rgba(99, 102, 241, 0.1)",
                        "&:hover": { bgcolor: "rgba(99, 102, 241, 0.2)" }
                      }}
                    >
                      <EyeIcon size={18} weight="bold" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar proyecto">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(p)}
                      sx={{ color: "text.primary" }}
                    >
                      <EditIcon size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(p.id)}
                      sx={{ color: "error.main" }}
                    >
                      <TrashIcon size={18} />
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
