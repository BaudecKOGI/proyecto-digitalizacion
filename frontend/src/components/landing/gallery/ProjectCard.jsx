import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ODS_LIST } from '@/pages/dashboard/digitalProjects/odsData';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ProjectCard({ proyecto: p, type, colorClass, onClick }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-panel mb-6">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: `url(${type === '3d' ? p.imagen_miniatura : p.imagen_portada || ''})` }}
        />
      </div>
      <div>
        <div className="mb-2.5 flex items-center justify-between gap-2 flex-wrap">
          {p.ods && (() => {
            const odsObj = ODS_LIST.find((o) => o.id === Number(p.ods));
            return (
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: odsObj?.color || '#888' }}
                />
                <span className="font-sans text-[10px] font-extrabold uppercase tracking-[0.18em] text-text">
                  {odsObj ? `ODS ${odsObj.id < 10 ? '0' + odsObj.id : odsObj.id} · ${odsObj.label.replace(/^ODS \d+:\s*/, '')}` : `ODS ${p.ods}`}
                </span>
              </div>
            );
          })()}

          {p.categoria_nombre && (
            <span className="border border-line/80 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-muted bg-panel">
              {p.categoria_nombre}
            </span>
          )}
        </div>

        <h3 className={`font-display text-2xl font-bold text-text transition-colors ${colorClass.replace('text-', 'group-hover:text-')}`}>
          {p.titulo}
        </h3>

        <div className="mt-2.5 flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-widest text-muted">
          <span>{p.autor_nombre}</span>
          <span className="h-1 w-1 rounded-full bg-muted/50"></span>
          <span>{p.carrera}</span>
        </div>

        {(() => {
          const techList = p.tecnologias_detalle || p.tecnologias || [];
          if (techList.length === 0) return null;
          return (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {techList.slice(0, 4).map((tech, idx) => (
                <span
                  key={tech.id || idx}
                  className="inline-flex items-center border border-line/80 bg-panel/70 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-text"
                >
                  {typeof tech === 'string' ? tech : tech.nombre}
                </span>
              ))}
              {techList.length > 4 && (
                <span className="inline-flex items-center border border-line/60 bg-bg px-1.5 py-0.5 font-mono text-[9px] font-bold text-muted">
                  +{techList.length - 4}
                </span>
              )}
            </div>
          );
        })()}

        <ProjectCardActions proyecto={p} />
      </div>
    </motion.div>
  );
}

function ProjectCardActions({ proyecto }) {
  const [likes, setLikes] = useState(proyecto.likes_totales || 0);
  const [shares, setShares] = useState(proyecto.compartidos_totales || 0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    if (liked) return;
    setLiked(true);
    setLikes((prev) => prev + 1);
    fetch(`http://127.0.0.1:8000/api/metricas/por-proyecto/${proyecto.id}/like/`, {
      method: 'POST',
    }).catch(() => { });
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShares((prev) => prev + 1);
    const url = window.location.href;
    navigator.clipboard?.writeText(url).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    fetch(`http://127.0.0.1:8000/api/metricas/por-proyecto/${proyecto.id}/share/`, {
      method: 'POST',
    }).catch(() => { });
  };

  return (
    <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-muted">
      <div className="flex items-center gap-3">
        <button
          onClick={handleLike}
          disabled={liked}
          className={`flex items-center gap-1 font-mono text-[11px] transition-colors ${liked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
            }`}
          title="Me Gusta"
        >
          <span>{liked ? '♥' : '♡'}</span>
          <span>{likes}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 font-mono text-[11px] hover:text-text transition-colors"
          title="Compartir proyecto"
        >
          <span>⎘</span>
          <span>{copied ? '¡Copiado!' : 'Compartir'}</span>
          {shares > 0 && <span>({shares})</span>}
        </button>
      </div>

      <div className="flex items-center gap-1 font-mono text-[11px]" title="Vistas reales">
        <span>👁</span>
        <span>{proyecto.vistas_totales || 0}</span>
      </div>
    </div>
  );
}
