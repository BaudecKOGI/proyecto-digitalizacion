import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Typography,
  Box
} from "@mui/material";
import ConfirmDialog from "@/components/core/ConfirmDialog";

export default function TecnologiaFormModal({
  open,
  onClose,
  onSave,
  editingTech,
  formTechName,
  setFormTechName,
  formError
}) {
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [initialTechName, setInitialTechName] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setInitialTechName(formTechName || "");
      setShowCancelDialog(false);
    }
  }, [open, editingTech]);

  const handleCancelClick = () => {
    if (formTechName !== initialTechName) {
      setShowCancelDialog(true);
    } else {
      onClose();
    }
  };

  const fieldSx = {
    bgcolor: "#F8FAFC",
    borderRadius: "2px 2px 0 0",
    "& .MuiOutlinedInput-root": {
      bgcolor: "#F8FAFC",
      borderRadius: "2px 2px 0 0",
      "& fieldset": {
        border: "none",
        borderBottom: "1px solid #002B49"
      },
      "&:hover fieldset": {
        border: "none",
        borderBottom: "1.5px solid #002B49"
      },
      "&.Mui-focused fieldset": {
        border: "none",
        borderBottom: "2px solid #002B49"
      }
    },
    "& .MuiInputBase-input": {
      py: 1.2,
      px: 1.5,
      fontSize: "0.95rem",
      color: "#0F172A",
      fontWeight: 500
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "2px",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)"
        }
      }}
    >
      <form onSubmit={onSave}>
        <DialogTitle sx={{ fontWeight: 800, color: "text.primary" }}>
          {editingTech ? "Editar Tecnología" : "Nueva Tecnología"}
        </DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "2px" }}>
              {formError}
            </Alert>
          )}
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" }}
            >
              Nombre de la tecnología *
            </Typography>
            <TextField
              fullWidth
              required
              placeholder="Ej: React, Django, Python..."
              value={formTechName}
              onChange={(e) => setFormTechName(e.target.value)}
              sx={fieldSx}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCancelClick}
            variant="outlined"
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
            sx={{
              borderRadius: "2px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              bgcolor: "#002B49",
              color: "#FFFFFF",
              px: 3.5,
              py: 0.9,
              boxShadow: "none",
              "&:hover": { bgcolor: "#001e33", boxShadow: "none" }
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </form>
      <ConfirmDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          onClose();
        }}
        title="¿Cancelar cambios?"
        message="Tienes cambios sin guardar. Si cancelas ahora, perderás los datos ingresados. ¿Estás seguro de que deseas cancelar?"
        confirmText="Sí, cancelar"
        cancelText="Continuar editando"
      />
    </Dialog>
  );
}
