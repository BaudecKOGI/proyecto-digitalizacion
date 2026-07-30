import * as React from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Paper,
  Divider,
  Button
} from "@mui/material";
import { OdsBadge } from "./odsData";
import { Code as CodeIcon } from "@phosphor-icons/react/dist/ssr/Code";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";

/**
 * COMPONENTE MODULAR DE DEMO / VISTA PREVIA EN VIVO
 * Muestra a la derecha del formulario cómo se verá la tarjeta del proyecto en el catálogo digital.
 */
export default function ProyectoLivePreview({
  formProyecto,
  archivoPortada,
  editingProyecto,
  categorias,
  tecnologias
}) {
  const previewImgUrl = archivoPortada
    ? URL.createObjectURL(archivoPortada)
    : editingProyecto?.imagen_portada || null;

  const categoriaObj = categorias.find((c) => c.id === formProyecto.categoria);

  return (
    <Box sx={{ width: "100%", position: "sticky", top: 24 }}>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontWeight: 800,
          letterSpacing: 1,
          display: "block",
          mb: 1.5
        }}
      >
        VISTA PREVIA EN VIVO
      </Typography>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          overflow: "hidden",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)"
        }}
      >
        {/* Portada o Placeholder en vivo */}
        <Box
          sx={{
            width: "100%",
            height: 200,
            bgcolor: "#0f172a",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderBottom: "1px solid",
            borderColor: "divider"
          }}
        >
          {previewImgUrl ? (
            <Box
              component="img"
              src={previewImgUrl}
              alt="Preview portada"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Stack alignItems="center" spacing={1} sx={{ color: "rgba(255,255,255,0.3)" }}>
              <CodeIcon size={48} weight="duotone" />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Sin imagen de portada seleccionada
              </Typography>
            </Stack>
          )}

          {/* Badge ODS superior derecho */}
          {formProyecto.ods && (
            <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
              <OdsBadge odsNum={formProyecto.ods} />
            </Box>
          )}

          {/* Badge Estado inferior izquierdo */}
          <Box sx={{ position: "absolute", bottom: 12, left: 12, zIndex: 2 }}>
            <Chip
              label={formProyecto.estado_publicacion || "BORRADOR"}
              size="small"
              color={formProyecto.estado_publicacion === "PUBLICADO" ? "success" : "default"}
              sx={{
                fontWeight: 700,
                fontSize: "0.7rem",
                bgcolor: "rgba(15, 23, 42, 0.85)",
                color: "white",
                backdropFilter: "blur(4px)"
              }}
            />
          </Box>
        </Box>

        {/* Cuerpo de la Tarjeta Preview */}
        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip
              label={categoriaObj?.nombre || "Sin Categoría"}
              size="small"
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 600, fontSize: "0.7rem" }}
            />
            {formProyecto.ciclo && (
              <Chip
                label={`Ciclo ${formProyecto.ciclo}`}
                size="small"
                sx={{ fontWeight: 600, fontSize: "0.7rem" }}
              />
            )}
          </Stack>

          <Typography variant="h6" fontWeight={800} sx={{ color: "text.primary", mb: 0.5 }}>
            {formProyecto.titulo || "Título del Proyecto de Software"}
          </Typography>

          <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 1.5 }}>
            Por: {formProyecto.autor_nombre || "Nombre del Autor"} {formProyecto.carrera ? `• ${formProyecto.carrera}` : ""}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {formProyecto.descripcion || "La descripción del proyecto y sus características se mostrarán aquí..."}
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          {/* Tecnologías chips preview */}
          <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 1 }}>
            TECNOLOGÍAS
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, mb: 2 }}>
            {(formProyecto.tecnologias || []).length > 0 ? (
              formProyecto.tecnologias.map((techId) => {
                const tech = tecnologias.find((t) => t.id === techId);
                return (
                  <Chip
                    key={techId}
                    label={tech?.nombre || techId}
                    size="small"
                    sx={{ fontWeight: 600, fontSize: "0.7rem", bgcolor: "primary.main", color: "white" }}
                  />
                );
              })
            ) : (
              <Typography variant="caption" color="text.disabled">
                Ninguna tecnología seleccionada
              </Typography>
            )}
          </Box>

          {/* Botones demo preview */}
          <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<GithubLogo size={14} />}
              disabled={!formProyecto.url_repositorio}
              sx={{ textTransform: "none", fontWeight: 700, flex: 1, fontSize: "0.75rem" }}
            >
              Repositorio
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<ArrowSquareOut size={14} />}
              disabled={!formProyecto.url_demo_live}
              sx={{ textTransform: "none", fontWeight: 700, flex: 1, fontSize: "0.75rem" }}
            >
              Demo Web
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
