import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

export const CamposDigitales = ({
  formData,
  handleChange,
  handleFileChange,
  tecnologias,
  handleTechChange,
  labelSx,
  fieldSx,
}) => {
  return (
    <>
      <Box>
        <Typography variant="body2" sx={labelSx}>
          URL Repositorio Git
        </Typography>
        <TextField
          fullWidth
          name="url_repositorio"
          value={formData.url_repositorio}
          onChange={handleChange}
          placeholder="https://github.com/..."
          sx={fieldSx}
        />
      </Box>
      <Box>
        <Typography variant="body2" sx={labelSx}>
          URL Demo en Vivo
        </Typography>
        <TextField
          fullWidth
          name="url_demo_live"
          value={formData.url_demo_live}
          onChange={handleChange}
          placeholder="https://mi-proyecto.vercel.app"
          sx={fieldSx}
        />
      </Box>
      <Box>
        <Typography variant="body2" sx={labelSx}>
          Tecnologías Utilizadas
        </Typography>
        <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <div className="flex flex-wrap gap-1.5">
            {tecnologias.map((tech) => {
              const isSelected = formData.tecnologias.includes(tech.id);
              return (
                <button
                  type="button"
                  key={tech.id}
                  onClick={() => handleTechChange(tech.id)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#002B49] text-white shadow-sm'
                      : 'bg-gray-100 border border-gray-300 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {tech.nombre} {isSelected ? '✓' : '+'}
                </button>
              );
            })}
          </div>
        </Box>
      </Box>
      <Box>
        <Typography variant="body2" sx={labelSx}>
          Archivo Video (MP4 / WebM)
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
          {formData.archivo_video ? formData.archivo_video.name : 'Subir Video MP4'}
          <input
            type="file"
            hidden
            accept="video/mp4,video/webm"
            name="archivo_video"
            onChange={handleFileChange}
          />
        </Button>
      </Box>
      <Box>
        <Typography variant="body2" sx={labelSx}>
          Imagen Portada (opcional)
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
          {formData.imagen_portada ? formData.imagen_portada.name : 'Subir Portada'}
          <input
            type="file"
            hidden
            accept="image/*"
            name="imagen_portada"
            onChange={handleFileChange}
          />
        </Button>
      </Box>
    </>
  );
};
