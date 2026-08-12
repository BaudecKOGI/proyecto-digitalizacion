import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from "@mui/material";

import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { Envelope as EmailIcon } from "@phosphor-icons/react/dist/ssr/Envelope";
import { ShieldCheck as RoleIcon } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { Folder as FolderIcon } from "@phosphor-icons/react/dist/ssr/Folder";
import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";

import {
  fetchProyectos3DAdmin,
  fetchProyectosSoftwareAdmin,
  deleteProyecto3D,
  deleteProyectoSoftware
} from "@/services/api";

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < (string || "").length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export default function EditorDetailView({ editor, onBack, showSnackbar }) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [proyectos3D, setProyectos3D] = React.useState([]);
  const [proyectosSoftware, setProyectosSoftware] = React.useState([]);

  // Modales de confirmación para borrado
  const [deleteDialog, setDeleteDialog] = React.useState({
    open: false,
    type: null,
    id: null,
    titulo: ""
  });
  const [submittingDelete, setSubmittingDelete] = React.useState(false);

  const loadProjects = React.useCallback(async () => {
    if (!editor || !editor.id) return;
    setLoading(true);
    try {
      const [res3D, resSoft] = await Promise.all([
        fetchProyectos3DAdmin().catch(() => []),
        fetchProyectosSoftwareAdmin().catch(() => [])
      ]);

      const list3D = Array.isArray(res3D) ? res3D : res3D.results || [];
      const listSoft = Array.isArray(resSoft) ? resSoft : resSoft.results || [];

      // Filtrar estrictamente los subidos por este Editor
      const filtered3D = list3D.filter(
        (p) => p.creado_por === editor.id || p.creado_por?.id === editor.id
      );
      const filteredSoft = listSoft.filter(
        (p) => p.creado_por === editor.id || p.creado_por?.id === editor.id
      );

      setProyectos3D(filtered3D);
      setProyectosSoftware(filteredSoft);
    } catch (err) {
      console.error("Error cargando proyectos del editor:", err);
      showSnackbar("Error al cargar los proyectos del editor.", "error");
    } finally {
      setLoading(false);
    }
  }, [editor, showSnackbar]);

  React.useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id || !deleteDialog.type) return;
    setSubmittingDelete(true);
    try {
      if (deleteDialog.type === "3D") {
        await deleteProyecto3D(deleteDialog.id);
        showSnackbar("Proyecto 3D eliminado exitosamente", "success");
      } else {
        await deleteProyectoSoftware(deleteDialog.id);
        showSnackbar("Proyecto Digital eliminado exitosamente", "success");
      }
      setDeleteDialog({ open: false, type: null, id: null, titulo: "" });
      loadProjects();
    } catch (err) {
      showSnackbar(err.message || "Error al eliminar el proyecto", "error");
    } finally {
      setSubmittingDelete(false);
    }
  };

  if (!editor) return null;

  const avatarColor = stringToColor(editor.nombre);
  const initials = (editor.nombre || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const avatarUrl = editor.avatar_url || editor.avatar || "/assets/user.png";

  // Filtrado por búsqueda local
  const currentList = activeTab === 0 ? proyectos3D : proyectosSoftware;
  const filteredList = currentList.filter((p) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (p.titulo || "").toLowerCase().includes(q) ||
      (p.descripcion || "").toLowerCase().includes(q) ||
      (p.categoria_nombre || "").toLowerCase().includes(q)
    );
  });

  return (
    <Box sx={{ pb: 4 }}>
      {/* Botón Volver */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowLeftIcon />}
          onClick={onBack}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "text.secondary",
            "&:hover": { color: "text.primary" }
          }}
        >
          Volver al listado de Editores
        </Button>
      </Box>

      {/* Cabecera del Editor*/}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "6px",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
          bgcolor: "#FFFFFF"
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Avatar
                src={avatarUrl}
                sx={{
                  width: 56,
                  height: 56,
                }}
              />
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {editor.nombre}
                  </Typography>
                  <Chip
                    label={editor.is_active ? "Activo" : "Inactivo"}
                    size="small"
                    color={editor.is_active ? "success" : "default"}
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                  />
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ color: "text.secondary" }}>
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <EmailIcon size={16} />
                    <Typography variant="body2">{editor.email}</Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* Estadísticas de Proyectos */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "action.hover",
                    textAlign: "center"
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    MODELOS 3D SUBIDOS
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#10B981", mt: 0.5 }}>
                    {proyectos3D.length}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "action.hover",
                    textAlign: "center"
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    DIGITALES SUBIDOS
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#10B981", mt: 0.5 }}>
                    {proyectosSoftware.length}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Navegación por Pestañas */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => {
            setActiveTab(v);
            setSearchTerm("");
          }}
          sx={{
            minHeight: 44,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              minHeight: 44,
              mr: 2
            }
          }}
        >
          <Tab
            icon={<CubeIcon size={18} />}
            iconPosition="start"
            label={`Modelos 3D (${proyectos3D.length})`}
          />
          <Tab
            icon={<FolderIcon size={18} />}
            iconPosition="start"
            label={`Proyectos Digitales (${proyectosSoftware.length})`}
          />
        </Tabs>
      </Box>

      {/* Barra de Filtro de Proyectos */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <TextField
          placeholder={`Buscar en ${activeTab === 0 ? "Modelos 3D" : "Proyectos Digitales"} de este editor...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ width: { xs: "100%", sm: 380 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon size={18} color="#6B7280" />
              </InputAdornment>
            )
          }}
        />
        <Typography variant="body2" color="text.secondary">
          Mostrando <strong>{filteredList.length}</strong> proyecto(s)
        </Typography>
      </Box>

      {/* Listado de Proyectos en Tarjetas Senior Limpias */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={32} sx={{ color: "#6366F1" }} />
        </Box>
      ) : filteredList.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: "6px",
            border: "1px dashed rgba(0, 0, 0, 0.12)",
            bgcolor: "#FFFFFF"
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: "text.primary" }}>
            {searchTerm
              ? "No se encontraron proyectos para esta búsqueda"
              : `Este editor aún no ha subido ${activeTab === 0 ? "Modelos 3D" : "Proyectos Digitales"}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Los proyectos publicados por el editor aparecerán listados aquí para su gestión.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {filteredList.map((proyecto) => {
            const coverUrl =
              activeTab === 0
                ? proyecto.imagen_miniatura || "/placeholder.jpg"
                : proyecto.imagen_portada || "/placeholder.jpg";

            return (
              <Grid key={proyecto.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "none",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "border-color 0.15s ease",
                    "&:hover": {
                      borderColor: "text.secondary"
                    }
                  }}
                >
                  <Box sx={{ position: "relative", height: 160, bgcolor: "action.hover", overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      image={coverUrl}
                      alt={proyecto.titulo}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <Chip
                      label={proyecto.estado_publicacion || "PUBLICADO"}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        bgcolor: "rgba(0,0,0,0.65)",
                        color: "white",
                        backdropFilter: "blur(4px)"
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "#6366F1" }}>
                        {proyecto.categoria_nombre || "Sin Categoría"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID #{proyecto.id}
                      </Typography>
                    </Stack>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: "text.primary",
                        mb: 1,
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {proyecto.titulo}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        fontSize: "0.825rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        flexGrow: 1
                      }}
                    >
                      {proyecto.descripcion}
                    </Typography>

                    <Box sx={{ pt: 1.5, borderTop: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" color="text.disabled">
                        {new Date(proyecto.created_at || Date.now()).toLocaleDateString()}
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Eliminar proyecto como Admin">
                          <IconButton
                            size="small"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                type: activeTab === 0 ? "3D" : "SOFTWARE",
                                id: proyecto.id,
                                titulo: proyecto.titulo
                              })
                            }
                            sx={{
                              color: "text.secondary",
                              "&:hover": { color: "error.main", bgcolor: "error.lighter" }
                            }}
                          >
                            <img src="/assets/icons/actions/delete.png" alt="Eliminar" style={{ width: 16, height: 16, objectFit: 'contain' }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Diálogo de Confirmación de Borrado de Proyecto */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "6px", p: 1, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid rgba(0, 0, 0, 0.05)", bgcolor: "#FFFFFF" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>¿Eliminar proyecto?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Vas a eliminar el proyecto <strong>{deleteDialog.titulo}</strong> de este Editor. Esta acción es irrevocable.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
            sx={{ textTransform: "none", fontWeight: 600 }}
            disabled={submittingDelete}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={submittingDelete}
            sx={{ borderRadius: 1.5, textTransform: "none", fontWeight: 600, boxShadow: "none" }}
          >
            {submittingDelete ? <CircularProgress size={20} color="inherit" /> : "Sí, eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
