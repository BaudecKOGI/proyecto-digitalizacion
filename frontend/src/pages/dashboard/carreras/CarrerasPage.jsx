import * as React from "react";
import { useNavigate } from "react-router-dom";
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
  Link,
  Avatar
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { GraduationCap as CarreraIcon } from "@phosphor-icons/react/dist/ssr/GraduationCap";

import {
  fetchCarreras,
  createCarrera,
  updateCarrera,
  deleteCarrera
} from "@/services/api";

import CarrerasTable from "./CarrerasTable";
import CarreraFormModal from "./CarreraFormModal";
import CarreraDeleteModal from "./CarreraDeleteModal";

export default function CarrerasPage() {
  const navigate = useNavigate();

  const [carreras, setCarreras] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingCarrera, setEditingCarrera] = React.useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState(null);

  const [formData, setFormData] = React.useState({
    nombre: "",
    codigo: "",
    duracion_ciclos: 12,
    activo: true
  });
  const [formError, setFormError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success"
  });

  const showSnackbar = React.useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const loadCarreras = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCarreras();
      setCarreras(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Error al cargar carreras:", err);
      showSnackbar("No se pudo conectar con el servidor.", "error");
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  React.useEffect(() => {
    loadCarreras();
  }, [loadCarreras]);

  const filteredCarreras = React.useMemo(() => {
    if (!searchTerm.trim()) return carreras;
    const query = searchTerm.toLowerCase().trim();
    return carreras.filter((c) => {
      const nombre = (c.nombre || "").toLowerCase();
      const codigo = (c.codigo || "").toLowerCase();
      return nombre.includes(query) || codigo.includes(query);
    });
  }, [carreras, searchTerm]);

  const paginatedCarreras = React.useMemo(() => {
    return filteredCarreras.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredCarreras, page, rowsPerPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleOpenCreate = () => {
    setEditingCarrera(null);
    setFormData({
      nombre: "",
      codigo: "",
      duracion_ciclos: 12,
      activo: true
    });
    setFormError("");
    setOpenDialog(true);
  };

  const handleOpenEdit = (carrera) => {
    setEditingCarrera(carrera);
    setFormData({
      nombre: carrera.nombre || "",
      codigo: carrera.codigo || "",
      duracion_ciclos: carrera.duracion_ciclos || 12,
      activo: carrera.activo !== undefined ? carrera.activo : true
    });
    setFormError("");
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setFormError("El nombre de la carrera es obligatorio.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        codigo: formData.codigo.trim() || null,
        duracion_ciclos: formData.duracion_ciclos,
        activo: formData.activo
      };

      if (editingCarrera) {
        await updateCarrera(editingCarrera.id, payload);
        showSnackbar("Carrera actualizada correctamente", "success");
      } else {
        await createCarrera(payload);
        showSnackbar("Nueva carrera creada correctamente", "success");
      }
      setOpenDialog(false);
      loadCarreras();
    } catch (err) {
      setFormError(err.message || "Ocurrió un error al guardar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setSubmitting(true);
    try {
      await deleteCarrera(deletingId);
      showSnackbar("Carrera eliminada correctamente", "success");
      setOpenDeleteDialog(false);
      setDeletingId(null);
      loadCarreras();
    } catch (err) {
      showSnackbar(err.message || "Error al eliminar la carrera", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Estado vacío (sin carreras)
  if (!loading && carreras.length === 0 && !searchTerm) {
    return (
      <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500, display: "block", mb: 0.5 }}>
              <Link component={RouterLink} to="/dashboard" color="inherit" underline="hover">Inicio</Link> / Carreras
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827", fontSize: { xs: "1.5rem", md: "1.75rem" } }}>
              Gestión de Carreras
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Organiza y estructura las carreras para los proyectos del FAB LAB.
            </Typography>
          </Box>

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
            Nueva Carrera
          </Button>
        </Stack>

        <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)", mb: 3 }} />

        <Card
          sx={{
            borderRadius: 2,
            p: 6,
            textAlign: "center",
            boxShadow: "none",
            border: "1px dashed",
            borderColor: "divider",
            bgcolor: "background.paper"
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              margin: "0 auto 16px",
              backgroundColor: "action.hover",
              color: "text.secondary"
            }}
          >
            <CarreraIcon size={28} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}>
            No hay carreras registradas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, margin: "0 auto 24px" }}>
            Crea la primera carrera para empezar a clasificar los proyectos por área académica.
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlusIcon />}
            onClick={handleOpenCreate}
            sx={{
              bgcolor: "#002B49",
              color: "#FFFFFF",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "2px",
              px: 3.5,
              py: 1,
              "&:hover": { bgcolor: "#001e33" }
            }}
          >
            Nueva Carrera
          </Button>
        </Card>

        <CarreraFormModal
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          editingCarrera={editingCarrera}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          formError={formError}
          submitting={submitting}
        />

        <CarreraDeleteModal
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          submitting={submitting}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%", borderRadius: 1.5, boxShadow: "0px 4px 20px rgba(0,0,0,0.12)" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500, display: "block", mb: 0.5 }}>
            <Link component={RouterLink} to="/dashboard" color="inherit" underline="hover">Inicio</Link> / Carreras
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827", fontSize: { xs: "1.5rem", md: "1.75rem" } }}>
            Gestión de Carreras
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Organiza y estructura las carreras para los proyectos del FAB LAB.
          </Typography>
        </Box>

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
          Nueva Carrera
        </Button>
      </Stack>

      <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)", mb: 3 }} />

      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <TextField
          placeholder="Buscar carrera por nombre o código..."
          label="Buscar"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#FFFFFF",
              borderRadius: "2px",
              "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
              "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.4)" },
              "&.Mui-focused fieldset": { borderColor: "#002B49" }
            },
            "& .MuiInputLabel-root.Mui-focused": { color: "#002B49" }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon size={18} color="#64748B" />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <CarrerasTable
        carreras={paginatedCarreras}
        loading={loading}
        totalCount={filteredCarreras.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        searchTerm={searchTerm}
        onEdit={handleOpenEdit}
        onDelete={(id) => {
          setDeletingId(id);
          setOpenDeleteDialog(true);
        }}
        onOpenCreate={handleOpenCreate}
        onNavigate={navigate}  // <-- Pasamos navigate
      />

      <CarreraFormModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        editingCarrera={editingCarrera}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
        submitting={submitting}
      />

      <CarreraDeleteModal
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        submitting={submitting}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 1.5, boxShadow: "0px 4px 20px rgba(0,0,0,0.12)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}