import React, { useRef, useState, useEffect } from 'react';
import { ODS_LIST } from '@/pages/dashboard/digitalProjects/odsData';

// Imágenes de mayor resolución y calidad
const ODS_BG_IMAGES = {
  1: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=90",
  2: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=90",
  3: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=90",
  4: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=90",
  5: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=90",
  6: "https://images.unsplash.com/photo-1548826879-189bc7504044?auto=format&fit=crop&w=800&q=90",
  7: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=90",
  8: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=90",
  9: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=90",
  10: "https://images.unsplash.com/photo-1531206715517-5c0ba140e2b8?auto=format&fit=crop&w=800&q=90",
  11: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=90",
  12: "https://images.unsplash.com/photo-1532996127008-052445996306?auto=format&fit=crop&w=800&q=90",
  13: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=90",
  14: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=90",
  15: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=90",
  16: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=90",
  17: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=90",
};

export default function OdsTickerSection({ onSelectOds }) {
  const tickerItems = [...ODS_LIST, ...ODS_LIST];

  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollPosRef = useRef(0);

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      if (!isHovered && trackRef.current) {
        scrollPosRef.current += 1.8;
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
      {/* Encabezado */}
      <div className="mx-auto max-w-4xl px-6 text-center mb-10">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-panel border border-line mb-4">
          <span className="font-['Inter'] text-xs font-bold uppercase tracking-[0.2em] text-text">
            Agenda 2030 · ONU
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-text mb-3">
          Innovación al Servicio de los <span className="text-[#5A00AA]">ODS</span>
        </h2>
      </div>

      {/* Marquee */}
      <div
        className="relative w-full overflow-hidden flex py-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Fades laterales */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-bg to-transparent" />

        <div
          ref={trackRef}
          className="flex items-center gap-3.5 px-2 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {tickerItems.map((ods, index) => {
            const IconComponent = ods.icon;
            const bgImage = ODS_BG_IMAGES[ods.id];

            return (
              <div
                key={`${ods.id}-${index}`}
                className="group relative flex h-[260px] w-[200px] sm:h-[340px] sm:w-[260px] shrink-0 flex-col justify-between p-4 sm:p-6 text-left text-white transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl cursor-default rounded-none select-none shadow-lg overflow-hidden border border-white/10"
              >
                {/* Imagen de fondo (ahora de alta calidad) */}
                {bgImage && (
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${bgImage}')` }}
                  />
                )}

                {/* Overlay más ligero para que se vea mejor la imagen */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

                {/* Número + Icono */}
                <div className="relative z-10 flex items-start justify-between pointer-events-none">
                  <span
                    className="font-display text-4xl sm:text-5xl font-black leading-none tracking-tight drop-shadow-md"
                    style={{ color: ods.color }}
                  >
                    {String(ods.id).padStart(2, '0')}
                  </span>
                  {IconComponent && (
                    <div
                      className="rounded-none p-1.5 sm:p-2 border backdrop-blur-md"
                      style={{
                        borderColor: `${ods.color}40`,
                        backgroundColor: `${ods.color}20`,
                      }}
                    >
                      <IconComponent
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        weight="fill"
                        style={{ color: ods.color }}
                      />
                    </div>
                  )}
                </div>

                {/* Título */}
                <div className="relative z-10 mt-auto transition-transform duration-500 group-hover:-translate-y-12 pointer-events-none">
                  <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 block mb-1">
                    Objetivo {ods.id}
                  </span>
                  <h3 className="font-display text-[13px] sm:text-[16px] font-black uppercase leading-snug tracking-wide text-white line-clamp-3">
                    {ods.fullTitle}
                  </h3>
                </div>

                {/* Panel de acciones */}
                <div className="absolute inset-x-0 bottom-0 z-20 flex h-14 translate-y-full transition-transform duration-500 group-hover:translate-y-0 bg-black/90 backdrop-blur-sm border-t border-white/10">
                  <button
                    onClick={() => onSelectOds?.('software', ods.id)}
                    className="flex-1 flex items-center justify-center font-sans text-[11px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors"
                  >
                    Digitales
                  </button>
                  <div className="w-[1px] h-full bg-white/10" />
                  <button
                    onClick={() => onSelectOds?.('3d', ods.id)}
                    className="flex-1 flex items-center justify-center font-sans text-[11px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors"
                  >
                    Modelos 3D
                  </button>
                </div>

                {/* Borde con color ODS */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 border border-transparent transition-colors duration-500"
                  style={{ borderColor: `${ods.color}40` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Texto inferior */}
      <div className="w-full pt-6 pb-20 px-6 mt-4">
        <div className="mx-auto max-w-5xl text-center">
          <p
            className="text-[17px] sm:text-[20px] lg:text-[25px] leading-relaxed font-normal text-[#000000] max-w-4xl mx-auto"
            style={{ fontFamily: '"Neue Plak", sans-serif' }}
          >
            Explora nuestro catálogo en constante crecimiento. Desde piezas
            anatómicas y mecánicas impresas en 3D de alta fidelidad, hasta
            soluciones de software y plataformas digitales que impactan en
            nuestro entorno.
          </p>
        </div>
      </div>
    </section>
  );
}