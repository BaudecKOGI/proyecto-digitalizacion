import React from 'react';
import useReveal from "../../../hooks/useReveal";

export default function ShowcaseSoftware({ onOpenGallery }) {
  useReveal();

  return (
    <section id="showcase-dig" className="py-[120px] px-[8vw]">
      <div className="showcase-layout">
        <div className="viewer-mock app-mock reveal order-1 lg:order-1">
          <div className="chrome">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <div className="screen">
            <div className="fake-code">
              <div>&gt; iniciando servidor<span>...</span></div>
              <div>[ok] conexión a base de datos</div>
              <div>GET <span>/api/proyectos</span> 200</div>
              <div>POST <span>/api/login</span> 200</div>
              <div>[ok] build compilado</div>
              <div>GET <span>/dashboard</span> 200</div>
              <div>&gt; render completado <span>✓</span></div>
            </div>
            <div className="live-pill">
              <span className="blip"></span>EN VIVO
            </div>
            <div className="app-overlay">
              <span>Abrir proyecto real ↗</span>
            </div>
          </div>
        </div>

        <div className="showcase-text reveal order-2 lg:order-2">
          <div className="tag text-cdig">Cómo se ve — Digital</div>
          <h2 className="text-[clamp(24px,3.2vw,34px)] mb-4 font-display font-bold">Se ve en acción, no en capturas</h2>
          <p className="text-muted text-[15px] leading-[1.75] mb-[14px]">En vez de una simulación del software dentro de la página o una captura estática, cada proyecto digital se presenta con una vista previa en video corto, en loop silencioso.</p>
          <p className="text-muted text-[15px] leading-[1.75] mb-[14px]">Si el proyecto ya está publicado, un clic sobre la vista previa lleva directamente al sitio real.</p>
          <button onClick={onOpenGallery} className="btn-outline cdig">
            Ver proyectos digitales <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}