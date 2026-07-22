import { useEffect, useState } from 'react';

export default function SideNav({ sections = [] }) {
  const [activeId, setActiveId] = useState('hero');

  useEffect(() => {
    if (sections.length === 0) return;

    // IntersectionObserver ajustado para detectar cambios a mitad de pantalla
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -50% 0px', // Detecta la sección activa justo en la zona central del scroll
      }
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
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  if (sections.length === 0) return null;

  return (
    <aside className="side-nav">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          data-label={s.label}
          className={s.id === activeId ? 'active' : ''}
          onClick={(e) => handleClick(e, s.id)}
        />
      ))}
    </aside>
  );
}