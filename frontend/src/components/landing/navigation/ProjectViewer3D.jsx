import React, { Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useFBX, Html } from '@react-three/drei';

// Componente para cargar el modelo y aplicar manipulación directa con el mouse
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

      // ¡AQUÍ ESTÁ LA CORRECCIÓN! Leemos si se debe invertir el giro
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

  // Función para buscar el nombre en el objeto tocado o en sus "padres" (Grupos)
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
      
      // Si no lo encuentra, sube un nivel al grupo padre
      nodoActual = nodoActual.parent;
    }
    return null;
  };

  const onPointerDown = (e) => {
    const resultado = encontrarConfiguracionDePieza(e.object);

    if (resultado) {
      // Detenemos el evento para que OrbitControls no mueva toda la escena
      e.stopPropagation(); 
      setHabilitarCamara(false); 
      
      dragRef.current = {
        mesh: resultado.mesh, // Rotamos el grupo/malla correcto
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

const CanvasLoader = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-muted/20 border-t-c3d"
        />
        <p className="mt-4 whitespace-nowrap font-sans text-[11px] font-bold uppercase tracking-widest text-c3d">
          Cargando Entorno 3D...
        </p>
      </div>
    </Html>
  );
};

export default function ProjectViewer3D({ project }) {
  const [habilitarCamara, setHabilitarCamara] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (project && project.id) {
      setLikesCount(project.likes_totales || 0);
      setSharesCount(project.compartidos_totales || 0);
      setViewsCount((project.vistas_totales || 0) + 1);
      setLiked(false);
      setCopied(false);

      // Registrar visita en el backend automáticamente al abrir el proyecto
      fetch(`http://127.0.0.1:8000/api/metricas/por-proyecto/${project.id}/view/`, {
        method: 'POST',
      }).catch(() => {});
    }
  }, [project]);

  const handleLike = () => {
    if (!project || liked) return;
    setLiked(true);
    setLikesCount((prev) => prev + 1);
    fetch(`http://127.0.0.1:8000/api/metricas/por-proyecto/${project.id}/like/`, {
      method: 'POST',
    }).catch(() => {});
  };

  const handleShare = () => {
    if (!project) return;
    setSharesCount((prev) => prev + 1);
    const url = window.location.href;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    fetch(`http://127.0.0.1:8000/api/metricas/por-proyecto/${project.id}/share/`, {
      method: 'POST',
    }).catch(() => {});
  };

  // 1. Extraemos tanto las piezas móviles como la cámara de forma segura
  let piezasMoviles = [];
  let camaraConfig = null;

  if (project?.configuracion_interactiva) {
    if (Array.isArray(project.configuracion_interactiva)) {
      piezasMoviles = project.configuracion_interactiva;
    } else {
      piezasMoviles = project.configuracion_interactiva.piezas_moviles || [];
      camaraConfig = project.configuracion_interactiva.camara || null;
    }
  }

  // 2. Configuramos las variables de cámara (con valores por defecto si no existen)
  const posicionCamara = camaraConfig?.posicion_inicial || [0, 2, 5];
  const targetCamara = camaraConfig?.target || [0, 0, 0];
  const minZoom = camaraConfig?.limites_zoom?.[0] ?? 1;
  const maxZoom = camaraConfig?.limites_zoom?.[1] ?? 10;
  // Si tenemos config de cámara en el JSON, evitamos que <Stage> la sobreescriba
  const autoAjustarCamara = !camaraConfig;

  const screenVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98,
      transition: { duration: 0.4, ease: "easeIn" }
    }
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          variants={screenVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[300] flex flex-col bg-bg overflow-hidden"
        >


          {/* PANEL LATERAL ELEGANTE (Presentación del Proyecto) */}
          <div className="absolute left-8 top-1/2 z-20 flex w-80 -translate-y-1/2 flex-col gap-4 rounded-2xl bg-panel/80 p-8 backdrop-blur-xl shadow-2xl border border-line pointer-events-auto">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-text leading-tight mb-2">
                {project.titulo}
              </h2>
              <div className="font-sans text-[12px] font-bold uppercase tracking-widest text-c3d mb-1">
                {project.autor_nombre}
              </div>
              <div className="font-sans text-[11px] uppercase tracking-widest text-muted">
                {project.carrera} <span className="mx-1">•</span> Ciclo {project.ciclo}
              </div>
            </div>
            
            {/* BARRA INTERACTIVA DE ACCIONES Y MÉTRICAS (LIKE, COMPARTIR, VISTAS) */}
            <div className="flex items-center justify-between gap-2 border-y border-line py-3 my-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  disabled={liked}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-wider transition-all ${
                    liked
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-bg/60 text-text hover:bg-rose-500/10 hover:text-rose-400 border border-line'
                  }`}
                  title="Dar Me Gusta a este proyecto"
                >
                  <span className="text-sm">{liked ? '♥' : '♡'}</span>
                  <span>{likesCount}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="relative flex items-center gap-1.5 rounded-lg bg-bg/60 px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-text border border-line transition-all hover:bg-c3d/10 hover:text-c3d hover:border-c3d/40"
                  title="Compartir proyecto y copiar enlace"
                >
                  <span className="text-sm">⎘</span>
                  <span>{copied ? '¡Copiado!' : 'Compartir'}</span>
                  {sharesCount > 0 && <span className="text-muted font-normal">({sharesCount})</span>}
                </button>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted" title="Vistas registradas">
                <span>👁</span>
                <span className="font-bold">{viewsCount}</span>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[30vh] pr-2 custom-scrollbar">
              <p className="font-sans text-[14px] leading-relaxed text-text whitespace-pre-wrap">
                {project.descripcion}
              </p>
            </div>

            {/* SECCIÓN NUEVA: Indicador visual de piezas interactivas */}
            {piezasMoviles.length > 0 && (
              <div className="mt-2 rounded-xl bg-bg/50 p-4 border border-line">
                <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest text-c3d mb-3 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-c3d opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-c3d"></span>
                  </span>
                  Piezas Interactivas
                </h3>
                <ul className="flex flex-col gap-2">
                  {piezasMoviles.map((pieza, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[12px] text-text/80 capitalize">
                      <span className="text-c3d">▸</span>
                      Arrastra: <span className="font-semibold">{pieza.etiqueta || pieza.nombre_objeto.replace(/_/g, ' ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* VISOR 3D o VISTA PREVIA SOFTWARE */}
          <div className="flex-1 relative z-0 flex items-center justify-center bg-bg/90">
            {project.archivo_fbx ? (
              <Canvas shadows camera={{ position: posicionCamara, fov: 50 }}>
                <color attach="background" args={['var(--bg)']} />
                
                <Suspense fallback={<CanvasLoader />}>
                  <Stage environment="city" intensity={0.6} adjustCamera={autoAjustarCamara}>
                    <FBXModel 
                      url={project.archivo_fbx} 
                      piezasMoviles={piezasMoviles}
                      setHabilitarCamara={setHabilitarCamara}
                    />
                  </Stage>
                </Suspense>
                
                <OrbitControls 
                  makeDefault 
                  enabled={habilitarCamara}
                  target={targetCamara}
                  minDistance={minZoom}
                  maxDistance={maxZoom}
                  minPolarAngle={Math.PI / 4} 
                  maxPolarAngle={Math.PI / 1.5} 
                />
              </Canvas>
            ) : project.archivo_video ? (
              <video
                src={project.archivo_video}
                controls
                autoPlay
                className="max-h-[80vh] max-w-[70vw] rounded-xl shadow-2xl border border-line"
              />
            ) : (
              <img
                src={project.imagen_portada}
                alt={project.titulo}
                className="max-h-[80vh] max-w-[70vw] rounded-xl shadow-2xl object-contain border border-line"
              />
            )}
          </div>

          {/* INSTRUCCIONES INFERIORES */}
          <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full bg-panel/80 px-6 py-3 backdrop-blur-md shadow-lg pointer-events-none">
            <svg className="h-5 w-5 text-c3d" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-text">
              {project.archivo_fbx
                ? "Pasa el mouse y arrastra las piezas para interactuar • Usa la rueda para hacer zoom"
                : "Vista previa interactiva del proyecto • Usa la barra de control inferior para explorar"}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}