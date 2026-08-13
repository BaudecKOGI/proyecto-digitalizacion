import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";

export default function Disenos3DHeader({ handleOpenCreate, setOpenInvitacionDialog }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={2}
      sx={{ mb: 4 }}
    >
      <Box>
        <Typography variant="h4" fontWeight={800} sx={{ color: "text.primary" }}>
          Gestión de Modelos 3D
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Gestiona el catálogo de modelos interactivos, visor 3D, archivos .fbx y estado de publicación.
        </Typography>
      </Box>

      <Stack spacing={1} direction="column" alignItems="stretch" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
        <Button
          variant="contained"
          size="medium"
          startIcon={<PlusIcon weight="bold" />}
          onClick={handleOpenCreate}
          sx={{
            fontWeight: 600,
            borderRadius: "2px",
            px: 3.5,
            py: 1,
            bgcolor: "#002B49",
            color: "#FFFFFF",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#001e33",
              boxShadow: "none"
            }
          }}
        >
          Nuevo Modelo 3D
        </Button>
        <Button
          variant="outlined"
          size="medium"
          startIcon={<img src="/assets/icons/link.png" alt="Generar enlace" style={{ width: 18, height: 18, objectFit: 'contain' }} />}
          onClick={() => setOpenInvitacionDialog(true)}
          sx={{
            fontWeight: 600,
            borderRadius: "2px",
            px: 3.5,
            py: 1,
            borderColor: "#002B49",
            color: "#002B49",
            textTransform: "none",
            "&:hover": {
              bgcolor: "rgba(0, 43, 73, 0.04)",
              borderColor: "#002B49"
            }
          }}
        >
          Generar enlace
        </Button>
      </Stack>
    </Stack>
  );
}
