import React from 'react';
import useReveal from "../../../hooks/useReveal";

export default function ShowcaseSoftware({ onOpenGallery }) {
  useReveal();

  return (
    <section id="showcase-dig" className="py-32 px-[8vw] bg-bg">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-24">

          <div className="reveal relative w-full overflow-hidden rounded-sm bg-panel order-2 lg:order-1">
            {/* A large editorial placeholder image */}
            <div className="aspect-[16/10] w-full bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80')] bg-cover bg-center transition-transform duration-1000 hover:scale-105 opacity-80"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg/70 backdrop-blur-sm opacity-0 transition-opacity hover:opacity-100">
              <svg className="mb-4 h-12 w-12 text-cdig" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-text">Live Preview</div>
            </div>
          </div>

          <div className="reveal pt-4 lg:sticky lg:top-32 order-1 lg:order-2">
            <div className="mb-6 font-sans text-[11px] font-extrabold uppercase tracking-[0.2em] text-cdig">
              02 — Desarrollo de Software
            </div>
            <h2 className="mb-6 font-display text-[clamp(32px,4vw,56px)] font-bold leading-[1.05] tracking-tight text-text">
              Soluciones en <br /> acción.
            </h2>
            <p className="mb-8 text-[16px] leading-relaxed text-muted">
              Documentamos cada proyecto con vistas previas interactivas. Atrás quedaron las capturas estáticas; evaluamos funcionalidad y experiencia en entornos reales.
            </p>
            <button
              onClick={onOpenGallery}
              className="group flex items-center gap-3 font-sans text-[13px] font-bold uppercase tracking-widest text-text transition-colors hover:text-cdig"
            >
              <span>Ver Software</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-line/50 text-text transition-all group-hover:bg-cdig group-hover:text-white">
                →
              </span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}