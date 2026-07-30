import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';

function Typewriter({ text = "Todo en un solo lugar.", typingSpeed = 100, deletingSpeed = 75, pauseTime = 3200 }) {
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    if (!isDeleting && displayed.length < text.length) {
      timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && displayed.length === text.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    } else if (isDeleting && displayed.length > 0) {
      timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && displayed.length === 0) {
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 600);
    }
    return () => clearTimeout(timer);
  }, [displayed, isDeleting, text, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="inline-flex items-center whitespace-nowrap">
      <span>{displayed}</span>
      <span className="ml-[3px] inline-block w-[3px] h-[0.9em] bg-[#00D8FF] animate-pulse" />
    </span>
  );
}

function Counter({ from = 0, to, duration = 2.2, suffix = '' }) {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = Intl.NumberFormat('en-US').format(Math.round(value)) + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [from, to, duration, suffix, isInView]);

  return <span ref={nodeRef} className="tabular-nums">{from}{suffix}</span>;
}

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden bg-[#090D16] pt-24 pb-16">
      {/* ================= VIDEO DE FONDO PRINCIPAL ================= */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-0"
        src="/assets/Fusio.mp4"
      />

      {/* Capa de oscurecimiento equilibrada para realzar el contraste del texto sin ocultar el video */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/65 z-0" />

      {/* Desvanecimiento inferior suave */}
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-t from-[#090D16] to-transparent z-10" />

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <div className="relative z-20 mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-20">
        <motion.div
          className="w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Título Principal */}
          <motion.h1 variants={itemVariants} className="font-sans text-[clamp(44px,6vw,86px)] font-bold leading-[1.08] tracking-tight text-white drop-shadow-md max-w-[850px]">
            Del modelo 3D <br />
            al software. <br />
            <span className="block mt-2 font-display font-semibold text-white text-[clamp(28px,3.8vw,48px)] drop-shadow-[0_2px_12px_rgba(255,255,255,0.35)] min-h-[1.3em]">
              <Typewriter text="Todo en un solo lugar." />
            </span>
          </motion.h1>

          {/* Descripción */}
          <motion.p variants={itemVariants} className="mt-8 max-w-[660px] text-base sm:text-lg leading-relaxed text-white/90 drop-shadow-sm font-sans">
            Donde los estudiantes y docentes desarrollan proyectos de fabricación digital y soluciones de software que impulsan la innovación y ODS.
          </motion.p>

          {/* Fila Inferior: Botón alineado más arriba junto a la descripción y Cuadro Resumido a la derecha */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
            {/* Botón de acción */}
            <div>
              <a
                href="#duality"
                className="group inline-flex items-center gap-4 px-8 py-4 bg-white text-[#090D16] font-sans text-sm font-bold uppercase tracking-wider transition-colors hover:bg-c3d hover:text-white"
              >
                <span>Explorar Proyectos</span>
                <span className="text-lg leading-none transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>

            {/* Cuadro Resumido de Estadísticas (Grid de 3 columnas con anchos y espaciados exactamente iguales para una alineación perfecta) */}
            <div className="grid grid-cols-3 divide-x divide-white/20 bg-[#1E1E1E]/95 backdrop-blur-md border-l-4 border-c3d shadow-2xl -mr-6 md:-mr-12 lg:-mr-20">
              {/* Stat 01: Modelos 3D */}
              <div className="flex flex-col justify-center px-6 sm:px-10 py-6">
                <span className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  <Counter to={85} suffix="+" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/75 mt-1">
                  Modelos 3D
                </span>
              </div>

              {/* Stat 02: Proyectos Digitales */}
              <div className="flex flex-col justify-center px-6 sm:px-10 py-6">
                <span className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  <Counter to={120} suffix="+" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/75 mt-1">
                  Proyectos Digitales
                </span>
              </div>

              {/* Stat 03: 17 ODS impactados (Cubre completamente la marca de agua en la esquina derecha del video) */}
              <div className="flex flex-col justify-center pl-6 sm:pl-10 pr-10 sm:pr-16 lg:pr-24 py-6">
                <span className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  <Counter to={17} suffix="" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/75 mt-1">
                  ODS Impactados
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}