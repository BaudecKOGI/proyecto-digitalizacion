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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box
} from "@mui/material";

export default function CarreraFormModal({
  open,
  onClose,
  editingCarrera,
  onSubmit,
  formData,
  setFormData,
  formError,
  submitting
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "6px",
          p: 1,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          bgcolor: "#FFFFFF"
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        {editingCarrera ? "Editar Carrera" : "Crear Nueva Carrera"}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {editingCarrera
              ? "Actualiza el nombre, código, duración o estado de la carrera."
              : "Ingresa los datos para registrar una nueva carrera profesional."}
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
              {formError}
            </Alert>
          )}

          <Stack spacing={2.5}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" }}>
                Nombre de la Carrera *
              </Typography>
              <TextField
                fullWidth
                required
                placeholder="Ej. Ingeniería de Software"
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
                Código (opcional)
              </Typography>
              <TextField
                fullWidth
                placeholder="Ej. ISW"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
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
                Duración (ciclos)
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.duracion_ciclos}
                  onChange={(e) => setFormData({ ...formData, duracion_ciclos: Number(e.target.value) })}
                  sx={{
                    bgcolor: "#F8FAFC",
                    borderRadius: "2px 2px 0 0",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                      borderBottom: "1px solid #002B49"
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                      borderBottom: "1.5px solid #002B49"
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                      borderBottom: "2px solid #002B49"
                    },
                    "& .MuiSelect-select": { py: 1.2, px: 1.5, fontSize: "0.95rem", color: "#0F172A", fontWeight: 500 }
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                    <MenuItem key={num} value={num}>{num} ciclos</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.activo}
                  onChange={(e) =>
                    setFormData({ ...formData, activo: e.target.checked })
                  }
                  color="primary"
                />
              }
              label="Carrera activa"
            />
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
              <CircularProgress size={20} color="inherit" />
            ) : editingCarrera ? (
              "Guardar cambios"
            ) : (
              "Crear Carrera"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}