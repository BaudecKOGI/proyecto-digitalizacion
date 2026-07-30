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
  Play 
} from 'lucide-react';

// Importamos la API y los ODS para formatear sus etiquetas
import { fetchProyectosSoftwareAdmin, fetchCategorias } from "../../../services/api";
import { ODS_LIST } from "@/pages/dashboard/digitalProjects/odsData";

// IMPORTACIÓN DE TU MODAL REUTILIZABLE
import VideoPlayerModal from "@/pages/dashboard/digitalProjects/VideoPlayerModal";

// NUEVO: Importamos la vista de detalle
import ProjectDetailViewSoftware from "./ProjectDetailViewSoftware"; 

export default function ProjectsListSoftware() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados para la data
  const [proyectos, setProyectos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [odsFilter, setOdsFilter] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  // Estado para la notificación flotante (Toast)
  const [toastMessage, setToastMessage] = useState(null);

  // ESTADOS PARA EL MODAL DE VIDEO
  const [modalVideoAbierto, setModalVideoAbierto] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  // NUEVO: Estado para saber qué proyecto se está viendo en detalle
  const [detalleProyecto, setDetalleProyecto] = useState(null);

  // Capturar mensaje enviado por redirección (ej. de crear o editar)
  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Cargar Categorías
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

  // Cargar lista de proyectos desde Django REST Framework
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

  // FUNCIONES PARA EL MODAL DE VIDEO
  const handleAbrirVideo = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setModalVideoAbierto(true);
  };

  const handleCerrarVideo = () => {
    setModalVideoAbierto(false);
    setProyectoSeleccionado(null);
  };

  // NUEVO: Si hay un proyecto en "detalleProyecto", renderizamos esa vista en lugar de la tabla
  if (detalleProyecto) {
    return (
      <ProjectDetailViewSoftware 
        proyecto={detalleProyecto} 
        onBack={() => setDetalleProyecto(null)} 
      />
    );
  }

  // SI NO HAY PROYECTO SELECCIONADO, SE RENDERIZA LA LISTA NORMAL
  return (
    <div className="flex flex-col gap-6 h-full pb-8 relative">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-main)]">Gestión de Proyectos Software</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Administra proyectos de software, repositorios, demos vivas, videos, tecnologías y ODS.
          </p>
        </div>
        
        {/* BOTÓN NUEVO PROYECTO */}
        <button 
          onClick={() => navigate('/editor/software/nuevo')}
          className="flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all cursor-pointer shadow-md shadow-[var(--accent)]/20"
        >
          <Plus size={18} />
          Nuevo Proyecto Software
        </button>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="bg-[var(--panel)] p-4 rounded-2xl border border-[var(--line)] grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        
        {/* Buscador */}
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por título, autor o carrera..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
        
        {/* Filtrar ODS */}
        <div>
          <select 
            value={odsFilter}
            onChange={(e) => setOdsFilter(e.target.value)}
            className="w-full bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <option value="">Filtrar ODS</option>
            {ODS_LIST.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Filtrar Categoría */}
        <div>
          <select 
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="w-full bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <option value="">Categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        {/* Filtrar Estado */}
        <div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <option value="TODOS">Estado</option>
            <option value="PUBLICADO">Publicado</option>
            <option value="BORRADOR">Borrador</option>
          </select>
        </div>

      </div>

      {/* TABLA DE PROYECTOS */}
      <div className="bg-[var(--panel)] rounded-2xl border border-[var(--line)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-general)]/50 border-b border-[var(--line)]">
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
                proyectos.map((proyecto) => {
                  const estado = proyecto.estado_publicacion || proyecto.estado || 'BORRADOR';
                  const odsObj = ODS_LIST.find(o => String(o.id) === String(proyecto.ods));
                  
                  return (
                    <tr key={proyecto.id} className="hover:bg-[var(--bg-general)]/40 transition-colors group">
                      
                      {/* PROYECTO & AUTOR */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          
                          {/* CONTENEDOR DE LA IMAGEN CON ICONO PLAY Y ONCLICK PARA EL MODAL */}
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
                            
                            {/* Overlay e Icono de Play estilo imagen de referencia */}
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
                            
                            {/* Iconos de Enlaces */}
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

                      {/* CARRERA / CATEGORÍA */}
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[var(--text-main)]">
                            {proyecto.carrera || 'N/A'}
                          </span>
                          <span className="text-xs text-[var(--text-muted)]">
                            {proyecto.categoria_nombre || categorias.find(c => String(c.id) === String(proyecto.categoria))?.nombre || 'General'}
                          </span>
                        </div>
                      </td>

                      {/* ODS DE IMPACTO */}
                      <td className="p-4">
                        {odsObj ? (
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold text-white bg-[#a21942]">
                            {odsObj.label}
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--text-muted)] italic">No especificado</span>
                        )}
                      </td>

                      {/* TECNOLOGÍAS */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {Array.isArray(proyecto.tecnologias_detalle) && proyecto.tecnologias_detalle.length > 0 ? (
                            proyecto.tecnologias_detalle.map(t => (
                              <span key={t.id} className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--line)] text-[var(--text-main)] bg-[var(--bg-general)]">
                                {t.nombre}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[var(--text-muted)] italic">-</span>
                          )}
                        </div>
                      </td>

                      {/* ESTADO */}
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          estado.toUpperCase() === 'PUBLICADO' 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {estado}
                        </span>
                      </td>

                      {/* ACCIONES */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end items-center gap-1">
                          
                          {/* MODIFICADO: Ver Detalle ahora actualiza el estado local */}
                          <button 
                            onClick={() => setDetalleProyecto(proyecto)}
                            className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors cursor-pointer"
                            title="Ver Detalle"
                          >
                            <Eye size={18} />
                          </button>

                          {/* Editar */}
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
      </div>

      {/* MENSAJE FLOTANTE (TOAST) */}
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

      {/* COMPONENTE DEL MODAL DE VIDEO REUTILIZADO */}
      <VideoPlayerModal 
        open={modalVideoAbierto} 
        onClose={handleCerrarVideo} 
        proyecto={proyectoSeleccionado} 
      />

    </div>
  );
}