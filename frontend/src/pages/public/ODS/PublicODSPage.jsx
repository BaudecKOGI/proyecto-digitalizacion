import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import OdsWheel from '../../../components/landing/ods/OdsWheel';

// Phosphor Icons — un ícono curado para cada ODS
import { HandHeart } from '@phosphor-icons/react/dist/ssr/HandHeart';
import { Plant } from '@phosphor-icons/react/dist/ssr/Plant';
import { Heartbeat } from '@phosphor-icons/react/dist/ssr/Heartbeat';
import { BookOpen } from '@phosphor-icons/react/dist/ssr/BookOpen';
import { GenderIntersex } from '@phosphor-icons/react/dist/ssr/GenderIntersex';
import { Drop } from '@phosphor-icons/react/dist/ssr/Drop';
import { Lightning } from '@phosphor-icons/react/dist/ssr/Lightning';
import { TrendUp } from '@phosphor-icons/react/dist/ssr/TrendUp';
import { Factory } from '@phosphor-icons/react/dist/ssr/Factory';
import { Scales } from '@phosphor-icons/react/dist/ssr/Scales';
import { Buildings } from '@phosphor-icons/react/dist/ssr/Buildings';
import { ArrowsClockwise } from '@phosphor-icons/react/dist/ssr/ArrowsClockwise';
import { Wind } from '@phosphor-icons/react/dist/ssr/Wind';
import { Fish } from '@phosphor-icons/react/dist/ssr/Fish';
import { Tree } from '@phosphor-icons/react/dist/ssr/Tree';
import { Bird } from '@phosphor-icons/react/dist/ssr/Bird';
import { Handshake } from '@phosphor-icons/react/dist/ssr/Handshake';

/* DATOS ODS */
const ODS_DATA = [
  { id: 1, color: '#E5243B', Icon: HandHeart, title: 'Fin de la Pobreza', desc: 'Erradicar la pobreza extrema para todas las personas en el mundo de aquí a 2030.', img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800' },
  { id: 2, color: '#DDA63A', Icon: Plant, title: 'Hambre Cero', desc: 'Lograr la seguridad alimentaria, mejorar la nutrición y promover la agricultura sostenible.', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800' },
  { id: 3, color: '#4C9F38', Icon: Heartbeat, title: 'Salud y Bienestar', desc: 'Garantizar una vida sana y promover el bienestar para todos en todas las edades.', img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' },
  { id: 4, color: '#C5192D', Icon: BookOpen, title: 'Educación de Calidad', desc: 'Garantizar una educación inclusiva, equitativa y de calidad y promover oportunidades de aprendizaje.', img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800' },
  { id: 5, color: '#FF3A21', Icon: GenderIntersex, title: 'Igualdad de Género', desc: 'Lograr la igualdad de género y empoderar a todas las mujeres y niñas.', img: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800' },
  { id: 6, color: '#26BDE2', Icon: Drop, title: 'Agua Limpia y Saneamiento', desc: 'Garantizar la disponibilidad y gestión sostenible del agua y el saneamiento para todos.', img: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&q=80&w=800' },
  { id: 7, color: '#FCC30B', Icon: Lightning, title: 'Energía Asequible', desc: 'Garantizar el acceso a energía asequible, fiable, sostenible y moderna para todos.', img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800' },
  { id: 8, color: '#A21942', Icon: TrendUp, title: 'Trabajo Decente y Crecimiento', desc: 'Promover el crecimiento económico sostenido, inclusivo y el trabajo decente para todos.', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800' },
  { id: 9, color: '#FD6925', Icon: Factory, title: 'Industria, Innovación e Infraestructura', desc: 'Construir infraestructuras resilientes, promover la industrialización y la innovación.', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800' },
  { id: 10, color: '#DD1367', Icon: Scales, title: 'Reducción de Desigualdades', desc: 'Reducir la desigualdad en y entre los países.', img: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800' },
  { id: 11, color: '#FD9D24', Icon: Buildings, title: 'Ciudades y Comunidades Sostenibles', desc: 'Lograr que las ciudades sean inclusivas, seguras, resilientes y sostenibles.', img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800' },
  { id: 12, color: '#BF8B2E', Icon: ArrowsClockwise, title: 'Producción y Consumo Responsables', desc: 'Garantizar modalidades de consumo y producción sostenibles.', img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800' },
  { id: 13, color: '#3F7E44', Icon: Wind, title: 'Acción por el Clima', desc: 'Adoptar medidas urgentes para combatir el cambio climático y sus efectos.', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' },
  { id: 14, color: '#0A97D9', Icon: Fish, title: 'Vida Submarina', desc: 'Conservar y utilizar de forma sostenible los océanos, los mares y los recursos marinos.', img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=800' },
  { id: 15, color: '#56C02B', Icon: Tree, title: 'Vida de Ecosistemas Terrestres', desc: 'Proteger, restablecer y promover el uso sostenible de los ecosistemas terrestres.', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800' },
  { id: 16, color: '#00689D', Icon: Bird, title: 'Paz, Justicia e Instituciones Sólidas', desc: 'Promover sociedades pacíficas e inclusivas para el desarrollo sostenible.', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800' },
  { id: 17, color: '#19486A', Icon: Handshake, title: 'Alianzas para Lograr los Objetivos', desc: 'Fortalecer los medios de implementación y revitalizar la Alianza Mundial para el DS.', img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800' },
];

/*SUB-COMPONENTES*/
function OdsCard({ ods, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const { Icon } = ods;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Top color band */}
      <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: ods.color }} />

      <div className="flex flex-1 flex-col p-6">
        {/* Number + Icon row */}
        <div className="mb-4 flex items-center justify-between">
          <span
            className="text-[11px] font-black tabular-nums tracking-[0.15em]"
            style={{ color: ods.color, fontFamily: 'Roboto, sans-serif' }}
          >
            ODS {ods.id < 10 ? `0${ods.id}` : ods.id}
          </span>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${ods.color}15` }}
          >
            <Icon size={20} weight="duotone" style={{ color: ods.color }} />
          </div>
        </div>

        <h3
          className="mb-2 text-[15px] font-bold leading-snug text-gray-900"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {ods.title}
        </h3>
        <p
          className="mt-auto text-[13px] leading-relaxed text-gray-500"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          {ods.desc}
        </p>
      </div>
    </motion.div>
  );
}

/*PÁGINA */
export default function PublicODSPage() {
  const [activeOdsId, setActiveOdsId] = useState(1);

  return (
    <div className="w-full flex flex-col" style={{ background: '#f8f9fb' }}>

      {/* HERO ODS */}
      <section className="relative flex min-h-[58vh] items-end overflow-hidden bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/heros/ods-hero-bg.png')" }}
        />
        {/* Gradient overlays to protect text legibility while showing image on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

        {/* Orbs decorativos para darle vida extra */}
        <div className="pointer-events-none absolute left-[12%] top-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute right-[8%] bottom-1/4 h-56 w-56 rounded-full bg-cyan-400/20 blur-[80px]" />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-[8vw] pb-16 pt-36">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="max-w-3xl text-[clamp(42px,6.5vw,82px)] font-bold leading-[1.05] tracking-tight text-gray-900"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Objetivos de<br />
            <span className="text-blue-600 font-extrabold">Desarrollo</span><br />
            Sostenible
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.7 }}
            className="mt-6 max-w-xl text-[18px] leading-[19px] text-[#212529] font-light"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            17 objetivos que guían al mundo hacia un futuro más equitativo y sostenible. En el Fab Lab UC, cada proyecto que diseñamos y fabricamos está explícitamente vinculado a estos propósitos globales.
          </motion.p>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24 px-[8vw]">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-blue-600" style={{ fontFamily: 'Roboto, sans-serif' }}>¿Qué son los ODS?</p>
            <h2 className="mb-5 text-[clamp(26px,3.2vw,40px)] font-black leading-tight text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Un plan de acción global para el planeta</h2>
            <p className="text-[18px] leading-[19px] text-[#212529] font-light" style={{ fontFamily: 'Roboto, sans-serif' }}>
              En septiembre de 2015, los 193 estados miembros de la ONU adoptaron la <strong>Agenda 2030 para el Desarrollo Sostenible</strong>: un plan universal con 17 ODS y 169 metas concretas. Estos objetivos suceden a los Objetivos del Milenio (ODM) y constituyen el marco de referencia mundial para erradicar la pobreza, proteger el planeta y garantizar prosperidad para todos.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.14 }}
          >
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-blue-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Fab Lab UC y los ODS</p>
            <h2 className="mb-5 text-[clamp(26px,3.2vw,40px)] font-black leading-tight text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Innovación con propósito social</h2>
            <p className="text-[18px] leading-[19px] text-[#212529] font-light" style={{ fontFamily: 'Roboto, sans-serif' }}>
              En el Fab Lab de la Universidad Continental, cada proyecto estudiantil está clasificado y vinculado explícitamente a los ODS. Desde prótesis de bajo costo <strong>(ODS 3 y 10)</strong> hasta sistemas de monitoreo hídrico <strong>(ODS 6 y 14)</strong>, la fabricación digital se convierte en una herramienta de impacto real alineada con la Agenda 2030.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ODS WHEEL SECTION */}
      <section className="bg-white py-24 px-[8vw]">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-blue-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Los 17 Objetivos</p>
              <h2 className="text-[clamp(26px,3vw,40px)] font-black text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Explora cada ODS</h2>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-stretch">
            {/* Left: The Wheel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <OdsWheel odsData={ODS_DATA} activeId={activeOdsId} onHover={setActiveOdsId} />
            </div>

            {/* Right: The details panel */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              {(() => {
                const activeOds = ODS_DATA.find(ods => ods.id === activeOdsId) || ODS_DATA[0];
                const { Icon } = activeOds;
                return (
                  <motion.div
                    key={activeOds.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-white shadow-xl ring-1 ring-black/5"
                  >
                    {/* Image Header */}
                    <div className="relative h-[300px] w-full overflow-hidden bg-gray-100">
                      <img
                        src={activeOds.img}
                        alt={activeOds.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-6 flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md"
                          style={{ color: activeOds.color }}
                        >
                          <Icon size={28} weight="fill" />
                        </div>
                        <span className="text-xl font-black text-white drop-shadow-sm tracking-widest font-mono">
                          ODS {activeOds.id < 10 ? `0${activeOds.id}` : activeOds.id}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 border-t-[6px]" style={{ borderColor: activeOds.color }}>
                      <h3
                        className="mb-4 text-[clamp(20px,2vw,28px)] font-black leading-snug text-gray-900"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {activeOds.title}
                      </h3>
                      <p 
                        className="text-[18px] leading-[19px] text-[#212529] font-light"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        {activeOds.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
