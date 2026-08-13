import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";


import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Link
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { Folder as FolderIcon } from "@phosphor-icons/react/dist/ssr/Folder";

import { fetchProyectos3DAdmin, fetchProyectosSoftwareAdmin } from "@/services/api";

// Convierte números a números romanos
const toRoman = (num) => {
  const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return romanos[num - 1] || num;
};

export default function CarreraDetailView() {
  const { carrera } = useParams();
  const navigate = useNavigate();
  const carreraNombre = decodeURIComponent(carrera);

  const [loading, setLoading] = React.useState(true);
  const [ciclos3D, setCiclos3D] = React.useState([]);
  const [ciclosSoftware, setCiclosSoftware] = React.useState([]);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [proyectos3D, proyectosSoftware] = await Promise.all([
          fetchProyectos3DAdmin(),
          fetchProyectosSoftwareAdmin()
        ]);

        const array3D = Array.isArray(proyectos3D) ? proyectos3D : proyectos3D?.results || [];
        const arraySoftware = Array.isArray(proyectosSoftware) ? proyectosSoftware : proyectosSoftware?.results || [];

        const filtrados3D = array3D.filter(p => {
          const nombre = p.carrera_nombre || p.carrera?.nombre || '';
          return nombre.toLowerCase() === carreraNombre.toLowerCase();
        });
        const filtradosSoftware = arraySoftware.filter(p => {
          const nombre = p.carrera_nombre || p.carrera?.nombre || '';
          return nombre.toLowerCase() === carreraNombre.toLowerCase();
        });

        const ciclos3DSet = new Set(filtrados3D.map(p => p.ciclo).filter(Boolean));
        const ciclosSoftwareSet = new Set(filtradosSoftware.map(p => p.ciclo).filter(Boolean));

        setCiclos3D(Array.from(ciclos3DSet).sort((a, b) => a - b));
        setCiclosSoftware(Array.from(ciclosSoftwareSet).sort((a, b) => a - b));
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [carreraNombre]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const allCiclos = Array.from(new Set([...ciclos3D, ...ciclosSoftware])).sort((a, b) => a - b);

  return (
    <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
      {/* Cabecera */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowLeftIcon />}
          onClick={() => navigate('/dashboard/carreras')}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "text.secondary",
            mb: 1,
            "&:hover": { color: "text.primary" }
          }}
        >
          Volver a Carreras
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827" }}>
          {carreraNombre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ciclos con proyectos registrados en esta carrera. Selecciona un ciclo para ver los proyectos.
        </Typography>
      </Box>

      {allCiclos.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No hay proyectos registrados para esta carrera.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {allCiclos.map((ciclo) => {
            const has3D = ciclos3D.includes(ciclo);
            const hasSoftware = ciclosSoftware.includes(ciclo);

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ciclo}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "6px",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                    bgcolor: "#FFFFFF",
                    p: 2.5,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827", mb: 1.5 }}>
                    Ciclo {toRoman(ciclo)}
                  </Typography>

                  <Stack direction={{ xs: "column", lg: "row" }} spacing={1.5} sx={{ mt: "auto" }}>
                    <Button
                      variant="outlined"
                      startIcon={<CubeIcon size={18} />}
                      disabled={!has3D}
                      onClick={() => {
                        // Manteniendo el orden por ciclo
                        navigate(`/dashboard/carreras/${encodeURIComponent(carreraNombre)}/3d/${ciclo}`);
                      }}
                      sx={{
                        flex: 1,
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "2px",
                        borderColor: "#002B49",
                        color: "#002B49",
                        "&:hover": { bgcolor: "rgba(0, 43, 73, 0.04)" },
                        "&.Mui-disabled": { opacity: 0.4 }
                      }}
                    >
                      {has3D ? "Ver 3D" : "Sin 3D"}
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<FolderIcon size={18} />}
                      disabled={!hasSoftware}
                      onClick={() => {
                        // Manteniendo el orden por ciclo
                        navigate(`/dashboard/carreras/${encodeURIComponent(carreraNombre)}/software/${ciclo}`);
                      }}
                      sx={{
                        flex: 1,
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "2px",
                        bgcolor: "#002B49",
                        color: "#FFFFFF",
                        "&:hover": { bgcolor: "#001e33" },
                        "&.Mui-disabled": { bgcolor: "rgba(0, 43, 73, 0.2)", color: "rgba(255,255,255,0.5)" }
                      }}
                    >
                      {hasSoftware ? "Ver Software" : "Sin Software"}
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}