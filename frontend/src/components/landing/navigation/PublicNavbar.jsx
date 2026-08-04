import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';

const MotionLink = motion(Link);

const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio', url: '/' },
  { id: '3d', label: 'Proyectos 3D', url: '/galeria/3d' },
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
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 transition-all duration-500"
        style={{
          background: showSolidBg ? 'rgba(8, 12, 22, 0.95)' : 'transparent',
          backdropFilter: showSolidBg ? 'blur(16px)' : 'none',
          borderBottom: showSolidBg ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center group">
            <div className="h-10 sm:h-12 overflow-hidden">
              <img
                src="/assets/Logos-FabLab.svg"
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
                className={`text-[13px] font-semibold transition-colors duration-200 relative pb-1 ${
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                {/* Línea subrayado activo */}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
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
            className="fixed top-0 left-0 right-0 z-40 lg:hidden"
            style={{ paddingTop: '72px' }}
          >
            <div
              className="mx-4 rounded-2xl overflow-hidden"
              style={{ background: 'rgba(0, 10, 20, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <nav className="flex flex-col py-4">
                {NAV_LINKS.map((link, i) => (
                  <MotionLink
                    key={link.id}
                    to={link.url}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                    className="px-6 py-3.5 text-sm font-semibold tracking-wide text-white/80 hover:text-white hover:bg-white/5 transition-colors duration-200"
                  >
                    {link.label}
                  </MotionLink>
                ))}
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