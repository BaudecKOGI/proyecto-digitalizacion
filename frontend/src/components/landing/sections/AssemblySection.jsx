import React from 'react';
import { motion } from 'framer-motion';

export default function AssemblySection() {
  return (
    <section id="assembly" className="relative overflow-hidden">
      <div className="flex min-h-[60vh] w-full flex-col md:flex-row">

        {/* LADO IZQUIERDO */}
        <div className="relative flex flex-[2] flex-col justify-center bg-white px-[8vw] py-28 md:py-36">

          {/* Línea decorativa vertical */}
          <div className="absolute right-0 top-1/2 hidden h-48 w-[2px] -translate-y-1/2 bg-gradient-to-b from-transparent via-[#5A00AA] to-transparent md:block" />

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-6 inline-block font-['Roboto'] text-xs font-bold uppercase tracking-[0.25em] text-[#5A00AA]">
              Fab Lab · Universidad Continental
            </span>

            <h2 className="font-['Roboto'] text-[clamp(42px,5vw,76px)] font-black leading-[1.02] tracking-tight text-black">
              Innovación
              <br />
              y Fabricación
              <br />
              <span className="relative inline-block text-[#5A00AA]">
                Digital.
                <span className="absolute -bottom-2 left-0 h-[3px] w-full bg-[#5A00AA]/80" />
              </span>
            </h2>
          </motion.div>
        </div>

        {/* LADO DERECHO */}
        <div className="relative flex flex-[3] flex-col justify-center bg-[#2D0055] px-[7vw] py-28 md:py-36">

          {/* Elementos decorativos de fondo */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-black/10 blur-2xl" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-2xl"
          >
            <p className="font-['Roboto'] text-[clamp(22px,2.6vw,32px)] font-semibold leading-snug text-white">
              En el Fab Lab de la Universidad Continental convertimos ideas abstractas en realidades tangibles.
            </p>

            <div className="my-8 h-px w-16 bg-white/40" />

            <p className="font-['Roboto'] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-white/90">
              Desde el modelado 3D de alta precisión anatómica e industrial, hasta el desarrollo de arquitecturas de software eficientes.
              Este catálogo interactivo es un testamento al talento y la capacidad técnica de nuestra comunidad académica.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}