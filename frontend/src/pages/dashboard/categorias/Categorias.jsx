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
  CircularProgress,
  Alert,
  Snackbar,
  Stack,
  Link
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { Tag as TagIcon } from "@phosphor-icons/react/dist/ssr/Tag";

import {
  fetchCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from "@/services/api";

import CategoriasTable from "./CategoriasTable";
import CategoriaFormModal from "./CategoriaFormModal";
import CategoriaDeleteModal from "./CategoriaDeleteModal";
import CategoriaDetailView from "./CategoriaDetailView";

/**
 * GESTIÓN DE CATEGORÍAS
 */
export default function CategoriasPage() {
  const [categorias, setCategorias] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Vista no flotante del detalle de categoría
  const [viewingCategory, setViewingCategory] = React.useState(null);

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

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

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

  // Abrir modal Nueva Categoría
  const handleOpenCreate = () => {
    setEditingCategoria(null);
    setFormData({ nombre: "", slug: "", descripcion: "" });
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

  // Si el usuario está viendo el detalle de una categoría
  if (viewingCategory) {
    return (
      <Box sx={{ pt: 0, pb: 4, px: 2, maxWidth: 1280, margin: "0 auto" }}>
        <CategoriaDetailView
          categoria={viewingCategory}
          onBack={() => setViewingCategory(null)}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
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
          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500, display: "block", mb: 0.5 }}>
            <Link component={RouterLink} to="/dashboard" color="inherit" underline="hover">Inicio</Link> / Categorías
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
            Gestión de Categorías
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Organiza y estructura las clasificaciones para modelos 3D y proyectos de desarrollo de software del FAB LAB.
          </Typography>
        </Box>
      </Box>

      {/* Barra de Búsqueda y Filtros */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <TextField
          size="small"
          placeholder="Buscar categoría por nombre o descripción..."
          label="Buscar"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            width: { xs: "100%", sm: 360 },
            "& .MuiOutlinedInput-root": {
              bgcolor: "#FFFFFF",
              borderRadius: "2px",
              "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
              "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.4)" },
              "&.Mui-focused fieldset": { borderColor: "#002B49" }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon size={20} color="#64748B" />
              </InputAdornment>
            )
          }}
        />

        <Stack direction="row" alignItems="center" spacing={3}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Total categorías: <strong>{categorias.length}</strong>
          </Typography>
          <Button
            variant="contained"
            size="medium"
            startIcon={<PlusIcon weight="bold" />}
            onClick={handleOpenCreate}
            sx={{
              borderRadius: "2px",
              px: 3.5,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              backgroundColor: "#002B49",
              color: "#FFFFFF",
              "&:hover": { backgroundColor: "#001e33", boxShadow: "none" }
            }}
          >
            Nueva Categoría
          </Button>
        </Stack>
      </Box>

      {/* Tabla de Categorías */}
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
          <Box
            component="img"
            src="/assets/tag.png"
            alt="Categoría vacía"
            sx={{
              width: 48,
              height: 48,
              margin: "0 auto 16px",
              opacity: 0.5,
              objectFit: "contain"
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {searchTerm ? "No se encontraron categorías coincidiendo con la búsqueda" : "No hay categorías registradas"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, margin: "0 auto 24px" }}>
            {searchTerm
              ? "Intenta buscar con otro término o palabra clave en la descripción."
              : "Crea tu primera categoría para poder clasificar los proyectos de fabricación digital y software."}
          </Typography>
        </Card>
      ) : (
        <CategoriasTable
          categorias={categorias}
          onView={(cat) => setViewingCategory(cat)}
          onEdit={handleOpenEdit}
          onDelete={(id) => {
            setDeletingId(id);
            setOpenDeleteDialog(true);
          }}
        />
      )}

      {/* DIALOG CREAR / EDITAR CATEGORÍA */}
      <CategoriaFormModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        editingCategoria={editingCategoria}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
        submitting={submitting}
        onSubmit={handleSubmit}
      />

      {/* DIALOG ELIMINAR CATEGORÍA */}
      <CategoriaDeleteModal
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        submitting={submitting}
      />

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
