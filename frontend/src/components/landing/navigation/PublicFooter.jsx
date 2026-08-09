import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const footerLinks = [
    {
      title: "MAPA DEL SITIO",
      className: "lg:col-span-2",
      links: [
        { label: "Inicio", href: "/", external: false },
        { label: "Modelos 3D", href: "/galeria/3d", external: false },
        { label: "Proyectos Digitales", href: "/galeria/software", external: false },
        { label: "ODS", href: "/ods", external: false },
        { label: "Acerca del FabLab", href: "/fablab", external: false }
      ]
    },
    {
      title: "CONTÁCTANOS",
      className: "lg:col-span-3",
      links: [
        { label: "fablab@continental.edu.pe", href: "mailto:fablab@continental.edu.pe" },
        { label: "Huancayo: Av. San Carlos 1980", href: "https://g.page/universidad-continental-huancayo", external: true },
        { label: "Lima: Av. Alfredo Mendiola 5210", href: "https://goo.gl/maps/TfQZKQ22pW", external: true },
        { label: "Tel: +51 64 481430 Anx. 7000", href: "tel:+5164481430" }
      ]
    },
    {
      title: "ACCESO INTERNO",
      className: "lg:col-span-2",
      links: [
        { label: "Ingreso al Sistema", href: "/auth/sign-in", newTab: true }
      ]
    }
  ];

  return (
    <footer className="relative bg-text pt-12 pb-6 px-[8vw] mt-16 md:mt-24">
      {/* Top Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-[99%]">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[60px] md:h-[120px] text-text"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120 L0 60 C480 150, 960 -30, 1440 60 L1440 120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Top Section - Links Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10 mb-8">

        {/* Brand Column */}
        <div className="flex flex-col items-start lg:col-span-3 lg:pr-8">
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group"
          >
            <img src="/assets/logos/Logos-FabLab.svg" alt="Fab Lab Continental Logo" className="h-14 sm:h-16 mb-6 object-contain opacity-95 group-hover:opacity-100 transition-opacity" />
          </Link>
          <p className="font-light text-[16px] leading-[24px] text-white max-w-[280px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Repositorio interactivo de proyectos y desarrollos tecnológicos de la Universidad Continental.
          </p>
        </div>

        {/* Link Columns */}
        {footerLinks.map((column, index) => (
          <div key={index} className={column.className}>
            <h4 className="font-sans text-[12px] font-extrabold uppercase text-white mb-3 tracking-widest">
              {column.title}
            </h4>
            <ul className="flex flex-col gap-2">
              {column.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  {link.external || link.href.startsWith('mailto') || link.href.startsWith('tel') || link.href.startsWith('#') ? (
                    <a href={link.href} target={link.external || link.newTab ? "_blank" : undefined} rel={link.external || link.newTab ? "noopener noreferrer" : undefined} className="block py-[2px] font-light text-[16px] leading-[24px] text-white hover:opacity-70 transition-opacity" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href} target={link.newTab ? "_blank" : undefined} className="block py-[2px] font-light text-[16px] leading-[24px] text-white hover:opacity-70 transition-opacity" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Socials Column */}
        <div className="flex flex-col lg:col-span-2">
          <h4 className="font-sans text-[12px] font-extrabold uppercase text-white mb-3 tracking-widest">
            SÍGUENOS
          </h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="https://web.facebook.com/ucontinental/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-[2px] font-light text-[16px] leading-[24px] text-white hover:opacity-70 transition-opacity" aria-label="Facebook" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                <span>Facebook</span>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/UContinental/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-[2px] font-light text-[16px] leading-[24px] text-white hover:opacity-70 transition-opacity" aria-label="Twitter" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
                <span>Twitter</span>
              </a>
            </li>
            <li>
              <a href="https://pe.linkedin.com/school/universidad-continental/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-[2px] font-light text-[16px] leading-[24px] text-white hover:opacity-70 transition-opacity" aria-label="LinkedIn" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                <span>LinkedIn</span>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/ucontinental/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-[2px] font-light text-[16px] leading-[24px] text-white hover:opacity-70 transition-opacity" aria-label="Instagram" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@fablabContinental" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-[2px] font-light text-[16px] leading-[24px] text-white hover:opacity-70 transition-opacity" aria-label="YouTube" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                <span>YouTube</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-slate-700/80 mb-6 mt-4"></div>

      {/* Bottom Section - Copyright */}
      <div className="flex flex-col items-center justify-center pb-2">
        <div className="font-light text-[16px] leading-[24px] text-white tracking-wide text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
          © {new Date().getFullYear()} Universidad Continental. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}