import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Alert
} from "@mui/material";
import { ODS_LIST } from "./odsData";

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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: "1.25rem" }}>
        {editingProyecto ? "Editar Proyecto de Software" : "Nuevo Proyecto de Software"}
      </DialogTitle>
      <form onSubmit={onSave}>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {formError}
            </Alert>
          )}

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Título del Proyecto"
                required
                value={formProyecto.titulo}
                onChange={(e) => setFormProyecto({ ...formProyecto, titulo: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estado de Publicación</InputLabel>
                <Select
                  value={formProyecto.estado_publicacion}
                  label="Estado de Publicación"
                  onChange={(e) => setFormProyecto({ ...formProyecto, estado_publicacion: e.target.value })}
                >
                  <MenuItem value="BORRADOR">Borrador</MenuItem>
                  <MenuItem value="PUBLICADO">Publicado</MenuItem>
                  <MenuItem value="ARCHIVADO">Archivado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción del Proyecto"
                value={formProyecto.descripcion}
                onChange={(e) => setFormProyecto({ ...formProyecto, descripcion: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Autor"
                required
                value={formProyecto.autor_nombre}
                onChange={(e) => setFormProyecto({ ...formProyecto, autor_nombre: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Carrera Profesional"
                required
                value={formProyecto.carrera}
                onChange={(e) => setFormProyecto({ ...formProyecto, carrera: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Ciclo"
                value={formProyecto.ciclo}
                onChange={(e) => setFormProyecto({ ...formProyecto, ciclo: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría / Área</InputLabel>
                <Select
                  value={formProyecto.categoria}
                  label="Categoría / Área"
                  onChange={(e) => setFormProyecto({ ...formProyecto, categoria: e.target.value })}
                >
                  {categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>ODS de Impacto (ONU)</InputLabel>
                <Select
                  value={formProyecto.ods}
                  label="ODS de Impacto (ONU)"
                  onChange={(e) => setFormProyecto({ ...formProyecto, ods: e.target.value })}
                >
                  <MenuItem value=""><em>Ninguno / No especificado</em></MenuItem>
                  {ODS_LIST.map((o) => (
                    <MenuItem key={o.id} value={o.id}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL Repositorio Git (GitHub/GitLab)"
                placeholder="https://github.com/..."
                value={formProyecto.url_repositorio}
                onChange={(e) => setFormProyecto({ ...formProyecto, url_repositorio: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL Demo en Vivo (Vercel/Live App)"
                placeholder="https://mi-proyecto.vercel.app"
                value={formProyecto.url_demo_live}
                onChange={(e) => setFormProyecto({ ...formProyecto, url_demo_live: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tecnologías Utilizadas</InputLabel>
                <Select
                  multiple
                  value={formProyecto.tecnologias}
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
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ py: 1.5, borderRadius: 2, textTransform: "none" }}
              >
                {archivoPortada ? archivoPortada.name : "Subir Imagen Portada..."}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setArchivoPortada(e.target.files[0])}
                />
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ py: 1.5, borderRadius: 2, textTransform: "none" }}
              >
                {archivoVideo ? archivoVideo.name : "Subir Archivo de Video MP4..."}
                <input
                  type="file"
                  hidden
                  accept="video/mp4,video/webm"
                  onChange={(e) => setArchivoVideo(e.target.files[0])}
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={onClose}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 4
            }}
          >
            {editingProyecto ? "Guardar Cambios" : "Crear Proyecto"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
