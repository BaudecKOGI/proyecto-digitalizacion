import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
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
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { ListChecks, Lightbulb } from '@phosphor-icons/react/dist/ssr';
import { Plus, Trash2, Upload, Box as BoxIcon } from 'lucide-react';
import { ODS_LIST } from '@/pages/dashboard/digitalProjects/odsData';
import {
  fetchInvitacionByToken,
  completarInvitacion,
  fetchCarreras,
  fetchCategorias,
  fetchTecnologias,
} from '@/services/api';

// --- 3D ---
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useFBX, Html } from '@react-three/drei';

const FBXModel = ({ url, piezasMoviles, setHabilitarCamara }) => {
  const fbx = useFBX(url);
  const originalRotations = useRef({});
  const dragRef = useRef(null);

  useEffect(() => {
    if (!fbx) return;
    fbx.traverse((child) => {
      if (!originalRotations.current[child.uuid]) {
        originalRotations.current[child.uuid] = {
          x: child.rotation.x,
          y: child.rotation.y,
          z: child.rotation.z,
        };
      }
    });
  }, [fbx]);

  useEffect(() => {
    const handleWindowPointerMove = (e) => {
      if (!dragRef.current) return;
      const { mesh, config, lastX, lastY } = dragRef.current;
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      const sensiblidad = config.invertir_giro ? -0.01 : 0.01;
      const cambioRotacion = (deltaX + deltaY) * sensiblidad;
      const baseRot = originalRotations.current[mesh.uuid]?.[config.eje] || 0;
      const minRad = baseRot + (config.min_giro * Math.PI) / 180;
      const maxRad = baseRot + (config.max_giro * Math.PI) / 180;
      const rotActual = mesh.rotation[config.eje];
      const nuevaRotacion = Math.max(minRad, Math.min(maxRad, rotActual + cambioRotacion));
      mesh.rotation[config.eje] = nuevaRotacion;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
    };

    const handleWindowPointerUp = () => {
      if (dragRef.current) {
        dragRef.current = null;
        setHabilitarCamara(true);
        document.body.style.cursor = 'auto';
      }
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
    };
  }, [setHabilitarCamara]);

  const encontrarConfiguracionDePieza = (objetoTocado) => {
    let nodoActual = objetoTocado;
    while (nodoActual) {
      const nombreNodo = nodoActual.name ? nodoActual.name.trim().toLowerCase() : '';
      const piezaConfig = (piezasMoviles || []).find(
        (p) => p.nombre_objeto && p.nombre_objeto.trim().toLowerCase() === nombreNodo
      );
      if (piezaConfig) {
        return { config: piezaConfig, mesh: nodoActual };
      }
      nodoActual = nodoActual.parent;
    }
    return null;
  };

  const onPointerDown = (e) => {
    const resultado = encontrarConfiguracionDePieza(e.object);
    if (resultado) {
      e.stopPropagation();
      setHabilitarCamara(false);
      dragRef.current = {
        mesh: resultado.mesh,
        config: resultado.config,
        lastX: e.clientX,
        lastY: e.clientY,
      };
      document.body.style.cursor = 'grabbing';
    }
  };

  const onPointerOver = (e) => {
    const resultado = encontrarConfiguracionDePieza(e.object);
    if (resultado) {
      e.stopPropagation();
      document.body.style.cursor = 'grab';
    }
  };

  const onPointerOut = () => {
    if (!dragRef.current) document.body.style.cursor = 'auto';
  };

  return (
    <primitive
      object={fbx}
      scale={0.01}
      onPointerDown={onPointerDown}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    />
  );
};

// --- GUÍA LATERAL ---
const GuiaPasos = ({ camposCompletados, tipo }) => {
  const pasos = tipo === '3D'
    ? [
        { id: 'titulo', label: 'Título del proyecto' },
        { id: 'autor', label: 'Autor (ya está asignado)' },
        { id: 'carrera', label: 'Seleccionar carrera' },
        { id: 'ciclo', label: 'Seleccionar ciclo' },
        { id: 'categoria', label: 'Seleccionar categoría' },
        { id: 'ods', label: 'Seleccionar ODS (opcional)' },
        { id: 'descripcion', label: 'Escribir descripción' },
        { id: 'archivo', label: 'Subir archivo 3D' },
        { id: 'piezas', label: 'Configurar piezas móviles' },
      ]
    : [
        { id: 'titulo', label: 'Título del proyecto' },
        { id: 'autor', label: 'Autor (ya está asignado)' },
        { id: 'carrera', label: 'Seleccionar carrera' },
        { id: 'ciclo', label: 'Seleccionar ciclo' },
        { id: 'categoria', label: 'Seleccionar categoría' },
        { id: 'ods', label: 'Seleccionar ODS (opcional)' },
        { id: 'descripcion', label: 'Escribir descripción' },
        { id: 'archivos', label: 'Subir archivos (video, portada)' },
        { id: 'tecnologias', label: 'Seleccionar tecnologías' },
      ];

  const completados = camposCompletados || {};
  const total = pasos.length;
  const completadosCount = Object.values(completados).filter(Boolean).length;

  return (
    <Box
      sx={{
        p: 2.5,
        height: '100%',
        bgcolor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        overflowY: 'auto',
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ color: '#0F172A', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <ListChecks size={22} weight="bold" />
        Guía paso a paso
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" sx={{ color: '#64748B' }}>
          {completadosCount} de {total} completados
        </Typography>
        <Box
          sx={{
            width: 60,
            height: 4,
            bgcolor: '#E2E8F0',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${(completadosCount / total) * 100}%`,
              height: '100%',
              bgcolor: '#0F172A',
              transition: 'width 0.3s ease',
            }}
          />
        </Box>
      </Box>

      <Stack spacing={1.5} sx={{ flex: 1 }}>
        {pasos.map((paso) => {
          const completado = completados[paso.id] || false;
          return (
            <Box
              key={paso.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 0.75,
                borderRadius: 1,
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: completado ? 'transparent' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: completado ? '#0F172A' : 'transparent',
                  border: completado ? '2px solid #0F172A' : '2px solid #CBD5E1',
                  color: completado ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                }}
              >
                {completado ? '✓' : pasos.indexOf(paso) + 1}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: completado ? '#334155' : '#1E293B',
                  fontWeight: completado ? 500 : 400,
                  textDecoration: completado ? 'line-through' : 'none',
                  opacity: completado ? 0.7 : 1,
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease',
                }}
              >
                {paso.label}
              </Typography>
            </Box>
          );
        })}
      </Stack>

      {tipo === '3D' && (
        <Box
          sx={{
            mt: 1,
            p: 1.5,
            bgcolor: '#F1F5F9',
            borderRadius: 2,
            border: '1px solid #E2E8F0',
          }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            color="#0F172A"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
          >
            <Lightbulb size={16} weight="fill" />
            Tips para piezas móviles
          </Typography>
          <Typography variant="caption" display="block" color="#475569" sx={{ mb: 0.5, fontSize: '0.7rem' }}>
            • El <strong style={{ color: '#0F172A' }}>ID</strong> debe coincidir con el nombre en Fusion 360.
          </Typography>
          <Typography variant="caption" display="block" color="#475569" sx={{ mb: 0.5, fontSize: '0.7rem' }}>
            • <strong style={{ color: '#0F172A' }}>Eje</strong>: selecciona dirección de rotación (X, Y, Z).
          </Typography>
          <Typography variant="caption" display="block" color="#475569" sx={{ mb: 0.5, fontSize: '0.7rem' }}>
            • <strong style={{ color: '#0F172A' }}>Límites</strong>: define el ángulo mínimo y máximo.
          </Typography>
          <Typography variant="caption" display="block" color="#475569" sx={{ fontSize: '0.7rem' }}>
            • <strong style={{ color: '#0F172A' }}>Invertir giro</strong>: invierte la dirección del movimiento.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function CompletarProyectoPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [invitacion, setInvitacion] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [carreras, setCarreras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tecnologias, setTecnologias] = useState([]);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    carrera: '',
    ciclo: '',
    categoria: '',
    ods_ids: [],
    archivo_fbx: null,
    imagen_miniatura: null,
    archivo_video: null,
    url_repositorio: '',
    url_demo_live: '',
    imagen_portada: null,
    tecnologias: [],
    piezasMoviles: [],
  });

  const [fbxUrl, setFbxUrl] = useState(null);
  const [habilitarCamara, setHabilitarCamara] = useState(true);
  const [camposCompletados, setCamposCompletados] = useState({});

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

  // --- LOGICA DE PASOS COMPLETADOS CORREGIDA ---
  useEffect(() => {
    const is3D = invitacion?.tipo === '3D';
    let campos = {};

    if (is3D) {
      campos = {
        titulo: Boolean(formData.titulo && formData.titulo.trim().length > 0),
        autor: true,
        carrera: Boolean(formData.carrera && formData.carrera !== ''),
        ciclo: Boolean(formData.ciclo && formData.ciclo !== ''),
        categoria: Boolean(formData.categoria && formData.categoria !== ''),
        ods: formData.ods_ids && formData.ods_ids.length > 0,
        descripcion: Boolean(formData.descripcion && formData.descripcion.trim().length > 0),
        archivo: Boolean(formData.archivo_fbx),
        piezas: formData.piezasMoviles && formData.piezasMoviles.length > 0,
      };
    } else {
      campos = {
        titulo: Boolean(formData.titulo && formData.titulo.trim().length > 0),
        autor: true,
        carrera: Boolean(formData.carrera && formData.carrera !== ''),
        ciclo: Boolean(formData.ciclo && formData.ciclo !== ''),
        categoria: Boolean(formData.categoria && formData.categoria !== ''),
        ods: formData.ods_ids && formData.ods_ids.length > 0,
        descripcion: Boolean(formData.descripcion && formData.descripcion.trim().length > 0),
        archivos: Boolean(formData.archivo_video || formData.imagen_portada),
        tecnologias: formData.tecnologias && formData.tecnologias.length > 0,
      };
    }

    setCamposCompletados(campos);
  }, [formData, invitacion]);

  const toRoman = (num) => {
    const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return romanos[num - 1] || num;
  };

  const carreraSeleccionada = carreras.find((c) => String(c.id) === String(formData.carrera));
  const duracionCiclos = carreraSeleccionada ? carreraSeleccionada.duracion_ciclos : 0;
  const is3D = invitacion?.tipo === '3D';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      if (name === 'archivo_fbx') {
        setFbxUrl(URL.createObjectURL(files[0]));
      }
    }
  };

  const handleCarreraChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, carrera: val, ciclo: '' }));
  };

  const handleTechChange = (techId) => {
    setFormData((prev) => {
      const current = prev.tecnologias;
      const exists = current.includes(techId);
      if (exists) {
        return { ...prev, tecnologias: current.filter((id) => id !== techId) };
      }
      return { ...prev, tecnologias: [...current, techId] };
    });
  };

  const handleOdsChange = (e) => {
    setFormData((prev) => ({ ...prev, ods_ids: e.target.value }));
  };

  const agregarPieza = () => {
    setFormData((prev) => ({
      ...prev,
      piezasMoviles: [
        ...prev.piezasMoviles,
        {
          nombre_objeto: '',
          eje: 'x',
          etiqueta: '',
          min_giro: -180,
          max_giro: 180,
          invertir_giro: false,
        },
      ],
    }));
  };

  const actualizarPieza = (index, campo, valor) => {
    const nuevas = [...formData.piezasMoviles];
    nuevas[index][campo] = valor;
    setFormData((prev) => ({ ...prev, piezasMoviles: nuevas }));
  };

  const eliminarPieza = (index) => {
    setFormData((prev) => ({
      ...prev,
      piezasMoviles: prev.piezasMoviles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('titulo', formData.titulo);
      data.append('descripcion', formData.descripcion);
      if (formData.carrera) data.append('carrera', formData.carrera);
      if (formData.ciclo) data.append('ciclo', formData.ciclo);
      if (formData.categoria) data.append('categoria', formData.categoria);
      if (formData.ods_ids && formData.ods_ids.length > 0) {
        data.append('ods_ids', JSON.stringify(formData.ods_ids));
      }

      if (is3D) {
        if (formData.archivo_fbx) data.append('archivo_fbx', formData.archivo_fbx);
        if (formData.imagen_miniatura) data.append('imagen_miniatura', formData.imagen_miniatura);
        if (formData.piezasMoviles && formData.piezasMoviles.length > 0) {
          data.append(
            'configuracion_interactiva',
            JSON.stringify({ piezas_moviles: formData.piezasMoviles })
          );
        }
      } else {
        if (formData.archivo_video) data.append('archivo_video', formData.archivo_video);
        if (formData.url_repositorio) data.append('url_repositorio', formData.url_repositorio);
        if (formData.url_demo_live) data.append('url_demo_live', formData.url_demo_live);
        if (formData.imagen_portada) data.append('imagen_portada', formData.imagen_portada);
        formData.tecnologias.forEach((id) => data.append('tecnologias', id));
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
      <Box sx={{ maxWidth: 480, mx: 'auto', mt: 8, textAlign: 'center' }}>
        <Paper sx={{ p: 4 }}>
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
      </Box>
    );
  }

  if (success) {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', mt: 8, textAlign: 'center' }}>
        <Paper sx={{ p: 4 }}>
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
      </Box>
    );
  }

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
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#F8FAFC', overflow: 'hidden' }}>
      {/* Guía lateral */}
      <Box sx={{ width: '18%', minWidth: 200, bgcolor: '#FFFFFF', borderRight: '1px solid #E2E8F0', overflowY: 'auto' }}>
        <GuiaPasos camposCompletados={camposCompletados} tipo={invitacion.tipo} />
      </Box>

      {/* Contenido principal */}
      <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Encabezado */}
        <Box sx={{ mb: 2 }}>
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
          <Divider sx={{ mt: 1 }} />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '2px', py: 0.5 }}>
            {error}
          </Alert>
        )}

        {/* Layout a dos columnas: formulario + visor (solo para 3D) */}
        <Box sx={{ display: 'flex', gap: 3, flex: 1, minHeight: 0 }}>
          {/* Formulario - ahora ocupa todo el ancho en software */}
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

              {is3D ? (
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
              ) : (
                // Software
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

          {/* Visor 3D (solo si es 3D) */}
          {is3D && (
            <Box
              sx={{
                flex: '1 1 auto',
                minWidth: 0,
                position: 'relative',
                bgcolor: '#1e293b',
                borderRadius: '6px',
                border: '1px solid #334155',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: 480,
              }}
            >
              {!fbxUrl && !formData.archivo_fbx ? (
                <Box sx={{ textAlign: 'center', color: '#94a3b8', p: 3 }}>
                  <BoxIcon size={64} style={{ opacity: 0.3, marginBottom: 16 }} />
                  <Typography variant="body2" fontWeight={500}>
                    Sube tu archivo .FBX a la izquierda
                    <br />
                    para previsualizarlo aquí
                  </Typography>
                </Box>
              ) : (
                <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
                  <color attach="background" args={['#1e293b']} />
                  <Suspense
                    fallback={
                      <Html center>
                        <Typography sx={{ color: '#22d3ee', fontWeight: 700, fontSize: 14 }}>
                          Cargando modelo 3D...
                        </Typography>
                      </Html>
                    }
                  >
                    <Stage environment="city" intensity={0.6}>
                      <FBXModel
                        url={fbxUrl || formData.archivo_fbx}
                        piezasMoviles={formData.piezasMoviles}
                        setHabilitarCamara={setHabilitarCamara}
                      />
                    </Stage>
                  </Suspense>
                  <OrbitControls makeDefault enabled={habilitarCamara} />
                </Canvas>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}