import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 bg-transparent"
    >
      <div className="flex items-center gap-6">
        <a href="#hero" className="flex items-center group">
          <div className="h-12 sm:h-14 overflow-hidden">
            <img
              src="/assets/Logos-FabLab.svg"
              alt="Fab Lab Continental Logo"
              className="h-full w-auto object-contain transition-transform duration-500"
            />
          </div>
        </a>
      </div>

      <div className="flex items-center gap-6">
        {/* Navigation links could go here in the future */}
      </div>
    </motion.header>
  );
}