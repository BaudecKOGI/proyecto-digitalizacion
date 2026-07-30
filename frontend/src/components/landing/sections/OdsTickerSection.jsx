import React, { useRef, useState, useEffect } from 'react';
import { ODS_LIST } from '@/pages/dashboard/digitalProjects/odsData';

/**
 * Sección institucional que presenta un Ticker/Marquee infinito horizontal
 * con los 17 Objetivos de Desarrollo Sostenible (ODS) de la ONU en formato
 * de CUADROS OFICIALES (tiles cuadrados 160x160px con color sólido, número, título y símbolo).
 * 
 * Implementa un bucle de animación 100% garantizado por requestAnimationFrame (JS)
 * que avanza de manera continua y solo se pausa cuando el cursor se sitúa sobre el contenedor.
 */
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
    <section className="relative w-full overflow-hidden border-y border-line/40 bg-transparent py-14 px-0">
      {/* Encabezado Institucional Centrado y Orientado al Proyecto */}
      <div className="mx-auto max-w-4xl px-6 text-center mb-10">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-panel border border-line mb-4">
          <span className="h-2 w-2 bg-c3d" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-text">
            Agenda 2030 · ONU
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-text mb-3">
          Innovación al Servicio de los <span className="text-c3d">ODS</span>
        </h2>
        <p className="text-muted font-sans text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Los proyectos de fabricación digital y desarrollo de software del Fab Lab Continental están alineados para resolver desafíos reales y contribuir de manera activa a los Objetivos de Desarrollo Sostenible.
        </p>
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
              <button
                key={`${ods.id}-${index}`}
                onClick={() => onSelectOds?.(ods.id)}
                style={{ backgroundColor: ods.color }}
                className="group relative flex h-[160px] w-[160px] shrink-0 flex-col justify-between p-3.5 text-left text-white transition-all duration-300 hover:scale-[1.05] hover:shadow-xl cursor-pointer rounded-[3px] select-none shadow-md"
              >
                {/* Cabecera del cuadro ODS: Número en la izquierda + Título oficial en mayúsculas */}
                <div className="flex items-start gap-2">
                  <span className="font-display text-3xl font-black leading-none tracking-tight">
                    {ods.id}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase leading-[1.1] tracking-tight line-clamp-3 text-white/95">
                    {ods.fullTitle}
                  </span>
                </div>

                {/* Centro-inferior: Símbolo / Icono oficial en blanco */}
                <div className="flex flex-1 items-end justify-center pb-1">
                  {IconComponent && (
                    <IconComponent
                      size={54}
                      weight="fill"
                      color="#FFFFFF"
                      className="transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                    />
                  )}
                </div>

                {/* Borde de realce al hacer hover */}
                <div className="pointer-events-none absolute inset-0 border border-white/0 transition-colors duration-300 group-hover:border-white/40 rounded-[3px]" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
