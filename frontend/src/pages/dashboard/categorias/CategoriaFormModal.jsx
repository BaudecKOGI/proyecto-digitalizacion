import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress
} from "@mui/material";

/**
 * MODAL DE CREACIÓN / EDICIÓN DE CATEGORÍA
 * Formulario modular para mantener limpio el archivo principal de Categorías.
 */
export default function CategoriaFormModal({
  open,
  onClose,
  editingCategoria,
  formData,
  setFormData,
  formError,
  submitting,
  onSubmit
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper"
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
        {editingCategoria ? "Editar Categoría" : "Crear Nueva Categoría"}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
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
            onClick={onClose}
            sx={{ textTransform: "none", fontWeight: 700 }}
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
              fontWeight: 700,
              backgroundColor: "#F79009",
              "&:hover": { backgroundColor: "#E07B00" }
            }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : editingCategoria ? (
              "Guardar cambios"
            ) : (
              "Crear Categoría"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
