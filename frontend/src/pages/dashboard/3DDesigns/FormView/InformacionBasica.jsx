import React from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Chip
} from "@mui/material";
import { Eye, FileEdit } from "lucide-react";
import { ODS_LIST } from "@/pages/dashboard/digitalProjects/odsData";

export default function InformacionBasica({
  formDiseno,
  setFormDiseno,
  editingDiseno,
  carreras,
  carreraSeleccionada,
  setCarreraSeleccionada,
  cicloSeleccionado,
  setCicloSeleccionado,
  opcionesCiclos,
  categorias,
  labelSx,
  fieldSx,
  selectSx
}) {
  return (
    <Stack spacing={3.5}>
      {/* ESTADO DE PUBLICACIÓN */}
      <Box>
        <Typography variant="body2" sx={labelSx}>
          Estado de Publicación
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button
            fullWidth
            variant={formDiseno.estado_publicacion === "PUBLICADO" ? "contained" : "outlined"}
            onClick={() => setFormDiseno({ ...formDiseno, estado_publicacion: "PUBLICADO" })}
            startIcon={<Eye size={18} />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "2px",
              borderColor: "#002B49",
              ...(formDiseno.estado_publicacion === "PUBLICADO"
                ? { bgcolor: "#002B49", color: "#fff", "&:hover": { bgcolor: "#001e33" } }
                : { color: "#002B49", "&:hover": { bgcolor: "rgba(0,43,73,0.04)" } })
            }}
          >
            Público
          </Button>
          <Button
            fullWidth
            variant={formDiseno.estado_publicacion === "BORRADOR" ? "contained" : "outlined"}
            onClick={() => setFormDiseno({ ...formDiseno, estado_publicacion: "BORRADOR" })}
            startIcon={<FileEdit size={18} />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "2px",
              borderColor: "#002B49",
              ...(formDiseno.estado_publicacion === "BORRADOR"
                ? { bgcolor: "#002B49", color: "#fff", "&:hover": { bgcolor: "#001e33" } }
                : { color: "#002B49", "&:hover": { bgcolor: "rgba(0,43,73,0.04)" } })
            }}
          >
            Borrador
          </Button>
        </Stack>
      </Box>

      {/* TÍTULO */}
      <Box>
        <Typography variant="body2" sx={labelSx}>
          Título del Proyecto
        </Typography>
        <TextField
          fullWidth
          required
          placeholder="Ej. Brazo Robótico Articulado"
          value={formDiseno.titulo || ""}
          onChange={(e) => setFormDiseno({ ...formDiseno, titulo: e.target.value })}
          sx={fieldSx}
        />
      </Box>

      {/* AUTOR + CARRERA + CICLO */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
        <Box sx={{ flex: 2 }}>
          <Typography variant="body2" sx={labelSx}>
            Autor(es)
          </Typography>
          <TextField
            fullWidth
            required
            placeholder="Ej. Alessandro"
            value={formDiseno.autor_nombre || ""}
            onChange={(e) => setFormDiseno({ ...formDiseno, autor_nombre: e.target.value })}
            sx={fieldSx}
          />
        </Box>
        <Box sx={{ flex: 2 }}>
          <Typography variant="body2" sx={labelSx}>
            Carrera
          </Typography>
          <FormControl fullWidth>
            <Select
              value={carreraSeleccionada || ""}
              onChange={(e) => {
                const val = e.target.value;
                setCarreraSeleccionada(val);
                setCicloSeleccionado(null);
              }}
              displayEmpty
              sx={selectSx}
            >
              <MenuItem value="">
                <em>Seleccionar...</em>
              </MenuItem>
              {carreras.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={labelSx}>
            Ciclo
          </Typography>
          <FormControl fullWidth>
            <Select
              value={cicloSeleccionado || ""}
              onChange={(e) => setCicloSeleccionado(e.target.value)}
              disabled={!carreraSeleccionada}
              displayEmpty
              sx={selectSx}
            >
              <MenuItem value="">
                <em>{carreraSeleccionada ? "Seleccionar..." : "Primero selecciona carrera"}</em>
              </MenuItem>
              {opcionesCiclos.map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  {op.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>

      {/* CATEGORÍA + ODS */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={labelSx}>
            Categoría
          </Typography>
          <FormControl fullWidth>
            <Select
              value={formDiseno.categoria || ""}
              onChange={(e) => setFormDiseno({ ...formDiseno, categoria: e.target.value })}
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
              multiple
              value={formDiseno.ods_ids || []}
              onChange={(e) => setFormDiseno({ ...formDiseno, ods_ids: e.target.value })}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const ods = ODS_LIST.find(o => o.id === id);
                    return (
                      <Chip
                        key={id}
                        label={ods ? `ODS ${id}` : id}
                        size="small"
                        sx={{ bgcolor: '#E2E8F0', color: '#475569', fontWeight: 600 }}
                      />
                    );
                  })}
                </Box>
              )}
              sx={selectSx}
            >
              {ODS_LIST.map((o) => (
                <MenuItem key={o.id} value={o.id}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>

      {/* DESCRIPCIÓN */}
      <Box>
        <Typography variant="body2" sx={labelSx}>
          Descripción
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          required
          placeholder="Descripción del modelo 3D..."
          value={formDiseno.descripcion || ""}
          onChange={(e) => setFormDiseno({ ...formDiseno, descripcion: e.target.value })}
          sx={fieldSx}
        />
      </Box>
    </Stack>
  );
}
