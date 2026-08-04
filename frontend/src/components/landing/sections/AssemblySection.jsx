import React from 'react';

export default function AssemblySection() {
  return (
    <section id="assembly" className="flex min-h-[50vh] overflow-hidden p-0">
      <div className="flex w-full flex-col md:flex-row">

        {/* Izquierda: Texto destacado más claro */}
        <div className="flex flex-[2] flex-col justify-center bg-bg px-[8vw] py-24 md:py-32">
          <h2 className="font-display text-[clamp(40px,4.5vw,72px)] font-bold leading-[1.05] tracking-tight text-text">
            Innovación <br />
            y Fabricación <br />
            <span className="text-cyan-600">Digital.</span> {/* Antes: text-cyan-900 */}
          </h2>
        </div>

        {/* Derecha: Fondo de panel más claro */}
        <div className="flex flex-[3] flex-col justify-center bg-cyan-600 px-[6vw] py-24 md:py-32"> {/* Antes: bg-cyan-900 */}
          <p
            className="text-[clamp(20px,2.5vw,30px)] font-semibold leading-snug text-white"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            En el Fab Lab de la Universidad Continental convertimos ideas abstractas en realidades tangibles.
          </p>
          <p
            className="mt-6 text-[clamp(16px,1.5vw,20px)] leading-relaxed text-white/90"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Desde el modelado 3D de alta precisión anatómica e industrial, hasta el desarrollo de arquitecturas de software eficientes.
            Este catálogo interactivo es un testamento al talento y la capacidad técnica de nuestra comunidad académica.
          </p>
        </div>

      </div>
    </section>

  );
}