import { useEffect, useRef } from 'react';

// Piezas dispersas: posición inicial (--sx/--sy en px), rotación inicial y color.
const PIECES_3D = [
  { sx: -320, sy: -140, sr: -70, path: 'rect', size: 46 },
  { sx: 300, sy: -190, sr: 60, path: 'circle', size: 40 },
  { sx: -260, sy: 180, sr: 40, path: 'house', size: 44 },
];

const PIECES_DIG = [
  { sx: 340, sy: 150, sr: -50, path: 'brackets', size: 42 },
  { sx: -150, sy: -260, sr: 35, path: 'window', size: 38 },
  { sx: 150, sy: 260, sr: -30, path: 'target', size: 40 },
];

function PieceIcon({ path, ...props }) {
  switch (path) {
    case 'rect':
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.4" />
          <path d="M3 9h18M9 3v18" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    case 'circle':
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
        </svg>
      );
    case 'house':
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none">
          <path d="M4 20 L4 10 L12 4 L20 10 L20 20 Z" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case 'brackets':
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none">
          <path d="M8 6 L2 12 L8 18 M16 6 L22 12 L16 18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'window':
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="1" stroke="currentColor" strokeWidth="1.4" />
          <path d="M3 9h18" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'target':
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none">
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AssemblySection() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    let ticking = false;

    function update() {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      let p = total > 0 ? scrolled / total : 0;
      p = Math.min(1, Math.max(0, p));
      sticky.style.setProperty('--p', p);

      const phase1 = p < 0.45 ? 1 : Math.max(0, 1 - (p - 0.45) / 0.15);
      const phase2 = p > 0.6 ? Math.min(1, (p - 0.6) / 0.2) : 0;
      sticky.style.setProperty('--phase1', phase1);
      sticky.style.setProperty('--phase2', phase2);
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="assembly" ref={sectionRef} className="blueprint-bg relative h-[320vh] px-[8vw]">
      <div
        ref={stickyRef}
        className="assembly-sticky sticky top-0 flex h-screen items-center justify-center overflow-hidden"
        style={{ '--p': 0 }}
      >
        <p className="assembly-phrase phase-1 font-display" style={{ top: '14%' }}>
          Cada proyecto empieza como piezas sueltas.
        </p>

        {PIECES_3D.map((piece, i) => (
          <PieceIcon
            key={`3d-${i}`}
            path={piece.path}
            className="assembly-piece"
            width={piece.size}
            height={piece.size}
            style={{ '--sx': `${piece.sx}px`, '--sy': `${piece.sy}px`, '--sr': piece.sr, '--piece-color': 'var(--c3d)' }}
          />
        ))}

        {PIECES_DIG.map((piece, i) => (
          <PieceIcon
            key={`dig-${i}`}
            path={piece.path}
            className="assembly-piece"
            width={piece.size}
            height={piece.size}
            style={{ '--sx': `${piece.sx}px`, '--sy': `${piece.sy}px`, '--sr': piece.sr, '--piece-color': 'var(--cdig)' }}
          />
        ))}

        <div className="assembly-core">
          <div className="mark">
            <span className="font-mono">FL</span>
          </div>
        </div>

        <p className="assembly-phrase phase-2 font-display" style={{ bottom: '14%' }}>
          …hasta que todas las piezas encajan.
        </p>
      </div>
    </section>
  );
}