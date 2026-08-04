import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  User, 
  Tag, 
  Target, 
  FileText, 
  Calendar, 
  Globe,
  GitBranch,
  Video,
  CheckCircle2,
  Clock,
  Code2
} from 'lucide-react';
import { ODS_LIST } from "@/pages/dashboard/digitalProjects/odsData";

export default function ProjectDetailViewSoftware({ proyecto, onBack }) {
  const navigate = useNavigate();

  if (!proyecto) return null;

  const odsObj = ODS_LIST?.find(o => String(o.id) === String(proyecto.ods));
  const isPublicado = (proyecto.estado_publicacion || proyecto.estado || '').toUpperCase() === 'PUBLICADO';
  const fechaProyecto = proyecto.created_at || proyecto.fecha_creacion || proyecto.fecha;

  // Procesar URLs de media
  let videoUrl = proyecto.archivo_video || '';
  if (videoUrl.startsWith('/')) {
    videoUrl = `http://localhost:8000${videoUrl}`;
  }

  let portadaUrl = proyecto.imagen_portada || '';
  if (portadaUrl.startsWith('/')) {
    portadaUrl = `http://localhost:8000${portadaUrl}`;
  }

  return (
    <div className="flex flex-col gap-6 h-full pb-8 max-w-7xl mx-auto w-full">
      
      {/* --- ENCABEZADO Y CONTROLES --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-[var(--panel)] border border-[var(--line)] rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent)] transition-all cursor-pointer shadow-sm"
            title="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] m-0 leading-tight flex items-center gap-3 flex-wrap">
              Detalle del Proyecto
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                isPublicado 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              }`}>
                {isPublicado ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                {proyecto.estado_publicacion || proyecto.estado || 'BORRADOR'}
              </span>
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">ID del registro: #{proyecto.id}</p>
          </div>
        </div>

        <button 
          onClick={() => navigate(`/editor/software/editar/${proyecto.id}`)}
          className="bg-[var(--accent)] hover:opacity-90 transition-opacity text-white border-none py-2 px-5 rounded-xl cursor-pointer font-bold flex items-center justify-center gap-2 shadow-sm shrink-0"
        >
          <Edit3 size={18} /> Editar Proyecto
        </button>
      </div>

      {/* --- CONTENIDO PRINCIPAL (GRID) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA: Video + Descripción */}
        <div className="lg:col-span-7 flex flex-col gap-6 min-w-0">
          
          {/* CONTENEDOR DEL VIDEO */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-1 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#0f111a] rounded-xl aspect-video relative flex items-center justify-center overflow-hidden shadow-inner">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  poster={portadaUrl || undefined}
                  className="w-full h-full object-contain bg-black"
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              ) : portadaUrl ? (
                <img 
                  src={portadaUrl} 
                  alt={proyecto.titulo} 
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-center text-slate-400 p-6">
                  <Video className="mx-auto mb-4 opacity-30" size={48} />
                  <p className="text-[15px] font-medium">Sin previsualización de video</p>
                </div>
              )}
            </div>

            <div className="p-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-2">
                <FileText size={16} /> 
                Video: <strong className="text-[var(--text-main)]">
                  {proyecto.archivo_video ? 'Asignado' : 'No subido'}
                </strong>
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} /> 
                {fechaProyecto 
                  ? new Date(fechaProyecto).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) 
                  : 'Fecha desconocida'}
              </span>
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 shadow-sm min-w-0">
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-3 flex items-center gap-2">
              <FileText size={20} className="text-[var(--accent)]" /> 
              Acerca del Proyecto
            </h3>
            {/* break-words + overflow-wrap evita el desbordamiento horizontal */}
            <p className="text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere text-sm md:text-base">
              {proyecto.descripcion || 'Este proyecto no cuenta con una descripción detallada en este momento.'}
            </p>
          </div>

          {/* TECNOLOGÍAS */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
              <Code2 size={20} className="text-[var(--accent)]" /> 
              Tecnologías Utilizadas
            </h3>
            <div className="flex flex-wrap gap-2">
              {(proyecto.tecnologias_detalle || []).length > 0 ? (
                (proyecto.tecnologias_detalle || []).map((t) => (
                  <span 
                    key={t.id} 
                    className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold bg-[var(--bg-general)] border border-[var(--line)] text-[var(--text-main)]"
                  >
                    {t.nombre}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[var(--text-muted)] italic">
                  No se especificaron tecnologías.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Metadatos */}
        <div className="lg:col-span-5 flex flex-col gap-6 min-w-0">
          
          {/* Tarjeta principal */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--text-main)] mb-1 leading-tight break-words">
                {proyecto.titulo || 'Sin título'}
              </h1>
              <p className="text-[var(--text-muted)] text-sm">Información general del proyecto</p>
            </div>

            <hr className="border-[var(--line)]" />

            <div className="flex flex-col gap-4">
              {/* Autor */}
              <div>
                <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1 block">
                  Desarrollado por
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-general)] border border-[var(--line)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
                    <User size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[var(--text-main)] truncate">
                      {proyecto.autor_nombre || 'Autor Desconocido'}
                    </div>
                    {proyecto.ciclo && (
                      <div className="text-xs text-[var(--text-muted)]">Ciclo: {proyecto.ciclo}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Carrera / Categoría */}
              <div>
                <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1 block">
                  Programa / Categoría
                </span>
                <div className="inline-flex items-center gap-2 bg-[var(--bg-general)] border border-[var(--line)] px-3 py-2 rounded-xl max-w-full">
                  <Tag size={16} className="text-[var(--accent)] shrink-0" />
                  <span className="font-semibold text-[var(--text-main)] text-sm truncate">
                    {proyecto.carrera || 'N/A'}
                    {proyecto.categoria_nombre ? ` • ${proyecto.categoria_nombre}` : ''}
                  </span>
                </div>
              </div>

              {/* ODS */}
              <div>
                <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">
                  Objetivo de Desarrollo Sostenible
                </span>
                {odsObj ? (
                  <div className="inline-flex items-center gap-3 bg-[#a21942]/10 border border-[#a21942]/20 p-3 rounded-xl w-full">
                    <div className="bg-[#a21942] text-white p-2 rounded-lg shrink-0">
                      <Target size={20} />
                    </div>
                    <div className="font-bold text-[#a21942] text-sm leading-tight break-words">
                      {odsObj.label}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-[var(--text-muted)] italic bg-[var(--bg-general)] p-3 rounded-xl border border-[var(--line)]">
                    Ningún ODS asignado a este proyecto.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col gap-3">
            {proyecto.url_demo_live && (
              <a
                href={proyecto.url_demo_live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-bold text-white bg-[var(--accent)] hover:opacity-90 transition-opacity shadow-sm"
              >
                <Globe size={18} />
                Visitar Proyecto en Vivo
              </a>
            )}

            {proyecto.url_repositorio && (
              <a
                href={proyecto.url_repositorio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-bold text-[var(--text-main)] bg-[var(--panel)] border-2 border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                <GitBranch size={18} />
                Ver Repositorio
              </a>
            )}
          </div>

          {/* Datos del sistema */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[14px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4 border-b border-[var(--line)] pb-2">
              Datos del Sistema
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex justify-between items-center gap-3">
                <span className="text-[var(--text-muted)] shrink-0">Visibilidad:</span>
                <strong className="text-[var(--text-main)] text-right">{proyecto.estado_publicacion || proyecto.estado || 'BORRADOR'}</strong>
              </li>
              <li className="flex justify-between items-center gap-3">
                <span className="text-[var(--text-muted)] shrink-0">Portada:</span>
                <span className="text-[var(--text-main)] truncate max-w-[160px] text-right" title={proyecto.imagen_portada}>
                  {proyecto.imagen_portada ? '...' + proyecto.imagen_portada.slice(-18) : 'N/A'}
                </span>
              </li>
              <li className="flex justify-between items-center gap-3">
                <span className="text-[var(--text-muted)] shrink-0">Video:</span>
                <span className="text-[var(--text-main)] truncate max-w-[160px] text-right" title={proyecto.archivo_video}>
                  {proyecto.archivo_video ? '...' + proyecto.archivo_video.slice(-18) : 'N/A'}
                </span>
              </li>
              <li className="flex justify-between items-center gap-3 mt-3 pt-3 border-t border-[var(--line)]">
                <span className="text-[var(--text-muted)] shrink-0">Tecnologías:</span>
                <strong className="text-[var(--text-main)]">
                  {(proyecto.tecnologias_detalle || []).length} registradas
                </strong>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Espaciador final */}
      <div className="h-24 w-full shrink-0"></div>
    </div>
  );
}