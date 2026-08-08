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
import ConfirmDialog from "@/components/core/ConfirmDialog";

//FORMULARIO DE REGISTRO INTEGRADO
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

  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [initialFormState, setInitialFormState] = React.useState(null);

  React.useEffect(() => {
    if (open) {
      setInitialFormState(JSON.stringify(formProyecto));
      setShowCancelDialog(false);
    }
  }, [open, editingProyecto]);

  const hasUnsavedChanges = () => {
    const currentFormState = JSON.stringify(formProyecto);
    const baseForm = initialFormState || "{}";

    if (currentFormState !== baseForm) return true;
    if (archivoPortada) return true;
    if (archivoVideo) return true;

    return false;
  };

  const handleCancelClick = () => {
    if (hasUnsavedChanges()) {
      setShowCancelDialog(true);
    } else {
      onClose();
    }
  };

  const fieldSx = {
    bgcolor: "#F8FAFC",
    borderRadius: "2px 2px 0 0",
    "& .MuiOutlinedInput-root": {
      bgcolor: "#F8FAFC",
      borderRadius: "2px 2px 0 0",
      "& fieldset": {
        border: "none",
        borderBottom: "1px solid #002B49"
      },
      "&:hover fieldset": {
        border: "none",
        borderBottom: "1.5px solid #002B49"
      },
      "&.Mui-focused fieldset": {
        border: "none",
        borderBottom: "2px solid #002B49"
      }
    },
    "& .MuiInputBase-input": {
      py: 1.2,
      px: 1.5,
      fontSize: "0.95rem",
      color: "#0F172A",
      fontWeight: 500
    }
  };

  const selectSx = {
    bgcolor: "#F8FAFC",
    borderRadius: "2px 2px 0 0",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
      borderBottom: "1px solid #002B49"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "none",
      borderBottom: "1.5px solid #002B49"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
      borderBottom: "2px solid #002B49"
    },
    "& .MuiSelect-select": {
      py: 1.2,
      px: 1.5,
      fontSize: "0.95rem",
      color: "#0F172A",
      fontWeight: 500
    }
  };

  const labelSx = {
    fontWeight: 600,
    color: "#1E293B",
    mb: 0.6,
    fontSize: "0.85rem"
  };

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
            onClick={onClose}
            startIcon={<BackIcon size={18} />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "2px",
              borderColor: "#002B49",
              color: "#002B49",
              "&:hover": {
                bgcolor: "rgba(0, 43, 73, 0.04)",
                borderColor: "#002B49"
              }
            }}
          >
            Volver a Proyectos
          </Button>
          <Typography variant="h6" fontWeight={700} sx={{ color: "text.primary" }}>
            {editingProyecto ? "Editar Proyecto Digital" : "Crear Proyecto Digital"}
          </Typography>
        </Stack>
      </Box>

      {formError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "2px" }}>
          {formError}
        </Alert>
      )}

      {/* 2. LAYOUT A DOS COLUMNAS: FORMULARIO + VISTA PREVIA */}
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
          id="proyecto-form"
          onSubmit={onSave}
          sx={{
            flex: { xs: "1 1 100%", lg: "1 1 calc(60% - 16px)" },
            width: "100%",
            p: { xs: 2.5, sm: 4 },
            borderRadius: "6px",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
            bgcolor: "#FFFFFF"
          }}
        >
          <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: "text.primary", mb: 0.5 }}>
            {editingProyecto ? "Editar Proyecto Digital" : "Crear Nuevo Proyecto Digital"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Completa la información técnica, repositorio, demo y archivos adjuntos del proyecto.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3.5}>
            {/* ROW 1: Título + Estado */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
              <Box sx={{ flex: 2 }}>
                <Typography variant="body2" sx={labelSx}>
                  Título del Proyecto
                </Typography>
                <TextField
                  fullWidth
                  required
                  placeholder="Ej. Sistema de Gestión y Analytics..."
                  value={formProyecto.titulo}
                  onChange={(e) => setFormProyecto({ ...formProyecto, titulo: e.target.value })}
                  sx={fieldSx}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={labelSx}>
                  Estado de Publicación
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formProyecto.estado_publicacion || "BORRADOR"}
                    onChange={(e) => setFormProyecto({ ...formProyecto, estado_publicacion: e.target.value })}
                    sx={selectSx}
                  >
                    <MenuItem value="PUBLICADO">Publicado</MenuItem>
                    <MenuItem value="BORRADOR">Borrador</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>

            {/* ROW 2: Descripción */}
            <Box>
              <Typography variant="body2" sx={labelSx}>
                Descripción del Proyecto
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Describe brevemente el alcance, solución y objetivos..."
                value={formProyecto.descripcion}
                onChange={(e) => setFormProyecto({ ...formProyecto, descripcion: e.target.value })}
                sx={fieldSx}
              />
            </Box>

            {/* ROW 3: Autor, Carrera, Ciclo */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
              <Box sx={{ flex: 2 }}>
                <Typography variant="body2" sx={labelSx}>
                  Nombre del Autor
                </Typography>
                <TextField
                  fullWidth
                  required
                  placeholder="Ej. Jonel Villanueva"
                  value={formProyecto.autor_nombre}
                  onChange={(e) => setFormProyecto({ ...formProyecto, autor_nombre: e.target.value })}
                  sx={fieldSx}
                />
              </Box>
              <Box sx={{ flex: 2 }}>
                <Typography variant="body2" sx={labelSx}>
                  Carrera Profesional
                </Typography>
                <TextField
                  fullWidth
                  required
                  placeholder="Ej. Ingeniería de Software"
                  value={formProyecto.carrera}
                  onChange={(e) => setFormProyecto({ ...formProyecto, carrera: e.target.value })}
                  sx={fieldSx}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={labelSx}>
                  Ciclo
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ej. VI"
                  value={formProyecto.ciclo}
                  onChange={(e) => setFormProyecto({ ...formProyecto, ciclo: e.target.value })}
                  sx={fieldSx}
                />
              </Box>
            </Stack>

            {/* ROW 4: Categoría + ODS */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={labelSx}>
                  Categoría
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formProyecto.categoria}
                    onChange={(e) => setFormProyecto({ ...formProyecto, categoria: e.target.value })}
                    displayEmpty
                    sx={selectSx}
                  >
                    <MenuItem value="">
                      <em>Seleccionar...</em>
                    </MenuItem>
                    {categorias.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={labelSx}>
                  ODS de Impacto (ONU)
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formProyecto.ods}
                    onChange={(e) => setFormProyecto({ ...formProyecto, ods: e.target.value })}
                    displayEmpty
                    sx={selectSx}
                  >
                    <MenuItem value="">
                      <em>No especificado</em>
                    </MenuItem>
                    {ODS_LIST.map((o) => (
                      <MenuItem key={o.id} value={o.id}>
                        {o.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>

            {/* ROW 5: URLs de Repositorio y Demo */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={labelSx}>
                  URL Repositorio Git (GitHub/GitLab)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="https://github.com/..."
                  value={formProyecto.url_repositorio}
                  onChange={(e) => setFormProyecto({ ...formProyecto, url_repositorio: e.target.value })}
                  sx={fieldSx}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={labelSx}>
                  URL Demo en Vivo (Live App)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="https://mi-proyecto.vercel.app"
                  value={formProyecto.url_demo_live}
                  onChange={(e) => setFormProyecto({ ...formProyecto, url_demo_live: e.target.value })}
                  sx={fieldSx}
                />
              </Box>
            </Stack>

            {/* ROW 6: Tecnologías 100% ancho */}
            <Box>
              <Typography variant="body2" sx={labelSx}>
                Tecnologías Utilizadas
              </Typography>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={formProyecto.tecnologias || []}
                  onChange={(e) => setFormProyecto({ ...formProyecto, tecnologias: e.target.value })}
                  sx={selectSx}
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
            </Box>

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
              onClick={handleCancelClick}
              sx={{
                borderRadius: "2px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "#002B49",
                borderColor: "#002B49",
                px: 3.5,
                py: 0.9,
                "&:hover": { borderColor: "#002B49", bgcolor: "rgba(0, 43, 73, 0.04)" }
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "2px",
                px: 4,
                py: 0.9,
                bgcolor: "#002B49",
                color: "#FFFFFF",
                boxShadow: "none",
                "&:hover": { bgcolor: "#001e33", boxShadow: "none" }
              }}
            >
              {editingProyecto ? "Actualizar Proyecto" : "Crear Proyecto"}
            </Button>
          </Stack>
        </Paper>

        {/* COLUMNA DERECHA: DEMO */}
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

      {/* DIÁLOGO DE CONFIRMACIÓN AL CANCELAR */}
      <ConfirmDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          onClose();
        }}
        title="¿Cancelar cambios?"
        message="Tienes cambios sin guardar. Si cancelas ahora, perderás todos los datos ingresados. ¿Estás seguro de que deseas cancelar?"
        confirmText="Sí, cancelar"
        cancelText="Continuar editando"
      />
    </Box>
  );
}
