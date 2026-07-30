import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, User, Folder, GraduationCap } from 'lucide-react';
import { fetchProyectos3D, fetchProyectosSoftware } from '@/services/api';

export const ProjectsList3D = ({ mode = "3d" }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = mode === "dig" ? await fetchProyectosSoftware() : await fetchProyectos3D();
        const rawProjects = Array.isArray(data) ? data : data?.results || [];
        setProjects(rawProjects);
      } catch (err) {
        console.error("Error al cargar los proyectos:", err);
        setError("No se pudieron cargar los proyectos.");
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [mode]);

  const handleEdit = (id) => {
    if (mode === "dig") {
      navigate(`/editor/software/editar/${id}`);
    } else {
      navigate(`/editor/3d/editar/${id}`);
    }
  };

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--text-main)]">
            {mode === "dig" ? "Todos los proyectos Digitales" : "Todos los proyectos 3D"}
          </h2>
          <div className="text-[var(--text-muted)] mt-1">
            {mode === "dig"
              ? "Administra el inventario de tus proyectos digitales (Solo lectura y edición)."
              : "Administra el inventario de tus diseños 3D (Solo lectura y edición)."}
          </div>
        </div>
        <button 
          onClick={() => navigate(mode === "dig" ? '/editor/software/nuevo' : '/editor/3d/nuevo')}
          className="bg-[var(--accent)] hover:opacity-90 transition-opacity text-white border-none py-2.5 px-4 rounded-lg cursor-pointer font-bold flex items-center gap-2"
        >
          {mode === "dig" ? "+ Nuevo Proyecto Digital" : "+ Nuevo Proyecto 3D"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 border border-red-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center text-[var(--text-muted)]">Cargando espectaculares proyectos 3D...</div>
      ) : projects.length === 0 ? (
        <div className="py-16 px-5 text-center bg-[var(--panel)] border border-[var(--line)] rounded-xl text-[var(--text-muted)]">
          No hay proyectos registrados aún. ¡Anímate a crear el primero!
        </div>
      ) : (
        /* GRID DE TARJETAS */
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {projects.map((project) => {
            
            let imageUrl = project.imagen_miniatura || 'https://via.placeholder.com/400x250?text=Sin+Imagen';

            if (imageUrl.startsWith('/')) {
              imageUrl = `http://localhost:8000${imageUrl}`; 
            }

            return (
              <div key={project.id} className="bg-[var(--panel)] rounded-xl border border-[var(--line)] overflow-hidden flex flex-col shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md h-[420px]">
                
                {/* Imagen del Proyecto */}
                <div className="w-full h-[200px] bg-[var(--bg-general)] relative overflow-hidden shrink-0">
                  <img 
                    src={imageUrl} 
                    alt={project.titulo} 
                    className="w-full h-full object-cover object-center block"
                  />
                  {/* Etiqueta flotante de estado */}
                  <span className="absolute top-3 right-3 bg-[var(--panel)] px-2 py-1 rounded-full text-xs font-bold text-[var(--text-main)] shadow-sm">
                    {project.estado_publicacion || 'Publicado'}
                  </span>
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-5 flex-grow flex flex-col justify-between overflow-hidden">
                  <div>
                    <h3 className="m-0 text-lg text-[var(--text-main)] font-semibold leading-tight line-clamp-2 h-[2.8rem] overflow-hidden">
                      {project.titulo || 'Sin título'}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-sm mt-2 truncate">
                      <User size={16} className="shrink-0" />
                      <span className="truncate">{project.autor_nombre || 'Autor desconocido'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-auto pt-2">
                    {project.categoria_nombre && (
                      <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[12px] bg-[var(--bg-general)] px-2 py-1 rounded-md w-fit max-w-full truncate">
                        <Folder size={14} className="shrink-0" />
                        <span className="truncate">{project.categoria_nombre}</span>
                      </div>
                    )}
                    {project.carrera && (
                      <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[12px] bg-[var(--bg-general)] px-2 py-1 rounded-md w-fit max-w-full truncate">
                        <GraduationCap size={14} className="shrink-0" />
                        <span className="truncate">{project.carrera}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón de Acción (Solo Editar) */}
                <div className="flex border-t border-[var(--line)] bg-[var(--bg-general)]">
                  <button 
                    onClick={() => handleEdit(project.id)}
                    className="flex-1 p-3.5 border-none bg-transparent cursor-pointer flex items-center justify-center gap-2 text-[var(--accent)] font-semibold transition-colors hover:bg-[var(--accent-dim)]"
                  >
                    <Pencil size={18} /> Editar Proyecto
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};