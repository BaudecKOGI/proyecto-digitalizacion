import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  IconButton,
  Tooltip
} from "@mui/material";

import { Tag as TagIcon } from "@phosphor-icons/react/dist/ssr/Tag";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { Code as CodeIcon } from "@phosphor-icons/react/dist/ssr/Code";
import { Folder as FolderIcon } from "@phosphor-icons/react/dist/ssr/Folder";
import { ArrowSquareOut as ExternalLinkIcon } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { X as CloseIcon } from "@phosphor-icons/react/dist/ssr/X";

import { fetchProyectos3DAdmin, fetchProyectosSoftwareAdmin } from "@/services/api";

/**
 * MODAL DE PROYECTOS RELACIONADOS A UNA CATEGORÍA
 */
export default function CategoriaProjectsModal({ open, categoria, onClose }) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [disenos3D, setDisenos3D] = React.useState([]);
  const [proyectosSoftware, setProyectosSoftware] = React.useState([]);

  React.useEffect(() => {
    if (!open || !categoria) return;

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
  }, [open, categoria]);

  if (!categoria) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper"
        }
      }}
    >
      {/* CABECERA Y RESUMEN DE LA CATEGORÍA */}
      <DialogTitle
        sx={{
          p: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          bgcolor: "action.hover"
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "primary.main",
              color: "#ffffff",
              width: 52,
              height: 52,
              borderRadius: 2.5
            }}
          >
            <TagIcon size={26} weight="fill" />
          </Avatar>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
                {categoria.nombre}
              </Typography>
              <Chip label={`#${categoria.slug || "sin-slug"}`} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {categoria.descripcion || "Categoría general en el catálogo del ecosistema digital FAB LAB."}
            </Typography>
          </Box>
        </Stack>

        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
          <CloseIcon size={22} />
        </IconButton>
      </DialogTitle>

      {/* PESTAÑAS DE NAVEGACIÓN ENTRE PROYECTOS */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3, bgcolor: "background.paper" }}>
        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 700, minHeight: 52 } }}
        >
          <Tab
            icon={<CubeIcon size={18} />}
            iconPosition="start"
            label={`Diseños 3D (${disenos3D.length})`}
          />
          <Tab
            icon={<CodeIcon size={18} />}
            iconPosition="start"
            label={`Proyectos de Software (${proyectosSoftware.length})`}
          />
        </Tabs>
      </Box>

      {/* CONTENIDO CON LISTA DE PROYECTOS RELACIONADOS */}
      <DialogContent sx={{ p: 3, minHeight: 380, maxHeight: 520 }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8 }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Consultando proyectos relacionados en la base de datos...
            </Typography>
          </Box>
        ) : tabIndex === 0 ? (
          /* TAB 0: DISEÑOS 3D */
          disenos3D.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: "action.hover",
                border: "1px dashed",
                borderColor: "divider"
              }}
            >
              <CubeIcon size={44} weight="duotone" style={{ opacity: 0.5, marginBottom: 12 }} />
              <Typography variant="subtitle1" fontWeight={700} color="text.primary" gutterBottom>
                Sin Diseños 3D vinculados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Actualmente no hay modelos 3D que pertenezcan a la categoría "{categoria.nombre}".
              </Typography>
            </Paper>
          ) : (
            <List disablePadding>
              {disenos3D.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      px: 2,
                      py: 2,
                      borderRadius: 2,
                      "&:hover": { bgcolor: "action.hover" }
                    }}
                    secondaryAction={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={item.estado_publicacion}
                          size="small"
                          color={item.estado_publicacion === "PUBLICADO" ? "success" : "default"}
                          sx={{ fontWeight: 700, fontSize: "0.68rem" }}
                        />
                        {item.archivo_stl && (
                          <Tooltip title="Ver modelo STL">
                            <IconButton
                              component="a"
                              href={item.archivo_stl}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{ border: "1px solid", borderColor: "divider" }}
                            >
                              <ExternalLinkIcon size={16} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={item.imagen_miniatura}
                        variant="rounded"
                        sx={{ width: 48, height: 48, mr: 1, bgcolor: "action.selected" }}
                      >
                        <CubeIcon size={24} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                          {item.titulo}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="column" spacing={0.3} sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Autor: {item.autor_nombre}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden"
                            }}
                          >
                            {item.descripcion || "Sin descripción de pieza 3D."}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                  {idx < disenos3D.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )
        ) : (
          /* TAB 1: PROYECTOS DE SOFTWARE */
          proyectosSoftware.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: "action.hover",
                border: "1px dashed",
                borderColor: "divider"
              }}
            >
              <FolderIcon size={44} weight="duotone" style={{ opacity: 0.5, marginBottom: 12 }} />
              <Typography variant="subtitle1" fontWeight={700} color="text.primary" gutterBottom>
                Sin Proyectos de Software vinculados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Actualmente no hay repositorios o demos que pertenezcan a la categoría "{categoria.nombre}".
              </Typography>
            </Paper>
          ) : (
            <List disablePadding>
              {proyectosSoftware.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      px: 2,
                      py: 2,
                      borderRadius: 2,
                      "&:hover": { bgcolor: "action.hover" }
                    }}
                    secondaryAction={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={item.estado_publicacion}
                          size="small"
                          color={item.estado_publicacion === "PUBLICADO" ? "success" : "default"}
                          sx={{ fontWeight: 700, fontSize: "0.68rem" }}
                        />
                        {item.enlace_demo && (
                          <Tooltip title="Abrir Demo en Vivo">
                            <IconButton
                              component="a"
                              href={item.enlace_demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{ border: "1px solid", borderColor: "divider" }}
                            >
                              <ExternalLinkIcon size={16} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={item.imagen_portada}
                        variant="rounded"
                        sx={{ width: 48, height: 48, mr: 1, bgcolor: "action.selected" }}
                      >
                        <CodeIcon size={24} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                          {item.titulo}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="column" spacing={0.3} sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Por: {item.autor_nombre} {item.carrera ? `· (${item.carrera})` : ""}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden"
                            }}
                          >
                            {item.descripcion_corta || item.descripcion || "Sin descripción de software."}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                  {idx < proyectosSoftware.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )
        )}
      </DialogContent>

      {/* ACCIONES Y BOTÓN CERRAR */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider", bgcolor: "background.default" }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mr: "auto" }}>
          Total vinculado: {disenos3D.length + proyectosSoftware.length} proyecto(s)
        </Typography>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}>
          Cerrar Vista
        </Button>
      </DialogActions>
    </Dialog>
  );
}
