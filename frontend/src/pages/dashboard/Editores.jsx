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
  Switch,
  FormControlLabel,
  Stack
} from "@mui/material";

import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { PencilSimple as EditIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { UserPlus as UserPlusIcon } from "@phosphor-icons/react/dist/ssr/UserPlus";
import { Envelope as EmailIcon } from "@phosphor-icons/react/dist/ssr/Envelope";
import { ShieldCheck as RoleIcon } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";

import {
  fetchEditores,
  createEditor,
  updateEditor,
  deleteEditor
} from "@/services/api";

// Función para obtener color coherente según el nombre
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

export default function EditoresPage() {
  const [editores, setEditores] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Modals de Crear/Editar/Eliminar
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
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // Alerta flotante (Snackbar)
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Cargar los editores desde la API
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
  }, []);

  React.useEffect(() => {
    loadEditores();
  }, [loadEditores]);

  // Manejador de Búsqueda
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    // Debounce simple para buscar
    const timer = setTimeout(() => {
      loadEditores(val);
    }, 400);
    return () => clearTimeout(timer);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
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
    setShowPassword(false);
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
    setShowPassword(false);
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
        // Editar
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
        // Crear
        await createEditor({
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          is_active: formData.is_active,
          rol: "PROF"
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
      {/* Encabezado Principal */}
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
            Gestión de Editores
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra a los profesores y encargados con acceso al Panel de Edición del FAB LAB.
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
            boxShadow: "0px 4px 14px rgba(99, 102, 241, 0.4)",
            backgroundColor: "#6366F1",
            "&:hover": {
              backgroundColor: "#4F46E5"
            }
          }}
        >
          Nuevo Editor
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
                placeholder="Buscar editor por nombre o correo..."
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
                Total registrados: <strong>{editores.length}</strong>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla/Lista de Editores */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#6366F1" }} />
        </Box>
      ) : editores.length === 0 ? (
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
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              color: "#6366F1"
            }}
          >
            <UserPlusIcon size={32} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {searchTerm ? "No se encontraron editores coincidiendo con la búsqueda" : "No hay editores registrados"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, margin: "0 auto 24px" }}>
            {searchTerm
              ? "Intenta buscar con otro nombre o correo electrónico."
              : "Crea el primer perfil de Editor para permitir que profesores o encargados gestionen proyectos."}
          </Typography>
          {!searchTerm && (
            <Button
              variant="outlined"
              startIcon={<PlusIcon />}
              onClick={handleOpenCreate}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Crear primer editor
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
                <TableCell sx={{ fontWeight: 700, py: 2 }}>EDITOR / PROFESOR</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>CORREO ELECTRÓNICO</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>ROL</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>ESTADO</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 2, textAlign: "right" }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {editores.map((editor) => {
                const avatarColor = stringToColor(editor.nombre);
                const initials = (editor.nombre || "?")
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <TableRow
                    key={editor.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {/* Usuario / Avatar */}
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: avatarColor,
                            fontWeight: 700,
                            width: 44,
                            height: 44,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                          }}
                        >
                          {initials}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {editor.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: #{editor.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Correo */}
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon size={16} color="#6B7280" />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {editor.email}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* Rol */}
                    <TableCell>
                      <Chip
                        icon={<RoleIcon size={14} />}
                        label="Editor FAB LAB"
                        size="small"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "rgba(99, 102, 241, 0.1)",
                          color: "#6366F1",
                          borderColor: "rgba(99, 102, 241, 0.2)",
                          border: "1px solid"
                        }}
                      />
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                      <Chip
                        label={editor.is_active ? "Activo" : "Inactivo"}
                        size="small"
                        color={editor.is_active ? "success" : "default"}
                        variant={editor.is_active ? "filled" : "outlined"}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    {/* Acciones */}
                    <TableCell sx={{ textAlign: "right" }}>
                      <Tooltip title="Editar cuenta">
                        <IconButton
                          onClick={() => handleOpenEdit(editor)}
                          sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
                        >
                          <EditIcon size={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar cuenta">
                        <IconButton
                          onClick={() => {
                            setDeletingId(editor.id);
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

      {/* DIALOG CREAR / EDITAR EDITOR */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingEditor ? "Editar cuenta de Editor" : "Crear nuevo Editor"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {editingEditor
                ? "Actualiza el nombre, correo electrónico o estado de la cuenta."
                : "Ingresa los datos para registrar a un nuevo encargado o profesor."}
            </Typography>

            {formError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {formError}
              </Alert>
            )}

            <Stack spacing={2.5}>
              <TextField
                label="Nombre completo"
                fullWidth
                required
                placeholder="Ej. Ing. Carlos Mendoza"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />

              <TextField
                label="Correo electrónico"
                type="email"
                fullWidth
                required
                placeholder="carlos.mendoza@fablab.pe"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <TextField
                label={
                  editingEditor
                    ? "Nueva contraseña (dejar vacía para conservar actual)"
                    : "Contraseña temporal"
                }
                type={showPassword ? "text" : "password"}
                fullWidth
                required={!editingEditor}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <EyeSlashIcon size={18} /> : <EyeIcon size={18} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    color="primary"
                  />
                }
                label="Cuenta activa (puede iniciar sesión en /editor)"
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
                backgroundColor: "#6366F1",
                "&:hover": { backgroundColor: "#4F46E5" }
              }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : editingEditor ? "Guardar cambios" : "Crear Editor"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* DIALOG ELIMINAR EDITOR */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>¿Eliminar este Editor?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Esta acción eliminará de forma permanente la cuenta y su acceso al panel de edición. Esta operación no se puede deshacer.
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
