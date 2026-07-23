import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg pt-20">
      <div className="relative z-10 grid w-full items-center px-6 md:grid-cols-[1.2fr_0.8fr] md:px-12 lg:px-20 gap-8">

        <motion.div
          className="max-w-[800px] z-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="mt-6 font-display text-[clamp(48px,7vw,110px)] font-bold leading-[1.05] tracking-tighter text-text">
            Diseño físico <br />
            y digital <br />
            <span className="text-muted/60 font-sans italic font-normal tracking-normal text-[clamp(32px,4vw,70px)]">en un solo lugar.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-8 max-w-[480px] text-[17px] leading-relaxed text-muted">
            La vitrina oficial del Fab Lab Continental. Un repositorio interactivo de desarrollos en 3D y soluciones de software creadas por nuestra comunidad académica.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-12 flex items-center gap-8">
            <a href="#showcase-3d" className="group flex items-center gap-3 font-sans text-[13px] font-bold uppercase tracking-widest text-text transition-colors hover:text-c3d">
              <span>Explorar Proyectos</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-panel text-text transition-all group-hover:bg-c3d group-hover:text-white">
                →
              </span>
            </a>
          </motion.div>
        </motion.div>

        {/* 3D Spline Interactive Model - Contained & Elegant */}
        <motion.div
          className="relative flex h-[50vh] w-full items-center justify-center lg:h-[75vh]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-2xl">
            <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
          </div>

          {/* Subtle overlay hint */}
          <div className="absolute bottom-8 right-8 pointer-events-none flex items-center gap-3 bg-panel/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <div className="h-px w-12 bg-line"></div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Interactúa en 3D</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}