import React, { useRef, useState, useEffect } from 'react';
import { ODS_LIST } from '@/pages/dashboard/digitalProjects/odsData';

//CUADROS OFICIALES
export default function OdsTickerSection({ onSelectOds }) {
  // Duplicamos el array para que el desplazamiento infinito sea continuo
  const tickerItems = [...ODS_LIST, ...ODS_LIST];

  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollPosRef = useRef(0);

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      if (!isHovered && trackRef.current) {
        // Avanzamos 1.2px por fotograma para un movimiento constante, perceptible y suave (60fps)
        scrollPosRef.current += 1.2;
        const totalWidth = trackRef.current.scrollWidth;
        const halfWidth = totalWidth / 2;

        if (halfWidth > 0 && scrollPosRef.current >= halfWidth) {
          scrollPosRef.current = 0;
        }
        trackRef.current.style.transform = `translate3d(-${scrollPosRef.current}px, 0, 0)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <section className="relative w-full overflow-hidden border-t border-line/40 bg-transparent pt-14 px-0">
      {/* Encabezado Institucional Centrado y Orientado al Proyecto */}
      <div className="mx-auto max-w-4xl px-6 text-center mb-10">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-panel border border-line mb-4">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-text">
            Agenda 2030 · ONU
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-text mb-3">
          Innovación al Servicio de los <span className="text-c3d">ODS</span>
        </h2>
      </div>

      {/* Contenedor del Marquee Infinito (con detección de hover clara) */}
      <div
        className="relative w-full overflow-hidden flex py-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Desvanecimiento en bordes izquierdo y derecho (Fade Mask adaptado al fondo claro de la página) */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-bg to-transparent" />

        {/* Track animado con requestAnimationFrame para un avance continuo sin fallos CSS */}
        <div
          ref={trackRef}
          className="flex items-center gap-3.5 px-2 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {tickerItems.map((ods, index) => {
            const IconComponent = ods.icon;

            return (
              <div
                key={`${ods.id}-${index}`}
                style={{ backgroundColor: ods.color }}
                className="group relative flex h-[160px] w-[160px] shrink-0 flex-col justify-between p-3.5 text-left text-white transition-all duration-300 hover:scale-[1.05] hover:shadow-xl cursor-default rounded-[3px] select-none shadow-md overflow-hidden"
              >
                {/* Cabecera del cuadro ODS: Número en la izquierda + Título oficial en mayúsculas */}
                <div className="flex items-start gap-2">
                  <span className="font-display text-3xl font-black leading-none tracking-tight transition-opacity duration-300 group-hover:opacity-10">
                    {ods.id}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase leading-[1.1] tracking-tight line-clamp-3 text-white/95 transition-opacity duration-300 group-hover:opacity-10">
                    {ods.fullTitle}
                  </span>
                </div>

                {/* Centro-inferior: Símbolo / Icono oficial en blanco */}
                <div className="flex flex-1 items-end justify-center pb-1 transition-opacity duration-300 group-hover:opacity-10">
                  {IconComponent && (
                    <IconComponent
                      size={54}
                      weight="fill"
                      color="#FFFFFF"
                      className="transition-transform duration-300 drop-shadow-sm"
                    />
                  )}
                </div>

                {/* Borde de realce al hacer hover */}
                <div className="pointer-events-none absolute inset-0 border border-white/0 transition-colors duration-300 group-hover:border-white/20 rounded-[3px]" />

                {/* Overlay con botones en hover */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button 
                    onClick={() => onSelectOds?.('software', ods.id)}
                    className="w-full flex-1 flex items-center justify-center font-sans text-[12px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors"
                  >
                    Digitales
                  </button>
                  <div className="h-[1px] w-16 bg-white/20"></div>
                  <button 
                    onClick={() => onSelectOds?.('3d', ods.id)}
                    className="w-full flex-1 flex items-center justify-center font-sans text-[12px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors"
                  >
                    Diseños 3D
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Introducción a los proyectos */}
      <div className="w-full bg-surface py-20 px-6 mt-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[clamp(20px,3vw,30px)] leading-relaxed text-muted max-w-4xl mx-auto" style={{ fontFamily: '"Open Sans", sans-serif' }}>
            Explora nuestro catálogo en constante crecimiento. Desde piezas anatómicas y mecánicas impresas en 3D de alta fidelidad, hasta soluciones de software y plataformas digitales que impactan en nuestro entorno.
          </p>
        </div>
      </div>
    </section>
  );
}
