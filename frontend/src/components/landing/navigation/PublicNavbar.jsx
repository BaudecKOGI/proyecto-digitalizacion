import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';

const MotionLink = motion(Link);

const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio', url: '/' },
  { id: '3d', label: 'Modelos 3D', url: '/galeria/3d' },
  { id: 'digital', label: 'Proyectos Digitales', url: '/galeria/software' },
  { id: 'ods', label: 'ODS', url: '/ods' },
  { id: 'about', label: 'Acerca del FabLab', url: '/fablab' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // En la página de inicio el navbar inicia transparente; en el resto siempre con fondo
  const isHome = location.pathname === '/';
  const showSolidBg = !isHome || scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          backgroundColor: showSolidBg ? 'rgba(8, 12, 22, 0.95)' : 'rgba(8, 12, 22, 0)'
        }}
        transition={{
          y: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          backgroundColor: { duration: 0 }
        }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
        style={{
          backdropFilter: showSolidBg ? 'blur(16px)' : 'none',
          borderBottom: showSolidBg ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div className="flex items-center gap-6">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center group"
          >
            <div className="h-10 sm:h-12 overflow-hidden">
              <img
                src="/assets/logos/Logos-FabLab.svg"
                alt="Fab Lab Continental Logo"
                className="h-full w-auto object-contain transition-transform duration-500"
              />
            </div>
          </Link>
        </div>

        {/* Desktop: Links de navegación */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive =
              (link.url === '/' && location.pathname === '/') ||
              (link.url !== '/' && location.pathname.startsWith(link.url));
            return (
              <Link
                key={link.id}
                to={link.url}
                className="group font-semibold text-[16px] leading-[24px] transition-colors duration-200 relative pb-1"
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  color: isActive ? '#A352FF' : 'rgba(255, 255, 255, 0.7)'
                }}
              >
                {link.label}
                {/* Línea subrayado hover */}
                {!isActive && (
                  <span className="absolute bottom-0 left-[15%] right-[15%] h-0.5 bg-white rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                )}
                {/* Línea subrayado activo */}
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: '#A352FF' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile: botón hamburguesa */}
        <button
          className="flex lg:hidden flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Abrir menú"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white rounded-full"
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-0.5 bg-white rounded-full"
            transition={{ duration: 0.2 }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white rounded-full"
            transition={{ duration: 0.3 }}
          />
        </button>
      </motion.header>

      {/* Mobile: menú desplegable */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-6 md:right-12 z-40 lg:hidden w-64 sm:w-72"
            style={{ paddingTop: '64px' }}
          >
            <div
              className="overflow-hidden shadow-2xl"
              style={{ background: 'rgba(0, 10, 20, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <nav className="flex flex-col py-2">
                {NAV_LINKS.map((link, i) => {
                  const isActive =
                    (link.url === '/' && location.pathname === '/') ||
                    (link.url !== '/' && location.pathname.startsWith(link.url));
                  return (
                    <div key={link.id} className="flex flex-col">
                      {i > 0 && <div className="border-t border-white/25 mx-6" />}
                      <MotionLink
                        to={link.url}
                        onClick={() => setMenuOpen(false)}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.25 }}
                        className="px-6 py-2.5 font-semibold text-[16px] leading-[24px] tracking-wide hover:bg-white/5 transition-colors duration-200"
                        style={{
                          fontFamily: 'Roboto, sans-serif',
                          color: isActive ? '#A352FF' : '#FFFFFF'
                        }}
                      >
                        {link.label}
                      </MotionLink>
                    </div>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para cerrar al hacer clic fuera */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}