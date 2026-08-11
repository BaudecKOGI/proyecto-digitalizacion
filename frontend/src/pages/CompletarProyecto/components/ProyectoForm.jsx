import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Paper,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ODS_LIST } from '@/pages/dashboard/digitalProjects/odsData';

import { Campos3D } from './Campos3D';
import { CamposDigitales } from './CamposDigitales';

export const ProyectoForm = ({
  is3D,
  handleSubmit,
  formData,
  handleChange,
  handleCarreraChange,
  carreras,
  categorias,
  duracionCiclos,
  invitacion,
  handleOdsChange,
  handleFileChange,
  agregarPieza,
  eliminarPieza,
  actualizarPieza,
  tecnologias,
  handleTechChange,
  submitting,
  toRoman,
}) => {
  const navigate = useNavigate();

  // Estilos
  const fieldSx = {
    bgcolor: '#F8FAFC',
    borderRadius: '2px 2px 0 0',
    '& .MuiOutlinedInput-root': {
      bgcolor: '#F8FAFC',
      borderRadius: '2px 2px 0 0',
      '& fieldset': { border: 'none', borderBottom: '1px solid #002B49' },
      '&:hover fieldset': { border: 'none', borderBottom: '1.5px solid #002B49' },
      '&.Mui-focused fieldset': { border: 'none', borderBottom: '2px solid #002B49' },
    },
    '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.9rem', fontWeight: 500 },
  };

  const selectSx = {
    bgcolor: '#F8FAFC',
    borderRadius: '2px 2px 0 0',
    '& .MuiOutlinedInput-notchedOutline': { border: 'none', borderBottom: '1px solid #002B49' },
    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none', borderBottom: '1.5px solid #002B49' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none', borderBottom: '2px solid #002B49' },
    '& .MuiSelect-select': { py: 1, px: 1.5, fontSize: '0.9rem', fontWeight: 500 },
  };

  const labelSx = { fontWeight: 600, color: '#1E293B', mb: 0.4, fontSize: '0.8rem' };

  return (
    <Paper
      elevation={0}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        flex: is3D ? '0 0 46%' : '1 1 100%',
        width: is3D ? '46%' : '100%',
        p: 3,
        borderRadius: '6px',
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        bgcolor: '#FFFFFF',
        overflowY: 'auto',
      }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
        Información del Proyecto
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Completa todos los campos obligatorios (*).
      </Typography>

      <Stack spacing={2.5}>
        {/* Título */}
        <Box>
          <Typography variant="body2" sx={labelSx}>
            Título del Proyecto *
          </Typography>
          <TextField
            fullWidth
            required
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ej. Brazo Robótico Articulado"
            sx={fieldSx}
          />
        </Box>

        {/* Autor (solo lectura) */}
        <Box>
          <Typography variant="body2" sx={labelSx}>
            Autor (de la invitación)
          </Typography>
          <TextField
            fullWidth
            value={invitacion.autor_nombre}
            InputProps={{ readOnly: true }}
            sx={{ ...fieldSx, '& .MuiInputBase-input': { color: '#6B7280' } }}
          />
        </Box>

        {/* Carrera + Ciclo */}
        <Stack direction="row" spacing={2}>
          <Box sx={{ flex: 2 }}>
            <Typography variant="body2" sx={labelSx}>
              Carrera *
            </Typography>
            <FormControl fullWidth required>
              <Select
                value={formData.carrera}
                onChange={handleCarreraChange}
                displayEmpty
                sx={selectSx}
              >
                <MenuItem value=""><em>Seleccionar...</em></MenuItem>
                {carreras.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={labelSx}>
              Ciclo *
            </Typography>
            <FormControl fullWidth required>
              <Select
                value={formData.ciclo}
                onChange={handleChange}
                name="ciclo"
                disabled={!formData.carrera}
                displayEmpty
                sx={selectSx}
              >
                <MenuItem value="">
                  <em>{formData.carrera ? 'Seleccionar...' : 'Primero selecciona carrera'}</em>
                </MenuItem>
                {Array.from({ length: duracionCiclos }, (_, i) => i + 1).map((num) => (
                  <MenuItem key={num} value={num}>{toRoman(num)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>

        {/* Categoría + ODS */}
        <Stack direction="row" spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={labelSx}>
              Categoría *
            </Typography>
            <FormControl fullWidth required>
              <Select
                value={formData.categoria}
                onChange={handleChange}
                name="categoria"
                displayEmpty
                sx={selectSx}
              >
                <MenuItem value=""><em>Seleccionar...</em></MenuItem>
                {categorias.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={labelSx}>
              ODS de Impacto
            </Typography>
            <FormControl fullWidth>
              <Select
                multiple
                value={formData.ods_ids}
                onChange={handleOdsChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((id) => {
                      const ods = ODS_LIST.find((o) => o.id === id);
                      return (
                        <Chip
                          key={id}
                          label={ods ? `ODS ${id}` : id}
                          size="small"
                          sx={{ bgcolor: ods?.color || '#6b7280', color: '#fff', fontWeight: 600 }}
                        />
                      );
                    })}
                  </Box>
                )}
                sx={selectSx}
              >
                {ODS_LIST.map((o) => (
                  <MenuItem key={o.id} value={o.id}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>

        {/* Descripción */}
        <Box>
          <Typography variant="body2" sx={labelSx}>
            Descripción *
          </Typography>
          <TextField
            fullWidth
            required
            multiline
            rows={2}
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción del proyecto..."
            sx={fieldSx}
          />
        </Box>

        {/* Campos Específicos según el Tipo de Proyecto */}
        {is3D ? (
          <Campos3D
            formData={formData}
            handleFileChange={handleFileChange}
            agregarPieza={agregarPieza}
            eliminarPieza={eliminarPieza}
            actualizarPieza={actualizarPieza}
            labelSx={labelSx}
            fieldSx={fieldSx}
            selectSx={selectSx}
          />
        ) : (
          <CamposDigitales
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            tecnologias={tecnologias}
            handleTechChange={handleTechChange}
            labelSx={labelSx}
            fieldSx={fieldSx}
          />
        )}

        {/* Botones */}
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '2px',
              borderColor: '#002B49',
              color: '#002B49',
              px: 3.5,
              py: 0.8,
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '2px',
              px: 4,
              py: 0.8,
              bgcolor: '#002B49',
              color: '#FFFFFF',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#001e33', boxShadow: 'none' },
            }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : 'Enviar proyecto'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
