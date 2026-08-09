import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Code,
  GitBranch,
  Globe,
  CheckCircle2,
  X,
  Play,
  ChevronLeft,
  ChevronRight,
  FilterX
} from 'lucide-react';

import { fetchProyectosSoftwareAdmin, fetchCategorias } from "../../../services/api";
import { ODS_LIST } from "@/pages/dashboard/digitalProjects/odsData";
import VideoPlayerModal from "@/pages/dashboard/digitalProjects/VideoPlayerModal";
import ProjectDetailViewSoftware from "./ProjectDetailViewSoftware"; 

export default function ProjectsListSoftware() {
  const navigate = useNavigate();
  const location = useLocation();

  const [proyectos, setProyectos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [odsFilter, setOdsFilter] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [toastMessage, setToastMessage] = useState(null);

  const [modalVideoAbierto, setModalVideoAbierto] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const [detalleProyecto, setDetalleProyecto] = useState(
    () => location.state?.openProject || null
  );

  useEffect(() => {
    if (location.state?.message) {
      setToastMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (location.state?.openProject) {
      setDetalleProyecto(location.state.openProject);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    const loadCats = async () => {
      try {
        const catsData = await fetchCategorias();
        setCategorias(Array.isArray(catsData) ? catsData : catsData?.results || []);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    loadCats();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await fetchProyectosSoftwareAdmin({
        search: searchTerm,
        estado: statusFilter === 'TODOS' ? '' : statusFilter,
        categoria: categoriaFilter,
        ods: odsFilter
      });
      const listaProyectos = Array.isArray(data) ? data : (data?.results || []);
      setProyectos(listaProyectos);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al cargar proyectos de Django:", error);
      setProyectos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [searchTerm, statusFilter, categoriaFilter, odsFilter]);

  const handleAbrirVideo = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setModalVideoAbierto(true);
  };

  const handleCerrarVideo = () => {
    setModalVideoAbierto(false);
    setProyectoSeleccionado(null);
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setOdsFilter('');
    setCategoriaFilter('');
    setStatusFilter('TODOS');
    setCurrentPage(1);
  };

  const hayFiltrosActivos = 
    searchTerm !== '' || 
    odsFilter !== '' || 
    categoriaFilter !== '' || 
    statusFilter !== 'TODOS';

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = proyectos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(proyectos.length / itemsPerPage);

  if (detalleProyecto) {
    return (
      <ProjectDetailViewSoftware 
        proyecto={detalleProyecto} 
        onBack={() => setDetalleProyecto(null)} 
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full pb-8 relative">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-main)]">Gestión de Proyectos Digitales</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Administra proyectos digitales, repositorios, demos vivas, videos, tecnologías y ODS.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/editor/software/nuevo')}
          className="flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all cursor-pointer shadow-md shadow-[var(--accent)]/20 shrink-0"
        >
          <Plus size={18} />
          Nuevo Proyecto Digital
        </button>
      </div>

      <div className="bg-[var(--panel)] p-4 rounded-2xl border border-[var(--line)] flex flex-col sm:flex-row flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input 
            type="text" 
            placeholder="Buscar título, autor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
        
        <div className="w-full sm:w-44 shrink-0">
          <select 
            value={odsFilter}
            onChange={(e) => setOdsFilter(e.target.value)}
            className="w-full bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <option value="">Filtrar ODS</option>
            {ODS_LIST.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-44 shrink-0">
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

        <div className="w-full sm:w-40 shrink-0">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <option value="TODOS">Estado</option>
            <option value="PUBLICADO">Publicado</option>
            <option value="BORRADOR">Borrador</option>
          </select>
        </div>

        {hayFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent)] bg-[var(--bg-general)] border border-[var(--line)] hover:border-[var(--accent)] rounded-xl transition-all cursor-pointer shrink-0"
            title="Limpiar todos los filtros"
          >
            <FilterX size={16} />
            Limpiar
          </button>
        )}
      </div>

      <div className="bg-[var(--panel)] rounded-2xl border border-[var(--line)] shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[55vh] scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[var(--bg-general)] shadow-sm">
              <tr className="border-b border-[var(--line)]">
                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Proyecto & Autor</th>
                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Carrera / Categoría</th>
                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">ODS de Impacto</th>
                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Tecnologías</th>
                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Estado</th>
                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">
                    Cargando proyectos desde Django REST...
                  </td>
                </tr>
              ) : proyectos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">
                    No se encontraron proyectos registrados.
                  </td>
                </tr>
              ) : (
                currentProjects.map((proyecto) => {
                  const estado = proyecto.estado_publicacion || proyecto.estado || 'BORRADOR';
                  const odsDetalle = proyecto.ods_detalle || [];

                  return (
                    <tr key={proyecto.id} className="hover:bg-[var(--bg-general)]/40 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={() => handleAbrirVideo(proyecto)}
                            title="Haz clic para ver el video"
                            className="relative w-12 h-12 rounded-xl bg-[#0f111a] border border-[var(--line)] overflow-hidden flex items-center justify-center shrink-0 cursor-pointer hover:opacity-90 transition-all hover:scale-105 group/video"
                          >
                            {proyecto.imagen_portada ? (
                              <img src={proyecto.imagen_portada} alt={proyecto.titulo} className="w-full h-full object-cover" />
                            ) : (
                              <Code size={20} className="text-[var(--accent)]" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover/video:bg-black/30 transition-colors">
                              <div className="bg-white rounded-full p-1 shadow-sm flex items-center justify-center">
                                <Play size={14} className="text-[#0f111a] ml-0.5" fill="currentColor" />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <span className="font-bold text-[var(--text-main)] text-sm">
                              {proyecto.titulo || 'Sin título'}
                            </span>
                            <span className="text-xs text-[var(--text-muted)]">
                              Por: {proyecto.autor_nombre || 'Desconocido'} {proyecto.ciclo && `• Ciclo ${proyecto.ciclo}`}
                            </span>
                            
                            <div className="flex items-center gap-2 mt-1 text-[var(--text-muted)]">
                              {proyecto.url_repositorio && (
                                <a href={proyecto.url_repositorio} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)] transition-colors" title="Ver Git">
                                  <GitBranch size={13} />
                                </a>
                              )}
                              {proyecto.url_demo_live && (
                                <a href={proyecto.url_demo_live} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)] transition-colors" title="Ver Demo">
                                  <Globe size={13} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[var(--text-main)]">
                            {proyecto.carrera_nombre || proyecto.carrera || 'N/A'}
                          </span>
                          <span className="text-xs text-[var(--text-muted)]">
                            {proyecto.categoria_nombre || categorias.find(c => String(c.id) === String(proyecto.categoria))?.nombre || 'General'}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
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
                            <span className="text-xs text-[var(--text-muted)] italic">Sin ODS</span>
                          )}
                          {odsDetalle.length > 2 && (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-gray-500">
                              +{odsDetalle.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {Array.isArray(proyecto.tecnologias_detalle) && proyecto.tecnologias_detalle.length > 0 ? (
                            proyecto.tecnologias_detalle.map(t => (
                              <span key={t.id} className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--line)] text-[var(--text-main)] bg-[var(--bg-general)] whitespace-nowrap">
                                {t.nombre}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[var(--text-muted)] italic">-</span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          estado.toUpperCase() === 'PUBLICADO' 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {estado}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex justify-end items-center gap-1">
                          <button 
                            onClick={() => setDetalleProyecto(proyecto)}
                            className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors cursor-pointer"
                            title="Ver Detalle"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => navigate(`/editor/software/editar/${proyecto.id}`)}
                            className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors cursor-pointer"
                            title="Editar Proyecto"
                          >
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && proyectos.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-[var(--line)] bg-[var(--panel)]">
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <span>Mostrar</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value) || proyectos.length);
                  setCurrentPage(1);
                }}
                className="bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-lg px-2 py-1 focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={proyectos.length}>Todos</option>
              </select>
              <span>registros</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--text-muted)]">
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex gap-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-lg border border-[var(--line)] text-[var(--text-muted)] hover:bg-[var(--bg-general)] hover:text-[var(--text-main)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-lg border border-[var(--line)] text-[var(--text-muted)] hover:bg-[var(--bg-general)] hover:text-[var(--text-main)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={20} />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="ml-2 hover:opacity-75 transition-opacity cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <VideoPlayerModal 
        open={modalVideoAbierto} 
        onClose={handleCerrarVideo} 
        proyecto={proyectoSeleccionado} 
      />

    </div>
  );
}