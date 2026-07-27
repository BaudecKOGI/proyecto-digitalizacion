"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { Envelope as EmailIcon } from "@phosphor-icons/react/dist/ssr/Envelope";
import { ShieldCheck as RoleIcon } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { LockKey as LockIcon } from "@phosphor-icons/react/dist/ssr/LockKey";

import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth/client";

export function AccountDetailsForm() {
  const { user, checkSession } = useUser();

  // Estado formulario Información Personal
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loadingProfile, setLoadingProfile] = React.useState(false);

  // Estado formulario Contraseña
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [loadingPassword, setLoadingPassword] = React.useState(false);

  // Notificaciones Snackbar
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

  // Sincronizar estado cuando carga el usuario
  React.useEffect(() => {
    if (user) {
      setNombre(user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim());
      setEmail(user.email || "");
    }
  }, [user]);

  // Guardar cambios en perfil
  const handleSaveProfile = async (event) => {
    event.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      showSnackbar("El nombre y el correo son obligatorios.", "error");
      return;
    }

    setLoadingProfile(true);
    try {
      const res = await authClient.updateProfile({
        nombre: nombre.trim(),
        email: email.trim(),
      });

      if (res.error) {
        showSnackbar(res.error, "error");
      } else {
        showSnackbar("Perfil actualizado correctamente.", "success");
        if (checkSession) {
          await checkSession();
        }
      }
    } catch (err) {
      showSnackbar("Error al conectar con el servidor.", "error");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Cambiar contraseña
  const handleSavePassword = async (event) => {
    event.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showSnackbar("Todos los campos de contraseña son obligatorios.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showSnackbar("La nueva contraseña y su confirmación no coinciden.", "error");
      return;
    }

    if (newPassword.length < 6) {
      showSnackbar("La nueva contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    setLoadingPassword(true);
    try {
      const res = await authClient.updatePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (res.error) {
        showSnackbar(res.error, "error");
      } else {
        showSnackbar("Contraseña actualizada correctamente.", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      showSnackbar("Error al actualizar la contraseña.", "error");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <Stack spacing={4}>
      {/* TARJETA 1: INFORMACIÓN DEL PERFIL */}
      <form onSubmit={handleSaveProfile}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardHeader
            title="Información de la Cuenta"
            subheader="Actualiza tu nombre de administrador y correo de acceso"
            titleTypographyProps={{ fontWeight: 700 }}
          />
          <Divider />
          <CardContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nombre de Administrador"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <UserIcon size={20} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Correo Electrónico (Usuario)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon size={20} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Rol Asignado"
                  value={user?.rol === "ADMIN" ? "ADMINISTRADOR GENERAL" : "EDITOR / PROFESOR"}
                  disabled
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <RoleIcon size={20} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Estado de la cuenta"
                  value={user?.is_active !== false ? "Activa (En línea)" : "Inactiva"}
                  disabled
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loadingProfile}
              startIcon={loadingProfile ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{ fontWeight: 600, borderRadius: 2, px: 3 }}
            >
              {loadingProfile ? "Guardando..." : "Guardar Información"}
            </Button>
          </CardActions>
        </Card>
      </form>

      {/* TARJETA 2: CAMBIAR CONTRASEÑA */}
      <form onSubmit={handleSavePassword}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardHeader
            title="Seguridad y Contraseña"
            subheader="Modifica tu clave secreta de inicio de sesión en React"
            titleTypographyProps={{ fontWeight: 700 }}
          />
          <Divider />
          <CardContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Contraseña Actual"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon size={20} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            edge="end"
                          >
                            {showCurrentPassword ? <EyeSlashIcon size={20} /> : <EyeIcon size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nueva Contraseña"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  helperText="Mínimo 6 caracteres"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon size={20} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? <EyeSlashIcon size={20} /> : <EyeIcon size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Confirmar Nueva Contraseña"
                  type={showNewPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon size={20} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={loadingPassword}
              startIcon={loadingPassword ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{ fontWeight: 600, borderRadius: 2, px: 3 }}
            >
              {loadingPassword ? "Actualizando..." : "Cambiar Contraseña"}
            </Button>
          </CardActions>
        </Card>
      </form>

      {/* SNACKBAR GLOBAL DE RESULTADOS */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
    </Stack>
  );
}
