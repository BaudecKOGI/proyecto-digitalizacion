import React, { useState } from 'react';
import { ThumbsUp, Share2, Eye, GraduationCap, Clock, User } from 'lucide-react';
import { FacebookLogo, WhatsappLogo, Link as LinkIcon } from '@phosphor-icons/react';
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
      className="bg-[#F4F4F4] overflow-hidden transition-all duration-300 hover:bg-[#E9D5FF] hover:shadow-lg hover:-translate-y-1 rounded-lg"
      style={{ fontFamily: 'Roboto, sans-serif' }}
    >
      <div
        className="group relative aspect-[4/3] w-full overflow-hidden bg-panel mb-5 cursor-pointer"
        onClick={onClick}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url(${(type === '3d' ? p.imagen_miniatura : p.imagen_portada) || '/assets/default.png'})`
          }}
        />
        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <span className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-2.5 font-bold text-sm shadow-xl hover:bg-[#7C3AED] hover:text-white">
            <img src="/assets/icons/eye.png" alt="Ver" className="w-[18px] h-[18px] object-contain opacity-80" />
            Ver Proyecto
          </span>
        </div>



        {/* Badge de Categoría */}
        {p.categoria_nombre && (
          <div className="absolute top-4 right-4 z-20 pointer-events-none">
            <span className="inline-flex px-3 py-1.5 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md text-[12.5px] font-medium text-white tracking-wide shadow-sm">
              {p.categoria_nombre}
            </span>
          </div>
        )}
      </div>
      <div className="px-5 pb-5">
        <div className="mb-2.5 flex items-center justify-between gap-2 flex-wrap">
          {p.ods_detalle && p.ods_detalle.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1">
              {p.ods_detalle.map((ods) => {
                const odsObj = ODS_LIST.find((o) => o.id === ods.id);
                const textColor = odsObj ? odsObj.color : '#475569';
                const bgColor = odsObj ? `${odsObj.color}20` : '#f1f5f9';
                return (
                  <span
                    key={ods.id}
                    className="px-2.5 py-0.5 rounded-md text-[13px] font-bold tracking-wide"
                    style={{ backgroundColor: bgColor, color: textColor }}
                  >
                    ODS {ods.id}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <h3 className="text-[24px] leading-[29px] text-[#111928] font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {p.titulo}
        </h3>

        <div className="mt-3.5 flex items-center gap-3">
          <img src="/assets/icons/student.png" alt="Estudiante" className="w-9 h-9 object-contain" />
          <div className="flex flex-col justify-center">
            <span className="text-[15px] font-bold text-[#111928] leading-snug">{p.autor_nombre}</span>
            <span className="text-[13px] font-medium text-muted leading-snug">Estudiante</span>
          </div>
        </div>

        {(() => {
          const techList = p.tecnologias_detalle || p.tecnologias || [];
          if (techList.length === 0) return null;
          return (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {techList.slice(0, 4).map((tech, idx) => (
                <span
                  key={tech.id || idx}
                  className="inline-flex items-center border border-line/80 bg-panel/70 px-2 py-0.5 text-[13px] font-medium text-text rounded-sm"
                >
                  {typeof tech === 'string' ? tech : tech.nombre}
                </span>
              ))}
              {techList.length > 4 && (
                <span className="inline-flex items-center border border-line/60 bg-bg px-1.5 py-0.5 text-[13px] font-medium text-muted rounded-sm">
                  +{techList.length - 4}
                </span>
              )}
            </div>
          );
        })()}

        <ProjectCardActions proyecto={p} type={type} />
      </div>
    </motion.div>
  );
}

function ProjectCardActions({ proyecto, type }) {
  const fechaProyecto = proyecto.fecha_creacion || proyecto.created_at || proyecto.fecha;
  const fechaFormateada = fechaProyecto
    ? new Date(fechaProyecto).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  return (
    <div className="mt-4 pt-4 border-t border-line/60 flex items-center justify-between text-muted">
      <div className="flex items-center gap-2 text-[13px]" title="Vistas reales">
        <img src="/assets/icons/eye.png" alt="Vistas" className="w-[18px] h-[18px] object-contain opacity-70" />
        <span className="font-medium">{proyecto.vistas_totales || 0}</span>
      </div>

      {fechaFormateada && (
        <div className="text-[13px] font-medium text-muted/80">
          {fechaFormateada}
        </div>
      )}
    </div>
  );
}
