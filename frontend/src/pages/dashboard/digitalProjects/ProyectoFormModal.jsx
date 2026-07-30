import * as React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip,
  Button,
  Alert,
  Typography,
  Paper,
  Stack,
  Divider
} from "@mui/material";
import { ArrowLeft as BackIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ODS_LIST } from "./odsData";
import ProyectoLivePreview from "./ProyectoLivePreview";

/**
 * FORMULARIO DE REGISTRO INTEGRADO (NO FLOTANTE)
 * Muestra el formulario a la izquierda y una demo en vivo de la tarjeta a la derecha.
 */
export default function ProyectoFormModal({
  open,
  onClose,
  onSave,
  editingProyecto,
  formProyecto,
  setFormProyecto,
  archivoPortada,
  setArchivoPortada,
  archivoVideo,
  setArchivoVideo,
  categorias,
  tecnologias,
  formError
}) {
  if (!open) return null;

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
      {/* 1. BARRA SUPERIOR DE NAVEGACIÓN */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexWrap: "wrap",
          gap: 2
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="outlined"
            size="small"
            startIcon={<BackIcon />}
            onClick={onClose}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              borderColor: "divider",
              color: "text.primary"
            }}
          >
            Volver al listado
          </Button>
          <Typography variant="body2" color="text.secondary">
            / Proyectos Digitales / {editingProyecto ? "Editar Proyecto" : "Nuevo Proyecto"}
          </Typography>
        </Stack>
      </Box>

      {formError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {formError}
        </Alert>
      )}

      {/* 2. LAYOUT A DOS COLUMNAS: FORMULARIO + VISTA PREVIA EN VIVO */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 4,
          alignItems: "flex-start"
        }}
      >
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <Paper
          elevation={0}
          component="form"
          onSubmit={onSave}
          sx={{
            flex: { xs: "1 1 100%", lg: "1 1 calc(60% - 16px)" },
            width: "100%",
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper"
          }}
        >
          <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: "text.primary", mb: 0.5 }}>
            {editingProyecto ? "Editar Proyecto de Software" : "Crear Nuevo Proyecto de Software"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Completa la información técnica, repositorio, demo y archivos adjuntos del proyecto.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            {/* ROW 1: Título + Estado */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
              <TextField
                fullWidth
                label="Título del Proyecto"
                required
                value={formProyecto.titulo}
                onChange={(e) => setFormProyecto({ ...formProyecto, titulo: e.target.value })}
                sx={{ flex: 2 }}
              />
              <FormControl fullWidth sx={{ flex: 1 }}>
                <InputLabel>Estado de Publicación</InputLabel>
                <Select
                  value={formProyecto.estado_publicacion || "BORRADOR"}
                  label="Estado de Publicación"
                  onChange={(e) => setFormProyecto({ ...formProyecto, estado_publicacion: e.target.value })}
                >
                  <MenuItem value="PUBLICADO">Publicado</MenuItem>
                  <MenuItem value="BORRADOR">Borrador</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* ROW 2: Descripción 100% ancho */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción del Proyecto"
              value={formProyecto.descripcion}
              onChange={(e) => setFormProyecto({ ...formProyecto, descripcion: e.target.value })}
            />

            {/* ROW 3: Autor, Carrera, Ciclo */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
              <TextField
                fullWidth
                label="Nombre del Autor"
                required
                value={formProyecto.autor_nombre}
                onChange={(e) => setFormProyecto({ ...formProyecto, autor_nombre: e.target.value })}
                sx={{ flex: 2 }}
              />
              <TextField
                fullWidth
                label="Carrera Profesional"
                required
                value={formProyecto.carrera}
                onChange={(e) => setFormProyecto({ ...formProyecto, carrera: e.target.value })}
                sx={{ flex: 2 }}
              />
              <TextField
                fullWidth
                label="Ciclo"
                value={formProyecto.ciclo}
                onChange={(e) => setFormProyecto({ ...formProyecto, ciclo: e.target.value })}
                sx={{ flex: 1 }}
              />
            </Stack>

            {/* ROW 4: Categoría + ODS (50% y 50%) */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
              <FormControl fullWidth sx={{ flex: 1 }}>
                <InputLabel>Categoría / Área</InputLabel>
                <Select
                  value={formProyecto.categoria}
                  label="Categoría / Área"
                  onChange={(e) => setFormProyecto({ ...formProyecto, categoria: e.target.value })}
                >
                  {categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ flex: 1 }}>
                <InputLabel>ODS de Impacto (ONU)</InputLabel>
                <Select
                  value={formProyecto.ods}
                  label="ODS de Impacto (ONU)"
                  onChange={(e) => setFormProyecto({ ...formProyecto, ods: e.target.value })}
                >
                  <MenuItem value="">
                    <em>Ninguno / No especificado</em>
                  </MenuItem>
                  {ODS_LIST.map((o) => (
                    <MenuItem key={o.id} value={o.id}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* ROW 5: URLs de Repositorio y Demo */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
              <TextField
                fullWidth
                label="URL Repositorio Git (GitHub/GitLab)"
                placeholder="https://github.com/..."
                value={formProyecto.url_repositorio}
                onChange={(e) => setFormProyecto({ ...formProyecto, url_repositorio: e.target.value })}
                sx={{ flex: 1 }}
              />
              <TextField
                fullWidth
                label="URL Demo en Vivo (Vercel/Live App)"
                placeholder="https://mi-proyecto.vercel.app"
                value={formProyecto.url_demo_live}
                onChange={(e) => setFormProyecto({ ...formProyecto, url_demo_live: e.target.value })}
                sx={{ flex: 1 }}
              />
            </Stack>

            {/* ROW 6: Tecnologías 100% ancho */}
            <FormControl fullWidth>
              <InputLabel>Tecnologías Utilizadas</InputLabel>
              <Select
                multiple
                value={formProyecto.tecnologias || []}
                onChange={(e) => setFormProyecto({ ...formProyecto, tecnologias: e.target.value })}
                input={<OutlinedInput label="Tecnologías Utilizadas" />}
                renderValue={(selectedIds) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selectedIds.map((id) => {
                      const techObj = tecnologias.find((t) => t.id === id);
                      return <Chip key={id} label={techObj?.nombre || id} size="small" />;
                    })}
                  </Box>
                )}
              >
                {tecnologias.map((tech) => (
                  <MenuItem key={tech.id} value={tech.id}>
                    {tech.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ROW 7: Botones Subida Portada y Video */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 600, flex: 1 }}
              >
                {archivoPortada ? archivoPortada.name : "Subir Imagen Portada..."}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setArchivoPortada(e.target.files[0])}
                />
              </Button>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 600, flex: 1 }}
              >
                {archivoVideo ? archivoVideo.name : "Subir Archivo de Video MP4..."}
                <input
                  type="file"
                  hidden
                  accept="video/mp4,video/webm"
                  onChange={(e) => setArchivoVideo(e.target.files[0])}
                />
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, px: 4 }}
            >
              {editingProyecto ? "Guardar Cambios" : "Crear Proyecto"}
            </Button>
          </Stack>
        </Paper>

        {/* COLUMNA DERECHA: DEMO / VISTA PREVIA EN VIVO */}
        <Box sx={{ flex: { xs: "1 1 100%", lg: "0 0 400px" }, width: { xs: "100%", lg: 400 } }}>
          <ProyectoLivePreview
            formProyecto={formProyecto}
            archivoPortada={archivoPortada}
            editingProyecto={editingProyecto}
            categorias={categorias}
            tecnologias={tecnologias}
          />
        </Box>
      </Box>
    </Box>
  );
}
