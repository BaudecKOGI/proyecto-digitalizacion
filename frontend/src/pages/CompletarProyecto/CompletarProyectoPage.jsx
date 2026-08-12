import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Box as BoxIcon } from 'lucide-react';

import {
  fetchInvitacionByToken,
  completarInvitacion,
  fetchCarreras,
  fetchCategorias,
  fetchTecnologias,
} from '@/services/api';

import { GuiaPasos } from './components/GuiaPasos';
import { FBXModelViewer } from './components/FBXModelViewer';
import { ProyectoForm } from './components/ProyectoForm';

// 3D
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Html } from '@react-three/drei';

// COMPONENTE PRINCIPAL
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

  // LOGICA DE PASOS COMPLETADOS
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
          {/* Componente del formulario */}
          <ProyectoForm
            is3D={is3D}
            handleSubmit={handleSubmit}
            formData={formData}
            handleChange={handleChange}
            handleCarreraChange={handleCarreraChange}
            carreras={carreras}
            categorias={categorias}
            duracionCiclos={duracionCiclos}
            invitacion={invitacion}
            handleOdsChange={handleOdsChange}
            handleFileChange={handleFileChange}
            agregarPieza={agregarPieza}
            eliminarPieza={eliminarPieza}
            actualizarPieza={actualizarPieza}
            tecnologias={tecnologias}
            handleTechChange={handleTechChange}
            submitting={submitting}
            toRoman={toRoman}
          />

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
                      <FBXModelViewer
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