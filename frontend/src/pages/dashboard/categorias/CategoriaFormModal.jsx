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
  CircularProgress,
  Box
} from "@mui/material";

/**
 * MODAL DE CREACIÓN 
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
          borderRadius: 1,
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
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" }}>
                Nombre de la categoría *
              </Typography>
              <TextField
                fullWidth
                required
                placeholder="Ej. Robótica y Automática"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                sx={{
                  bgcolor: "#F8FAFC",
                  borderRadius: "2px 2px 0 0",
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#F8FAFC",
                    borderRadius: "2px 2px 0 0",
                    "& fieldset": { border: "none", borderBottom: "1px solid #002B49" },
                    "&:hover fieldset": { border: "none", borderBottom: "1.5px solid #002B49" },
                    "&.Mui-focused fieldset": { border: "none", borderBottom: "2px solid #002B49" }
                  },
                  "& .MuiInputBase-input": { py: 1.2, px: 1.5, fontSize: "0.95rem", color: "#0F172A", fontWeight: 500 }
                }}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" }}>
                Slug / URL amigable (opcional)
              </Typography>
              <TextField
                fullWidth
                placeholder="robotica-y-automatica (deja vacío para autogenerar)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                helperText="Identificador único sin acentos ni espacios usado en enlaces web."
                sx={{
                  bgcolor: "#F8FAFC",
                  borderRadius: "2px 2px 0 0",
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#F8FAFC",
                    borderRadius: "2px 2px 0 0",
                    "& fieldset": { border: "none", borderBottom: "1px solid #002B49" },
                    "&:hover fieldset": { border: "none", borderBottom: "1.5px solid #002B49" },
                    "&.Mui-focused fieldset": { border: "none", borderBottom: "2px solid #002B49" }
                  },
                  "& .MuiInputBase-input": { py: 1.2, px: 1.5, fontSize: "0.95rem", color: "#0F172A", fontWeight: 500 }
                }}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" }}>
                Descripción
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Describe brevemente qué tipo de proyectos engloba esta categoría..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                sx={{
                  bgcolor: "#F8FAFC",
                  borderRadius: "2px 2px 0 0",
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#F8FAFC",
                    borderRadius: "2px 2px 0 0",
                    "& fieldset": { border: "none", borderBottom: "1px solid #002B49" },
                    "&:hover fieldset": { border: "none", borderBottom: "1.5px solid #002B49" },
                    "&.Mui-focused fieldset": { border: "none", borderBottom: "2px solid #002B49" }
                  },
                  "& .MuiInputBase-input": { py: 1.2, px: 1.5, fontSize: "0.95rem", color: "#0F172A", fontWeight: 500 }
                }}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={submitting}
            sx={{
              borderRadius: "2px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "#002B49",
              borderColor: "#002B49",
              px: 3.5,
              py: 0.9,
              "&:hover": { borderColor: "#002B49", bgcolor: "rgba(0, 43, 73, 0.04)" }
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{
              borderRadius: "2px",
              px: 3.5,
              py: 0.9,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              backgroundColor: "#002B49",
              color: "#FFFFFF",
              "&:hover": { backgroundColor: "#001e33", boxShadow: "none" }
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
