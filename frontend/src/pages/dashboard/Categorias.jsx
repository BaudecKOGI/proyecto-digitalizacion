import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Tooltip,
  Stack
} from "@mui/material";

import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { PencilSimple as EditIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { Tag as TagIcon } from "@phosphor-icons/react/dist/ssr/Tag";
import { Folder as FolderIcon } from "@phosphor-icons/react/dist/ssr/Folder";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";

import {
  fetchCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from "@/services/api";

// Función auxiliar para generar un color de acento según la categoría
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

export default function CategoriasPage() {
  const [categorias, setCategorias] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Modals de Crear/Editar/Eliminar
  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingCategoria, setEditingCategoria] = React.useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState(null);

  // Formulario de Categoría
  const [formData, setFormData] = React.useState({
    nombre: "",
    slug: "",
    descripcion: ""
  });
  const [formError, setFormError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // Alerta flotante
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Cargar las categorías desde la API
  const loadCategorias = React.useCallback(async (query = "") => {
    setLoading(true);
    try {
      const data = await fetchCategorias(query);
      setCategorias(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      showSnackbar(
        "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCategorias();
  }, [loadCategorias]);

  // Manejador de búsqueda
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    const timer = setTimeout(() => {
      loadCategorias(val);
    }, 350);
    return () => clearTimeout(timer);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Abrir modal Nueva Categoría
  const handleOpenCreate = () => {
    setEditingCategoria(null);
    setFormData({
      nombre: "",
      slug: "",
      descripcion: ""
    });
    setFormError("");
    setOpenDialog(true);
  };

  // Abrir modal Editar Categoría
  const handleOpenEdit = (cat) => {
    setEditingCategoria(cat);
    setFormData({
      nombre: cat.nombre || "",
      slug: cat.slug || "",
      descripcion: cat.descripcion || ""
    });
    setFormError("");
    setOpenDialog(true);
  };

  // Enviar Formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setFormError("El nombre de la categoría es obligatorio.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim()
      };
      if (formData.slug.trim()) {
        payload.slug = formData.slug.trim().toLowerCase().replace(/\s+/g, "-");
      }

      if (editingCategoria) {
        await updateCategoria(editingCategoria.id, payload);
        showSnackbar("Categoría actualizada correctamente", "success");
      } else {
        await createCategoria(payload);
        showSnackbar("Nueva categoría creada correctamente", "success");
      }
      setOpenDialog(false);
      loadCategorias(searchTerm);
    } catch (err) {
      setFormError(err.message || "Ocurrió un error al guardar la categoría.");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmar Eliminación
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setSubmitting(true);
    try {
      await deleteCategoria(deletingId);
      showSnackbar("Categoría eliminada correctamente", "success");
      setOpenDeleteDialog(false);
      setDeletingId(null);
      loadCategorias(searchTerm);
    } catch (err) {
      showSnackbar(err.message || "Error al eliminar la categoría", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ pt: 0, pb: 4, px: 2, maxWidth: 1280, margin: "0 auto" }}>
      {/* Encabezado */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 4
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
            Gestión de Categorías
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organiza y estructura las clasificaciones para proyectos 3D y de desarrollo de software del FAB LAB.
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<PlusIcon weight="bold" />}
          onClick={handleOpenCreate}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.2,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0px 4px 14px rgba(247, 144, 9, 0.4)",
            backgroundColor: "#F79009",
            "&:hover": {
              backgroundColor: "#E07B00"
            }
          }}
        >
          Nueva Categoría
        </Button>
      </Box>

      {/* Barra de Búsqueda y Filtros */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 2.5,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)",
          border: "1px solid",
          borderColor: "divider"
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 8, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Buscar categoría por nombre o descripción..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon size={20} color="#6B7280" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, backgroundColor: "background.default" }
                }}
                size="medium"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 6 }} sx={{ textAlign: { sm: "right" } }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Total categorías: <strong>{categorias.length}</strong>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla / Lista de Categorías */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#F79009" }} />
        </Box>
      ) : categorias.length === 0 ? (
        <Card
          sx={{
            borderRadius: 3,
            p: 6,
            textAlign: "center",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
            border: "1px dashed",
            borderColor: "divider"
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              margin: "0 auto 16px",
              backgroundColor: "rgba(247, 144, 9, 0.1)",
              color: "#F79009"
            }}
          >
            <TagIcon size={32} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {searchTerm ? "No se encontraron categorías coincidiendo con la búsqueda" : "No hay categorías registradas"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, margin: "0 auto 24px" }}>
            {searchTerm
              ? "Intenta buscar con otro término o palabra clave en la descripción."
              : "Crea tu primera categoría para poder clasificar los proyectos de fabricación digital y software."}
          </Typography>
          {!searchTerm && (
            <Button
              variant="outlined"
              startIcon={<PlusIcon />}
              onClick={handleOpenCreate}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#F79009",
                color: "#F79009",
                "&:hover": { borderColor: "#E07B00", backgroundColor: "rgba(247,144,9,0.05)" }
              }}
            >
              Crear primera categoría
            </Button>
          )}
        </Card>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0px 4px 25px rgba(0, 0, 0, 0.04)",
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden"
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "action.hover" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>CATEGORÍA</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>DESCRIPCIÓN</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>SLUG (URL)</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>PROYECTOS</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 2, textAlign: "right" }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.map((cat) => {
                const accentColor = stringToColor(cat.nombre);
                const count = cat.proyectos_count || 0;

                return (
                  <TableRow
                    key={cat.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {/* Categoría / Icono */}
                    <TableCell sx={{ py: 2.2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: `${accentColor}1A`, // 10% opacidad
                            color: accentColor,
                            width: 44,
                            height: 44,
                            border: "1px solid",
                            borderColor: `${accentColor}33`,
                            fontWeight: 700
                          }}
                        >
                          <TagIcon size={22} weight="fill" />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {cat.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: #{cat.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Descripción */}
                    <TableCell sx={{ maxWidth: 320 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {cat.descripcion || "Sin descripción adicional"}
                      </Typography>
                    </TableCell>

                    {/* Slug */}
                    <TableCell>
                      <Chip
                        label={`#${cat.slug}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          fontFamily: "monospace",
                          borderColor: "divider",
                          backgroundColor: "background.default"
                        }}
                      />
                    </TableCell>

                    {/* Proyectos count */}
                    <TableCell>
                      <Chip
                        icon={<FolderIcon size={14} />}
                        label={`${count} proyecto${count === 1 ? "" : "s"}`}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: count > 0 ? "rgba(16, 185, 129, 0.1)" : "action.hover",
                          color: count > 0 ? "#10B981" : "text.secondary"
                        }}
                      />
                    </TableCell>

                    {/* Acciones */}
                    <TableCell sx={{ textAlign: "right" }}>
                      <Tooltip title="Editar categoría">
                        <IconButton
                          onClick={() => handleOpenEdit(cat)}
                          sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
                        >
                          <EditIcon size={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar categoría">
                        <IconButton
                          onClick={() => {
                            setDeletingId(cat.id);
                            setOpenDeleteDialog(true);
                          }}
                          sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                        >
                          <TrashIcon size={20} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* DIALOG CREAR / EDITAR CATEGORÍA */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingCategoria ? "Editar Categoría" : "Crear Nueva Categoría"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {editingCategoria
                ? "Modifica el nombre, descripción o identificador URL de la categoría."
                : "Agrega una nueva etiqueta de clasificación para los proyectos del FAB LAB."}
            </Typography>

            {formError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {formError}
              </Alert>
            )}

            <Stack spacing={2.5}>
              <TextField
                label="Nombre de la categoría"
                fullWidth
                required
                placeholder="Ej. Robótica y Automática"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />

              <TextField
                label="Slug / URL amigable (opcional)"
                fullWidth
                placeholder="robotica-y-automatica (deja vacío para autogenerar)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                helperText="Identificador único sin acentos ni espacios usado en enlaces web."
              />

              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                placeholder="Describe brevemente qué tipo de proyectos engloba esta categoría..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{ textTransform: "none", fontWeight: 600 }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#F79009",
                "&:hover": { backgroundColor: "#E07B00" }
              }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : editingCategoria ? "Guardar cambios" : "Crear Categoría"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* DIALOG ELIMINAR CATEGORÍA */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>¿Eliminar esta Categoría?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Esta acción eliminará la categoría de la lista. Los proyectos que actualmente tengan asignada esta categoría no se borrarán, pero perderán esta clasificación.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ textTransform: "none", fontWeight: 600 }}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={submitting}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            {submitting ? <CircularProgress size={22} color="inherit" /> : "Sí, eliminar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* NOTIFICACION FLOTANTE */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2, boxShadow: "0px 8px 25px rgba(0,0,0,0.15)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
