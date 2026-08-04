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

export default function ProyectoDeleteModal({ open, onClose, onConfirm, submitting }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
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
      <DialogTitle sx={{ fontWeight: 700 }}>¿Eliminar este Proyecto?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Esta acción eliminará de forma permanente el proyecto de software, incluyendo su portada y video. Esta operación no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
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
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={submitting}
          sx={{
            borderRadius: "2px",
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
