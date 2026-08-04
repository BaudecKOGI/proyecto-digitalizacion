import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from "@mui/material";

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", confirmColor = "error" }) {
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
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
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
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          sx={{
            borderRadius: "2px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none"
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
