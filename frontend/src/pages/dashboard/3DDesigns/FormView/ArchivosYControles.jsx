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
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper
} from "@mui/material";
import { Plus, Trash2, Upload, Lightbulb, HelpCircle } from "lucide-react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#F8FAFC',
    color: '#334155',
    maxWidth: 280,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
}));

export default function ArchivosYControles({
  editingDiseno,
  archivoFBX,
  setArchivoFBX,
  imagenMiniatura,
  setImagenMiniatura,
  piezasMoviles,
  agregarPieza,
  actualizarPieza,
  eliminarPieza,
  labelSx,
  fieldSx,
  selectSx
}) {
  return (
    <>
      {/* ARCHIVOS */}
      <Box sx={{ mt: 3.5 }}>
        <Typography variant="body2" sx={{ ...labelSx, mb: 1.5 }}>
          Archivos
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<Upload size={18} />}
            sx={{
              py: 1.8,
              borderRadius: "2px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#002B49",
              color: "#002B49",
              borderStyle: "dashed",
              "&:hover": { bgcolor: "rgba(0,43,73,0.04)", borderColor: "#002B49" }
            }}
          >
            {archivoFBX
              ? archivoFBX.name
              : editingDiseno
                ? "Actualizar .FBX"
                : "Subir Modelo .FBX"}
            <input
              type="file"
              hidden
              accept=".fbx,.obj,.glb,.gltf"
              onChange={(e) => setArchivoFBX(e.target.files?.[0] || null)}
            />
          </Button>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<Upload size={18} />}
            sx={{
              py: 1.8,
              borderRadius: "2px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#002B49",
              color: "#002B49",
              borderStyle: "dashed",
              "&:hover": { bgcolor: "rgba(0,43,73,0.04)", borderColor: "#002B49" }
            }}
          >
            {imagenMiniatura
              ? imagenMiniatura.name
              : editingDiseno
                ? "Actualizar Miniatura"
                : "Subir Portada"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImagenMiniatura(e.target.files?.[0] || null)}
            />
          </Button>
        </Stack>
      </Box>

      {/* CONTROLES MECÁNICOS */}
      <Box sx={{ mt: 3.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography variant="body2" sx={labelSx}>
            Controles Mecánicos
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <HtmlTooltip
              title={
                <React.Fragment>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Lightbulb size={16} color="#002B49" />
                    <Typography sx={{ fontWeight: 700, color: '#002B49', fontSize: '0.9rem' }}>
                      Tips para piezas móviles
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • El <b>ID</b> debe coincidir con el nombre del componente de la pieza en Fusion 360.
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • <b>Eje</b>: selecciona dirección de rotación (X, Y, Z).
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • <b>Límites</b>: define el ángulo mínimo y máximo.
                  </Typography>
                  <Typography variant="body2">
                    • <b>Invertir giro</b>: invierte la dirección del movimiento.
                  </Typography>
                </React.Fragment>
              }
              placement="left"
            >
              <IconButton size="small" sx={{ color: "#64748B", "&:hover": { color: "#002B49", bgcolor: "rgba(0,43,73,0.04)" } }}>
                <HelpCircle size={20} />
              </IconButton>
            </HtmlTooltip>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Plus size={14} />}
              onClick={agregarPieza}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "2px",
                borderColor: "#002B49",
                color: "#002B49",
                "&:hover": { bgcolor: "rgba(0,43,73,0.04)" }
              }}
            >
              Nueva Pieza
            </Button>
          </Stack>
        </Stack>

        {piezasMoviles.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              p: 3,
              bgcolor: "#F8FAFC",
              borderRadius: "4px",
              border: "1px dashed",
              borderColor: "divider"
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No has agregado piezas móviles. Presiona "Nueva Pieza" para configurar la interacción.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {piezasMoviles.map((pieza, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: "#F8FAFC",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "4px",
                  position: "relative"
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => eliminarPieza(index)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "error.main",
                    bgcolor: "error.lighter",
                    "&:hover": { bgcolor: "error.light" }
                  }}
                >
                  <Trash2 size={14} />
                </IconButton>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2, pr: 4 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ ...labelSx, fontSize: "0.75rem" }}>
                      ID de la pieza (FBX)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      placeholder="Ej: Rueda_Izq"
                      value={pieza.nombre_objeto}
                      onChange={(e) => actualizarPieza(index, "nombre_objeto", e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ ...labelSx, fontSize: "0.75rem" }}>
                      Etiqueta (UI)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      placeholder="Ej: Girar Rueda"
                      value={pieza.etiqueta}
                      onChange={(e) => actualizarPieza(index, "etiqueta", e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-end">
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ ...labelSx, fontSize: "0.75rem" }}>
                      Eje
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={pieza.eje}
                        onChange={(e) => actualizarPieza(index, "eje", e.target.value)}
                        sx={selectSx}
                      >
                        <MenuItem value="x">Eje X</MenuItem>
                        <MenuItem value="y">Eje Y</MenuItem>
                        <MenuItem value="z">Eje Z</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ ...labelSx, fontSize: "0.75rem" }}>
                      Límite Min (°)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      required
                      value={pieza.min_giro}
                      onChange={(e) => actualizarPieza(index, "min_giro", Number(e.target.value))}
                      sx={fieldSx}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ ...labelSx, fontSize: "0.75rem" }}>
                      Límite Max (°)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      required
                      value={pieza.max_giro}
                      onChange={(e) => actualizarPieza(index, "max_giro", Number(e.target.value))}
                      sx={fieldSx}
                    />
                  </Box>
                  <Box sx={{ flex: 1, pb: 0.5 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={pieza.invertir_giro || false}
                          onChange={(e) => actualizarPieza(index, "invertir_giro", e.target.checked)}
                          sx={{ color: "#002B49", "&.Mui-checked": { color: "#002B49" } }}
                        />
                      }
                      label={
                        <Typography variant="caption" fontWeight={600}>
                          Invertir Giro
                        </Typography>
                      }
                    />
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </>
  );
}
