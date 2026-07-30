import * as React from "react";
import { Paper, Box, Typography, Stack, Chip, LinearProgress, Avatar } from "@mui/material";
import { GlobeHemisphereWest as GlobeIcon } from "@phosphor-icons/react/dist/ssr/GlobeHemisphereWest";
import { Tag as TagIcon } from "@phosphor-icons/react/dist/ssr/Tag";

/**
 * COMPONENTE DE IMPACTO EN ODS Y DISTRIBUCIÓN POR CATEGORÍAS
 * Muestra el impacto en Objetivos de Desarrollo Sostenible (ONU) y las categorías más activas.
 */
export default function OdsImpactCard({ disenos = [], proyectos = [], categorias = [] }) {
  // Calcular proyectos con ODS asignado
  const todosLosProyectos = [...disenos, ...proyectos];
  const conOds = todosLosProyectos.filter((item) => Boolean(item.ods));
  const porcentajeOds =
    todosLosProyectos.length > 0 ? Math.round((conOds.length / todosLosProyectos.length) * 100) : 0;

  // Conteo de proyectos por categoría
  const conteoCategorias = categorias.map((cat) => {
    const totalEnCat = todosLosProyectos.filter((p) => p.categoria === cat.id).length;
    return { ...cat, total: totalEnCat };
  }).sort((a, b) => b.total - a.total).slice(0, 4);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <Box>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
          <Avatar sx={{ bgcolor: "info.main", width: 40, height: 40 }}>
            <GlobeIcon size={22} weight="fill" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              Impacto Sostenible & Categorías
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mb: 3, p: 2, bgcolor: "action.hover", borderRadius: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" fontWeight={700}>
              Proyectos con impacto en ODS
            </Typography>
            <Typography variant="body2" fontWeight={800} color="info.main">
              {conOds.length} / {todosLosProyectos.length} ({porcentajeOds}%)
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={porcentajeOds}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "background.paper",
              "& .MuiLinearProgress-bar": { bgcolor: "info.main", borderRadius: 4 }
            }}
          />
        </Box>

        <Typography variant="overline" color="text.secondary" fontWeight={800} sx={{ display: "block", mb: 1.5 }}>
          Categorías con Mayor Actividad
        </Typography>

        <Stack spacing={1.5}>
          {conteoCategorias.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              Sin categorías registradas.
            </Typography>
          ) : (
            conteoCategorias.map((cat) => {
              const porcentajeCat =
                todosLosProyectos.length > 0 ? Math.round((cat.total / todosLosProyectos.length) * 100) : 0;

              return (
                <Box key={cat.id}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <TagIcon size={14} weight="bold" />
                      <Typography variant="caption" fontWeight={700}>
                        {cat.nombre}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" fontWeight={800} color="text.secondary">
                      {cat.total} proy. ({porcentajeCat}%)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={porcentajeCat}
                    sx={{
                      height: 5,
                      borderRadius: 3,
                      bgcolor: "action.hover",
                      "& .MuiLinearProgress-bar": { bgcolor: "primary.main", borderRadius: 3 }
                    }}
                  />
                </Box>
              );
            })
          )}
        </Stack>
      </Box>
    </Paper>
  );
}
