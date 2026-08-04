import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';
import PeruMap from '@/components/landing/PeruMap';

export default function CampusNetworkSection() {
  return (
    <section className="bg-[#F8F9FB] py-20 px-[8vw]">
      <div className="mx-auto max-w-[1400px]">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.28em] text-indigo-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Red de Campus
          </p>
          <h2 className="text-[clamp(28px,3.5vw,50px)] font-black leading-tight text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Primera Red Universitaria<br />de Fab Labs en Perú
          </h2>
        </motion.div>

        {/* Layout principal: grid 3 columnas */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8 items-center">

          {/* Columna izquierda: Lima y Arequipa */}
          <div className="flex flex-col gap-5">
            {/* Campus Lima */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative overflow-hidden shadow-lg border border-gray-200 bg-white"
            >
              <div className="relative h-44 overflow-hidden bg-[#07101F]">
                <img
                  src="/campus/campus-lima-los-olivos.png"
                  alt="Campus Lima Los Olivos"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 relative z-10"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className="absolute inset-0 hidden flex-col items-center justify-center bg-[#07101F] z-0">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                  <MapPin size={28} weight="duotone" className="text-indigo-500/50 relative z-10" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white font-black text-[13px] uppercase tracking-widest z-30 pointer-events-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Campus Lima Los Olivos
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3">
                <MapPin size={14} weight="fill" className="text-indigo-500 shrink-0" />
                <span className="text-[12px] text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Lima — Sede urbana</span>
              </div>
            </motion.div>

            {/* Campus Arequipa */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden shadow-lg border border-gray-200 bg-white"
            >
              <div className="relative h-44 overflow-hidden bg-[#07101F]">
                <img
                  src="/campus/campus-arequipa.png"
                  alt="Campus Arequipa"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 relative z-10"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className="absolute inset-0 hidden flex-col items-center justify-center bg-[#07101F] z-0">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                  <MapPin size={28} weight="duotone" className="text-indigo-500/50 relative z-10" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white font-black text-[13px] uppercase tracking-widest z-30 pointer-events-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Campus Arequipa
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3">
                <MapPin size={14} weight="fill" className="text-indigo-500 shrink-0" />
                <span className="text-[12px] text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Arequipa — Ciudad Blanca</span>
              </div>
            </motion.div>
          </div>

          {/* Centro: Mapa profesional del Perú*/}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="flex flex-col items-center justify-center py-4 h-full"
          >
            <div className="w-full h-full min-h-[500px] flex items-center justify-center relative">
              <PeruMap />
            </div>
          </motion.div>

          {/* Columna derecha: Huancayo y Cusco */}
          <div className="flex flex-col gap-5">
            {/* Campus Huancayo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative overflow-hidden shadow-lg border border-gray-200 bg-white"
            >
              <div className="relative h-44 overflow-hidden bg-[#07101F]">
                <img
                  src="/campus/campus-huancayo.png"
                  alt="Campus Huancayo"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 relative z-10"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className="absolute inset-0 hidden flex-col items-center justify-center bg-[#07101F] z-0">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                  <MapPin size={28} weight="duotone" className="text-indigo-500/50 relative z-10" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white font-black text-[13px] uppercase tracking-widest z-30 pointer-events-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Campus Huancayo
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3">
                <MapPin size={14} weight="fill" className="text-indigo-500 shrink-0" />
                <span className="text-[12px] text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Av. San Carlos 1980, Huancayo</span>
              </div>
            </motion.div>

            {/* Campus Cusco */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden shadow-lg border border-gray-200 bg-white"
            >
              <div className="relative h-44 overflow-hidden bg-[#07101F]">
                <img
                  src="/campus/campus-cusco.png"
                  alt="Campus Cusco"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 relative z-10"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className="absolute inset-0 hidden flex-col items-center justify-center bg-[#07101F] z-0">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                  <MapPin size={28} weight="duotone" className="text-indigo-500/50 relative z-10" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white font-black text-[13px] uppercase tracking-widest z-30 pointer-events-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Campus Cusco
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3">
                <MapPin size={14} weight="fill" className="text-indigo-500 shrink-0" />
                <span className="text-[12px] text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Cusco — Ciudad Imperial</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
