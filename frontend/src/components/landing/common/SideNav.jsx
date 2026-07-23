import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SideNav({ sections = [] }) {
  const [activeId, setActiveId] = useState('hero');
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -50% 0px' }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (sections.length === 0) return null;

  return (
    <motion.aside 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-4 md:flex"
    >
      {sections.map((s) => {
        const isActive = s.id === activeId;
        const isHovered = s.id === hoveredId;

        return (
          <div 
            key={s.id} 
            className="group relative flex items-center justify-end"
            onMouseEnter={() => setHoveredId(s.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <motion.span 
              initial={{ opacity: 0, x: 10, y: "-50%" }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                x: isHovered ? 0 : 10,
                y: "-50%"
              }}
              className="absolute right-8 top-1/2 whitespace-nowrap px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-text pointer-events-none"
            >
              {s.label}
            </motion.span>
            <a
              href={`#${s.id}`}
              onClick={(e) => handleClick(e, s.id)}
              className="relative block h-8 w-8 outline-none"
            >
              {/* Minimal Dot */}
              <motion.div 
                className={`absolute left-1/2 top-1/2 h-2 w-2 rounded-full transition-colors duration-300 ${(isActive || isHovered) ? 'bg-c3d' : 'bg-gray-400'}`}
                initial={{ x: "-50%", y: "-50%" }}
                animate={{ 
                  x: "-50%", 
                  y: "-50%",
                  scale: isActive || isHovered ? 1.5 : 1 
                }}
              />
            </a>
          </div>
        );
      })}
    </motion.aside>
  );
}