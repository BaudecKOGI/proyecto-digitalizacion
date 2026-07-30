import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  IconButton,
  Tooltip
} from "@mui/material";

import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { Tag as TagIcon } from "@phosphor-icons/react/dist/ssr/Tag";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { Code as CodeIcon } from "@phosphor-icons/react/dist/ssr/Code";
import { Folder as FolderIcon } from "@phosphor-icons/react/dist/ssr/Folder";
import { ArrowSquareOut as ExternalLinkIcon } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";

import { fetchProyectos3DAdmin, fetchProyectosSoftwareAdmin } from "@/services/api";

/**
 * VISTA INTEGRADA (NO FLOTANTE) DEL DETALLE DE UNA CATEGORÍA
 * Muestra el contenido y los proyectos asociados directamente en la página principal.
 */
export default function CategoriaDetailView({ categoria, onBack }) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [disenos3D, setDisenos3D] = React.useState([]);
  const [proyectosSoftware, setProyectosSoftware] = React.useState([]);

  React.useEffect(() => {
    if (!categoria) return;

    let mounted = true;
    setLoading(true);
    setTabIndex(0);

    const loadRelatedProjects = async () => {
      try {
        const [d3d, dSoft] = await Promise.all([
          fetchProyectos3DAdmin().catch(() => []),
          fetchProyectosSoftwareAdmin().catch(() => [])
        ]);

        if (mounted) {
          const list3D = (Array.isArray(d3d) ? d3d : d3d?.results || []).filter(
            (item) => item.categoria === categoria.id || String(item.categoria) === String(categoria.id)
          );
          const listSoft = (Array.isArray(dSoft) ? dSoft : dSoft?.results || []).filter(
            (item) => item.categoria === categoria.id || String(item.categoria) === String(categoria.id)
          );
          setDisenos3D(list3D);
          setProyectosSoftware(listSoft);
        }
      } catch (error) {
        console.error("Error cargando proyectos de la categoría:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadRelatedProjects();
    return () => {
      mounted = false;
    };
  }, [categoria]);

  if (!categoria) return null;

  return (
    <Box sx={{ pt: 0, pb: 6 }}>
      {/* BOTÓN DE RETORNO AL LISTADO */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowLeftIcon weight="bold" />}
          sx={{
            textTransform: "none",
            fontWeight: 800,
            color: "text.primary",
            "&:hover": { bgcolor: "action.hover" }
          }}
        >
          Volver al listado de Categorías
        </Button>
      </Stack>

      {/* CABECERA INTEGRADA DE LA CATEGORÍA */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper"
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={3}
        >
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: "#ffffff",
                width: 64,
                height: 64,
                borderRadius: 3
              }}
            >
              <TagIcon size={32} weight="fill" />
            </Avatar>
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
                  {categoria.nombre}
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" fontWeight={500}>
                {categoria.descripcion || "Categoría general en el catálogo del ecosistema digital FAB LAB."}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              icon={<CubeIcon size={16} weight="fill" />}
              label={`${disenos3D.length} Diseños 3D`}
              sx={{ fontWeight: 700, bgcolor: "action.hover", py: 2 }}
            />
            <Chip
              icon={<CodeIcon size={16} weight="fill" />}
              label={`${proyectosSoftware.length} Proyectos Software`}
              sx={{ fontWeight: 700, bgcolor: "action.hover", py: 2 }}
            />
          </Stack>
        </Stack>
      </Paper>

      {/* NAVEGACIÓN EN PESTAÑAS (TABS INTEGRADOS) */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 800, minHeight: 52, fontSize: "0.95rem" } }}
        >
          <Tab
            icon={<CubeIcon size={20} />}
            iconPosition="start"
            label={`Diseños 3D relacionados (${disenos3D.length})`}
          />
          <Tab
            icon={<CodeIcon size={20} />}
            iconPosition="start"
            label={`Proyectos de Software relacionados (${proyectosSoftware.length})`}
          />
        </Tabs>
      </Box>

      {/* CONTENIDO DE PROYECTOS EN GRILLA */}
      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 10 }}>
          <CircularProgress size={44} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Cargando proyectos vinculados de la base de datos...
          </Typography>
        </Box>
      ) : tabIndex === 0 ? (
        /* TAB 0: DISEÑOS 3D */
        disenos3D.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: "action.hover",
              border: "1px dashed",
              borderColor: "divider"
            }}
          >
            <CubeIcon size={56} weight="duotone" style={{ opacity: 0.5, marginBottom: 16 }} />
            <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
              Sin Diseños 3D vinculados
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: "auto" }}>
              Actualmente no hay modelos 3D que pertenezcan a la categoría "{categoria.nombre}".
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {disenos3D.map((item) => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.03)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0px 12px 30px rgba(0,0,0,0.08)"
                    }
                  }}
                >
                  <Box sx={{ position: "relative", pt: "60%", bgcolor: "action.hover" }}>
                    {item.imagen_miniatura && (
                      <CardMedia
                        component="img"
                        image={item.imagen_miniatura}
                        alt={item.titulo}
                        sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                    <Chip
                      label={item.estado_publicacion}
                      size="small"
                      color={item.estado_publicacion === "PUBLICADO" ? "success" : "default"}
                      sx={{ position: "absolute", top: 12, right: 12, fontWeight: 700 }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800} color="text.primary" gutterBottom>
                      {item.titulo}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 1 }}>
                      Autor: {item.autor_nombre}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {item.descripcion || "Sin descripción disponible para esta pieza 3D."}
                    </Typography>
                  </CardContent>
                  {item.archivo_stl && (
                    <Box sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                      <Button
                        component="a"
                        href={item.archivo_stl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="small"
                        fullWidth
                        endIcon={<ExternalLinkIcon size={16} />}
                        sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
                      >
                        Ver archivo STL
                      </Button>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        /* TAB 1: PROYECTOS DE SOFTWARE */
        proyectosSoftware.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: "action.hover",
              border: "1px dashed",
              borderColor: "divider"
            }}
          >
            <FolderIcon size={56} weight="duotone" style={{ opacity: 0.5, marginBottom: 16 }} />
            <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
              Sin Proyectos de Software vinculados
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: "auto" }}>
              Actualmente no hay repositorios o demos digitales que pertenezcan a la categoría "{categoria.nombre}".
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {proyectosSoftware.map((item) => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.03)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0px 12px 30px rgba(0,0,0,0.08)"
                    }
                  }}
                >
                  <Box sx={{ position: "relative", pt: "55%", bgcolor: "action.hover" }}>
                    {item.imagen_portada && (
                      <CardMedia
                        component="img"
                        image={item.imagen_portada}
                        alt={item.titulo}
                        sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                    <Chip
                      label={item.estado_publicacion}
                      size="small"
                      color={item.estado_publicacion === "PUBLICADO" ? "success" : "default"}
                      sx={{ position: "absolute", top: 12, right: 12, fontWeight: 700 }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800} color="text.primary" gutterBottom>
                      {item.titulo}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 1 }}>
                      Por: {item.autor_nombre} {item.carrera ? `· (${item.carrera})` : ""}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {item.descripcion_corta || item.descripcion || "Sin descripción del software digital."}
                    </Typography>
                  </CardContent>
                  {item.enlace_demo && (
                    <Box sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                      <Button
                        component="a"
                        href={item.enlace_demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        size="small"
                        fullWidth
                        endIcon={<ExternalLinkIcon size={16} />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          borderRadius: 2,
                          bgcolor: "#F79009",
                          "&:hover": { bgcolor: "#E07B00" }
                        }}
                      >
                        Abrir Demo en Vivo
                      </Button>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      )}
    </Box>
  );
}
