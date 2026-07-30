import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";

/**
 * Sección Duality - Fondo Estático al hacer scroll (Parallax con la imagen '/assets/dos-mundos.jpg')
 * Estilo cinematográfico y elegante, con tarjetas en cristal templado (Glassmorphism),
 * tipografía en blanco de alto contraste y mínimo texto. Cero clichés de IA.
 */
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
      className="relative overflow-hidden py-32 px-[8vw] border-b border-line/40 bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: `url('/assets/uno.png')` }}
    >
      {/* Capa sutil de oscurecimiento equilibrado para realzar texto sin perder nitidez de la foto */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/55" />

      {/* Desvanecimiento en los bordes superior e inferior para transición continua */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-16 bg-gradient-to-b from-[#090D16] to-transparent z-10" />
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-t from-[#090D16] to-transparent z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="relative z-20 mx-auto max-w-[1360px]"
      >
        {/* ================= ENCABEZADO CINEMATOGRÁFICO ================= */}
        <motion.div variants={itemVariants} className="max-w-3xl mb-16">
          <h2 className="font-display text-[clamp(40px,5vw,68px)] font-black leading-[1.04] tracking-tight text-white mb-6 drop-shadow-md">
            Dos mundos,<br />
            <span className="text-white/75 font-normal">una misma plataforma.</span>
          </h2>

          <p className="text-white/95 text-base sm:text-lg max-w-xl font-sans leading-relaxed drop-shadow-sm">
            No importa si un proyecto se fabricó en el taller físico o se compiló en la terminal: ambos concurren con el mismo rigor técnico e inspección interactiva.
          </p>
        </motion.div>

        {/* ================= TARJETAS GRIS GRAFITO ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* TARJETA 01: FABRICACIÓN DIGITAL / MODELOS 3D */}
          <div
            onClick={() => {
              const el = document.getElementById('modelos-3d');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else onOpen3D?.();
            }}
            className="group cursor-pointer rounded-none bg-[#3E3E3E] hover:bg-[#252525] p-8 sm:p-10 transition-colors duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Etiqueta superior */}
              <div className="flex items-center justify-between font-mono text-xs font-bold tracking-widest uppercase mb-6">
                <span className="text-c3d">
                  01 · Fabricación Digital
                </span>
                <span className="text-white/80 bg-white/10 px-2.5 py-1 rounded-none">
                  WEBGL 360°
                </span>
              </div>

              {/* Título y descripción concisa */}
              <h3 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
                Modelado & Prototipado 3D
              </h3>
              <p className="text-white/85 text-base leading-relaxed mb-8">
                Piezas impresas en resina de alta precisión y corte láser inspeccionadas mediante un visor orbital en tiempo real.
              </p>

              {/* Píldoras de especificación limpia sin bordes y con puntas rectas */}
              <div className="flex flex-wrap gap-2.5 mb-10 font-mono text-xs">
                <span className="px-3.5 py-1.5 rounded-none bg-white/10 text-white/95">
                  Visor WebGL Interactivo
                </span>
                <span className="px-3.5 py-1.5 rounded-none bg-white/10 text-white/95">
                  Archivos .STL / .OBJ
                </span>
                <span className="px-3.5 py-1.5 rounded-none bg-white/10 text-white/95">
                  Parámetros de Taller
                </span>
              </div>
            </div>

            {/* Botón de acción inferior */}
            <div className="pt-4 border-t border-white/15 flex items-center justify-between">
              <span className="font-sans text-sm font-bold text-white uppercase tracking-wider group-hover:text-c3d transition-colors">
                Explorar Galería 3D
              </span>
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-none bg-white/10 group-hover:bg-c3d text-white transition-colors duration-300">
                <ArrowRight size={18} weight="bold" />
              </span>
            </div>
          </div>

          {/* TARJETA 02: DESARROLLO DE SOFTWARE */}
          <div
            onClick={() => {
              const el = document.getElementById('desarrollo-software');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else onOpenDigital?.();
            }}
            className="group cursor-pointer rounded-none bg-[#3E3E3E] hover:bg-[#252525] p-8 sm:p-10 transition-colors duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Etiqueta superior */}
              <div className="flex items-center justify-between font-mono text-xs font-bold tracking-widest uppercase mb-6">
                <span className="text-cdig">
                  02 · Desarrollo de Software
                </span>
                <span className="text-white/80 bg-white/10 px-2.5 py-1 rounded-none">
                  VIDEO PREVIEW
                </span>
              </div>

              {/* Título y descripción concisa */}
              <h3 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
                Sistemas, Cloud & Apps
              </h3>
              <p className="text-white/85 text-base leading-relaxed mb-8">
                Herramientas institucionales, aplicaciones web y soluciones móviles con demostraciones en video y acceso a código fuente.
              </p>

              {/* Píldoras de especificación limpia sin bordes y con puntas rectas */}
              <div className="flex flex-wrap gap-2.5 mb-10 font-mono text-xs">
                <span className="px-3.5 py-1.5 rounded-none bg-white/10 text-white/95">
                  Preview en Video Vivo
                </span>
                <span className="px-3.5 py-1.5 rounded-none bg-white/10 text-white/95">
                  Filtrado por ODS (ONU)
                </span>
                <span className="px-3.5 py-1.5 rounded-none bg-white/10 text-white/95">
                  Repositorio GitHub
                </span>
              </div>
            </div>

            {/* Botón de acción inferior */}
            <div className="pt-4 border-t border-white/15 flex items-center justify-between">
              <span className="font-sans text-sm font-bold text-white uppercase tracking-wider group-hover:text-cdig transition-colors">
                Explorar Software
              </span>
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-none bg-white/10 group-hover:bg-cdig text-white transition-colors duration-300">
                <ArrowRight size={18} weight="bold" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}