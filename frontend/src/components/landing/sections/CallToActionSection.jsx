import React from 'react';
import { Link } from 'react-router-dom';
import useReveal from '../../../hooks/useReveal';

export default function CallToActionSection() {
  useReveal();

  return (
    <section className="relative overflow-hidden bg-bg py-28 md:py-36 px-[6vw] border-t border-line">
      {/* Tech grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.025] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LEFT — Content */}
          <div className="lg:col-span-7">
            <h2 className="reveal mb-6 font-display text-[clamp(32px,4.5vw,56px)] font-black leading-[1.08] tracking-tight text-text">
              Atrévete a crear{' '}
              <span className="text-[#5A00AA]">el futuro hoy.</span>
            </h2>

            <p className="reveal text-[16px] md:text-[17px] font-medium leading-relaxed text-muted max-w-xl">
              El Fab Lab de la Universidad Continental es un space abierto para estudiantes, docentes y la comunidad. Descubre nuestras instalaciones, equipos de fabricación avanzada y únete a la revolución Maker.
            </p>
          </div>

          {/* RIGHT — Actions */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Link
              to="/fablab"
              onClick={() => window.scrollTo(0, 0)}
              className="reveal group relative overflow-hidden border border-transparent bg-text text-bg px-8 py-5 font-sans text-[13px] font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_12px_40px_-12px_rgba(255,255,255,0.12)]"
            >
              <span className="relative z-10 flex items-center justify-between gap-4">
                <span>Acerca del FABLAB</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </span>
              <div className="absolute inset-0 z-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>

            <a
              href="https://ucontinental.edu.pe"
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group flex items-center justify-between gap-4 border border-line bg-panel/60 backdrop-blur-sm px-8 py-5 font-sans text-[13px] font-bold uppercase tracking-widest text-text transition-all duration-300 hover:scale-[1.02] hover:bg-surface hover:border-black active:scale-[0.98]"
            >
              <span>Conoce más</span>
              <span className="text-muted transition-colors duration-300 group-hover:text-black">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
