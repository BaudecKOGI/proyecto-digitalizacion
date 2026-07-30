import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress
} from "@mui/material";

export default function EditorDeleteModal({
  open,
  onClose,
  onConfirm,
  submitting
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
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
      <DialogTitle sx={{ fontWeight: 700 }}>¿Eliminar este Editor?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Esta acción eliminará de forma permanente la cuenta y revocará su acceso al panel de edición. Esta operación no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: "none", fontWeight: 600 }}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={submitting}
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none"
          }}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : "Sí, eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
