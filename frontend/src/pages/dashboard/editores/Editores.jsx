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
  Alert,
  Stack,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Link
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

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

  // Filtros desplegables (Estado y Más Filtros)
  const [statusFilter, setStatusFilter] = React.useState("ALL"); // "ALL" | "ACTIVE" | "INACTIVE"
  const [moreFilter, setMoreFilter] = React.useState("ALL"); // "ALL" | "WITH_PROJECTS" | "WITHOUT_PROJECTS"
  const [anchorElStatus, setAnchorElStatus] = React.useState(null);
  const [anchorElMore, setAnchorElMore] = React.useState(null);

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

  const filteredEditores = React.useMemo(() => {
    return editores.filter((e) => {
      if (statusFilter === "ACTIVE" && !e.is_active) return false;
      if (statusFilter === "INACTIVE" && e.is_active) return false;
      const total = (e.proyectos_3d_count || 0) + (e.proyectos_software_count || 0);
      if (moreFilter === "WITH_PROJECTS" && total === 0) return false;
      if (moreFilter === "WITHOUT_PROJECTS" && total > 0) return false;
      return true;
    });
  }, [editores, statusFilter, moreFilter]);

  return (
    <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
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
          {/* Encabezado Principal*/}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: 2
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500, display: "block", mb: 0.5 }}>
                <Link component={RouterLink} to="/dashboard" color="inherit" underline="hover">Inicio</Link> / Editores
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827", fontSize: { xs: "1.5rem", md: "1.75rem" } }}>
                Gestión de editores
              </Typography>
            </Box>

            <Button
              variant="contained"
              elevation={0}
              sx={{
                bgcolor: "#F1F5F9",
                color: "#1E293B",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "6px",
                boxShadow: "none",
                px: 2.2,
                py: 0.8,
                "&:hover": { bgcolor: "#E2E8F0", boxShadow: "none" }
              }}
            >
              Exportar
            </Button>
          </Box>

          <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)", mb: 3 }} />

          {/* Barra de Acciones y Filtros (Posición original en escritorio, 100% responsive en móvil) */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
              gap: 2,
              mb: 3
            }}
          >
            {/* Izquierda: Botón Nuevo Editor + Buscador */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
              <Button
                variant="contained"
                startIcon={<PlusIcon weight="bold" />}
                onClick={handleOpenCreate}
                elevation={0}
                sx={{
                  bgcolor: "#002B49",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "2px",
                  boxShadow: "none",
                  px: 3.5,
                  py: 1,
                  whiteSpace: "nowrap",
                  "&:hover": { bgcolor: "#001e33", boxShadow: "none" }
                }}
              >
                Nuevo Editor
              </Button>
              <TextField
                placeholder="Buscar editor..."
                label="Buscar"
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                sx={{
                  width: { xs: "100%", sm: 280 },
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
                      <SearchIcon size={18} color="#64748B" />
                    </InputAdornment>
                  )
                }}
              />
            </Stack>

            {/* Derecha: Filtros estilo Select con etiqueta flotante */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
              sx={{ pt: { xs: 1, md: 0 } }}
            >
              <FormControl
                size="small"
                sx={{
                  minWidth: 160,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "2px",
                    bgcolor: "#FFFFFF",
                    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
                    "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.4)" },
                    "&.Mui-focused fieldset": { borderColor: "#002B49" }
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#002B49" }
                }}
              >
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  label="Estado"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL"><em>Todos los estados</em></MenuItem>
                  <MenuItem value="ACTIVE">Activo</MenuItem>
                  <MenuItem value="INACTIVE">Inactivo</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                size="small"
                sx={{
                  minWidth: 200,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "2px",
                    bgcolor: "#FFFFFF",
                    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
                    "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.4)" },
                    "&.Mui-focused fieldset": { borderColor: "#002B49" }
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#002B49" }
                }}
              >
                <InputLabel>Filtro Proyectos</InputLabel>
                <Select
                  value={moreFilter}
                  label="Filtro Proyectos"
                  onChange={(e) => setMoreFilter(e.target.value)}
                >
                  <MenuItem value="ALL"><em>Todos los editores</em></MenuItem>
                  <MenuItem value="WITH_PROJECTS">Con proyectos subidos</MenuItem>
                  <MenuItem value="WITHOUT_PROJECTS">Sin proyectos subidos</MenuItem>
                </Select>
              </FormControl>

              {(searchTerm || statusFilter !== "ALL" || moreFilter !== "ALL") && (
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("ALL");
                    setMoreFilter("ALL");
                  }}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "2px",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    color: "#475569",
                    px: 2,
                    py: 0.8,
                    "&:hover": { borderColor: "#002B49", bgcolor: "rgba(0, 43, 73, 0.04)", color: "#002B49" }
                  }}
                >
                  Limpiar
                </Button>
              )}
            </Stack>
          </Box>

          {/* Tabla Senior con Subcolumnas y Botón de Ver Proyectos */}
          <EditoresTable
            editores={filteredEditores}
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
