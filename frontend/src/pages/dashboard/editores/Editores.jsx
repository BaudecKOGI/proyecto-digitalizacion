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
  Snackbar,
  Alert
} from "@mui/material";

import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";

import {
  fetchEditores,
  createEditor,
  updateEditor,
  deleteEditor
} from "@/services/api";

import EditoresTable from "./EditoresTable";
import EditorFormModal from "./EditorFormModal";
import EditorDeleteModal from "./EditorDeleteModal";
import EditorDetailView from "./EditorDetailView";

export default function EditoresPage() {
  const [editores, setEditores] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Vista Detalle Integrada (Ver Proyectos Subidos por un Editor)
  const [viewingEditor, setViewingEditor] = React.useState(null);

  // Modales de Crear / Editar / Eliminar
  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingEditor, setEditingEditor] = React.useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState(null);

  // Formulario de editor
  const [formData, setFormData] = React.useState({
    nombre: "",
    email: "",
    password: "",
    is_active: true
  });
  const [formError, setFormError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // Alerta flotante (Snackbar)
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success"
  });

  const showSnackbar = React.useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const loadEditores = React.useCallback(async (query = "") => {
    setLoading(true);
    try {
      const data = await fetchEditores(query);
      setEditores(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Error al cargar editores:", err);
      showSnackbar(
        "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  React.useEffect(() => {
    loadEditores();
  }, [loadEditores]);

  // Manejador de Búsqueda
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    const timer = setTimeout(() => {
      loadEditores(val);
    }, 400);
    return () => clearTimeout(timer);
  };

  // Abrir modal Nuevo Editor
  const handleOpenCreate = () => {
    setEditingEditor(null);
    setFormData({
      nombre: "",
      email: "",
      password: "",
      is_active: true
    });
    setFormError("");
    setOpenDialog(true);
  };

  // Abrir modal Editar Editor
  const handleOpenEdit = (editor) => {
    setEditingEditor(editor);
    setFormData({
      nombre: editor.nombre || "",
      email: editor.email || "",
      password: "",
      is_active: editor.is_active !== undefined ? editor.is_active : true
    });
    setFormError("");
    setOpenDialog(true);
  };

  // Enviar formulario (Crear o Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.email.trim()) {
      setFormError("Nombre y Correo electrónico son obligatorios.");
      return;
    }
    if (!editingEditor && !formData.password.trim()) {
      setFormError("Debes asignar una contraseña para la nueva cuenta.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      if (editingEditor) {
        const payload = {
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          is_active: formData.is_active
        };
        if (formData.password.trim()) {
          payload.password = formData.password.trim();
        }
        await updateEditor(editingEditor.id, payload);
        showSnackbar("Editor actualizado correctamente", "success");
      } else {
        await createEditor({
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          is_active: formData.is_active,
          rol: "EDITOR"
        });
        showSnackbar("Nuevo editor creado correctamente", "success");
      }
      setOpenDialog(false);
      loadEditores(searchTerm);
    } catch (err) {
      setFormError(err.message || "Ocurrió un error al guardar.");
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar Editor
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setSubmitting(true);
    try {
      await deleteEditor(deletingId);
      showSnackbar("Editor eliminado correctamente", "success");
      setOpenDeleteDialog(false);
      setDeletingId(null);
      loadEditores(searchTerm);
    } catch (err) {
      showSnackbar(err.message || "Error al eliminar el editor", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ pt: 0, pb: 4, px: 2, maxWidth: 1280, margin: "0 auto" }}>
      {/* Si estamos viendo la producción/proyectos de un editor en particular */}
      {viewingEditor ? (
        <EditorDetailView
          editor={viewingEditor}
          onBack={() => {
            setViewingEditor(null);
            loadEditores(searchTerm);
          }}
          showSnackbar={showSnackbar}
        />
      ) : (
        <>
          {/* Encabezado Principal (Estilo Senior Limpio) */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: 2,
              mb: 3
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                Gestión de Editores
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Administra a los editores y supervisa la producción y proyectos subidos por cada encargado.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<PlusIcon weight="bold" />}
              onClick={handleOpenCreate}
              sx={{
                borderRadius: 1.5,
                px: 3,
                py: 1.2,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                backgroundColor: "#6366F1",
                "&:hover": {
                  backgroundColor: "#4F46E5",
                  boxShadow: "none"
                }
              }}
            >
              Nuevo Editor
            </Button>
          </Box>

          {/* Barra de Búsqueda y Filtros */}
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "none",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper"
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 8, md: 6 }}>
                  <TextField
                    fullWidth
                    placeholder="Buscar editor por nombre o correo..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon size={18} color="#6B7280" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4, md: 6 }} sx={{ textAlign: { sm: "right" } }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total registrados: <strong>{editores.length}</strong>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Tabla Senior con Subcolumnas y Botón de Ver Proyectos */}
          <EditoresTable
            editores={editores}
            loading={loading}
            searchTerm={searchTerm}
            onViewProjects={(editor) => setViewingEditor(editor)}
            onEdit={(editor) => handleOpenEdit(editor)}
            onDelete={(editor) => {
              setDeletingId(editor.id);
              setOpenDeleteDialog(true);
            }}
            onOpenCreate={handleOpenCreate}
          />
        </>
      )}

      {/* Modal Crear / Editar */}
      <EditorFormModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        editingEditor={editingEditor}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
        submitting={submitting}
      />

      {/* Modal Eliminar */}
      <EditorDeleteModal
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        submitting={submitting}
      />

      {/* Notificación Flotante */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 1.5,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.12)"
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
