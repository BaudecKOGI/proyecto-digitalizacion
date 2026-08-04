import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProyectos3D } from '@/services/api';
import Navbar from '@/components/landing/navigation/PublicNavbar';
import Footer from '@/components/landing/navigation/PublicFooter';
import GalleryHero from '@/components/landing/gallery/GalleryHero';
import OdsFilterBar from '@/components/landing/gallery/OdsFilterBar';
import ProjectCard from '@/components/landing/gallery/ProjectCard';

export default function Gallery3DPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOds = searchParams.get('ods');
  const [selectedOds, setSelectedOds] = useState(initialOds ? Number(initialOds) : null);
  
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [proyectos, setProyectos] = useState([]);

  // Configuración de la galería 3D
  const config = {
    tag: "Fabricación digital",
    title: "Proyectos 3D",
    description: "Todo lo diseñado y fabricado en el Fab Lab, con su propio visor interactivo.",
    colorClass: 'text-c3d',
    bgTypeClass: 'bg-c3d',
    bgImage: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&q=80&w=1600"
  };

  const handleOdsChange = (odsId) => {
    setSelectedOds(odsId);
    if (odsId) {
      setSearchParams({ ods: odsId });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    setStatus('loading');
    window.scrollTo(0, 0);
    fetchProyectos3D(true)
      .then((data) => {
        const todosLosProyectos = Array.isArray(data) ? data : data.results || [];
        const proyectosPublicados = todosLosProyectos.filter(
          (p) => p.estado_publicacion === 'PUBLICADO'
        );
        setProyectos(proyectosPublicados);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, []);

  const filteredProyectos = selectedOds
    ? proyectos.filter((p) => Number(p.ods) === Number(selectedOds))
    : proyectos;

  const showEmptyState = status !== 'success' || filteredProyectos.length === 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      
      <GalleryHero 
        tag={config.tag}
        title={config.title}
        description={config.description}
        colorClass={config.colorClass}
        bgImage={config.bgImage}
        bgTypeClass={config.bgTypeClass}
        status={status}
        count={proyectos.length}
      />

      <main className="flex-grow pb-32">
        <OdsFilterBar 
          status={status}
          proyectos={proyectos}
          selectedOds={selectedOds}
          handleOdsChange={handleOdsChange}
          colorClass={config.colorClass}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-x-12 gap-y-16 px-[8vw]"
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
                  : selectedOds
                    ? `No hay proyectos catalogados en el ODS ${selectedOds < 10 ? '0' + selectedOds : selectedOds} para esta categoría.`
                    : 'Aún no hay proyectos publicados en esta categoría.'}
              </div>
            </>
          )}

          {status === 'success' &&
            filteredProyectos.map((p) => (
              <ProjectCard 
                key={p.id}
                proyecto={p}
                type="3d"
                colorClass={config.colorClass}
                onClick={() => window.open(`/proyecto/3d/${p.id}`, '_blank')}
              />
            ))}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}
