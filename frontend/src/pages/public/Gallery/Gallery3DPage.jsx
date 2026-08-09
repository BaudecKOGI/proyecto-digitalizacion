import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProyectos3D } from '@/services/api';
import GalleryHero from '@/components/landing/gallery/GalleryHero';
import GalleryFilters from '@/components/landing/gallery/GalleryFilters';
import ProjectCard from '@/components/landing/gallery/ProjectCard';
import Pagination from '@/components/landing/gallery/Pagination';

export default function Gallery3DPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse comma-separated list of ODS IDs from URL or default to empty array
  const initialOds = searchParams.get('ods');
  const [selectedOds, setSelectedOds] = useState(
    initialOds ? initialOds.split(',').map(Number).filter(n => !isNaN(n)) : []
  );

  // Parse comma-separated list of Categories from URL or default to empty array
  const initialCat = searchParams.get('cat');
  const [selectedCategory, setSelectedCategory] = useState(
    initialCat ? initialCat.split(',') : []
  );

  const [searchQuery, setSearchQuery] = useState('');

  const initialPage = parseInt(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [status, setStatus] = useState('idle');
  const [proyectos, setProyectos] = useState([]);

  // Configuración de la galería 3D
  const config = {
    tag: "Fabricación digital",
    title: "Modelos 3D",
    description: "Todo lo diseñado y fabricado en el Fab Lab, con su propio visor interactivo.",
    colorClass: 'text-[#6802C1]',
    bgTypeClass: 'bg-[#6802C1]',
    bgImage: "/assets/brazo-3D.png"
  };

  const updateURLParams = (newOdsArray, newCatArray, resetPage = true) => {
    const params = new URLSearchParams(searchParams);

    if (newOdsArray && newOdsArray.length > 0) {
      params.set('ods', newOdsArray.join(','));
    } else {
      params.delete('ods');
    }

    if (newCatArray && newCatArray.length > 0) {
      params.set('cat', newCatArray.join(','));
    } else {
      params.delete('cat');
    }

    if (resetPage) {
      params.delete('page');
      setCurrentPage(1);
    }

    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set('page', page);
    } else {
      params.delete('page');
    }
    setSearchParams(params);
  };

  const handleOdsChange = (odsArray) => {
    setSelectedOds(odsArray);
    updateURLParams(odsArray, selectedCategory);
  };

  const handleCategoryChange = (catArray) => {
    setSelectedCategory(catArray);
    updateURLParams(selectedOds, catArray);
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

  const filteredProyectos = proyectos.filter((p) => {
    // 1. Filtro ODS
    if (selectedOds.length > 0) {
      const projectOdsIds = p.ods_detalle?.map(o => Number(o.id)) || (Array.isArray(p.ods) ? p.ods.map(Number) : [Number(p.ods)]);
      const hasMatch = projectOdsIds.some(id => selectedOds.includes(id));
      if (!hasMatch) return false;
    }

    // 2. Filtro Categoría
    if (selectedCategory.length > 0 && !selectedCategory.includes(p.categoria_nombre)) return false;

    // 3. Filtro Búsqueda (título, categoría y ODS)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = p.titulo?.toLowerCase().includes(query);
      const matchesCategory = p.categoria_nombre?.toLowerCase().includes(query);
      const projectOdsItems = p.ods_detalle || [];
      const matchesOds = projectOdsItems.some(o => {
        const matchesOdsNumber = `ods ${o.id}`.includes(query) || String(o.id) === query;
        const matchesOdsLabel = o.label?.toLowerCase().includes(query);
        return matchesOdsNumber || matchesOdsLabel;
      });
      if (!matchesTitle && !matchesCategory && !matchesOds) return false;
    }

    return true;
  });

  const showEmptyState = status !== 'success' || filteredProyectos.length === 0;

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(filteredProyectos.length / ITEMS_PER_PAGE);
  const paginatedProyectos = filteredProyectos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (currentPage !== 1) {
      handlePageChange(1);
    }
  };

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
    <div className="w-full bg-bg flex flex-col">
      <GalleryHero
        tag={config.tag}
        title={config.title}
        description={config.description}
        colorClass={config.colorClass}
        bgImage={config.bgImage}
        bgTypeClass={config.bgTypeClass}
        status={status}
      />

      <main className="flex-grow pb-32 pt-8">
        <GalleryFilters
          status={status}
          proyectos={proyectos}
          selectedOds={selectedOds}
          handleOdsChange={handleOdsChange}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          colorClass={config.colorClass}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-x-5 gap-y-8"
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
                {/* Contenedor para centrar los 3 cuadros en pantallas grandes */}
                <div className="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
                  {[0, 1, 2].map((i) => (
                    <motion.div variants={itemVariants} key={i} className="flex aspect-[4/3] w-full items-center justify-center bg-panel rounded-2xl">
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
                </div>

                {/* Contenedor del texto centrado */}
                <div className="col-span-full py-12 text-center font-sans text-[13px] font-semibold text-muted">
                  {status === 'error'
                    ? 'Error de conexión con el repositorio principal.'
                    : (selectedOds.length > 0 || selectedCategory.length > 0)
                      ? 'No hay proyectos catalogados que coincidan con estos filtros de ODS y Categoría.'
                      : 'Aún no hay proyectos publicados.'}
                </div>
              </>
            )}

            {status === 'success' &&
              paginatedProyectos.map((p) => (
                <ProjectCard
                  key={p.id}
                  proyecto={p}
                  type="3d"
                  colorClass={config.colorClass}
                  onClick={() => window.open(`/proyecto/3d/${p.id}`, '_blank')}
                />
              ))}
          </motion.div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </GalleryFilters>
      </main>
    </div>
  );
}
