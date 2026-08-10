import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography
} from "@mui/material";
import { X as CloseIcon } from "@phosphor-icons/react/dist/ssr/X";
import { VideoCameraSlash as NoVideoIcon } from "@phosphor-icons/react/dist/ssr/VideoCameraSlash";

export default function VideoPlayerModal({ open, onClose, proyecto }) {
  if (!proyecto) return null;

  const videoUrl = proyecto.archivo_video;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          backgroundColor: "#0F172A",
          color: "#fff",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)"
        }
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          px: 3,
          py: 2
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
            {proyecto.titulo}
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Demostración en Video • Autor: {proyecto.autor_nombre}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 360, bgcolor: "#000" }}>
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            style={{
              width: "100%",
              maxHeight: "75vh",
              display: "block",
              backgroundColor: "#000"
            }}
          >
            Tu navegador no soporta la reproducción de video HTML5.
          </video>
        ) : (
          <Box sx={{ textAlign: "center", py: 8, px: 3, color: "rgba(255, 255, 255, 0.6)" }}>
            <NoVideoIcon size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff", mb: 1 }}>
              Video de demostración no disponible
            </Typography>
            <Typography variant="body2">
              Este proyecto no cuenta con un archivo de video MP4 cargado aún.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
