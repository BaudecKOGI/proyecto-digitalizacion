import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  IconButton,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';

export const Campos3D = ({
  formData,
  handleFileChange,
  agregarPieza,
  eliminarPieza,
  actualizarPieza,
  labelSx,
  fieldSx,
  selectSx,
}) => {
  return (
    <>
      {/* Archivo FBX */}
      <Box>
        <Typography variant="body2" sx={labelSx}>
          Archivo FBX *
        </Typography>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: '2px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#002B49',
            color: '#002B49',
            borderStyle: 'dashed',
          }}
        >
          {formData.archivo_fbx ? formData.archivo_fbx.name : 'Subir Modelo .FBX'}
          <input
            type="file"
            hidden
            accept=".fbx,.obj,.glb,.gltf"
            name="archivo_fbx"
            onChange={handleFileChange}
            required
          />
        </Button>
      </Box>

      {/* Imagen Miniatura */}
      <Box>
        <Typography variant="body2" sx={labelSx}>
          Imagen Miniatura (opcional)
        </Typography>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: '2px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#002B49',
            color: '#002B49',
            borderStyle: 'dashed',
          }}
        >
          {formData.imagen_miniatura ? formData.imagen_miniatura.name : 'Subir Portada'}
          <input
            type="file"
            hidden
            accept="image/*"
            name="imagen_miniatura"
            onChange={handleFileChange}
          />
        </Button>
      </Box>

      {/* Controles Mecánicos */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="body2" sx={labelSx}>
            Controles Mecánicos (opcional)
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Plus size={14} />}
            onClick={agregarPieza}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '2px',
              borderColor: '#002B49',
              color: '#002B49',
            }}
          >
            Nueva Pieza
          </Button>
        </Stack>

        {formData.piezasMoviles.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              p: 2,
              bgcolor: '#F8FAFC',
              borderRadius: '4px',
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No has agregado piezas móviles. Presiona "Nueva Pieza" para configurar la interacción.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {formData.piezasMoviles.map((pieza, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 1.5,
                  bgcolor: '#F8FAFC',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '4px',
                  position: 'relative',
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => eliminarPieza(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    color: 'error.main',
                    bgcolor: 'error.lighter',
                  }}
                >
                  <Trash2 size={14} />
                </IconButton>

                <Stack direction="row" spacing={1.5} sx={{ mb: 1, pr: 4 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ ...labelSx, fontSize: '0.7rem' }}>
                      ID de la pieza (FBX) *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      placeholder="Ej: Rueda_Izq"
                      value={pieza.nombre_objeto}
                      onChange={(e) => actualizarPieza(index, 'nombre_objeto', e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ ...labelSx, fontSize: '0.7rem' }}>
                      Etiqueta (UI) *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      placeholder="Ej: Girar Rueda"
                      value={pieza.etiqueta}
                      onChange={(e) => actualizarPieza(index, 'etiqueta', e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="flex-end">
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ ...labelSx, fontSize: '0.7rem' }}>
                      Eje
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={pieza.eje}
                        onChange={(e) => actualizarPieza(index, 'eje', e.target.value)}
                        sx={selectSx}
                      >
                        <MenuItem value="x">Eje X</MenuItem>
                        <MenuItem value="y">Eje Y</MenuItem>
                        <MenuItem value="z">Eje Z</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ ...labelSx, fontSize: '0.7rem' }}>
                      Límite Min (°)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      required
                      value={pieza.min_giro}
                      onChange={(e) => actualizarPieza(index, 'min_giro', Number(e.target.value))}
                      sx={fieldSx}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ ...labelSx, fontSize: '0.7rem' }}>
                      Límite Max (°)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      required
                      value={pieza.max_giro}
                      onChange={(e) => actualizarPieza(index, 'max_giro', Number(e.target.value))}
                      sx={fieldSx}
                    />
                  </Box>
                  <Box sx={{ flex: 1, pb: 0.5 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={pieza.invertir_giro || false}
                          onChange={(e) => actualizarPieza(index, 'invertir_giro', e.target.checked)}
                          sx={{ color: '#002B49', '&.Mui-checked': { color: '#002B49' } }}
                        />
                      }
                      label={
                        <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem' }}>
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
};
