import React from 'react';
import { motion } from 'framer-motion';

export default function DualitySection() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="duality" className="relative overflow-hidden bg-panel px-[8vw] py-32 border-b border-line">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24"
      >
        <motion.div variants={itemVariants} className="pt-2 lg:sticky lg:top-32">
          <div className="mb-6 font-sans text-[11px] font-extrabold uppercase tracking-[0.2em] text-text">
            Un solo repositorio
          </div>
          <h2 className="mb-6 font-display text-[clamp(40px,5vw,72px)] font-bold leading-[1.05] tracking-tight text-text">
            Dos mundos, <br />
            una plataforma.
          </h2>
          <p className="max-w-[480px] text-[16px] leading-relaxed text-muted">
            No importa si un proyecto se imprimió en una resina de alta precisión o se compiló en una terminal — aquí se presenta con el mismo rigor institucional y detalle técnico.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-12 pt-12">
          {/* Item 1: Fabricación Digital */}
          <div className="group relative border-t border-line pt-8 transition-all duration-300">
            <div className="mb-4 font-sans text-[11px] font-extrabold uppercase tracking-widest text-c3d">
              01 — Fabricación Digital
            </div>
            <h3 className="mb-6 font-display text-3xl font-bold text-text group-hover:text-c3d transition-colors">
              Modelos 3D
            </h3>
            <p className="text-[15px] leading-relaxed text-muted mb-8">
              Piezas modeladas en CAD, impresas o cortadas en el taller del Fab Lab. Presentadas con un visor 3D interactivo en la propia página, permitiendo rotación libre y escrutinio técnico.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="text-[13px] text-text font-semibold uppercase tracking-wider">— Visor Interactivo</li>
              <li className="text-[13px] text-text font-semibold uppercase tracking-wider">— Rotación Libre</li>
              <li className="text-[13px] text-text font-semibold uppercase tracking-wider">— Ficha Técnica</li>
            </ul>
          </div>

          {/* Item 2: Software */}
          <div className="group relative border-t border-line pt-8 transition-all duration-300">
            <div className="mb-4 font-sans text-[11px] font-extrabold uppercase tracking-widest text-cdig">
              02 — Desarrollo de Software
            </div>
            <h3 className="mb-6 font-display text-3xl font-bold text-text group-hover:text-cdig transition-colors">
              Proyectos Digitales
            </h3>
            <p className="text-[15px] leading-relaxed text-muted mb-8">
              Apps, sistemas web y herramientas de gestión construidas por alumnos. Documentadas mediante vistas previas en video y accesos directos al código o plataforma en vivo.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="text-[13px] text-text font-semibold uppercase tracking-wider">— Live Preview</li>
              <li className="text-[13px] text-text font-semibold uppercase tracking-wider">— Links directos</li>
              <li className="text-[13px] text-text font-semibold uppercase tracking-wider">— Stack Tecnológico</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}