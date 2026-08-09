import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Code, 
  GitBranch, 
  ExternalLink,
  Info,
  Upload,
  Video,
  X
} from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { fetchCategorias, fetchTecnologias, fetchCarreras, createProyectoSoftware } from '@/services/api';
import { ODS_LIST } from "@/pages/dashboard/digitalProjects/odsData";

import { MultiSelectODS } from '@/components/editor/MultiSelectODS';

export default function NewProjectSoftware() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [categorias, setCategorias] = useState([]);
  const [tecnologias, setTecnologias] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    estado_publicacion: 'BORRADOR',
    descripcion: '',
    autor_nombre: '',
    carrera: '',   // ID de carrera
    ciclo: '',     // número de ciclo
    categoria: '',
    ods_ids: [],
    url_repositorio: '',
    url_demo_live: '',
    tecnologias: []
  });

  const [archivoPortada, setArchivoPortada] = useState(null);
  const [archivoVideo, setArchivoVideo] = useState(null);
  const [imagenUrl, setImagenUrl] = useState(null);

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsData, techsData, carrerasData] = await Promise.all([
          fetchCategorias(),
          fetchTecnologias(),
          fetchCarreras('activo=true')
        ]);
        setCategorias(Array.isArray(catsData) ? catsData : catsData?.results || []);
        setTecnologias(Array.isArray(techsData) ? techsData : techsData?.results || []);
        setCarreras(Array.isArray(carrerasData) ? carrerasData : carrerasData?.results || []);
      } catch (err) {
        console.error("Error cargando listas:", err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (archivoPortada) {
      const url = URL.createObjectURL(archivoPortada);
      setImagenUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagenUrl(null);
    }
  }, [archivoPortada]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTechChange = (techId) => {
    setFormData(prev => {
      const current = prev.tecnologias;
      const exists = current.includes(techId);
      if (exists) {
        return { ...prev, tecnologias: current.filter(id => id !== techId) };
      } else {
        return { ...prev, tecnologias: [...current, techId] };
      }
    });
  };

  const toRoman = (num) => {
    const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return romanos[num - 1] || num;
  };

  const carreraSeleccionada = carreras.find(c => String(c.id) === String(formData.carrera));
  const duracionCiclos = carreraSeleccionada ? carreraSeleccionada.duracion_ciclos : 0;

  const renderSelectedODS = () => {
    if (!formData.ods_ids || formData.ods_ids.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {formData.ods_ids.map(id => {
          const ods = ODS_LIST.find(o => o.id === id);
          if (!ods) return null;
          return (
            <span 
              key={id}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: ods.color || '#6b7280' }}
            >
              ODS {id}
            </span>
          );
        })}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tecnologias') {
          formData.tecnologias.forEach(id => data.append('tecnologias', id));
        } else if (key === 'ods_ids') {
          if (formData.ods_ids && formData.ods_ids.length > 0) {
            data.append('ods_ids', JSON.stringify(formData.ods_ids));
          }
        } else if (key === 'carrera' || key === 'ciclo') {
          if (formData[key]) data.append(key, formData[key]);
        } else if (formData[key] !== '' && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      if (user?.id) data.append('creado_por', user.id);
      
      if (archivoPortada) data.append('imagen_portada', archivoPortada);
      if (archivoVideo) data.append('archivo_video', archivoVideo);

      await createProyectoSoftware(data);
      navigate('/editor/software/proyectos');
    } catch (err) {
      console.error("Error al guardar:", err);
      setError(err.message || "Error al registrar el proyecto. Revisa la consola o los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      
      {/* BARRA SUPERIOR */}
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/editor/software/proyectos')}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span>Volver a la lista</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 flex items-center gap-3">
          <Info size={20} />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[7fr_3fr] gap-8 items-start">
        
        {/* FORMULARIO */}
        <div className="bg-[var(--panel)] p-6 md:p-10 rounded-2xl border border-[var(--line)] shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-main)]">Crear Nuevo Proyecto de Software</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Completa la información técnica, repositorio, demo y multimedia del proyecto.
            </p>
          </div>

          <form className="flex flex-col gap-8" id="project-form" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-main)]">Título del Proyecto *</label>
                <input 
                  type="text" name="titulo" value={formData.titulo} onChange={handleChange}
                  placeholder="Ej. Sistema de Gestión de Inventarios"
                  className="bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors w-full"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-main)]">Estado de Publicación</label>
                <select 
                  name="estado_publicacion" value={formData.estado_publicacion} onChange={handleChange}
                  className="bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors w-full cursor-pointer"
                >
                  <option value="BORRADOR">Borrador</option>
                  <option value="PUBLICADO">Publicado</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[var(--text-main)]">Descripción del Proyecto</label>
              <textarea 
                name="descripcion" value={formData.descripcion} onChange={handleChange}
                placeholder="Describe brevemente de qué trata el proyecto..."
                rows="4"
                className="bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--accent)] transition-colors w-full resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_150px] gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-main)]">Nombre del Autor *</label>
                <input 
                  type="text" name="autor_nombre" value={formData.autor_nombre} onChange={handleChange}
                  placeholder="Nombre del estudiante o equipo"
                  className="bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors w-full"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-main)]">Carrera Profesional *</label>
                <select 
                  className="bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors w-full"
                  name="carrera"
                  value={formData.carrera}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, carrera: e.target.value, ciclo: '' }));
                  }}
                  required
                >
                  <option value="">Seleccionar carrera...</option>
                  {carreras.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-main)]">Ciclo</label>
                <select 
                  className="bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors w-full"
                  name="ciclo"
                  value={formData.ciclo}
                  onChange={handleChange}
                  disabled={!formData.carrera}
                  required
                >
                  <option value="">{formData.carrera ? 'Seleccionar ciclo...' : 'Primero selecciona carrera'}</option>
                  {Array.from({ length: duracionCiclos }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{toRoman(num)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-main)]">Categoría / Área</label>
                <select 
                  name="categoria" value={formData.categoria} onChange={handleChange}
                  className="bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors w-full cursor-pointer"
                >
                  <option value="">Seleccionar categoría...</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-main)]">ODS de Impacto (ONU)</label>
                <MultiSelectODS
                  value={formData.ods_ids}
                  onChange={(values) => setFormData(prev => ({ ...prev, ods_ids: values }))}
                  placeholder="Seleccionar ODS..."
                />
                {renderSelectedODS()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-main)]">URL Repositorio Git</label>
                <input 
                  type="url" name="url_repositorio" value={formData.url_repositorio} onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-main)]">URL Demo en Vivo</label>
                <input 
                  type="url" name="url_demo_live" value={formData.url_demo_live} onChange={handleChange}
                  placeholder="https://mi-proyecto.vercel.app"
                  className="bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[var(--text-main)]">Tecnologías Utilizadas</label>
              <div className="flex flex-wrap gap-2 p-3 bg-[var(--bg-general)] border border-[var(--line)] rounded-lg min-h-[48px]">
                {tecnologias.length === 0 && (
                  <span className="text-xs text-[var(--text-muted)] self-center">Cargando tecnologías...</span>
                )}
                {tecnologias.map((tech) => {
                  const isSelected = formData.tecnologias.includes(tech.id);
                  return (
                    <button
                      type="button"
                      key={tech.id}
                      onClick={() => handleTechChange(tech.id)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[var(--accent)] text-white shadow-sm' 
                          : 'bg-[var(--panel)] border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {tech.nombre} {isSelected ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-main)]">Imagen de Portada</label>
                <div className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer relative transition-colors ${archivoPortada ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--line)] bg-[var(--bg-general)] hover:border-[var(--text-muted)]'}`}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setArchivoPortada(e.target.files[0])} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <Upload size={22} className={`mx-auto mb-1 ${archivoPortada ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
                  <span className="text-xs font-bold text-[var(--text-main)] block truncate">
                    {archivoPortada ? archivoPortada.name : 'Subir imagen de portada'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--text-main)]">Archivo Video (MP4 / WebM)</label>
                <div className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer relative transition-colors ${archivoVideo ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--line)] bg-[var(--bg-general)] hover:border-[var(--text-muted)]'}`}>
                  <input 
                    type="file" 
                    accept="video/mp4,video/webm" 
                    onChange={(e) => setArchivoVideo(e.target.files[0])} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <Video size={22} className={`mx-auto mb-1 ${archivoVideo ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
                  <span className="text-xs font-bold text-[var(--text-main)] block truncate">
                    {archivoVideo ? archivoVideo.name : 'Subir demo en video'}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* VISTA PREVIA */}
        <div className="xl:sticky xl:top-6 self-start flex flex-col gap-3 w-full">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Vista Previa en Vivo
          </h3>
          
          <div className="bg-[var(--panel)] rounded-xl border border-[var(--line)] shadow-lg overflow-hidden flex flex-col">
            <div className="h-44 bg-[#0f111a] flex flex-col items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: imagenUrl ? `url(${imagenUrl})` : 'none' }}>
              {imagenUrl && <div className="absolute inset-0 bg-black/40"></div>}
              <div className="absolute bottom-3 left-3 z-10">
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                  formData.estado_publicacion === 'PUBLICADO' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
                }`}>
                  {formData.estado_publicacion}
                </span>
              </div>
              {!imagenUrl && (
                <>
                  <div className="bg-white/5 p-3.5 rounded-xl mb-2">
                    <Code size={32} className="text-white/20" />
                  </div>
                  <p className="text-xs font-medium text-white/30">Sin imagen de portada</p>
                </>
              )}
            </div>

            <div className="p-5 flex flex-col gap-3.5">
              <div className="flex flex-wrap gap-2">
                {formData.categoria && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10">
                    {categorias.find(c => String(c.id) === String(formData.categoria))?.nombre || 'Categoría'}
                  </span>
                )}
                {formData.ciclo && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[var(--line)] text-[var(--text-muted)] bg-[var(--bg-general)]">
                    Ciclo {toRoman(Number(formData.ciclo))}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xl font-bold text-[var(--text-main)] leading-tight">
                  {formData.titulo || 'Título del Proyecto'}
                </h4>
                <p className="text-sm font-medium text-[var(--text-muted)] mt-1">
                  Por: {formData.autor_nombre || 'Nombre del Autor'}
                </p>
              </div>

              <p className="text-sm text-[var(--text-muted)] line-clamp-3 min-h-[44px]">
                {formData.descripcion || 'La descripción del proyecto se mostrará aquí...'}
              </p>

              <div>
                <h5 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Tecnologías</h5>
                <div className="flex flex-wrap gap-1">
                  {formData.tecnologias.length === 0 ? (
                    <span className="text-xs text-[var(--text-muted)] italic">Ninguna seleccionada</span>
                  ) : (
                    formData.tecnologias.map(id => {
                      const t = tecnologias.find(item => item.id === id);
                      return (
                        <span key={id} className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-general)] text-[var(--text-main)] border border-[var(--line)]">
                          {t?.nombre || id}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button 
                  type="button"
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    formData.url_repositorio 
                      ? 'border-[var(--line)] bg-[var(--bg-general)] text-[var(--text-main)]' 
                      : 'border-transparent bg-[var(--bg-general)]/50 text-[var(--text-muted)] opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!formData.url_repositorio}
                >
                  <GitBranch size={16} />
                  Código
                </button>
                <button 
                  type="button"
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    formData.url_demo_live 
                      ? 'border-transparent bg-[var(--accent)] text-white' 
                      : 'border-transparent bg-[var(--bg-general)]/50 text-[var(--text-muted)] opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!formData.url_demo_live}
                >
                  <ExternalLink size={16} />
                  Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 pt-4 border-t border-[var(--line)] mt-4">
        <button 
          type="button"
          onClick={() => navigate('/editor/software/proyectos')}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[var(--text-muted)] bg-[var(--panel)] border border-[var(--line)] hover:text-[var(--text-main)] hover:border-[var(--text-muted)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={18} />
          Cancelar
        </button>

        <button 
          type="submit"
          form="project-form"
          disabled={loading}
          className="flex items-center gap-2 bg-[var(--accent)] text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-[var(--accent)]/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          <Save size={20} />
          {loading ? 'Guardando...' : 'Guardar Proyecto'}
        </button>
      </div>

    </div>
  );
}