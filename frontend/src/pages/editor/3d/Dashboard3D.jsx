import React, { useState, useEffect } from 'react';
import { 
  Box, Code, Eye, FileEdit, 
  Clock, ArrowRight, FolderKanban, Activity, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Importamos las funciones de tu API para traer los datos reales
import { fetchProyectos3D, fetchCategorias } from '@/services/api'; // <-- Verifica que esta ruta sea la correcta a tu api.js

export const Overview = ({ isDig }) => {
  const navigate = useNavigate();
  
  // Estados para guardar la información real
  const [stats, setStats] = useState({ total: 0, publicados: 0, borradores: 0, categorias: 0 });
  const [recientes, setRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efecto que carga los datos al entrar al Dashboard
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // Traemos proyectos y categorías de tu API
        const proyectosData = await fetchProyectos3D();
        const categoriasData = await fetchCategorias();

        // Aseguramos que sean arrays (por si tu API devuelve un objeto con .results)
        const proyectos = Array.isArray(proyectosData) ? proyectosData : proyectosData?.results || [];
        const categorias = Array.isArray(categoriasData) ? categoriasData : categoriasData?.results || [];

        // Calculamos las estadísticas
        const publicados = proyectos.filter(p => p.estado_publicacion === 'PUBLICADO').length;
        const borradores = proyectos.filter(p => p.estado_publicacion === 'BORRADOR').length;

        setStats({
          total: proyectos.length,
          publicados,
          borradores,
          categorias: categorias.length
        });

        // Tomamos solo los 3 primeros proyectos para "Actividad Reciente"
        // (Asumiendo que tu API ya los devuelve ordenados por los más nuevos)
        const ultimosTres = proyectos.slice(0, 3).map(p => {
          // Formateamos un poco la fecha si tu API la devuelve (ej: created_at)
          const fechaFormateada = p.created_at 
            ? new Date(p.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Reciente';

          return {
            id: p.id,
            titulo: p.titulo,
            estado: p.estado_publicacion,
            fecha: fechaFormateada
          };
        });

        setRecientes(ultimosTres);
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return <div className="p-8 text-[var(--text-muted)] text-center">Cargando métricas...</div>;
  }

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      
      {/* HEADER DEL DASHBOARD (Sin el botón de "Nuevo") */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--panel)] p-6 rounded-xl border border-[var(--line)] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
            <Activity className="text-[var(--accent)]" />
            Panel de Control
          </h2>
          <div className="text-sm text-[var(--text-muted)]">
            Resumen general de {isDig ? 'Desarrollo de Software' : 'Fabricación Digital y Modelado 3D'}
          </div>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS CON DATOS REALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Proyectos */}
        <div className="bg-[var(--panel)] p-5 rounded-xl border border-[var(--line)] flex items-center gap-4 hover:border-[var(--accent)] transition-colors">
          <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
            {isDig ? <Code size={24} /> : <Box size={24} />}
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Proyectos</div>
            <div className="text-2xl font-black text-[var(--text-main)]">{stats.total}</div>
          </div>
        </div>

        {/* Publicados */}
        <div className="bg-[var(--panel)] p-5 rounded-xl border border-[var(--line)] flex items-center gap-4 hover:border-emerald-500 transition-colors">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Eye size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Publicados</div>
            <div className="text-2xl font-black text-[var(--text-main)]">{stats.publicados}</div>
          </div>
        </div>

        {/* Borradores */}
        <div className="bg-[var(--panel)] p-5 rounded-xl border border-[var(--line)] flex items-center gap-4 hover:border-amber-500 transition-colors">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <FileEdit size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">En Borrador</div>
            <div className="text-2xl font-black text-[var(--text-main)]">{stats.borradores}</div>
          </div>
        </div>

        {/* Categorías Reales */}
        <div className="bg-[var(--panel)] p-5 rounded-xl border border-[var(--line)] flex items-center gap-4 hover:border-blue-500 transition-colors">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <FolderKanban size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Categorías</div>
            <div className="text-2xl font-black text-[var(--text-main)]">{stats.categorias}</div>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Actividad Reciente */}
        <div className="lg:col-span-2 bg-[var(--panel)] rounded-xl border border-[var(--line)] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[var(--line)] flex justify-between items-center bg-[var(--bg-general)]/50">
            <h3 className="font-bold text-[var(--text-main)] flex items-center gap-2">
              <Clock size={18} className="text-[var(--text-muted)]" />
              Proyectos Recientes
            </h3>
            <button 
              onClick={() => navigate('/editor/3d/proyectos')}
              className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight size={12} />
            </button>
          </div>
          
          <div className="p-2">
            {recientes.length === 0 ? (
              <div className="p-6 text-center text-sm text-[var(--text-muted)]">
                Aún no tienes proyectos creados.
              </div>
            ) : (
              recientes.map((proyecto) => (
                <div 
                  key={proyecto.id} 
                  className="flex items-center justify-between p-3 mx-2 my-1 rounded-lg hover:bg-[var(--bg-general)] transition-colors group cursor-pointer"
                  onClick={() => navigate(`/editor/3d/editar/${proyecto.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-[var(--bg-general)] border border-[var(--line)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors">
                      {isDig ? <Code size={20} /> : <Box size={20} />}
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-main)] text-sm">{proyecto.titulo}</div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">{proyecto.fecha}</div>
                    </div>
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      proyecto.estado === 'PUBLICADO' 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {proyecto.estado}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna Derecha: Accesos (Ahora funcionan los botones) */}
        <div className="bg-[var(--panel)] rounded-xl border border-[var(--line)] flex flex-col h-max">
          <div className="p-5 border-b border-[var(--line)] bg-[var(--bg-general)]/50">
            <h3 className="font-bold text-[var(--text-main)] flex items-center gap-2">
              <Activity size={18} className="text-[var(--text-muted)]" />
              Accesos
            </h3>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <p className="text-sm text-[var(--text-muted)]">
              Acciones rápidas para gestionar tu portafolio 3D.
            </p>
            
            <div className="flex flex-col gap-3 mt-2">
              {/* Botón 1: Redirige a crear un nuevo proyecto */}
              <button 
                onClick={() => navigate('/editor/3d/nuevo')}
                className="w-full text-left px-4 py-3 rounded-lg border border-[var(--line)] bg-[var(--bg-general)] text-sm font-bold text-[var(--text-main)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors flex justify-between items-center group cursor-pointer"
              >
                Subir nuevo proyecto 3D
                <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
              </button>
              
              {/* Botón 2: Redirige a la página pública (Ajusta '/galeria' si tu ruta pública es diferente) */}
              <button 
                onClick={() => navigate('/galeria')} // <--- CAMBIA ESTA RUTA POR LA DE TU PÁGINA PÚBLICA
                className="w-full text-left px-4 py-3 rounded-lg border border-[var(--line)] bg-[var(--bg-general)] text-sm font-bold text-[var(--text-main)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors flex justify-between items-center group cursor-pointer"
              >
                Ver Galería Pública
                <ExternalLink size={16} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};