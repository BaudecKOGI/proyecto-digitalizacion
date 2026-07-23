import React, { useRef, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';

const defaultStats = [
  { id: 1, name: 'Proyectos Anuales', value: 1200, suffix: '+' },
  { id: 2, name: 'Proyectos Mensual', value: 100, suffix: '+' },
  { id: 3, name: 'Horas de Innovación', value: 2500, suffix: 'h' },
  { id: 4, name: 'Prototipos 3D', value: 85, suffix: '' },
];

function Counter({ from = 0, to, duration = 2.5, suffix = '' }) {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: [0.16, 1, 0.3, 1], // Elegant easing function
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

export default function StatsSection({ stats = defaultStats, className = "" }) {
  return (
    <section className={`relative z-10 bg-text py-4 md:py-6 ${className}`}>
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="flex flex-col items-center justify-center text-center border-l border-white/10 pl-0 border-l-0 md:pl-8 md:border-l md:first:border-l-0 md:first:pl-0"
            >
              <div className="text-[clamp(32px,4vw,56px)] font-display font-bold text-white mb-2 tracking-tighter">
                <Counter to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs md:text-sm font-sans font-medium uppercase tracking-[0.2em] text-white/60 max-w-[160px]">
                {stat.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
