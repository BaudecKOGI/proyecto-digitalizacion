export default function Hero() {
  return (
    <section id="hero">
      <div className="grid items-center gap-14 md:grid-cols-[1.15fr_0.85fr]">
        <div className="max-w-[620px]">
          <div className="eyebrow">
            UNIVERSIDAD CONTINENTAL <span className="sep">/</span> <span className="dig">FAB LAB</span>
          </div>
          <h1 className="hero-title">
            Piezas físicas<br />
            <em>y</em> líneas de código,<br />
            en <span className="dig">un solo lugar.</span>
          </h1>
          <p className="lead">
            La vitrina de todo lo que se construye en el Fab Lab: diseños fabricados
            en 3D y software creado por alumnos, presentados como lo que realmente
            son — trabajo terminado, no maquetas.
          </p>
        </div>

        {/* Placeholder de la imagen */}
        <div className="viewer-mock flex h-[460px] flex-col items-center justify-center gap-4 border-dashed">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line text-muted">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="16" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="8.5" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4 16l5-4.5 3.5 3L17 10l3 3.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          <p className="px-8 text-center font-mono text-[11px] tracking-wide text-muted">
            <b className="text-text">Espacio para imagen</b><br />
            foto del campus, del taller o del equipo — pendiente de definir
          </p>
        </div>
      </div>

      {/* Animación "Desliza" limpia usando index.css */}
      <div className="scroll-cue">
        <span>Desliza</span>
        <div className="line" />
      </div>
    </section>
  );
}