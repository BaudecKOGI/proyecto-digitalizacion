import React, { useState } from 'react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

function resolveImageUrl(item) {
  // Prueba los campos más comunes de imagen en orden de prioridad
  const raw =
    item.imagen_portada ||
    item.imagen ||
    item.imagen_miniatura ||
    item.miniatura ||
    item.thumbnail ||
    item.cover ||
    null;
  if (!raw) return null;
  if (typeof raw === 'string' && raw.startsWith('http')) return raw;
  if (typeof raw === 'string') return `${API_BASE}${raw}`;
  return null;
}

function getRoute(item) {
  if (item._type === '3D') return `/proyecto/3d/${item.id}`;
  return `/proyecto/digitales/${item.id}`;
}

const TYPE_BADGE = {
  '3D': { label: 'Diseño 3D', color: '#6366F1', bg: 'rgba(99,102,241,0.15)' },
  Software: { label: 'Software', color: '#5A00AA', bg: 'rgba(90,0,170,0.15)' },
};

export default function ResultCard({ item, index }) {
  const imgUrl = resolveImageUrl(item);
  const badge = TYPE_BADGE[item._type] || TYPE_BADGE['Software'];
  const [imgError, setImgError] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => window.open(getRoute(item), '_blank')}
      className="group w-full text-left flex gap-3 items-center p-2.5 transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,1)',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
      whileHover={{ background: 'rgba(248,250,252,1)', borderColor: 'rgba(0,0,0,0.12)' }}
    >
      {/* Imagen de portada del proyecto */}
      <div
        className="shrink-0 overflow-hidden flex items-center justify-center"
        style={{
          width: 56,
          height: 56,
          background: imgUrl && !imgError
            ? '#F1F5F9'
            : 'linear-gradient(135deg, #3730A3, #6366F1)',
        }}
      >
        {imgUrl && !imgError ? (
          <img
            src={imgUrl}
            alt={item.titulo}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback: placeholder elegante con inicial del título */
          <span
            className="text-white font-black text-xl select-none"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {(item.titulo || '?').charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Info del proyecto */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5"
            style={{ color: badge.color, background: badge.bg }}
          >
            {badge.label}
          </span>
        </div>
        <p
          className="text-[13px] font-semibold leading-snug truncate text-slate-900"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {item.titulo || 'Sin título'}
        </p>
        {item.categoria?.nombre && (
          <p
            className="text-[11px] text-slate-500 mt-0.5 truncate"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {item.categoria.nombre}
          </p>
        )}
      </div>

      {/* Flecha */}
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 text-base mr-1">
        →
      </div>
    </motion.button>
  );
}
