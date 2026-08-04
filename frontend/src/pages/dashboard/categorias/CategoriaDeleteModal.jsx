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

/**
 * MODAL DE CONFIRMACIÓN DE ELIMINACIÓN DE CATEGORÍA
 */
export default function CategoriaDeleteModal({
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
          borderRadius: 3,
          p: 1,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper"
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800 }}>¿Eliminar esta Categoría?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Esta acción eliminará la categoría de la lista. Los proyectos que actualmente tengan asignada esta categoría no se borrarán, pero perderán esta clasificación.
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
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
        >
          {submitting ? <CircularProgress size={22} color="inherit" /> : "Sí, eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
