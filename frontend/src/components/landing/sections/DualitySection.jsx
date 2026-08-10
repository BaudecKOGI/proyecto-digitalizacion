import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";

/*Sección Duality - Fondo blanco*/
export default function DualitySection({ onOpen3D, onOpenDigital }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section
      id="duality"
      className="relative overflow-hidden pt-16 pb-24 px-[8vw] border-b border-line/40 bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: `url('/assets/uno.png')` }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="relative z-20 mx-auto max-w-[1360px]"
      >
        {/* ENCABEZADO */}
        <motion.div variants={itemVariants} className="max-w-3xl mb-10">
          <h2 className="font-display text-[clamp(40px,5vw,68px)] font-black leading-[1.04] tracking-tight text-black mb-4">
            Dos mundos,<br />
            <span className="text-black/60 font-normal">una misma plataforma.</span>
          </h2>
        </motion.div>

        {/* TARJETAS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

          {/* TARJETA 01 */}
          <div
            onClick={() => {
              const el = document.getElementById('modelos-3d');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else onOpen3D?.();
            }}
            className="group cursor-pointer rounded-none bg-white border border-black/10 hover:border-black/25 hover:shadow-xl p-8 sm:py-8 sm:px-10 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase mb-4">
                <span className="text-[#6802C1]">
                  01 · Fabricación Digital
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-black mb-3">
                Modelado & Prototipado 3D
              </h3>
              <p className="text-black/70 text-base leading-relaxed mb-6">
                Piezas impresas en resina de alta precisión y corte láser inspeccionadas mediante un visor orbital en tiempo real.
              </p>

              <div className="flex flex-wrap gap-2.5 text-xs">
                <span className="px-3.5 py-1.5 rounded-none bg-black/5 text-black/80 border border-black/10">
                  Visor WebGL Interactivo
                </span>
                <span className="px-3.5 py-1.5 rounded-none bg-black/5 text-black/80 border border-black/10">
                  Archivos .FBX
                </span>
                <span className="px-3.5 py-1.5 rounded-none bg-black/5 text-black/80 border border-black/10">
                  Parámetros de Taller
                </span>
              </div>
            </div>
          </div>

          {/* TARJETA 02 */}
          <div
            onClick={() => {
              const el = document.getElementById('desarrollo-software');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else onOpenDigital?.();
            }}
            className="group cursor-pointer rounded-none bg-white border border-black/10 hover:border-black/25 hover:shadow-xl p-8 sm:py-8 sm:px-10 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase mb-4">
                <span className="text-cdig">
                  02 · Desarrollo de Software
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-black mb-3">
                Sistemas, Cloud & Apps
              </h3>
              <p className="text-black/70 text-base leading-relaxed mb-6">
                Herramientas institucionales, aplicaciones web y soluciones móviles con demostraciones en video y acceso a código fuente.
              </p>

              <div className="flex flex-wrap gap-2.5 text-xs">
                <span className="px-3.5 py-1.5 rounded-none bg-black/5 text-black/80 border border-black/10">
                  Preview en Video Vivo
                </span>
                <span className="px-3.5 py-1.5 rounded-none bg-black/5 text-black/80 border border-black/10">
                  Filtrado por ODS (ONU)
                </span>
                <span className="px-3.5 py-1.5 rounded-none bg-black/5 text-black/80 border border-black/10">
                  Repositorio GitHub
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}