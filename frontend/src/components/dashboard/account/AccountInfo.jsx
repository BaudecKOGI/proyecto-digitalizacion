"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { Camera as CameraIcon } from "@phosphor-icons/react/dist/ssr/Camera";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";

import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth/client";

export function AccountInfo() {
  const { user, checkSession } = useUser();
  const fileInputRef = React.useRef(null);
  const [uploading, setUploading] = React.useState(false);

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const nombre = user?.name || user?.firstName || "Administrador General";
  const email = user?.email || "admin@continental.edu.pe";
  const rol = user?.rol === "ADMIN" ? "Administrador General" : "Editor / Profesor";
  const avatarUrl = user?.avatar || "/assets/avatar_jonel.png";

  const isCustomAvatar =
    user?.avatar &&
    !user.avatar.includes("/assets/avatar_jonel.png") &&
    user.avatar !== "/assets/avatar_jonel.png";

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showSnackbar("Por favor, selecciona un archivo de imagen válido.", "error");
      return;
    }

    setUploading(true);
    try {
      const res = await authClient.updateProfile({
        nombre: user?.name || "Administrador",
        email: user?.email || "",
        avatar: file,
      });

      if (res.error) {
        showSnackbar(res.error, "error");
      } else {
        showSnackbar("Foto de perfil actualizada correctamente.", "success");
        if (checkSession) {
          await checkSession();
        }
      }
    } catch (err) {
      showSnackbar("Error al subir la imagen.", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setUploading(true);
    try {
      const res = await authClient.updateProfile({
        nombre: user?.name || "Administrador",
        email: user?.email || "",
        remove_avatar: true,
      });

      if (res.error) {
        showSnackbar(res.error, "error");
      } else {
        showSnackbar("Foto de perfil eliminada.", "success");
        if (checkSession) {
          await checkSession();
        }
      }
    } catch (err) {
      showSnackbar("Error al eliminar la foto de perfil.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden" }}>
      <Box
        sx={{
          height: 80,
          background: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
        }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Stack spacing={2} sx={{ alignItems: "center", mt: -5 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={avatarUrl}
              sx={{
                height: 96,
                width: 96,
                border: "4px solid #fff",
                boxShadow: 2,
                bgcolor: "primary.main",
                fontSize: "2.2rem",
                fontWeight: 700,
              }}
            >
              {nombre.charAt(0).toUpperCase()}
            </Avatar>
            {uploading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <CircularProgress size={28} sx={{ color: "#fff" }} />
              </Box>
            )}
          </Box>

          {/* Botones de control de Avatar */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={handleFileSelect}
              disabled={uploading}
              startIcon={<CameraIcon size={16} />}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Cambiar foto
            </Button>
            {isCustomAvatar && (
              <Tooltip title="Eliminar foto actual">
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleRemoveAvatar}
                  disabled={uploading}
                  sx={{ border: "1px solid", borderColor: "error.light" }}
                >
                  <TrashIcon size={16} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          <Stack spacing={1} sx={{ textAlign: "center", width: "100%" }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {nombre}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {email}
            </Typography>
            <Box sx={{ pt: 0.5 }}>
              <Chip
                label={rol}
                color="primary"
                size="small"
                sx={{ fontWeight: 600, px: 1 }}
              />
            </Box>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <Box sx={{ p: 2, textAlign: "center", bgcolor: "background.default" }}>
        <Typography variant="caption" color="text.secondary">
          Cuenta de administración protegida · FAB LAB Continental
        </Typography>
      </Box>

      {/* SNACKBAR DE RESULTADO DE FOTO */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
