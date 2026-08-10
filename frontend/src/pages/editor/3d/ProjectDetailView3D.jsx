import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Box, 
  User, 
  Tag, 
  Target, 
  FileText, 
  Calendar, 
  Image as ImageIcon,
  CheckCircle2,
  Clock
} from 'lucide-react';

// --- IMPORTACIONES 3D ---
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useFBX } from '@react-three/drei';

// Ajusta estas importaciones según tu estructura real
import { ODS_LIST } from "@/pages/dashboard/digitalProjects/odsData";
import { fetchProyectos3D, fetchCategorias } from '@/services/api'; 

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

// --- COMPONENTE INTERNO PARA EL MODELO Y LA MANIPULACIÓN DIRECTA ---
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
          z: child.rotation.z
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
      const minRad = baseRot + (config.min_giro * Math.PI / 180);
      const maxRad = baseRot + (config.max_giro * Math.PI / 180);

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
      const piezaConfig = piezasMoviles.find(
        p => p.nombre_objeto && p.nombre_objeto.trim().toLowerCase() === nombreNodo
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
        lastY: e.clientY
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

export const ProjectDetailView3D = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [categoriaNombre, setCategoriaNombre] = useState('Cargando...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [habilitarCamara, setHabilitarCamara] = useState(true);

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        setLoading(true);
        const [data3D, catsData] = await Promise.all([
          fetchProyectos3D(),
          fetchCategorias()
        ]);

        const rawProjects = Array.isArray(data3D) ? data3D : data3D?.results || [];
        const foundProject = rawProjects.find(p => String(p.id) === String(id));

        if (!foundProject) {
          setError("No se encontró el proyecto solicitado.");
          setLoading(false);
          return;
        }

        setProject(foundProject);

        const categories = Array.isArray(catsData) ? catsData : catsData?.results || [];
        const cat = categories.find(c => String(c.id) === String(foundProject.categoria));
        setCategoriaNombre(cat ? cat.nombre : 'Sin categoría');

      } catch (err) {
        console.error("Error al cargar el detalle:", err);
        setError("Ocurrió un error al cargar la información del proyecto.");
      } finally {
        setLoading(false);
      }
    };

    loadProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-[var(--text-muted)] gap-3">
        <Box className="animate-bounce" size={40} />
        <p className="font-medium animate-pulse">Cargando detalles del proyecto...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] mb-6 transition-colors">
          <ArrowLeft size={20} /> Volver a la lista
        </button>
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 text-center font-medium">
          {error}
        </div>
      </div>
    );
  }

  const odsDetalle = project.ods_detalle || [];
  const isPublicado = project.estado_publicacion === 'PUBLICADO';
  const fechaProyecto = project.created_at || project.fecha_creacion || project.fecha;

  let imageUrl = project.imagen_miniatura || '';
  if (imageUrl.startsWith('/')) {
    imageUrl = `${API_BASE}${imageUrl}`;
  }

  let fbxUrl = project.archivo_fbx || '';
  if (fbxUrl.startsWith('/')) {
    fbxUrl = `${API_BASE}${fbxUrl}`;
  }

  let piezasMoviles = [];
  try {
    if (project.configuracion_interactiva) {
      const config = typeof project.configuracion_interactiva === 'string' 
        ? JSON.parse(project.configuracion_interactiva) 
        : project.configuracion_interactiva;
      piezasMoviles = config?.piezas_moviles || [];
    }
  } catch (err) {
    console.error("Error al parsear la configuración interactiva:", err);
  }

  return (
    <div className="flex flex-col gap-6 h-full pb-8 max-w-7xl mx-auto w-full">
      
      {/* --- ENCABEZADO Y CONTROLES --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-[var(--panel)] border border-[var(--line)] rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent)] transition-all cursor-pointer shadow-sm"
            title="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] m-0 leading-tight flex items-center gap-3">
              Detalle del Proyecto
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                isPublicado 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              }`}>
                {isPublicado ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                {project.estado_publicacion || 'BORRADOR'}
              </span>
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">ID del registro: #{project.id}</p>
          </div>
        </div>

        <button 
          onClick={() => navigate(`/editor/3d/editar/${project.id}`)}
          className="bg-[var(--accent)] hover:opacity-90 transition-opacity text-white border-none py-2 px-5 rounded-xl cursor-pointer font-bold flex items-center justify-center gap-2 shadow-sm shrink-0"
        >
          <Edit3 size={18} /> Editar Proyecto
        </button>
      </div>

      {/* --- CONTENIDO PRINCIPAL (GRID) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA: Visor (Ocupa 7/12 en desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-1 shadow-sm overflow-hidden flex flex-col">
            
            <div className="bg-[#1e293b] rounded-xl aspect-video relative flex items-center justify-center overflow-hidden shadow-inner cursor-grab active:cursor-grabbing">
              {!fbxUrl ? (
                <div className="text-center text-slate-400">
                  <Box className="mx-auto mb-4 opacity-30" size={48} />
                  <p className="text-[15px] font-medium">El archivo de modelo no está disponible</p>
                </div>
              ) : (
                <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
                  <color attach="background" args={['#1e293b']} />
                  <Suspense fallback={
                    <mesh>
                      <boxGeometry args={[1, 1, 1]} />
                      <meshBasicMaterial color="#334155" wireframe />
                    </mesh>
                  }>
                    <Stage environment="city" intensity={0.6}>
                      <FBXModel 
                        url={fbxUrl} 
                        piezasMoviles={piezasMoviles} 
                        setHabilitarCamara={setHabilitarCamara}
                      />
                    </Stage>
                  </Suspense>
                  <OrbitControls makeDefault enabled={habilitarCamara} />
                </Canvas>
              )}
            </div>

            <div className="p-4 flex items-center justify-between text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-2">
                <FileText size={16} /> 
                Archivo modelo: <strong className="text-[var(--text-main)] truncate max-w-[200px]">{project.archivo_fbx ? 'Asignado' : 'No subido'}</strong>
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} /> 
                {fechaProyecto ? new Date(fechaProyecto).toLocaleDateString() : 'Fecha desconocida'}
              </span>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-3 flex items-center gap-2">
              <FileText size={20} className="text-[var(--accent)]" /> Descripción
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap break-all text-sm md:text-base">
              {project.descripcion || 'Este proyecto no cuenta con una descripción detallada en este momento.'}
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: Metadatos e Información (Ocupa 5/12 en desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Tarjeta de Información Principal */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--text-main)] mb-1 leading-tight">
                {project.titulo}
              </h1>
              <p className="text-[var(--text-muted)] text-sm">Información general del modelo</p>
            </div>

            <hr className="border-[var(--line)]" />

            <div className="flex flex-col gap-4">
              {/* Autor */}
              <div>
                <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1 block">
                  Desarrollado por
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-general)] border border-[var(--line)] flex items-center justify-center text-[var(--text-muted)]">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-main)]">{project.autor_nombre || 'Autor Desconocido'}</div>
                    {project.ciclo && (
                      <div className="text-xs text-[var(--text-muted)]">Ciclo: {project.ciclo}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Categoría */}
              <div>
                <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1 block">
                  Categoría Tecnológica
                </span>
                <div className="inline-flex items-center gap-2 bg-[var(--bg-general)] border border-[var(--line)] px-3 py-2 rounded-xl">
                  <Tag size={16} className="text-[var(--accent)]" />
                  <span className="font-semibold text-[var(--text-main)] text-sm">{categoriaNombre}</span>
                </div>
              </div>

              {/* ODS MÚLTIPLES */}
              {odsDetalle.length > 0 && (
                <div>
                  <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">
                    Objetivos de Desarrollo Sostenible
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {odsDetalle.map((ods) => {
                      const odsData = ODS_LIST.find(o => o.id === ods.id);
                      return (
                        <span 
                          key={ods.id}
                          className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
                          style={{ backgroundColor: odsData?.color || '#6b7280' }}
                        >
                          {ods.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tarjeta de Datos del Sistema */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 shadow-sm">
             <h3 className="text-[14px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4 border-b border-[var(--line)] pb-2">
               Datos del Sistema
             </h3>
             <ul className="flex flex-col gap-3 text-sm">
                <li className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">Visibilidad:</span>
                  <strong className="text-[var(--text-main)]">{project.estado_publicacion}</strong>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">Ruta de miniatura:</span>
                  <span className="text-[var(--text-main)] truncate max-w-[150px]" title={project.imagen_miniatura}>
                    {project.imagen_miniatura ? '...'+project.imagen_miniatura.slice(-15) : 'N/A'}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">Ruta del modelo:</span>
                  <span className="text-[var(--text-main)] truncate max-w-[150px]" title={project.archivo_fbx}>
                    {project.archivo_fbx ? '...'+project.archivo_fbx.slice(-15) : 'N/A'}
                  </span>
                </li>
                <li className="flex justify-between items-center mt-3 pt-3 border-t border-[var(--line)]">
                  <span className="text-[var(--text-muted)]">Piezas Interactivas:</span>
                  <strong className="text-[var(--text-main)]">{piezasMoviles.length} configuradas</strong>
                </li>
             </ul>
          </div>

        </div>
      </div>
      <div className="h-24 w-full shrink-0"></div>
    </div>
  );
};