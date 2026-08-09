import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CampusNetworkSection from './CampusNetworkSection';

const CAMPUS = [
  { city: 'Huancayo', role: 'Campus Principal', address: 'Av. San Carlos 1980, Urb. San Antonio' },
  { city: 'Lima', role: 'Sedes: Los Olivos y Miraflores', address: 'Capital — sede urbana' },
  { city: 'Arequipa', role: 'Campus Regional', address: 'Ciudad Blanca' },
  { city: 'Cusco', role: 'Campus Regional', address: 'Ciudad Imperial' },
];

const TIMELINE = [
  {
    year: '2000',
    title: 'Fundación y Legado Académico',
    desc: 'Constitución oficial de la Universidad Continental, consolidando un proyecto educativo de alto impacto regional que capitaliza la sólida trayectoria técnica y formativa iniciada por el Instituto Continental en 1985 en Huancayo.',
    img: '/assets/timeline/timeline_2000.png'
  },
  {
    year: '2016',
    title: 'Hito en Fabricación Digital',
    desc: 'Inauguración del Fab Lab UC, un ecosistema equipado con tecnología de manufactura avanzada que marcó un precedente histórico al descentralizar el acceso a la innovación tecnológica y la prototipación fuera de Lima.',
    img: '/assets/timeline/timeline_2016.png'
  },
  {
    year: '2018',
    title: 'Calidad Institucional y Red MIT',
    desc: 'Consolidación institucional tras obtener el licenciamiento de SUNEDU, en paralelo a su incorporación global a la Fab Lab Network del MIT, conectando el talento local con una comunidad científica de más de 100 países.',
    img: '/assets/timeline/timeline_2018.png'
  },
  {
    year: '2020',
    title: 'Respuesta e Impacto Social',
    desc: 'Validación del propósito social de la universidad mediante el liderazgo activo del Fab Lab durante la crisis sanitaria, transformando capacidades de diseño en soluciones y material biomédico de emergencia para el sector salud.',
    img: '/assets/timeline/timeline_2020.png'
  },
  {
    year: '2022',
    title: 'Transformación Digital y 3D',
    desc: 'Evolución de la experiencia educativa interactiva con el lanzamiento de un ecosistema web 3D, facilitando la visualización, validación y exposición global de proyectos estudiantiles en tiempo real y sin barreras geográficas.',
    img: '/assets/timeline/timeline_2022.png'
  },
  {
    year: '2026',
    title: 'Acreditación Europea Global',
    desc: 'Hito histórico en la educación superior del país: la UC se convierte en la primera universidad del Perú en recibir el prestigioso Sello SOFÍA de la Fundación madri+d, certificando su excelencia bajo los exigentes estándares europeos (ESG).',
    img: '/assets/timeline/timeline_2026.png'
  },
];

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.05 }}
      className="flex gap-6"
    >
      {/* Línea */}
      <div className="flex flex-col items-center">
        <div className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-indigo-500 ring-4 ring-indigo-100" />
        {index < TIMELINE.length - 1 && <div className="mt-1 w-px flex-grow bg-gray-200" />}
      </div>
      <div className="pb-10">
        <span className="mb-1 block font-mono text-[11px] font-black tracking-widest text-indigo-500">
          {item.year}
        </span>
        <h3 className="mb-1.5 text-[17px] font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {item.title}
        </h3>
        <p className="text-[14px] leading-relaxed text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function FabLabPage() {
  return (
    <div className="w-full flex flex-col bg-white">

      {/* HERO */}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-[#07101F]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('/assets/heros/impresora.jpg')" }}
        />
        <div className="pointer-events-none absolute left-[18%] top-1/4 h-80 w-80 rounded-full bg-indigo-500/12 blur-[100px]" />
        <div className="pointer-events-none absolute right-[10%] bottom-1/3 h-60 w-60 rounded-full bg-violet-500/8 blur-[80px]" />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-[8vw] pb-16 pt-36">

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.85 }}
            className="max-w-3xl text-[clamp(42px,6.5vw,84px)] font-black leading-[0.97] tracking-tight text-white"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Acerca del<br />
            <span className="text-[#5A00AA]">Fab Lab</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.7 }}
            className="mt-6 max-w-lg text-[16px] leading-relaxed text-white/80"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            El único laboratorio de fabricación digital en red descentralizada del Perú. Convertimos ideas en prototipos reales con tecnología de vanguardia y filosofía maker.
          </motion.p>
          {/* Tag pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-2.5"
          >
            {['Red MIT Fab Lab', 'SUNEDU Licenciada', 'QS Stars ★★★★★', 'Sello SOFÍA 2026', '4 Campus en Perú'].map((tag) => (
              <span key={tag} className="border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/60"
                style={{ fontFamily: 'Roboto, sans-serif' }}>
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MISIÓN */}
      <section className="py-24 px-[8vw] bg-[#F8F9FB]">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-indigo-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Nuestra Misión</p>
            <h2 className="mb-5 text-[clamp(26px,3.2vw,40px)] font-black leading-tight text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Democratizar el acceso a la fabricación digital
            </h2>
            <p className="text-[15px] leading-relaxed text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Llevamos el concepto nacido en el MIT a todo el país para poner la tecnología al alcance de todos:
            </p>
            <p className="text-[15px] leading-relaxed text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              <strong>Pioneros en el Perú</strong>: Primera red universitaria descentralizada de laboratorios fuera de Lima.<br />
              <strong>Presencia estratégica</strong>: Espacios activos en Huancayo, Arequipa, Cusco y Lima.<br />
              <strong>Espacio abierto</strong>: Diseñado para estudiantes, investigadores y la comunidad general.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-end"
          >
            <img
              src="/assets/nuestra-mision.png"
              alt="Misión Fab Lab UC"
              className="w-full object-cover"
              style={{ borderRadius: 0 }}
            />
          </motion.div>
        </div>
      </section>

      {/* RED DE CAMPUS */}
      <CampusNetworkSection />

      {/* TIMELINE */}
      <section className="py-24 px-[8vw] bg-[#F8F9FB]">
        <div className="mx-auto max-w-[1200px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Historia</p>
            <h2 className="text-[clamp(28px,3.5vw,44px)] font-black text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Nuestro Legado</h2>
          </motion.div>
          {/* Timeline Line & Content */}
          <div className="relative">
            {/* The vertical line */}
            <div className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-gray-200" />

            <div className="space-y-10 py-6">
              {TIMELINE.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <div key={i} className={`relative flex items-center justify-start md:justify-between ${!isLeft ? 'md:flex-row-reverse' : ''}`}>

                    {/* The content block */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className={`w-[calc(100%-60px)] ml-[60px] md:w-1/2 md:ml-0`}
                    >
                      <div className={`${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'} text-left`}>
                        <span className="mb-2 block font-mono text-[13px] font-black tracking-widest text-indigo-500">
                          {item.year}
                        </span>
                        <h3 className="mb-3 text-[19px] font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {item.title}
                        </h3>
                        <p className="text-[15px] leading-relaxed text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>

                    {/* Central dot */}
                    <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-white" />
                    </div>

                    {/* The Image block */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className={`hidden md:block md:w-1/2 ${isLeft ? 'pl-12' : 'pr-12'}`}
                    >
                      <div className="overflow-hidden rounded shadow-sm border border-gray-100 group cursor-pointer">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </motion.div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* INVITACIÓN */}
      <section className="py-24 px-[8vw] bg-white">
        <div className="mx-auto max-w-[800px] text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-5 text-[clamp(26px,3.2vw,40px)] font-black text-gray-900 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Te invitamos a conocer más sobre nuestro Fab Lab
            </h2>
            <p className="mb-10 text-[16px] leading-relaxed text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Descubre los proyectos, las instalaciones y todo lo que la red de Fab Labs de la Universidad Continental tiene para ofrecerte.
            </p>
            <a
              href="https://fablab.ucontinental.edu.pe/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-indigo-600 px-8 py-4 text-[15px] font-bold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Visitar portal oficial
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
