import React from 'react';

export default function DigitalSection({ onOpenGallery }) {
  return (
    <section className="relative w-full h-full bg-cover bg-center flex items-center overflow-hidden" style={{ backgroundImage: "url('/assets/codigo.png')" }}>
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative mx-auto max-w-[1000px] w-full text-center z-10 flex flex-col items-center">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-none border border-cdig/50 bg-cdig/20 px-4 py-2 backdrop-blur-md">
            <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.15em] text-white">
              02 — Desarrollo de Software
            </span>
          </div>

          <h2 className="mb-6 font-display text-[clamp(40px,5vw,72px)] font-black leading-[1.05] tracking-tight text-white drop-shadow-lg">
            Soluciones en <br />
            <span className="text-cdig">
              acción.
            </span>
          </h2>
          <p className="mb-8 text-[18px] leading-relaxed text-white/90 font-medium max-w-2xl mx-auto drop-shadow-md">
            Documentamos cada proyecto con vistas previas interactivas. Atrás quedaron las capturas estáticas; evaluamos funcionalidad y experiencia en entornos reales.
          </p>

          {/* Stack Tecnológico */}
          <div className="mb-12 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {['React', 'Python', 'Node.js', 'AWS', 'Three.js', 'WebGL', 'Flutter', 'ROS'].map((tech) => (
              <span
                key={tech}
                className="rounded-none border border-white/20 bg-black/40 backdrop-blur-sm px-4 py-2 font-sans text-[13px] font-bold tracking-wide text-white shadow-sm transition-colors hover:border-cdig hover:bg-cdig/80"
              >
                {tech}
              </span>
            ))}
          </div>

          <button
            onClick={onOpenGallery}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-none bg-white px-10 py-5 font-sans text-[15px] font-bold uppercase tracking-widest text-black transition-transform hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Ver Software</span>
            <span className="relative z-10 flex transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
              →
            </span>
            <div className="absolute inset-0 z-0 bg-cdig opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </section>
  );
}