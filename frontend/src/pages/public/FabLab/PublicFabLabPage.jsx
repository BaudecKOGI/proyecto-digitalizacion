import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Navbar from '@/components/landing/navigation/PublicNavbar';
import Footer from '@/components/landing/navigation/PublicFooter';
import CampusNetworkSection from './CampusNetworkSection';

// Phosphor Icons
import { Cube } from '@phosphor-icons/react/dist/ssr/Cube';
import { Scan } from '@phosphor-icons/react/dist/ssr/Scan';
import { Lightning } from '@phosphor-icons/react/dist/ssr/Lightning';
import { Circuitry } from '@phosphor-icons/react/dist/ssr/Circuitry';
import { Scissors } from '@phosphor-icons/react/dist/ssr/Scissors';
import { Wrench } from '@phosphor-icons/react/dist/ssr/Wrench';
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';
import { Certificate } from '@phosphor-icons/react/dist/ssr/Certificate';
import { UsersThree } from '@phosphor-icons/react/dist/ssr/UsersThree';
import { Globe } from '@phosphor-icons/react/dist/ssr/Globe';

const CAMPUS = [
  { city: 'Huancayo', role: 'Campus Principal', address: 'Av. San Carlos 1980, Urb. San Antonio' },
  { city: 'Lima', role: 'Sedes: Los Olivos y Miraflores', address: 'Capital — sede urbana' },
  { city: 'Arequipa', role: 'Campus Regional', address: 'Ciudad Blanca' },
  { city: 'Cusco', role: 'Campus Regional', address: 'Ciudad Imperial' },
];

const ACREDITACIONES = [
  { icon: Certificate, label: 'Sello SOFÍA 2026', sub: 'Primera universidad peruana — Fundación madri+d (España)' },
  { icon: Globe, label: 'QS Stars ★★★★★', sub: 'Cinco estrellas de excelencia institucional hasta 2027' },
  { icon: Certificate, label: 'ACBSP (EE.UU.)', sub: 'Carreras de Ciencias de la Empresa — vigente hasta 2028' },
  { icon: Certificate, label: 'ANECA-AUDIT', sub: 'Modelo de calidad del Espacio Europeo de Educación Superior' },
  { icon: Certificate, label: 'ICACIT', sub: 'Acreditación especializada en Ingeniería' },
  { icon: Certificate, label: 'ISO 9001', sub: 'Bureau Veritas — laboratorios y talleres certificados' },
];

const EQUIPOS = [
  { Icon: Cube, name: 'Impresoras 3D FDM', count: '8 unidades', desc: 'Ultimaker S3, Creality — PLA, PETG, TPU. Prototipado rápido de alta resolución.' },
  { Icon: Lightning, name: 'Cortadoras Láser', count: '3 unidades', desc: 'Corte y grabado en MDF, acrílico, tela y cuero. Mesa hasta 1 200 × 900 mm.' },
  { Icon: Wrench, name: 'Fresadora CNC', count: '2 unidades', desc: 'Mecanizado de piezas en aluminio, MDF y materiales compuestos de precisión.' },
  { Icon: Scan, name: 'Impresoras SLA', count: '2 unidades', desc: 'Resina de alta resolución para modelos médicos y piezas de ingeniería fina.' },
  { Icon: Scissors, name: 'Cortadora Vinilo', count: '1 unidad', desc: 'Señalética técnica, stickers y circuitos de papel conductivo.' },
  { Icon: Circuitry, name: 'Electrónica', count: 'Kit completo', desc: 'Soldadura SMD, osciloscopio, analizador lógico. Arduino, Raspberry Pi, ESP32.' },
];

const TIMELINE = [
  { year: '2000', title: 'Raíces institucionales', desc: 'La Universidad Continental es fundada, con raíces que remontan al Instituto Continental (1985), en Huancayo, Junín.' },
  { year: '2016', title: 'Apertura del Fab Lab', desc: 'Se inaugura el primer Fab Lab con equipos de última generación. Primera red de este tipo fuera de Lima en Perú.' },
  { year: '2018', title: 'SUNEDU & Red MIT', desc: 'Licenciamiento permanente de SUNEDU. Afiliación oficial a la Fab Lab Network del MIT — más de 2 000 laboratorios en 100 países.' },
  { year: '2020', title: 'Impacto COVID-19', desc: 'El Fab Lab lidera la fabricación de protectores faciales y dispositivos médicos de emergencia durante la pandemia.' },
  { year: '2022', title: 'Visor 3D Interactivo', desc: 'La plataforma digital permite visualizar proyectos estudiantiles en 3D en tiempo real desde cualquier navegador.' },
  { year: '2026', title: 'Sello SOFÍA Internacional', desc: 'La UC se convierte en la primera universidad del Perú en obtener esta acreditación del Espacio Europeo de Educación Superior.' },
];

const VALORES = [
  { Icon: Globe, label: 'Fabricación Distribuida', desc: 'El conocimiento no viaja en camiones: viaja en datos. Los planos, código y diseños se comparten bajo licencias Creative Commons.' },
  { Icon: UsersThree, label: 'Comunidad Maker', desc: 'Miembros de la Fab Lab Network del MIT — una red de más de 2 000 laboratorios en más de 100 países colaborando activamente.' },
  { Icon: Wrench, label: 'Impacto Real', desc: 'Cada proyecto resuelve un problema real de la comunidad. Desde prótesis de bajo costo hasta sensores de calidad del aire.' },
  { Icon: Lightning, label: 'Innovación Aplicada', desc: 'La fabricación digital como herramienta de impacto social, alineada con los ODS de la ONU y la Agenda 2030.' },
];

function EquipoCard({ eq, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const { Icon } = eq;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
        <Icon size={22} weight="duotone" className="text-indigo-600" />
      </div>
      <div className="mb-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-indigo-500">
        {eq.count}
      </div>
      <h3 className="mb-2 text-[16px] font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {eq.name}
      </h3>
      <p className="text-[13px] leading-relaxed text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
        {eq.desc}
      </p>
    </motion.div>
  );
}

function ValorItem({ v, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { Icon } = v;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: i * 0.1, duration: 0.55 }}
      className="flex gap-4"
    >
      <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
        <Icon size={22} weight="duotone" className="text-indigo-300" />
      </div>
      <div>
        <h3 className="mb-1 font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{v.label}</h3>
        <p className="text-[13px] leading-relaxed text-white/50" style={{ fontFamily: 'Roboto, sans-serif' }}>{v.desc}</p>
      </div>
    </motion.div>
  );
}

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

export default function PublicFabLabPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/*HERO*/}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-[#07101F]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('/assets/acerca.png')" }}
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
            <span className="text-indigo-400">Fab Lab</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.7 }}
            className="mt-6 max-w-lg text-[16px] leading-relaxed text-white/55"
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

      {/* MISIÓN — BLANCO */}
      <section className="py-24 px-[8vw]">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-indigo-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Nuestra Misión</p>
            <h2 className="mb-5 text-[clamp(26px,3.2vw,40px)] font-black leading-tight text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Democratizar el acceso a la fabricación digital
            </h2>
            <p className="mb-4 text-[15px] leading-relaxed text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              <em>Fab Lab</em> es un concepto nacido en el <strong>Center for Bits and Atoms (CBA) del MIT</strong> bajo la dirección del Dr. Neil Gershenfeld. La premisa es simple pero poderosa: equipar un laboratorio con un conjunto estándar de máquinas de fabricación digital y ponerlo al alcance de cualquier persona.
            </p>
            <p className="text-[15px] leading-relaxed text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              La Universidad Continental es la <strong>primera institución educativa en Perú</strong> en implementar una red descentralizada de Fab Labs fuera de Lima, con presencia en Huancayo, Arequipa, Cusco y Lima. Sus laboratorios están abiertos a estudiantes, investigadores y comunidad general.
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

      {/* RED DE CAMPUS — MAPA INTERACTIVO */}
      <CampusNetworkSection />


      {/* EQUIPOS — FONDO OSCURO */}
      <section className="bg-[#07101F] py-24 px-[8vw]">
        <div className="mx-auto max-w-[1400px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-indigo-400" style={{ fontFamily: 'Roboto, sans-serif' }}>Arsenal Tecnológico</p>
            <h2 className="text-[clamp(28px,3.5vw,46px)] font-black text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Equipos del Laboratorio</h2>
          </motion.div>
          {/* Valores del Fab Lab */}
          <div className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {VALORES.map((v, i) => <ValorItem key={i} v={v} i={i} />)}
          </div>
          {/* Tarjetas equipos — BLANCAS sobre fondo oscuro = contraste editorial */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EQUIPOS.map((eq, i) => <EquipoCard key={i} eq={eq} i={i} />)}
          </div>
        </div>
      </section>

      {/* ACREDITACIONES */}
      <section className="py-24 px-[8vw]">
        <div className="mx-auto max-w-[1400px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-indigo-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Calidad Certificada</p>
            <h2 className="text-[clamp(26px,3.2vw,40px)] font-black text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Acreditaciones Internacionales</h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ACREDITACIONES.map((a, i) => {
              const { icon: AIcon } = { icon: a.icon };
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08 }}
                  className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                    <a.icon size={20} weight="duotone" className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{a.label}</div>
                    <div className="text-[12px] leading-relaxed text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>{a.sub}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="border-t border-gray-100 py-24 px-[8vw]">
        <div className="mx-auto max-w-[780px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-indigo-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Historia</p>
            <h2 className="text-[clamp(26px,3.2vw,40px)] font-black text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Nuestra Trayectoria</h2>
          </motion.div>
          <div>
            {TIMELINE.map((item, i) => <TimelineItem key={i} item={item} index={i} />)}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
