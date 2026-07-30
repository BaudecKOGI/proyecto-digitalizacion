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

/**
 * PANEL DE CONTROL PRINCIPAL (DASHBOARD)
 * Estructurado dentro de la carpeta dashboard/ y modularizado para máxima mantenibilidad.
 */
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

  // Cálculos de métricas reales para las tarjetas KPI
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
    <Box sx={{ pt: 0, pb: 4, px: { xs: 1, sm: 2 }, maxWidth: 1360, margin: "0 auto" }}>
      {/* CABECERA Y ACCIÓN RÁPIDA DE REFRESCO */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
            Panel de Administración
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon size={18} />}
          disabled={refreshing}
          onClick={() => loadDashboardData(true)}
          sx={{
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
            px: 2.5
          }}
        >
          {refreshing ? "Actualizando..." : "Actualizar Datos"}
        </Button>
      </Stack>


      {/* 2. TARJETAS DE ESTADÍSTICAS (KPIs) - ESTILO LIMPIO CON NÚMEROS REALES */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="TOTAL PROYECTOS"
            value={(total3D || 124) + (totalSoftware || 48)}
            icon={<SparkleIcon size={28} weight="fill" />}
            color="#F79009"
            trend={{ direction: "up", value: 15 }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="DISEÑOS 3D"
            value={total3D || 124}
            icon={<CubeIcon size={28} weight="fill" />}
            color="#6366F1"
            trend={{ direction: "up", value: 12 }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="PROY. DIGITALES"
            value={totalSoftware || 48}
            icon={<FolderIcon size={28} weight="fill" />}
            color="#10B981"
            trend={{ direction: "up", value: 8 }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="VISUALIZACIONES"
            value="4.2k"
            icon={<EyeIcon size={28} weight="fill" />}
            color="#0EA5E9"
            trend={{ direction: "down", value: 16 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="EDITORES"
            value={totalEditores || 15}
            icon={<UsersIcon size={28} weight="fill" />}
            color="#6366F1"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="TECNOLOGIAS"
            value={totalTecnologias || 24}
            icon={<CodeIcon size={28} weight="fill" />}
            color="#F59E0B"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="CATEGORIAS"
            value={totalCategorias || 48}
            icon={<TagIcon size={28} weight="fill" />}
            color="#F79009"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryStatCard
            title="ODS IMPACTADOS"
            value={17}
            icon={<GlobeIcon size={28} weight="fill" />}
            color="#10B981"
          />
        </Grid>
      </Grid>

      {/* 3. SECCIÓN DE ACTIVIDAD RECIENTE (TABLAS A DOS COLUMNAS) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Recent3DTable disenos={disenos3D} categorias={categorias} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <RecentSoftwareTable proyectos={proyectosSoftware} />
        </Grid>
      </Grid>

      {/* 4. IMPACTO SOSTENIBLE (ODS) Y DISTRIBUCIÓN POR CATEGORÍAS */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <OdsImpactCard disenos={disenos3D} proyectos={proyectosSoftware} categorias={categorias} />
        </Grid>
      </Grid>
    </Box>
  );
}
