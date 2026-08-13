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
  useTheme,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  useMediaQuery
} from "@mui/material";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { Code as CodeIcon } from "@phosphor-icons/react/dist/ssr/Code";
import { Globe as GlobeIcon } from "@phosphor-icons/react/dist/ssr/Globe";
import { GitBranch as GitIcon } from "@phosphor-icons/react/dist/ssr/GitBranch";
import { PlayCircle as PlayIcon } from "@phosphor-icons/react/dist/ssr/PlayCircle";
import { OdsBadges } from "./odsData";

export default function ProyectosTable({
  proyectos,
  onOpenCreate,
  onView,
  onEdit,
  onDelete,
  onPlayVideo,
  onUpdateEstado
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProyectos = React.useMemo(() => {
    return proyectos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [proyectos, page, rowsPerPage]);

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
            color: "#9CA3AF"
          }}
        >
          <CodeIcon size={32} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          No hay proyectos digitales registrados
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Comienza publicando el primer proyecto digital o aplicación con repositorios y ODS.
        </Typography>
      </Card>
    );
  }

  // VISTA MÓVIL RESPONSIVA (Tarjetas)
  if (isMobile) {
    return (
      <Box>
        <Grid container spacing={2}>
          {paginatedProyectos.map((p) => (
            <Grid size={{ xs: 12 }} key={p.id}>
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "6px",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                bgcolor: "#FFFFFF"
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
                    variant="square"
                    sx={{ width: 56, height: 56, bgcolor: "primary.main", borderRadius: 0 }}
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
                    Por: {p.autor_nombre} • {p.carrera_nombre || p.carrera} (Ciclo {p.ciclo})
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
                <OdsBadges odsIds={p.ods_detalle?.map(o => o.id) || []} />
                <Chip
                  label={p.categoria_nombre || "Sin Categoría"}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.72rem", fontWeight: 600 }}
                />
                <FormControl size="small">
                  <Select
                    value={p.estado_publicacion || "BORRADOR"}
                    onChange={(e) => onUpdateEstado && onUpdateEstado(p.id, e.target.value)}
                    sx={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      height: 24,
                      borderRadius: "12px",
                      bgcolor: p.estado_publicacion === "PUBLICADO" ? "#E8F5E9" : "#F5F5F5",
                      color: p.estado_publicacion === "PUBLICADO" ? "#2E7D32" : "#616161",
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "& .MuiSelect-icon": { color: "inherit" }
                    }}
                  >
                    <MenuItem value="PUBLICADO" sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#2E7D32" }}>PUBLICADO</MenuItem>
                    <MenuItem value="BORRADOR" sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#616161" }}>BORRADOR</MenuItem>
                  </Select>
                </FormControl>
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
                  startIcon={<img src="/assets/icons/actions/detail.png" alt="Ver" style={{ width: 16, height: 16, objectFit: 'contain' }} />}
                  onClick={() => onView(p)}
                  sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                >
                  Ver Detalle
                </Button>
                <IconButton size="small" onClick={() => onEdit(p)} sx={{ color: "primary.main" }}>
                  <img src="/assets/icons/actions/pencil.png" alt="Editar" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(p.id)} sx={{ color: "error.main" }}>
                  <img src="/assets/icons/actions/delete.png" alt="Eliminar" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                </IconButton>
              </Stack>
            </Card>
          </Grid>
        ))}
        </Grid>
        <Box sx={{ mt: 3 }}>
          <TablePagination
            component="div"
            count={proyectos.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
            sx={{
              borderTop: "1px solid rgba(0, 0, 0, 0.06)",
              color: "#475569",
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                fontSize: "0.85rem",
                fontWeight: 500,
                margin: 0
              },
              ".MuiTablePagination-select": {
                borderRadius: "6px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                bgcolor: "#F8FAFC",
                py: 0.4,
                px: 1.2
              }
            }}
          />
        </Box>
      </Box>
    );
  }

  // VISTA ESCRITORIO (Tabla elegante)
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "6px",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
        bgcolor: "#FFFFFF",
        overflow: "hidden"
      }}
    >
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }}>
        <TableHead
          sx={{
            bgcolor: "#FFFFFF",
            "& .MuiTableCell-root, & .MuiTableCell-head": {
              bgcolor: "#FFFFFF !important",
              color: "#000000 !important",
              fontWeight: "700 !important",
              textTransform: "none !important"
            }
          }}
        >
          <TableRow sx={{ bgcolor: "#FFFFFF" }}>
            <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>Proyecto & Autor</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>Carrera / Categoría</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>ODS de Impacto</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>Tecnologías</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF", textAlign: "right" }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedProyectos.map((p) => (
            <TableRow key={p.id} hover sx={{ "& td": { borderBottom: "1px solid rgba(0, 0, 0, 0.04)" }, "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Tooltip title={p.archivo_video ? "Haz clic para ver el video en vivo" : "Sin video MP4"}>
                    <Box
                      onClick={() => p.archivo_video && onPlayVideo && onPlayVideo(p)}
                      sx={{
                        position: "relative",
                        cursor: p.archivo_video ? "pointer" : "default",
                        display: "inline-flex"
                      }}
                    >
                      <Avatar
                        src={p.imagen_portada}
                        variant="square"
                        sx={{ width: 48, height: 48, bgcolor: "primary.main", borderRadius: 0 }}
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
                  {p.carrera_nombre || p.carrera}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {p.categoria_nombre || "Sin Categoría"}
                </Typography>
              </TableCell>

              <TableCell>
                <OdsBadges odsIds={p.ods_detalle?.map(o => o.id) || []} />
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
                <FormControl size="small">
                  <Select
                    value={p.estado_publicacion || "BORRADOR"}
                    onChange={(e) => onUpdateEstado && onUpdateEstado(p.id, e.target.value)}
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      height: 28,
                      borderRadius: "16px",
                      bgcolor: p.estado_publicacion === "PUBLICADO" ? "#E8F5E9" : "#F5F5F5",
                      color: p.estado_publicacion === "PUBLICADO" ? "#2E7D32" : "#616161",
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "& .MuiSelect-icon": { color: "inherit" }
                    }}
                  >
                    <MenuItem value="PUBLICADO" sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#2E7D32" }}>PUBLICADO</MenuItem>
                    <MenuItem value="BORRADOR" sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#616161" }}>BORRADOR</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>

              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
                  <Tooltip title="Vista detallada">
                    <IconButton
                      size="small"
                      onClick={() => onView(p)}
                      sx={{
                        color: "primary.main",
                        bgcolor: "rgba(99, 102, 241, 0.1)",
                        "&:hover": { bgcolor: "rgba(99, 102, 241, 0.2)" }
                      }}
                    >
                      <img src="/assets/icons/actions/detail.png" alt="Ver" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar proyecto">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(p)}
                      sx={{ color: "text.primary" }}
                    >
                      <img src="/assets/icons/actions/pencil.png" alt="Editar" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(p.id)}
                      sx={{ color: "error.main" }}
                    >
                      <img src="/assets/icons/actions/delete.png" alt="Eliminar" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={proyectos.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
        sx={{
          borderTop: "1px solid rgba(0, 0, 0, 0.06)",
          color: "#475569",
          ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
            fontSize: "0.85rem",
            fontWeight: 500,
            margin: 0
          },
          ".MuiTablePagination-select": {
            borderRadius: "6px",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            bgcolor: "#F8FAFC",
            py: 0.4,
            px: 1.2
          }
        }}
      />
    </Paper>
  );
}