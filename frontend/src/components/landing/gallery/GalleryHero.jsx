import React from 'react';
import { motion } from 'framer-motion';

export default function GalleryHero({
  tag,
  title,
  description,
  colorClass,
  bgImage,
  bgTypeClass,
  status,
  count,
}) {
  return (
    <section
      className="relative flex items-end overflow-hidden bg-[#090D16]"
      style={{ minHeight: '42vh' }}
    >
      {/* Imagen de fondo según el tipo */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
        style={{
          backgroundImage: `url('${bgImage}')`,
        }}
      />

      {/* Degradados */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-[#090D16]/70 to-[#090D16]/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090D16]/80 via-transparent to-transparent" />

      {/* Contenido del hero */}
      <div className="relative z-10 px-[8vw] pb-14 pt-32 w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className={`mb-4 font-sans text-[11px] font-extrabold uppercase tracking-[0.25em] ${colorClass}`}
        >
          {tag}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-[clamp(44px,6vw,80px)] font-bold leading-[1.02] tracking-tight text-white max-w-3xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/60"
        >
          {description}
        </motion.p>

        {/* Stats pill */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
          >
            <span className={`h-2 w-2 rounded-full ${bgTypeClass}`} />
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/70">
              {count} {count === 1 ? 'proyecto publicado' : 'proyectos publicados'}
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
