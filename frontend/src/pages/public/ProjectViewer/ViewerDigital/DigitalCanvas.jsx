import React, { useState } from "react";
import { Box, Typography, Stack, IconButton, Button, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { ChevronRight, ChevronLeft, Heart, Monitor } from "lucide-react";

export default function DigitalCanvas({
  proyecto,
  sidebarOpen,
  toggleSidebar,
}) {
  const hasVideo = !!proyecto.archivo_video;
  const hasPortada = !!proyecto.imagen_portada;

  // Like logic
  const [liked, setLiked] = useState(() => {
    if (typeof window !== "undefined" && proyecto?.id) {
      const likes = JSON.parse(localStorage.getItem("liked_digital_projects") || "[]");
      return likes.includes(proyecto.id);
    }
    return false;
  });
  const [likesCount, setLikesCount] = useState(proyecto?.likes_totales || 0);

  const handleLike = () => {
    const likes = JSON.parse(localStorage.getItem("liked_digital_projects") || "[]");
    
    if (!liked) {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      
      // Guardar localmente para persistencia
      if (!likes.includes(proyecto.id)) {
        likes.push(proyecto.id);
        localStorage.setItem("liked_digital_projects", JSON.stringify(likes));
      }

      if (proyecto && proyecto.id) {
        fetch(`http://127.0.0.1:8000/api/metricas/por-proyecto/${proyecto.id}/like/`, {
          method: "POST",
        }).catch(() => {});
      }
    } else {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
      
      // Remover localmente
      const updatedLikes = likes.filter(id => id !== proyecto.id);
      localStorage.setItem("liked_digital_projects", JSON.stringify(updatedLikes));

      if (proyecto && proyecto.id) {
        fetch(`http://127.0.0.1:8000/api/metricas/por-proyecto/${proyecto.id}/unlike/`, {
          method: "POST",
        }).catch(() => {});
      }
    }
  };

  // Share logic
  const [anchorEl, setAnchorEl] = useState(null);
  const shareOpen = Boolean(anchorEl);
  const [copied, setCopied] = useState(false);
  const [sharesCount, setSharesCount] = useState(proyecto?.compartidos_totales || 0);

  const handleShareClick = (event) => setAnchorEl(event.currentTarget);
  const handleShareClose = () => setAnchorEl(null);

  const executeShareAPI = () => {
    if (proyecto && proyecto.id) {
      fetch(`http://127.0.0.1:8000/api/metricas/por-proyecto/${proyecto.id}/share/`, {
        method: "POST",
      }).catch(() => {});
      setSharesCount(prev => prev + 1);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    executeShareAPI();
    handleShareClose();
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=¡Mira este proyecto digital! ${encodeURIComponent(window.location.href)}`, '_blank');
    executeShareAPI();
    handleShareClose();
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "relative",
        height: { xs: sidebarOpen ? "50vh" : "100vh", md: "100vh" },
        transition: "height 0.3s ease",
        minWidth: 0,
        bgcolor: "#090D16",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Botón para abrir/cerrar sidebar (arriba a la derecha) */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          right: 16,
          transform: "translateY(-50%)",
          zIndex: 10000,
          display: { xs: "none", md: "block" },
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          size="small"
          sx={{
            bgcolor: "rgba(15, 23, 42, 0.9)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(12px)",
            width: 40,
            height: 40,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            "&:hover": {
              bgcolor: "rgba(15, 23, 42, 1)",
              borderColor: "rgba(255, 255, 255, 0.35)",
            },
            "&:active": { transform: "scale(0.95)" },
          }}
        >
          {sidebarOpen ? <ChevronLeft size={20} strokeWidth={2.5} /> : <ChevronRight size={20} strokeWidth={2.5} />}
        </IconButton>
      </Box>

      {/* Contenedor del reproductor / imagen */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", p: 2 }}>
        {hasVideo ? (
          <video
            src={proyecto.archivo_video}
            controls
            autoPlay
            muted
            style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px" }}
          />
        ) : hasPortada ? (
          <img
            src={proyecto.imagen_portada}
            alt={proyecto.titulo}
            style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px" }}
          />
        ) : (
          <Stack alignItems="center" spacing={2} sx={{ color: "rgba(255,255,255,0.25)" }}>
            <Monitor size={64} />
            <Typography variant="overline" sx={{ letterSpacing: 2 }}>
              Sin vista previa
            </Typography>
          </Stack>
        )}
      </Box>

      {/* Barra de Reacciones (Pie de página) */}
      <Box sx={{ p: { xs: 1.5, sm: 2.5 }, bgcolor: "#06090F", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Stack direction="row" spacing={{ xs: 1.5, sm: 3 }} alignItems="center" justifyContent="center">
          <Button
            variant={liked ? "contained" : "outlined"}
            onClick={handleLike}
            startIcon={<Heart size={20} fill={liked ? "#fff" : "none"} color={liked ? "#fff" : "currentColor"} />}
            sx={{
              fontWeight: 800,
              fontSize: { xs: "0.85rem", sm: "1.1rem" },
              px: { xs: 2, sm: 4 },
              py: { xs: 0.8, sm: 1.2 },
              borderRadius: { xs: "8px", sm: "12px" },
              textTransform: "none",
              borderColor: liked ? "#ef4444" : "rgba(255,255,255,0.2)",
              bgcolor: liked ? "#ef4444" : "transparent",
              color: liked ? "#fff" : "rgba(255,255,255,0.7)",
              "&:hover": { 
                bgcolor: liked ? "#dc2626" : "rgba(255,255,255,0.1)", 
                color: liked ? "#fff" : "#fff", 
                borderColor: liked ? "#dc2626" : "rgba(255,255,255,0.4)" 
              },
            }}
          >
            {likesCount} Likes
          </Button>

          <Button
            variant="outlined"
            onClick={handleShareClick}
            startIcon={<img src="/assets/icons/share.png" alt="Share" style={{ width: 20, height: 20, objectFit: 'contain', filter: 'invert(1)', opacity: 0.9 }} />}
            sx={{
              fontWeight: 800,
              fontSize: { xs: "0.85rem", sm: "1.1rem" },
              px: { xs: 2, sm: 4 },
              py: { xs: 0.8, sm: 1.2 },
              borderRadius: { xs: "8px", sm: "12px" },
              textTransform: "none",
              borderColor: "rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.7)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)", color: "#fff", borderColor: "rgba(255,255,255,0.4)" },
            }}
          >
            {copied ? "¡Enlace copiado!" : "Compartir"}
          </Button>

          {/* Menú de opciones de compartir */}
          <Menu
            anchorEl={anchorEl}
            open={shareOpen}
            onClose={handleShareClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            PaperProps={{
              sx: {
                mb: 1,
                bgcolor: "#111827",
                color: "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                borderRadius: "8px",
                minWidth: 180,
                border: "1px solid rgba(255,255,255,0.1)"
              }
            }}
          >
            <MenuItem onClick={handleCopyLink} sx={{ py: 1.5, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
              <ListItemIcon>
                <img src="/assets/icons/link.png" alt="Link" style={{ width: 20, height: 20, objectFit: 'contain', filter: 'invert(1)' }} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontSize: '1rem', fontWeight: 600 }}>
                Copiar enlace
              </ListItemText>
            </MenuItem>
            
            <MenuItem onClick={shareWhatsApp} sx={{ py: 1.5, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
              <ListItemIcon>
                <img src="/assets/icons/whatsapp.png" alt="WhatsApp" style={{ width: 20, height: 20, objectFit: 'contain' }} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontSize: '1rem', fontWeight: 600 }}>
                WhatsApp
              </ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Box>
    </Box>
  );
}
