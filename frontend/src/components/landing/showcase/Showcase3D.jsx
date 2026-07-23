import React from 'react';
import useReveal from "../../../hooks/useReveal";

export default function Showcase3D({ onOpenGallery }) {
  useReveal();

  return (
    <section id="showcase-3d" className="py-[120px] px-[8vw]">
      <div className="showcase-layout">
        <div className="showcase-text reveal">
          <div className="tag text-c3d">Cómo se ve — 3D</div>
          <h2 className="text-[clamp(24px,3.2vw,34px)] mb-4 font-display font-bold">El diseño se rota, no se describe</h2>
          <p className="text-muted text-[15px] leading-[1.75] mb-[14px]">Cada proyecto 3D se carga directamente en la página con su propio visor: el visitante lo rota, hace zoom, y si tiene partes móviles, puede manipularlas con el mouse.</p>
          <p className="text-muted text-[15px] leading-[1.75] mb-[14px]">Sin videos pregrabados de por medio — es el modelo real, corriendo en el navegador.</p>
          <button onClick={onOpenGallery} className="btn-outline c3d">
            Ver proyectos 3D <span className="arrow">→</span>
          </button>
        </div>

        <div className="viewer-mock reveal">
          <div className="corner tl border-c3d"></div>
          <div className="corner tr border-c3d"></div>
          <div className="corner bl border-c3d"></div>
          <div className="corner br border-c3d"></div>
          
          <div className="absolute top-3 right-3 font-mono text-[10.5px] text-c3d">arrastra para rotar</div>
          <div className="absolute bottom-3 left-3 font-mono text-[10.5px] text-muted">VISTA_3D · proyecto_ejemplo.glb</div>
          
          <div className="cube-stage">
            <div className="cube">
              <div className="f1"></div><div className="f2"></div><div className="f3"></div>
              <div className="f4"></div><div className="f5"></div><div className="f6"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}