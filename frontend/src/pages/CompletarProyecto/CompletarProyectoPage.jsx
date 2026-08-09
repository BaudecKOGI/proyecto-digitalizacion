import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Alert,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Divider,
  FormHelperText
} from '@mui/material';
import { ArrowLeft as BackIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { ODS_LIST } from '@/pages/dashboard/digitalProjects/odsData';
import {
  fetchInvitacionByToken,
  completarInvitacion,
  fetchCarreras,
  fetchCategorias,
  fetchTecnologias
} from '@/services/api';

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
  '& .MuiInputBase-input': { py: 1.2, px: 1.5, fontSize: '0.95rem', color: '#0F172A', fontWeight: 500 },
  '& .MuiInputLabel-root': { color: '#1E293B', fontWeight: 600 },
};

const selectSx = {
  bgcolor: '#F8FAFC',
  borderRadius: '2px 2px 0 0',
  '& .MuiOutlinedInput-notchedOutline': { border: 'none', borderBottom: '1px solid #002B49' },
  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none', borderBottom: '1.5px solid #002B49' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none', borderBottom: '2px solid #002B49' },
  '& .MuiSelect-select': { py: 1.2, px: 1.5, fontSize: '0.95rem', color: '#0F172A', fontWeight: 500 },
};

const labelSx = { fontWeight: 600, color: '#1E293B', mb: 0.6, fontSize: '0.85rem' };

export default function CompletarProyectoPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [invitacion, setInvitacion] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Catálogos
  const [carreras, setCarreras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tecnologias, setTecnologias] = useState([]);

  // Formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    carrera: '',
    ciclo: '',
    categoria: '',
    ods_ids: [],
    // 3D
    archivo_fbx: null,
    imagen_miniatura: null,
    // Software
    archivo_video: null,
    url_repositorio: '',
    url_demo_live: '',
    imagen_portada: null,
    tecnologias: [],
  });

  // Cargar invitación y catálogos
  useEffect(() => {
    const loadData = async () => {
      try {
        const [invData, carrerasData, catsData, techsData] = await Promise.all([
          fetchInvitacionByToken(token),
          fetchCarreras('activo=true'),
          fetchCategorias(),
          fetchTecnologias(),
        ]);

        setInvitacion(invData);
        setCarreras(Array.isArray(carrerasData) ? carrerasData : carrerasData?.results || []);
        setCategorias(Array.isArray(catsData) ? catsData : catsData?.results || []);
        setTecnologias(Array.isArray(techsData) ? techsData : techsData?.results || []);
      } catch (err) {
        setError(err.message || 'El enlace no es válido o ha expirado.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  // Helper para números romanos
  const toRoman = (num) => {
    const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return romanos[num - 1] || num;
  };

  const carreraSeleccionada = carreras.find(c => String(c.id) === String(formData.carrera));
  const duracionCiclos = carreraSeleccionada ? carreraSeleccionada.duracion_ciclos : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleCarreraChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, carrera: val, ciclo: '' }));
  };

  const handleTechChange = (techId) => {
    setFormData(prev => {
      const current = prev.tecnologias;
      const exists = current.includes(techId);
      if (exists) {
        return { ...prev, tecnologias: current.filter(id => id !== techId) };
      } else {
        return { ...prev, tecnologias: [...current, techId] };
      }
    });
  };

  const handleOdsChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, ods_ids: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      // Campos comunes
      data.append('titulo', formData.titulo);
      data.append('descripcion', formData.descripcion);
      if (formData.carrera) data.append('carrera', formData.carrera);
      if (formData.ciclo) data.append('ciclo', formData.ciclo);
      if (formData.categoria) data.append('categoria', formData.categoria);
      if (formData.ods_ids && formData.ods_ids.length > 0) {
        data.append('ods_ids', JSON.stringify(formData.ods_ids));
      }

      // Campos específicos
      if (invitacion?.tipo === '3D') {
        if (formData.archivo_fbx) data.append('archivo_fbx', formData.archivo_fbx);
        if (formData.imagen_miniatura) data.append('imagen_miniatura', formData.imagen_miniatura);
      } else {
        if (formData.archivo_video) data.append('archivo_video', formData.archivo_video);
        if (formData.url_repositorio) data.append('url_repositorio', formData.url_repositorio);
        if (formData.url_demo_live) data.append('url_demo_live', formData.url_demo_live);
        if (formData.imagen_portada) data.append('imagen_portada', formData.imagen_portada);
        formData.tecnologias.forEach(id => data.append('tecnologias', id));
      }

      await completarInvitacion(token, data);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al enviar el proyecto.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!invitacion || !invitacion.vigente) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Paper sx={{ p: 4, borderRadius: '6px' }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Enlace no válido o expirado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error || 'El enlace que has utilizado no es válido, ya ha sido usado o ha caducado.'}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3, bgcolor: '#002B49', '&:hover': { bgcolor: '#001e33' } }}
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </Button>
        </Paper>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Paper sx={{ p: 4, borderRadius: '6px' }}>
          <Typography variant="h5" fontWeight={700} gutterBottom color="success.main">
            ¡Proyecto enviado con éxito!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            El administrador revisará tu proyecto y lo publicará próximamente.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3, bgcolor: '#002B49', '&:hover': { bgcolor: '#001e33' } }}
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </Button>
        </Paper>
      </Container>
    );
  }

  const is3D = invitacion.tipo === '3D';

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {is3D ? 'Completar Diseño 3D' : 'Completar Proyecto de Software'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Estás completando el proyecto para <strong>{invitacion.autor_nombre}</strong>. El enlace expira en{' '}
              {new Date(invitacion.expira_en).toLocaleString('es-PE', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '2px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
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
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
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
                      {carreras.map(c => (
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
                      {Array.from({ length: duracionCiclos }, (_, i) => i + 1).map(num => (
                        <MenuItem key={num} value={num}>{toRoman(num)}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Stack>

              {/* Categoría + ODS */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
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
                      {categorias.map(c => (
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
                            const ods = ODS_LIST.find(o => o.id === id);
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
                      {ODS_LIST.map(o => (
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
                  rows={3}
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción del proyecto..."
                  sx={fieldSx}
                />
              </Box>

              {/* Campos específicos según tipo */}
              {is3D ? (
                <>
                  <Box>
                    <Typography variant="body2" sx={labelSx}>
                      Archivo FBX *
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ py: 1.8, borderStyle: 'dashed', borderColor: '#002B49', color: '#002B49' }}
                    >
                      {formData.archivo_fbx ? formData.archivo_fbx.name : 'Seleccionar archivo .fbx, .obj, .glb'}
                      <input type="file" hidden accept=".fbx,.obj,.glb,.gltf" name="archivo_fbx" onChange={handleFileChange} required />
                    </Button>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={labelSx}>
                      Imagen Miniatura (opcional)
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ py: 1.8, borderStyle: 'dashed', borderColor: '#002B49', color: '#002B49' }}
                    >
                      {formData.imagen_miniatura ? formData.imagen_miniatura.name : 'Seleccionar imagen (JPG/PNG)'}
                      <input type="file" hidden accept="image/*" name="imagen_miniatura" onChange={handleFileChange} />
                    </Button>
                  </Box>
                </>
              ) : (
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
                    <Box sx={{ p: 2, bgcolor: '#F8FAFC', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <div className="flex flex-wrap gap-2">
                        {tecnologias.map((tech) => {
                          const isSelected = formData.tecnologias.includes(tech.id);
                          return (
                            <button
                              type="button"
                              key={tech.id}
                              onClick={() => handleTechChange(tech.id)}
                              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
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
                      sx={{ py: 1.8, borderStyle: 'dashed', borderColor: '#002B49', color: '#002B49' }}
                    >
                      {formData.archivo_video ? formData.archivo_video.name : 'Seleccionar video (MP4/WebM)'}
                      <input type="file" hidden accept="video/mp4,video/webm" name="archivo_video" onChange={handleFileChange} />
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
                      sx={{ py: 1.8, borderStyle: 'dashed', borderColor: '#002B49', color: '#002B49' }}
                    >
                      {formData.imagen_portada ? formData.imagen_portada.name : 'Seleccionar imagen (JPG/PNG)'}
                      <input type="file" hidden accept="image/*" name="imagen_portada" onChange={handleFileChange} />
                    </Button>
                  </Box>
                </>
              )}

              {/* Botones */}
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '2px',
                    borderColor: '#002B49',
                    color: '#002B49',
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
                    py: 0.9,
                    bgcolor: '#002B49',
                    color: '#FFFFFF',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#001e33' },
                  }}
                >
                  {submitting ? <CircularProgress size={20} color="inherit" /> : 'Enviar proyecto'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}