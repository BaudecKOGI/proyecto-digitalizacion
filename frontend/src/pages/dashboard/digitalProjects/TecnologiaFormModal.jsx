import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert
} from "@mui/material";

export default function TecnologiaFormModal({
  open,
  onClose,
  onSave,
  editingTech,
  formTechName,
  setFormTechName,
  formError
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 800 }}>
        {editingTech ? "Editar Tecnología" : "Nueva Tecnología"}
      </DialogTitle>
      <form onSubmit={onSave}>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {formError}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Nombre de la tecnología"
            required
            placeholder="Ej: React, Django, Python..."
            value={formTechName}
            onChange={(e) => setFormTechName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onClose} sx={{ textTransform: "none", fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ fontWeight: 700, textTransform: "none", px: 3, borderRadius: 2 }}
          >
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
