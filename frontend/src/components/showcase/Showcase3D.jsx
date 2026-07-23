import React from 'react';
import useReveal from "../../hooks/useReveal";

export default function Showcase3D({ onOpenGallery }) {
  useReveal();

  return (
    <section id="showcase-3d" className="py-32 px-[8vw] bg-panel">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
          
          <div className="reveal pt-4 lg:sticky lg:top-32">
            <div className="mb-6 font-sans text-[11px] font-extrabold uppercase tracking-[0.2em] text-c3d">
              01 — Fabricación Digital
            </div>
            <h2 className="mb-6 font-display text-[clamp(32px,4vw,56px)] font-bold leading-[1.05] tracking-tight text-text">
              El diseño <br/> se explora.
            </h2>
            <p className="mb-8 text-[16px] leading-relaxed text-muted">
              Cada proyecto 3D se procesa para la web, permitiendo a la comunidad rotar, acercar y estudiar modelos en tiempo real sin requerir instalaciones pesadas.
            </p>
            <button 
              onClick={onOpenGallery} 
              className="group flex items-center gap-3 font-sans text-[13px] font-bold uppercase tracking-widest text-text transition-colors hover:text-c3d"
            >
              <span>Ver Proyectos 3D</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-line/50 text-text transition-all group-hover:bg-c3d group-hover:text-white">
                →
              </span>
            </button>
          </div>

          <div className="reveal relative w-full overflow-hidden rounded-sm bg-bg">
            <div className="aspect-[4/3] w-full bg-[url('https://fablab.ucontinental.edu.pe/wp-content/uploads/2022/10/banner_principal.jpg')] bg-cover bg-center transition-transform duration-1000 hover:scale-105"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg/70 backdrop-blur-sm opacity-0 transition-opacity hover:opacity-100">
              <svg className="mb-4 h-12 w-12 text-c3d" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
              <div className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-text">Visor Interactivo 3D</div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}