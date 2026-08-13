import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";

export default function ProyectosDigitalesHeader({ activeTab, handleOpenCreateProyecto, handleOpenCreateTech, setOpenInvitacionDialog }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        mb: 4,
        flexWrap: "wrap",
        gap: 2
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
          Gestión de Proyectos Digitales
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Administra proyectos digitales, repositorios, videos, tecnologías y ODS.
        </Typography>
      </Box>

      <Stack spacing={1} direction="column" alignItems="stretch" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
        {activeTab === 0 || activeTab === 2 ? (
          <Button
            variant="contained"
            startIcon={<PlusIcon />}
            onClick={handleOpenCreateProyecto}
            sx={{
              borderRadius: "2px",
              textTransform: "none",
              fontWeight: 600,
              px: 3.5,
              py: 1,
              bgcolor: "#002B49",
              color: "#FFFFFF",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#001e33",
                boxShadow: "none"
              }
            }}
          >
            Nuevo Proyecto Digital
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<PlusIcon />}
            onClick={handleOpenCreateTech}
            sx={{
              borderRadius: "2px",
              textTransform: "none",
              fontWeight: 600,
              px: 3.5,
              py: 1,
              bgcolor: "#002B49",
              color: "#FFFFFF",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#001e33",
                boxShadow: "none"
              }
            }}
          >
            Nueva Tecnología
          </Button>
        )}
        <Button
          variant="outlined"
          startIcon={<img src="/assets/icons/link.png" alt="Generar enlace" style={{ width: 18, height: 18, objectFit: 'contain' }} />}
          onClick={() => setOpenInvitacionDialog(true)}
          sx={{
            borderRadius: "2px",
            textTransform: "none",
            fontWeight: 600,
            px: 3.5,
            py: 1,
            borderColor: "#002B49",
            color: "#002B49",
            "&:hover": {
              bgcolor: "rgba(0, 43, 73, 0.04)",
              borderColor: "#002B49"
            }
          }}
        >
          Generar enlace
        </Button>
      </Stack>
    </Box>
  );
}
