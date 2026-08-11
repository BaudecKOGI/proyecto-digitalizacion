import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Heart, Download } from "lucide-react";
import { OdsBadge } from "@/pages/dashboard/digitalProjects/odsData";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function Detalles3D({
  diseno,
  sidebarOpen,
  piezasMoviles,
  copied,
  handleShare,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const shareOpen = Boolean(anchorEl);
  const [liked, setLiked] = useState(() => {
    if (typeof window !== "undefined" && diseno?.id) {
      const likes = JSON.parse(localStorage.getItem("liked_3d_projects") || "[]");
      return likes.includes(diseno.id);
    }
    return false;
  });
  const [likesCount, setLikesCount] = useState(0);

  React.useEffect(() => {
    if (diseno) {
      setLikesCount(diseno.likes_totales || 0);
    }
  }, [diseno]);

  const handleLike = async () => {
    if (!diseno?.id) return;

    const key = "liked_3d_projects";
    const likes = JSON.parse(localStorage.getItem(key) || "[]");
    const id = diseno.id;

    if (!liked) {
      setLiked(true);
      setLikesCount((prev) => prev + 1);

      if (!likes.includes(id)) {
        likes.push(id);
        localStorage.setItem(key, JSON.stringify(likes));
      }

      try {
        const res = await fetch(`${API_BASE}/metricas/por-proyecto/${id}/like/`, {
          method: "POST",
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.likes_totales === "number") {
            setLikesCount(data.likes_totales);
          }
        }
      } catch (_) {}
    } else {
      setLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));

      localStorage.setItem(
        key,
        JSON.stringify(likes.filter((x) => x !== id))
      );

      try {
        const res = await fetch(`${API_BASE}/metricas/por-proyecto/${id}/unlike/`, {
          method: "POST",
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.likes_totales === "number") {
            setLikesCount(data.likes_totales);
          }
        }
      } catch (_) {}
    }
  };

  const handleShareClick = (event) => setAnchorEl(event.currentTarget);
  const handleShareClose = () => setAnchorEl(null);

  const handleCopyLink = () => {
    handleShare();
    handleShareClose();
  };

  const shareWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=¡Mira este modelo 3D! ${encodeURIComponent(window.location.href)}`,
      "_blank"
    );
    handleShareClose();
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", md: sidebarOpen ? 400 : 0 },
        minWidth: { xs: "100%", md: sidebarOpen ? 400 : 0 },
        height: { xs: sidebarOpen ? "50vh" : 0, md: "100vh" },
        bgcolor: "#FFFFFF",
        borderLeft: {
          md: sidebarOpen ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
        },
        borderTop: {
          xs: sidebarOpen ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
          md: "none",
        },
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        pointerEvents: sidebarOpen ? "auto" : "none",
        opacity: { xs: sidebarOpen ? 1 : 0, md: 1 },
      }}
    >
      <Box
        sx={{
          p: 2.5,
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "#111827", fontWeight: 800 }}
        >
          Detalles del Modelo 3D
        </Typography>
        <Link to="/" style={{ display: "inline-flex" }} title="Volver a la página principal">
          <img
            src="/assets/logos/logo-continental-negro.png"
            alt="Universidad Continental"
            style={{ height: 32, objectFit: "contain", opacity: 0.85 }}
          />
        </Link>
      </Box>

      <Box
        sx={{
          p: 3,
          flexGrow: 1,
          overflowY: "auto",
          color: "#111827",
        }}
      >
        <Typography variant="h5" fontWeight={800} sx={{ color: "#111827", mb: 2 }}>
          {diseno.titulo}
        </Typography>

        {diseno.ods_detalle && diseno.ods_detalle.length > 0 && (
          <Box sx={{ mb: 2.5 }}>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {diseno.ods_detalle.map((ods) => (
                <OdsBadge key={ods.id} odsNum={ods.id} />
              ))}
            </Stack>
          </Box>
        )}

        {diseno.categoria_nombre && (
          <Chip
            label={diseno.categoria_nombre}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 600,
              fontSize: "0.75rem",
              color: "#111827",
              borderColor: "rgba(0,0,0,0.23)",
              mb: 2,
            }}
          />
        )}

        <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
          <Button
            variant={liked ? "contained" : "outlined"}
            size="small"
            onClick={handleLike}
            startIcon={
              <Heart
                size={16}
                fill={liked ? "#fff" : "none"}
                color={liked ? "#fff" : "currentColor"}
              />
            }
            sx={{
              fontWeight: 600,
              borderRadius: "2px",
              textTransform: "none",
              borderColor: liked ? "#ef4444" : "rgba(0,0,0,0.12)",
              bgcolor: liked ? "#ef4444" : "transparent",
              color: liked ? "#fff" : "#475569",
              "&:hover": {
                bgcolor: liked ? "#dc2626" : "rgba(239,68,68,0.05)",
                color: liked ? "#fff" : "#ef4444",
                borderColor: liked ? "#dc2626" : "#ef4444",
              },
            }}
          >
            {likesCount}
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={
              <img
                src="/assets/icons/share.png"
                alt="Share"
                style={{ width: 16, height: 16, objectFit: "contain", opacity: 0.7 }}
              />
            }
            onClick={handleShareClick}
            sx={{
              fontWeight: 600,
              borderRadius: "2px",
              textTransform: "none",
              borderColor: "#002B49",
              color: "#002B49",
              "&:hover": { bgcolor: "rgba(0,43,73,0.04)" },
            }}
          >
            {copied ? "¡Enlace copiado!" : "Compartir"}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={shareOpen}
            onClose={handleShareClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                minWidth: 180,
              },
            }}
          >
            <MenuItem onClick={handleCopyLink} sx={{ py: 1.2 }}>
              <ListItemIcon>
                <img
                  src="/assets/icons/link.png"
                  alt="Link"
                  style={{ width: 18, height: 18, objectFit: "contain" }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 500 }}
              >
                Copiar enlace
              </ListItemText>
            </MenuItem>

            <MenuItem onClick={shareWhatsApp} sx={{ py: 1.2 }}>
              <ListItemIcon>
                <img
                  src="/assets/icons/whatsapp.png"
                  alt="WhatsApp"
                  style={{ width: 18, height: 18, objectFit: "contain" }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 500 }}
              >
                WhatsApp
              </ListItemText>
            </MenuItem>
          </Menu>
        </Stack>

        <Divider sx={{ my: 2.5, borderColor: "rgba(0, 0, 0, 0.08)" }} />

        <Stack spacing={2.5}>
          <Box>
            <Typography
              variant="caption"
              sx={{ color: "#64748B", fontWeight: 700, display: "block", mb: 1 }}
            >
              DESCRIPCIÓN DEL DISEÑO
            </Typography>
            <Typography
              variant="body2"
              sx={{ lineHeight: 1.7, color: "#475569", whiteSpace: "pre-line" }}
            >
              {diseno.descripcion ||
                "No se ha proporcionado una descripción detallada para este proyecto 3D."}
            </Typography>
          </Box>

          {piezasMoviles.length > 0 && (
            <Box
              sx={{
                mt: 1,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "rgba(0, 43, 73, 0.06)",
                border: "1px solid rgba(0, 43, 73, 0.2)",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ color: "#002B49", fontWeight: 800, mb: 0.5 }}
              >
                {piezasMoviles.length} Pieza(s) Mecánica(s) Interactiva(s)
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#475569", lineHeight: 1.5, display: "block" }}
              >
                Haz clic y arrastra directamente sobre las partes mecánicas del modelo 3D.
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 1, borderColor: "rgba(0, 0, 0, 0.08)" }} />

          <Box>
            <Typography
              variant="caption"
              sx={{ color: "#64748B", fontWeight: 700, display: "block" }}
            >
              CREADOR
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#111827", fontWeight: 700, mt: 0.3 }}
            >
              {diseno.autor_nombre || "Sin autor"}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{ color: "#64748B", fontWeight: 700, display: "block" }}
            >
              CARRERA Y CICLO
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#111827", fontWeight: 600, mt: 0.3 }}
            >
              {diseno.carrera_nombre || "N/A"} -{" "}
              {diseno.ciclo_romano ? `Ciclo ${diseno.ciclo_romano}` : "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{ color: "#64748B", fontWeight: 700, display: "block", mb: 1 }}
            >
              ARCHIVO 3D (.FBX)
            </Typography>
            {diseno.archivo_fbx ? (
              <Button
                variant="contained"
                href={diseno.archivo_fbx}
                download
                startIcon={<Download size={18} />}
                sx={{
                  bgcolor: "#002B49",
                  color: "#FFFFFF",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  boxShadow: "0 4px 14px rgba(0, 43, 73, 0.25)",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    bgcolor: "#001A2C",
                    boxShadow: "0 6px 20px rgba(0, 43, 73, 0.35)",
                  },
                }}
              >
                Descargar Modelo 3D
              </Button>
            ) : (
              <Typography variant="body2" sx={{ color: "#64748b", mt: 0.3 }}>
                No adjunto
              </Typography>
            )}
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{ color: "#64748B", fontWeight: 700, display: "block" }}
            >
              FECHA DE REGISTRO
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569", mt: 0.3 }}>
              {diseno.created_at
                ? new Date(diseno.created_at).toLocaleDateString("es-PE")
                : "N/A"}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}