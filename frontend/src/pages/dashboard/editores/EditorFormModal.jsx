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
  InputAdornment,
  IconButton,
  FormControlLabel,
  Switch,
  Box
} from "@mui/material";

import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";

export default function EditorFormModal({
  open,
  onClose,
  editingEditor,
  onSubmit,
  formData,
  setFormData,
  formError,
  submitting
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setShowPassword(false);
    }
  }, [open]);

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
        {editingEditor ? "Editar cuenta de Editor" : "Crear nuevo Editor"}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {editingEditor
              ? "Actualiza el nombre, correo electrónico o estado de la cuenta."
              : "Ingresa los datos para registrar a un nuevo editor o encargado en la plataforma."}
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
              {formError}
            </Alert>
          )}

          <Stack spacing={2.5}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" }}>
                Nombre completo *
              </Typography>
              <TextField
                fullWidth
                required
                placeholder="Ej. Ing. Carlos Mendoza"
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
                Correo electrónico *
              </Typography>
              <TextField
                type="email"
                fullWidth
                required
                placeholder="carlos.mendoza@fablab.pe"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                {editingEditor
                  ? "Nueva contraseña (dejar vacía para conservar actual)"
                  : "Contraseña temporal *"}
              </Typography>
              <TextField
                type={showPassword ? "text" : "password"}
                fullWidth
                required={!editingEditor}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            </Box>

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
              label="Cuenta activa"
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
            ) : editingEditor ? (
              "Guardar cambios"
            ) : (
              "Crear Editor"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
