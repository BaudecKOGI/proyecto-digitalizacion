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
import { Keyhole as PasswordIcon } from "@phosphor-icons/react/dist/ssr/Keyhole";
import { LockKey as LockIcon } from "@phosphor-icons/react/dist/ssr/LockKey";

import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth/client";
import ConfirmDialog from "@/components/core/ConfirmDialog";

export function AccountDetailsForm() {
  const { user, checkSession } = useUser();

  const fieldSx = {
    bgcolor: "#F8FAFC",
    borderRadius: "2px 2px 0 0",
    "& .MuiOutlinedInput-root": {
      bgcolor: "#F8FAFC",
      borderRadius: "2px 2px 0 0",
      "& fieldset": { border: "none", borderBottom: "1px solid #002B49" },
      "&:hover fieldset": { border: "none", borderBottom: "1.5px solid #002B49" },
      "&.Mui-focused fieldset": { border: "none", borderBottom: "2px solid #002B49" }
    },
    "& .MuiInputBase-input": { py: 1.2, px: 1.5, fontSize: "0.95rem", color: "#0F172A", fontWeight: 500 }
  };

  // Estado formulario Información Personal
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loadingProfile, setLoadingProfile] = React.useState(false);

  // Estado formulario Contraseña
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loadingPassword, setLoadingPassword] = React.useState(false);

  // Controladores visibilidad contraseñas
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showConfirmPasswordDialog, setShowConfirmPasswordDialog] = React.useState(false);

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

  // Cargar datos al montar o cambiar el usuario
  React.useEffect(() => {
    if (user) {
      setNombre(user.name || user.nombre || user.firstName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Actualizar Información Personal
  const handleSaveProfile = async (event) => {
    event.preventDefault();
    if (!nombre || !email) {
      showSnackbar("El nombre y el correo electrónico son obligatorios.", "error");
      return;
    }

    setLoadingProfile(true);
    try {
      const res = await authClient.updateProfile({ nombre, email });
      if (res.error) {
        showSnackbar(res.error, "error");
      } else {
        showSnackbar("Información personal actualizada con éxito.", "success");
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
  const handleSavePassword = (event) => {
    event.preventDefault();
    
    let hasError = false;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showSnackbar("Todos los campos de contraseña son obligatorios.", "error");
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      showSnackbar("La nueva contraseña y su confirmación no coinciden.", "error");
      hasError = true;
    } else if (newPassword.length < 6) {
      showSnackbar("La nueva contraseña debe tener al menos 6 caracteres.", "error");
      hasError = true;
    }

    if (hasError) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    setShowConfirmPasswordDialog(true);
  };

  const executePasswordUpdate = async () => {
    setShowConfirmPasswordDialog(false);
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
      }
    } catch (err) {
      showSnackbar("Error al actualizar la contraseña.", "error");
    } finally {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoadingPassword(false);
    }
  };

  return (
    <Stack spacing={4}>
      {/* TARJETA 1: INFORMACIÓN PERSONAL */}
      <form onSubmit={handleSaveProfile}>
        <Card elevation={0} sx={{ borderRadius: "6px", border: "1px solid rgba(0, 0, 0, 0.05)", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)", bgcolor: "#FFFFFF" }}>
          <CardHeader
            title="Información Personal"
            subheader="Actualiza los datos básicos de tu cuenta administrativa"
            titleTypographyProps={{ fontWeight: 700 }}
          />
          <Divider />
          <CardContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" }}>
                  Nombre de Administrador *
                </Typography>
                <TextField
                  fullWidth
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  sx={fieldSx}
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
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" }}>
                  Correo Electrónico *
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={fieldSx}
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
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" }}>
                  Rol Asignado
                </Typography>
                <TextField
                  fullWidth
                  value={user?.rol === "ADMIN" ? "ADMINISTRADOR GENERAL" : "EDITOR"}
                  disabled
                  sx={fieldSx}
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
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" }}>
                  Estado de la cuenta
                </Typography>
                <TextField
                  fullWidth
                  value={user?.is_active !== false ? "Activa" : "Inactiva"}
                  disabled
                  sx={fieldSx}
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
              sx={{
                fontWeight: 600,
                borderRadius: "2px",
                px: 3.5,
                py: 0.9,
                textTransform: "none",
                bgcolor: "#002B49",
                color: "#FFFFFF",
                boxShadow: "none",
                "&:hover": { bgcolor: "#001e33", boxShadow: "none" }
              }}
            >
              {loadingProfile ? "Guardando..." : "Guardar Información"}
            </Button>
          </CardActions>
        </Card>
      </form>

      {/* TARJETA 2: CAMBIAR CONTRASEÑA */}
      <form onSubmit={handleSavePassword}>
        <Card elevation={0} sx={{ borderRadius: "6px", border: "1px solid rgba(0, 0, 0, 0.05)", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)", bgcolor: "#FFFFFF" }}>
          <CardHeader
            title="Seguridad y Contraseña"
            subheader="Modifica tu clave secreta de inicio de sesión"
            titleTypographyProps={{ fontWeight: 700 }}
          />
          <Divider />
          <CardContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" }}>
                  Contraseña Actual *
                </Typography>
                <TextField
                  fullWidth
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  sx={fieldSx}
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
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" }}>
                  Nueva Contraseña *
                </Typography>
                <TextField
                  fullWidth
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  helperText="Mínimo 6 caracteres"
                  sx={fieldSx}
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
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" }}>
                  Confirmar Nueva Contraseña *
                </Typography>
                <TextField
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  sx={fieldSx}
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
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <EyeSlashIcon size={20} /> : <EyeIcon size={20} />}
                          </IconButton>
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
              disabled={loadingPassword}
              startIcon={loadingPassword ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{
                fontWeight: 600,
                borderRadius: "2px",
                px: 3.5,
                py: 0.9,
                textTransform: "none",
                bgcolor: "#002B49",
                color: "#FFFFFF",
                boxShadow: "none",
                "&:hover": { bgcolor: "#001e33", boxShadow: "none" }
              }}
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

      <ConfirmDialog
        open={showConfirmPasswordDialog}
        onClose={() => setShowConfirmPasswordDialog(false)}
        onConfirm={executePasswordUpdate}
        title="¿Confirmar actualización?"
        message="¿Estás seguro de que deseas cambiar tu contraseña? La nueva contraseña reemplazará a la actual inmediatamente."
        confirmText="Sí, actualizar contraseña"
        cancelText="Cancelar"
      />
    </Stack>
  );
}
