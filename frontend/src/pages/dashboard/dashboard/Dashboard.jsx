import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { Folder as FolderIcon } from "@phosphor-icons/react/dist/ssr/Folder";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { Tag as TagIcon } from "@phosphor-icons/react/dist/ssr/Tag";
import { Code as CodeIcon } from "@phosphor-icons/react/dist/ssr/Code";
import { Sparkle as SparkleIcon } from "@phosphor-icons/react/dist/ssr/Sparkle";
import { GlobeHemisphereWest as GlobeIcon } from "@phosphor-icons/react/dist/ssr/GlobeHemisphereWest";
import { ArrowClockwise as RefreshIcon } from "@phosphor-icons/react/dist/ssr/ArrowClockwise";

import {
  fetchProyectos3DAdmin,
  fetchProyectosSoftwareAdmin,
  fetchCategorias,
  fetchTecnologias,
  fetchEditores
} from "@/services/api";

import SummaryStatCard from "./SummaryStatCard";
import Recent3DTable from "./Recent3DTable";
import RecentSoftwareTable from "./RecentSoftwareTable";
import OdsImpactCard from "./OdsImpactCard";

export default function Dashboard() {
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [disenos3D, setDisenos3D] = React.useState([]);
  const [proyectosSoftware, setProyectosSoftware] = React.useState([]);
  const [categorias, setCategorias] = React.useState([]);
  const [tecnologias, setTecnologias] = React.useState([]);
  const [editores, setEditores] = React.useState([]);

  const loadDashboardData = React.useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [d3d, dSoft, dCats, dTechs, dEdits] = await Promise.all([
        fetchProyectos3DAdmin().catch(() => []),
        fetchProyectosSoftwareAdmin().catch(() => []),
        fetchCategorias().catch(() => []),
        fetchTecnologias().catch(() => []),
        fetchEditores().catch(() => [])
      ]);

      setDisenos3D(Array.isArray(d3d) ? d3d : d3d?.results || []);
      setProyectosSoftware(Array.isArray(dSoft) ? dSoft : dSoft?.results || []);
      setCategorias(Array.isArray(dCats) ? dCats : dCats?.results || []);
      setTecnologias(Array.isArray(dTechs) ? dTechs : dTechs?.results || []);
      setEditores(Array.isArray(dEdits) ? dEdits : dEdits?.results || []);
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const total3D = disenos3D.length;
  const totalSoftware = proyectosSoftware.length;
  const totalCategorias = categorias.length;
  const totalTecnologias = tecnologias.length;
  const totalEditores = editores.length;
  const totalGeneral = total3D + totalSoftware;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={44} />
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Cargando indicadores de FAB LAB...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
      {/* Cabecera */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
            Hola, Bienvenido
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={refreshing ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon weight="bold" />}
          disabled={refreshing}
          onClick={() => loadDashboardData(true)}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "6px",
            borderColor: "rgba(0,0,0,0.15)",
            color: "#002B49",
            px: 2.5,
            py: 1,
            "&:hover": {
              borderColor: "#002B49",
              bgcolor: "rgba(0, 43, 73, 0.04)"
            }
          }}
        >
          {refreshing ? "Actualizando..." : "Actualizar Datos"}
        </Button>
      </Stack>

      {/* Tarjetas sin subtítulo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="Total de Proyectos"
            value={totalGeneral}
            icon={<SparkleIcon size={18} />}
            bgIcon={<SparkleIcon size={130} />}
            color="#6366F1"
            subtitle="Proyectos Digitales y Modelos 3D"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="Modelos 3D"
            value={total3D}
            icon={<CubeIcon size={18} />}
            bgIcon={<CubeIcon size={130} />}
            color="#0EA5E9"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="Proyectos Digitales"
            value={totalSoftware}
            icon={<FolderIcon size={18} />}
            bgIcon={<FolderIcon size={130} />}
            color="#F97316"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="Visualizaciones"
            value="4.2k"
            icon={<EyeIcon size={18} />}
            bgIcon={<EyeIcon size={130} />}
            color="#10B981"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="Editores Activos"
            value={totalEditores}
            icon={<UsersIcon size={18} />}
            bgIcon={<UsersIcon size={130} />}
            color="#8B5CF6"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="Tecnologías"
            value={totalTecnologias}
            icon={<CodeIcon size={18} />}
            bgIcon={<CodeIcon size={130} />}
            color="#06B6D4"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="Categorías"
            value={totalCategorias}
            icon={<TagIcon size={18} />}
            bgIcon={<TagIcon size={130} />}
            color="#F59E0B"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="ODS Impactados"
            value={17}
            icon={<GlobeIcon size={18} />}
            bgIcon={<GlobeIcon size={130} />}
            color="#3B82F6"
          />
        </Grid>
      </Grid>

      {/* Tablas de actividad reciente */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Recent3DTable disenos={disenos3D} categorias={categorias} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <RecentSoftwareTable proyectos={proyectosSoftware} />
        </Grid>
      </Grid>

      {/* ODS Impact */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <OdsImpactCard disenos={disenos3D} proyectos={proyectosSoftware} categorias={categorias} />
        </Grid>
      </Grid>
    </Box>
  );
}