import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const footerLinks = [
    {
      title: "MAPA DEL SITIO",
      links: [
        { label: "Inicio", href: "/#hero", external: false },
        { label: "Ensamblaje", href: "/#assembly", external: false },
        { label: "Dos mundos", href: "/#duality", external: false },
        { label: "Proyectos 3D", href: "/#showcase-3d", external: false },
        { label: "Proyectos Digitales", href: "/#showcase-dig", external: false }
      ]
    },
    {
      title: "CONTÁCTANOS",
      links: [
        { label: "fablab@continental.edu.pe", href: "mailto:fablab@continental.edu.pe", external: true },
        { label: "Av. San Carlos 1980, Huancayo", href: "#", external: true },
        { label: "+51 64 481430 Anexo 7000", href: "#", external: true }
      ]
    },
    {
      title: "ACCESO INTERNO",
      links: [
        { label: "Ingreso al Sistema", href: "/auth/sign-in", external: false }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 mb-8">

        {/* Brand Column */}
        <div className="flex flex-col items-start lg:col-span-1">
          <img src="/assets/Logos-FabLab.svg" alt="Fab Lab Continental Logo" className="h-14 sm:h-16 mb-6 object-contain opacity-95" />
          <p className="text-[13.5px] text-muted leading-relaxed max-w-[280px]">
            Repositorio interactivo de proyectos y desarrollos tecnológicos de la Universidad Continental.
          </p>
        </div>

        {/* Link Columns */}
        {footerLinks.map((column, index) => (
          <div key={index}>
            <h4 className="font-sans text-[12px] font-extrabold uppercase text-bg mb-4 tracking-widest">
              {column.title}
            </h4>
            <ul className="flex flex-col gap-2">
              {column.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  {link.external || link.href.startsWith('mailto') || link.href.startsWith('#') ? (
                    <a href={link.href} className="font-sans text-[13.5px] text-muted hover:text-bg transition-colors">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href} className="font-sans text-[13.5px] text-muted hover:text-bg transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-muted/20 mb-6 mt-4"></div>

      {/* Bottom Section - Copyright & Socials */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

        <div className="font-sans text-[12px] text-muted tracking-wide text-center lg:text-left">
          © {new Date().getFullYear()} Universidad Continental. Todos los derechos reservados.
        </div>

        {/* Socials */}
        <div className="flex items-center gap-6 text-muted">
          <a href="https://web.facebook.com/ucontinental/" target="_blank" rel="noopener noreferrer" className="hover:text-bg transition-colors" aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="https://twitter.com/UContinental/" target="_blank" rel="noopener noreferrer" className="hover:text-bg transition-colors" aria-label="Twitter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
          </a>
          <a href="https://pe.linkedin.com/school/universidad-continental/" target="_blank" rel="noopener noreferrer" className="hover:text-bg transition-colors" aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="https://www.instagram.com/ucontinental/" target="_blank" rel="noopener noreferrer" className="hover:text-bg transition-colors" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://www.youtube.com/@fablabContinental" target="_blank" rel="noopener noreferrer" className="hover:text-bg transition-colors" aria-label="YouTube">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}