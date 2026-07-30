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
  Switch
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
          borderRadius: 2,
          p: 1,
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider"
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
            <TextField
              label="Nombre completo"
              fullWidth
              required
              placeholder="Ej. Ing. Carlos Mendoza"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              size="medium"
            />

            <TextField
              label="Correo electrónico"
              type="email"
              fullWidth
              required
              placeholder="carlos.mendoza@fablab.pe"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              size="medium"
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
              label="Cuenta activa (puede iniciar sesión y administrar proyectos)"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button
            onClick={onClose}
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
              borderRadius: 1.5,
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              backgroundColor: "#6366F1",
              "&:hover": { backgroundColor: "#4F46E5", boxShadow: "none" }
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
