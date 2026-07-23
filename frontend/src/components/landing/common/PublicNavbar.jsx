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
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 transition-all duration-300 ${scrolled ? 'bg-bg/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
    >
      <div className="flex items-center gap-6">
        <a href="#hero" className="flex items-center gap-6 group">
          <div className="h-10 overflow-hidden">
            <img
              src="/assets/logo-continental-negro.png"
              alt="Universidad Continental Logo"
              className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="hidden h-6 w-px bg-line/60 md:block" />
          <div className="brand-text hidden flex-col justify-center md:flex">
            <span className="font-sans text-[12px] font-extrabold tracking-[0.2em] text-text">FAB LAB</span>
          </div>
        </a>
      </div>

      <div className="flex items-center gap-6">
        {/* Navigation links could go here in the future */}
      </div>
    </motion.header>
  );
}