import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Navbar from '@/components/landing/navigation/PublicNavbar';
import Footer from '@/components/landing/navigation/PublicFooter';

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

/* ─────────────────────────── DATOS ODS ─────────────────────────── */
const ODS_DATA = [
  { id: 1, color: '#E5243B', Icon: HandHeart, title: 'Fin de la Pobreza', desc: 'Erradicar la pobreza extrema para todas las personas en el mundo de aquí a 2030.' },
  { id: 2, color: '#DDA63A', Icon: Plant, title: 'Hambre Cero', desc: 'Lograr la seguridad alimentaria, mejorar la nutrición y promover la agricultura sostenible.' },
  { id: 3, color: '#4C9F38', Icon: Heartbeat, title: 'Salud y Bienestar', desc: 'Garantizar una vida sana y promover el bienestar para todos en todas las edades.' },
  { id: 4, color: '#C5192D', Icon: BookOpen, title: 'Educación de Calidad', desc: 'Garantizar una educación inclusiva, equitativa y de calidad y promover oportunidades de aprendizaje.' },
  { id: 5, color: '#FF3A21', Icon: GenderIntersex, title: 'Igualdad de Género', desc: 'Lograr la igualdad de género y empoderar a todas las mujeres y niñas.' },
  { id: 6, color: '#26BDE2', Icon: Drop, title: 'Agua Limpia y Saneamiento', desc: 'Garantizar la disponibilidad y gestión sostenible del agua y el saneamiento para todos.' },
  { id: 7, color: '#FCC30B', Icon: Lightning, title: 'Energía Asequible', desc: 'Garantizar el acceso a energía asequible, fiable, sostenible y moderna para todos.' },
  { id: 8, color: '#A21942', Icon: TrendUp, title: 'Trabajo Decente y Crecimiento', desc: 'Promover el crecimiento económico sostenido, inclusivo y el trabajo decente para todos.' },
  { id: 9, color: '#FD6925', Icon: Factory, title: 'Industria, Innovación e Infraestructura', desc: 'Construir infraestructuras resilientes, promover la industrialización y la innovación.' },
  { id: 10, color: '#DD1367', Icon: Scales, title: 'Reducción de Desigualdades', desc: 'Reducir la desigualdad en y entre los países.' },
  { id: 11, color: '#FD9D24', Icon: Buildings, title: 'Ciudades y Comunidades Sostenibles', desc: 'Lograr que las ciudades sean inclusivas, seguras, resilientes y sostenibles.' },
  { id: 12, color: '#BF8B2E', Icon: ArrowsClockwise, title: 'Producción y Consumo Responsables', desc: 'Garantizar modalidades de consumo y producción sostenibles.' },
  { id: 13, color: '#3F7E44', Icon: Wind, title: 'Acción por el Clima', desc: 'Adoptar medidas urgentes para combatir el cambio climático y sus efectos.' },
  { id: 14, color: '#0A97D9', Icon: Fish, title: 'Vida Submarina', desc: 'Conservar y utilizar de forma sostenible los océanos, los mares y los recursos marinos.' },
  { id: 15, color: '#56C02B', Icon: Tree, title: 'Vida de Ecosistemas Terrestres', desc: 'Proteger, restablecer y promover el uso sostenible de los ecosistemas terrestres.' },
  { id: 16, color: '#00689D', Icon: Bird, title: 'Paz, Justicia e Instituciones Sólidas', desc: 'Promover sociedades pacíficas e inclusivas para el desarrollo sostenible.' },
  { id: 17, color: '#19486A', Icon: Handshake, title: 'Alianzas para Lograr los Objetivos', desc: 'Fortalecer los medios de implementación y revitalizar la Alianza Mundial para el DS.' },
];

const STATS = [
  { value: '193', label: 'países firmantes', sub: 'Agenda 2030 · ONU' },
  { value: '17', label: 'objetivos globales', sub: 'ODS – adoptados 2015' },
  { value: '169', label: 'metas específicas', sub: 'para medir el avance' },
  { value: '2030', label: 'horizonte meta', sub: 'año de cumplimiento' },
];

/*SUB-COMPONENTES*/
function AnimatedCounter({ to, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const end = parseInt(to, 10);
      if (isNaN(end)) {
        setCount(to);
        return;
      }

      const totalDuration = duration * 1000;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / totalDuration, 1);

        // easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        setCount(Math.floor(easeProgress * end));

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [inView, to, duration]);

  return <span ref={ref}>{count}</span>;
}

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
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8f9fb' }}>
      <Navbar />

      {/* HERO OSCURO (Suave) */}
      <section className="relative flex min-h-[58vh] items-end overflow-hidden bg-[#1E293B]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1600')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-[#1E293B]/80 to-transparent" />
        {/* Orbs decorativos */}
        <div className="pointer-events-none absolute left-[12%] top-1/3 h-72 w-72 rounded-full bg-emerald-500/20 blur-[90px]" />
        <div className="pointer-events-none absolute right-[8%] bottom-1/4 h-56 w-56 rounded-full bg-cyan-400/20 blur-[70px]" />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-[8vw] pb-16 pt-36">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="max-w-3xl text-[clamp(42px,6.5vw,82px)] font-black leading-[0.97] tracking-tight text-white"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Objetivos de<br />
            <span className="text-cyan-600">Desarrollo</span><br />
            Sostenible
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.7 }}
            className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/75"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            17 objetivos que guían al mundo hacia un futuro más equitativo y sostenible. En el Fab Lab UC, cada proyecto que diseñamos y fabricamos está explícitamente vinculado a estos propósitos globales.
          </motion.p>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-16 px-[8vw] shadow-sm">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 mb-14">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="text-center"
              >
                <div className="text-[clamp(36px,4.5vw,58px)] font-black leading-none text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <AnimatedCounter to={s.value} />
                </div>
                <div className="mt-1 text-[13px] font-semibold text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>{s.label}</div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-gray-400" style={{ fontFamily: 'Roboto, sans-serif' }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto max-w-3xl border-t border-gray-100 pt-8 text-center"
          >
            <p className="text-[16px] leading-relaxed text-gray-600 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Los proyectos de fabricación digital y desarrollo de software del Fab Lab Continental están alineados para resolver desafíos reales y contribuir de manera activa a los Objetivos de Desarrollo Sostenible.
            </p>
          </motion.div>
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
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-600" style={{ fontFamily: 'Roboto, sans-serif' }}>¿Qué son los ODS?</p>
            <h2 className="mb-5 text-[clamp(26px,3.2vw,40px)] font-black leading-tight text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Un plan de acción global para el planeta</h2>
            <p className="text-[15px] leading-relaxed text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              En septiembre de 2015, los 193 estados miembros de la ONU adoptaron la <strong>Agenda 2030 para el Desarrollo Sostenible</strong>: un plan universal con 17 ODS y 169 metas concretas. Estos objetivos suceden a los Objetivos del Milenio (ODM) y constituyen el marco de referencia mundial para erradicar la pobreza, proteger el planeta y garantizar prosperidad para todos.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.14 }}
          >
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Fab Lab UC y los ODS</p>
            <h2 className="mb-5 text-[clamp(26px,3.2vw,40px)] font-black leading-tight text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Innovación con propósito social</h2>
            <p className="text-[15px] leading-relaxed text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              En el Fab Lab de la Universidad Continental, cada proyecto estudiantil está clasificado y vinculado explícitamente a los ODS. Desde prótesis de bajo costo <strong>(ODS 3 y 10)</strong> hasta sistemas de monitoreo hídrico <strong>(ODS 6 y 14)</strong>, la fabricación digital se convierte en una herramienta de impacto real alineada con la Agenda 2030.
            </p>
          </motion.div>
        </div>
      </section>

      {/* GRID ODS*/}
      <section className="bg-white py-24 px-[8vw]">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Los 17 Objetivos</p>
              <h2 className="text-[clamp(26px,3vw,40px)] font-black text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Explorá cada ODS</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ODS_DATA.map((ods, i) => <OdsCard key={ods.id} ods={ods} index={i} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F8F9FB] py-20 px-[8vw]">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="flex flex-col items-center text-center"
          >
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.25em] text-emerald-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Repositorio de Proyectos
            </p>
            <h2 className="mb-4 max-w-2xl text-[clamp(28px,3.8vw,52px)] font-black text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Cada proyecto tiene un propósito
            </h2>
            <p className="mb-8 max-w-lg text-[15px] leading-relaxed text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Descubre los diseños y prototipos del Fab Lab UC clasificados por Objetivo de Desarrollo Sostenible.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/galeria/3d" className="inline-flex items-center gap-2 bg-emerald-500 px-7 py-3.5 text-[13px] font-bold text-white transition-all hover:bg-emerald-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Proyectos 3D →
              </a>
              <a href="/galeria/software" className="inline-flex items-center gap-2 border border-gray-300 px-7 py-3.5 text-[13px] font-bold text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Proyectos Digitales →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
