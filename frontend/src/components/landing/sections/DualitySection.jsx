import React from 'react';
import useReveal from "../../../hooks/useReveal"; // Asegúrate de importar el hook

export default function DualitySection() {
  useReveal(); // Ejecuta la animación de scroll

  return (
    <section id="duality" className="py-[140px] px-[8vw]">
      <div className="section-head reveal max-w-[640px] mb-16">
        <div className="eyebrow text-c3d">
          <span className="text-muted">Un solo requerimiento</span>
        </div>
        <h2 className="text-[clamp(28px,4vw,42px)] font-bold font-display">Dos mundos, una plataforma</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          No importa si un proyecto se imprimió en una impresora 3D o se compiló en una terminal — aquí se presenta con el mismo nivel de detalle.
        </p>
      </div>

      <div className="duality-grid reveal">
        <div className="duality-col d3d">
          <div className="tag">Fabricación digital</div>
          <h3 className="text-2xl mb-[14px] font-display">Proyectos 3D</h3>
          <p className="text-muted text-[14.5px] leading-relaxed">Piezas modeladas en CAD, impresas o cortadas en el taller del Fab Lab.</p>
          <ul>
            <li>Visor 3D interactivo, en la propia página</li>
            <li>Rotación libre y, en algunos casos, piezas articulables</li>
            <li>Ficha técnica: material, autor, proceso de fabricación</li>
          </ul>
        </div>

        <div className="duality-col ddig">
          <div className="tag">Desarrollo de software</div>
          <h3 className="text-2xl mb-[14px] font-display">Proyectos digitales</h3>
          <p className="text-muted text-[14.5px] leading-relaxed">Apps, sistemas y páginas web construidas por alumnos.</p>
          <ul>
            <li>Vista previa en video, siempre en movimiento</li>
            <li>Un clic lleva directo al proyecto real, si está publicado</li>
            <li>Ficha técnica: stack usado, autor, repositorio</li>
          </ul>
        </div>
      </div>
    </section>
  );
}