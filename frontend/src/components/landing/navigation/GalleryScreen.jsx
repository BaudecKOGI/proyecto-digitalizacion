import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectViewer3D from './ProjectViewer3D';

/**
 * Modal de pantalla completa para listar proyectos de una categoría.
 */
export default function GalleryScreen({
  id,
  active,
  onClose,
  type,
  fetchFn,
  tag,
  title,
  description,
}) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [proyectos, setProyectos] = useState([]);
  
  // Estado para controlar qué proyecto 3D está abierto en el visor
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const colorClass = type === '3d' ? 'text-c3d' : 'text-cdig';
  const bgHoverClass = type === '3d' ? 'hover:border-c3d hover:shadow-md' : 'hover:border-cdig hover:shadow-md';

  useEffect(() => {
    if (!active || status !== 'idle') return;
    setStatus('loading');
    fetchFn()
      .then((data) => {
        // 1. Obtenemos el arreglo de proyectos original
        const todosLosProyectos = Array.isArray(data) ? data : data.results || [];
        
        // 2. Filtramos para guardar en el estado SOLAMENTE los publicados
        const proyectosPublicados = todosLosProyectos.filter(
          (p) => p.estado_publicacion === 'PUBLICADO'
        );
        
        setProyectos(proyectosPublicados);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [active, status, fetchFn]);

  const showEmptyState = status !== 'success' || proyectos.length === 0;

  const modalVariants = {
    hidden: { opacity: 0, y: "100%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
      opacity: 0,
      y: "100%",
      transition: { duration: 0.4, ease: "easeIn" }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          id={id}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[200] overflow-y-auto bg-bg"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between bg-bg/90 px-[8vw] py-8 backdrop-blur-md">
            <div className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-text">FAB LAB REPOSITORY</div>
            <button
              onClick={onClose}
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-panel text-text transition-all hover:bg-line"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>
          </div>

          <div className="px-[8vw] pb-12 pt-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`mb-6 font-sans text-[11px] font-extrabold uppercase tracking-[0.2em] ${colorClass}`}
            >
              {tag}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl font-display text-[clamp(40px,5vw,64px)] font-bold leading-[1.05] tracking-tight text-text"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted"
            >
              {description}
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-x-12 gap-y-16 px-[8vw] pb-32"
          >
            {status === 'loading' && (
              <div className="col-span-full py-24 text-center font-sans text-[11px] font-bold uppercase tracking-widest text-muted">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Sincronizando proyectos...
                </motion.div>
              </div>
            )}

            {showEmptyState && status !== 'loading' && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div variants={itemVariants} key={i} className="flex aspect-[4/3] w-full items-center justify-center bg-panel">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    >
                      <svg className="opacity-10" width="34" height="34" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </motion.div>
                  </motion.div>
                ))}
                <div className="col-span-full py-12 text-center font-sans text-[13px] font-semibold text-muted">
                  {status === 'error'
                    ? 'Error de conexión con el repositorio principal.'
                    : 'Aún no hay proyectos publicados en esta categoría.'}
                </div>
              </>
            )}

            {status === 'success' &&
              proyectos.map((p) => (
                <motion.div
                  variants={itemVariants}
                  key={p.id}
                  className="group cursor-pointer"
                  onClick={() => {
                    // Al hacer clic, si es la galería 3D, abrimos el visor
                    if (type === '3d') {
                      setProyectoSeleccionado(p);
                    }
                  }}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-panel mb-6">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                      style={{ backgroundImage: `url(${type === '3d' ? p.imagen_miniatura : p.imagen_portada || ''})` }}
                    />
                  </div>
                  <div>
                    <h3 className={`font-display text-2xl font-bold text-text transition-colors ${type === '3d' ? 'group-hover:text-c3d' : 'group-hover:text-cdig'}`}>
                      {p.titulo}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-widest text-muted">
                      <span>{p.autor_nombre}</span>
                      <span className="h-1 w-1 rounded-full bg-muted/50"></span>
                      <span>{p.carrera}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </motion.div>
      )}

      {/* Visor 3D que se sobrepone a la galería */}
      <ProjectViewer3D 
        project={proyectoSeleccionado} 
        onClose={() => setProyectoSeleccionado(null)} 
      />
    </AnimatePresence>
  );
}