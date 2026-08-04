import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useReveal from '../../../hooks/useReveal';

export default function CallToActionSection() {
  useReveal();

  return (
    <section className="relative overflow-hidden bg-white py-32 px-[8vw] border-t border-line/20">
      {/* Elementos de fondo */}
      <div className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-c3d opacity-[0.03] blur-[120px]"></div>
      <div className="pointer-events-none absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-cdig opacity-[0.03] blur-[120px]"></div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="reveal mb-8 text-[clamp(40px,5vw,72px)] font-bold leading-[1.05] tracking-tight text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Atrévete a crear <br />
          <span className="text-cyan-600">el futuro hoy.</span>
        </h2>

        <p className="reveal mb-12 text-[clamp(16px,2vw,20px)] leading-relaxed text-muted max-w-2xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
          El Fab Lab de la Universidad Continental es un espacio abierto para estudiantes, docentes y la comunidad. Descubre nuestras instalaciones, equipos de fabricación avanzada y únete a la revolución Maker.
        </p>

        <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/fablab"
              onClick={() => window.scrollTo(0, 0)}
              className="group relative inline-flex items-center justify-center gap-3 bg-cyan-600 text-white px-8 py-4 font-sans text-[13px] font-bold uppercase tracking-widest transition-all duration-300 hover:bg-cyan-700 hover:scale-105"
            >
              <span>Acerca del FABLAB</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <a
            href="https://fablab.ucontinental.edu.pe/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 border border-line/60 bg-transparent px-8 py-4 font-sans text-[13px] font-bold uppercase tracking-widest text-text transition-colors hover:border-text hover:bg-surface"
          >
            <span>CONOCE MÁS</span>
          </a>
        </div>
      </div>
    </section>
  );
}
