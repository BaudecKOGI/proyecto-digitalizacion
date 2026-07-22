import { useEffect, useState } from 'react';

/**
 * Modal de pantalla completa para listar proyectos de una categoría.
 *
 * type: '3d' | 'software'  -> decide qué campos mostrar en cada tarjeta
 * fetchFn: función de src/services/api.js que trae los proyectos
 *
 * Mientras el backend no esté listo (o no haya proyectos publicados),
 * se muestra un estado vacío prolijo en vez de contenido inventado.
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

  const colorClass = type === '3d' ? 'c3d' : 'cdig';

  useEffect(() => {
    if (!active || status !== 'idle') return;
    setStatus('loading');
    fetchFn()
      .then((data) => {
        setProyectos(Array.isArray(data) ? data : data.results || []);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [active, status, fetchFn]);

  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : '';
  }, [active]);

  const showEmptyState = status !== 'success' || proyectos.length === 0;

  return (
    <div id={id} className={`app-screen ${active ? 'active' : ''}`}>
      <div className="flex items-center justify-between border-b border-line px-[8vw] py-6">
        <button onClick={onClose} className="gallery-back flex items-center gap-2 font-mono text-[11.5px] tracking-wide">
          ← Volver al inicio
        </button>
        <div className="font-mono text-[11px] text-muted">FAB LAB UNIVERSITARIO</div>
      </div>

      <div className="gallery-head px-[8vw] pb-10 pt-16">
        <div className={`tag ${colorClass} mb-4 font-mono text-[11px] uppercase tracking-[2px]`}>{tag}</div>
        <h2 className="max-w-xl text-[clamp(28px,4vw,46px)] font-bold font-display">{title}</h2>
        <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-muted">{description}</p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 px-[8vw] pb-24">
        {status === 'loading' && (
          <div className="col-span-full py-8 text-center font-mono text-[11.5px] tracking-wide text-muted">
            Cargando proyectos…
          </div>
        )}

        {showEmptyState && status !== 'loading' && (
          <>
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton-card flex aspect-[4/3] items-center justify-center">
                <svg className="ph-icon" width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" stroke={`var(--${colorClass})`} strokeWidth="1.4" />
                </svg>
              </div>
            ))}
            <div className="col-span-full py-6 text-center font-mono text-[11.5px] tracking-wide text-muted">
              {status === 'error'
                ? 'No se pudo conectar con el servidor todavía.'
                : 'Los proyectos publicados aparecerán aquí.'}
            </div>
          </>
        )}

        {status === 'success' &&
          proyectos.map((p) => (
            <div key={p.id} className="project-card overflow-hidden">
              <div className="thumb aspect-[4/3] w-full bg-cover bg-center" style={{
                backgroundImage: `url(${type === '3d' ? p.imagen_miniatura : p.imagen_portada || ''})`
              }} />
              <div className="p-4">
                <h3 className="text-sm font-semibold">{p.titulo}</h3>
                <p className="meta mt-1 font-mono text-[11px]">{p.autor_nombre} · {p.carrera}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}