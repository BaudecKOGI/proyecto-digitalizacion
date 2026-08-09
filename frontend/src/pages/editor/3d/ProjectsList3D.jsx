import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Pencil, 
  Eye,
  ChevronLeft,
  ChevronRight,
  FilterX
} from 'lucide-react';
import { fetchProyectos3D, fetchCategorias } from '@/services/api';
import { ODS_LIST } from "@/pages/dashboard/digitalProjects/odsData"; 

export const ProjectsList3D = () => {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [odsFilter, setOdsFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS'); 

  const [itemsPerPage, setItemsPerPage] = useState(8); 
  const [currentPage, setCurrentPage] = useState(1);

  const hasActiveFilters = searchTerm !== '' || categoriaFilter !== '' || odsFilter !== '';

  const clearFilters = () => {
    setSearchTerm('');
    setCategoriaFilter('');
    setOdsFilter('');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data3D = await fetchProyectos3D();
        const rawProjects = Array.isArray(data3D) ? data3D : data3D?.results || [];
        setProjects(rawProjects);

        const catsData = await fetchCategorias();
        setCategorias(Array.isArray(catsData) ? catsData : catsData?.results || []);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError("No se pudieron cargar los proyectos o categorías.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoriaFilter, odsFilter, statusFilter]);

  // Filtro base (sin estado) → sirve para los contadores de las pestañas
  const baseFiltered = projects.filter(project => {
    const matchSearch = 
      project.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      project.autor_nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCategoria = categoriaFilter ? String(project.categoria) === String(categoriaFilter) : true;
    const matchOds = odsFilter ? String(project.ods) === String(odsFilter) : true;

    return matchSearch && matchCategoria && matchOds;
  });

  // Contadores para las pestañas
  const totalCount = baseFiltered.length;
  const publicadosCount = baseFiltered.filter(p => p.estado_publicacion === 'PUBLICADO').length;
  const borradoresCount = baseFiltered.filter(p => p.estado_publicacion === 'BORRADOR').length;

  // Filtro final (incluye estado)
  const filteredProjects = baseFiltered.filter(project => {
    return statusFilter === 'TODOS' ? true : project.estado_publicacion === statusFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handleEdit = (id) => {
    navigate(`/editor/3d/editar/${id}`);
  };

  const handleView = (id) => {
    navigate(`/editor/3d/detalle/${id}`);
  };

  return (
    <div className="flex flex-col gap-6 min-h-full pb-8">
      
      {/* TÍTULO PRINCIPAL */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-main)]">Gestión de Proyectos 3D</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Administra modelos 3D, tecnologías y ODS.
        </p>
      </div>

      {/* --- ENCABEZADO Y PESTAÑAS (TABS) --- */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-6 border-b border-[var(--line)] w-full sm:w-auto">
            
            {/* Todos */}
            <button 
              onClick={() => setStatusFilter('TODOS')}
              className={`pb-2 text-sm font-semibold transition-colors border-b-2 bg-transparent cursor-pointer flex items-center gap-2 ${
                statusFilter === 'TODOS' 
                  ? 'border-[var(--accent)] text-[var(--accent)]' 
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Todos los Diseños
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                statusFilter === 'TODOS' 
                  ? 'bg-[var(--accent)]/15 text-[var(--accent)]' 
                  : 'bg-[var(--bg-general)] text-[var(--text-muted)]'
              }`}>
                {totalCount}
              </span>
            </button>

            {/* Publicados */}
            <button 
              onClick={() => setStatusFilter('PUBLICADO')}
              className={`pb-2 text-sm font-semibold transition-colors border-b-2 bg-transparent cursor-pointer flex items-center gap-2 ${
                statusFilter === 'PUBLICADO' 
                  ? 'border-[var(--accent)] text-[var(--accent)]' 
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Publicados
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                statusFilter === 'PUBLICADO' 
                  ? 'bg-[var(--accent)]/15 text-[var(--accent)]' 
                  : 'bg-[var(--bg-general)] text-[var(--text-muted)]'
              }`}>
                {publicadosCount}
              </span>
            </button>

            {/* Borradores */}
            <button 
              onClick={() => setStatusFilter('BORRADOR')}
              className={`pb-2 text-sm font-semibold transition-colors border-b-2 bg-transparent cursor-pointer flex items-center gap-2 ${
                statusFilter === 'BORRADOR' 
                  ? 'border-[var(--accent)] text-[var(--accent)]' 
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Borradores
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                statusFilter === 'BORRADOR' 
                  ? 'bg-[var(--accent)]/15 text-[var(--accent)]' 
                  : 'bg-[var(--bg-general)] text-[var(--text-muted)]'
              }`}>
                {borradoresCount}
              </span>
            </button>
          </div>

          <button 
            onClick={() => navigate('/editor/3d/nuevo')}
            className="bg-[var(--accent)] hover:opacity-90 transition-opacity text-white border-none py-2 px-5 rounded-xl cursor-pointer font-bold flex items-center gap-2 shadow-sm shrink-0"
          >
            <Plus size={18} /> Nuevo Proyecto 3D
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}

      {/* --- BARRA DE FILTROS --- */}
      <div className="bg-[var(--panel)] p-3 rounded-2xl border border-[var(--line)] flex flex-col md:flex-row gap-3 items-center shadow-sm">
        
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por título o nombre del autor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
        
        <div className="w-full md:w-48 shrink-0">
          <select 
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="w-full bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <option value="">Categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-56 shrink-0">
          <select 
            value={odsFilter}
            onChange={(e) => setOdsFilter(e.target.value)}
            className="w-full bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <option value="">Objetivo ODS</option>
            {ODS_LIST?.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2.5 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] bg-[var(--bg-general)] border border-[var(--line)] hover:border-[var(--accent)] rounded-xl transition-all cursor-pointer shrink-0"
            title="Limpiar filtros"
          >
            <FilterX size={16} />
            Limpiar
          </button>
        )}
      </div>

      {/* --- GRID DE TARJETAS --- */}
      {loading ? (
        <div className="p-10 text-center text-[var(--text-muted)] animate-pulse">Cargando espectaculares proyectos 3D...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 px-5 text-center bg-[var(--panel)] border border-[var(--line)] rounded-2xl text-[var(--text-muted)]">
          No hay proyectos que coincidan con tu búsqueda.
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {currentProjects.map((project) => {
              
              let imageUrl = project.imagen_miniatura || 'https://via.placeholder.com/400x300?text=Sin+Imagen';
              if (imageUrl.startsWith('/')) {
                imageUrl = `http://localhost:8000${imageUrl}`; 
              }

              const catNombre = project.categoria_nombre || categorias.find(c => String(c.id) === String(project.categoria))?.nombre || 'Sin Cat';
              const odsDetalle = project.ods_detalle || [];

              return (
                <div key={project.id} className="bg-[var(--panel)] rounded-2xl border border-[var(--line)] overflow-hidden flex flex-col shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  
                  <div className="w-full h-[220px] bg-[var(--bg-general)] relative overflow-hidden shrink-0 group">
                    <img 
                      src={imageUrl} 
                      alt={project.titulo} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-[10px] font-extrabold tracking-wider shadow-sm backdrop-blur-md uppercase ${
                      project.estado_publicacion === 'PUBLICADO' 
                        ? 'bg-white/90 text-[var(--text-main)]' 
                        : 'bg-black/70 text-white'
                    }`}>
                      {project.estado_publicacion || 'BORRADOR'}
                    </span>
                  </div>

                  <div className="p-5 flex-grow flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[var(--accent)] border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {catNombre}
                      </span>
                    </div>

                    <div>
                      <h3 className="m-0 text-[1.1rem] text-[var(--text-main)] font-extrabold leading-tight line-clamp-1">
                        {project.titulo || 'Sin título'}
                      </h3>
                      <div className="text-[var(--text-muted)] text-[13px] mt-1.5 truncate">
                        Autor: {project.autor_nombre || 'Desconocido'} {project.ciclo && `(${project.ciclo})`}
                      </div>
                    </div>

                    {/* ODS MÚLTIPLES */}
                    <div className="mt-auto pt-2 flex flex-wrap gap-1">
                      {odsDetalle.length > 0 ? (
                        odsDetalle.slice(0, 2).map((ods) => {
                          const odsData = ODS_LIST.find(o => o.id === ods.id);
                          return (
                            <span 
                              key={ods.id}
                              className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold text-white"
                              style={{ backgroundColor: odsData?.color || '#6b7280' }}
                            >
                              ODS {ods.id}
                            </span>
                          );
                        })
                      ) : (
                        <span className="inline-block px-3 py-1.5 rounded-xl text-[11px] font-bold text-[var(--text-muted)] bg-[var(--bg-general)] border border-[var(--line)]">
                          Sin ODS
                        </span>
                      )}
                      {odsDetalle.length > 2 && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-gray-500">
                          +{odsDetalle.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border-t border-[var(--line)] bg-[var(--panel)]">
                    <button 
                      onClick={() => handleView(project.id)}
                      className="flex items-center gap-2 text-[13px] font-bold text-[var(--accent)] bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Eye size={16} /> Ver modelo
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(project.id)}
                        className="p-1.5 text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* CONTROLES DE PAGINACIÓN */}
          {filteredProjects.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 mt-6 border border-[var(--line)] bg-[var(--panel)] rounded-2xl shadow-sm">
              
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4 sm:mb-0">
                <span>Mostrar</span>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value) || filteredProjects.length);
                    setCurrentPage(1); 
                  }}
                  className="bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                >
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={20}>20</option>
                  <option value={filteredProjects.length}>Todos</option>
                </select>
                <span>proyectos</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-[var(--text-muted)]">
                  Página <span className="font-bold text-[var(--text-main)]">{currentPage}</span> de <span className="font-bold text-[var(--text-main)]">{totalPages}</span>
                  <span className="ml-2 text-xs opacity-70">({filteredProjects.length} resultados)</span>
                </span>
                
                <div className="flex gap-1">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-[var(--line)] text-[var(--text-muted)] hover:bg-[var(--bg-general)] hover:text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-[var(--line)] text-[var(--text-muted)] hover:bg-[var(--bg-general)] hover:text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

            </div>
          )}
        </>
      )}

      <div className="h-12 shrink-0 w-full"></div>
    </div>
  );
};