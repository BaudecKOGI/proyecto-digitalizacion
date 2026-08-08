import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GraduationCap, ChevronRight, Eye } from 'lucide-react';

export function CareersExplorer({ mode, fetchFn }) {
  const { carrera, ciclo } = useParams();
  const navigate = useNavigate();
  const base = `/editor/${mode}/carreras`;

  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    fetchFn()
      .then((data) => {
        if (cancelado) return;
        setProyectos(Array.isArray(data) ? data : data?.results || []);
      })
      .catch(() => !cancelado && setProyectos([]))
      .finally(() => !cancelado && setLoading(false));
    return () => {
      cancelado = true;
    };
  }, []);

  const arbol = useMemo(() => {
    const tree = {};
    for (const p of proyectos) {
      const c = p.carrera || 'Sin carrera';
      const ci = p.ciclo || 'Sin ciclo';
      const a = p.autor_nombre || 'Sin autor';
      tree[c] ??= {};
      tree[c][ci] ??= {};
      tree[c][ci][a] ??= [];
      tree[c][ci][a].push(p);
    }
    return tree;
  }, [proyectos]);

  function verProyecto(proyecto) {
    if (mode === '3d') {
      navigate(`/editor/3d/detalle/${proyecto.id}`);
    } else {
      navigate('/editor/software/proyectos', {
        state: { openProject: proyecto }
      });
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-sm text-[var(--text-muted)] animate-pulse">Organizando proyectos...</div>;
  }

  const CardGrid = ({ children }) => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">{children}</div>
  );

  const TileButton = ({ onClick, title, subtitle, icon }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      {icon}
      <div>
        <div className="text-[1.05rem] font-extrabold text-[var(--text-main)]">{title}</div>
        <div className="mt-1 text-xs text-[var(--text-muted)]">{subtitle}</div>
      </div>
    </button>
  );

  const Breadcrumb = () => (
    <div className="mb-5 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)]">
      <button onClick={() => navigate(base)} className="hover:text-[var(--text-main)] cursor-pointer bg-transparent border-none">
        Carreras
      </button>
      {carrera && (
        <>
          <ChevronRight size={12} />
          <button
            onClick={() => navigate(`${base}/${encodeURIComponent(carrera)}`)}
            className={`cursor-pointer bg-transparent border-none ${ciclo ? 'hover:text-[var(--text-main)]' : 'text-[var(--text-main)]'}`}
          >
            {carrera}
          </button>
        </>
      )}
      {ciclo && (
        <>
          <ChevronRight size={12} />
          <span className="text-[var(--text-main)]">{ciclo}</span>
        </>
      )}
    </div>
  );

  // NIVEL 3: alumnos dentro de un ciclo 
  if (carrera && ciclo) {
    const alumnos = arbol[carrera]?.[ciclo] || {};
    const entradas = Object.entries(alumnos);
    return (
      <div className="flex flex-col gap-6 pb-24">
        <div>
          <Breadcrumb />
          <h2 className="text-2xl font-bold text-[var(--text-main)]">{ciclo}</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{entradas.length} alumno(s) en este ciclo</p>
        </div>

        <div className="flex flex-col gap-3">
          {entradas.map(([alumno, projs]) => (
            <div key={alumno} className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm">
              <div>
                <div className="text-sm font-bold text-[var(--text-main)]">{alumno}</div>
                <div className="mt-0.5 text-xs text-[var(--text-muted)]">{projs.map((p) => p.titulo).join(' · ')}</div>
              </div>
              <button
                onClick={() => verProyecto(projs[0])}
                className="flex items-center gap-2 rounded-xl p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--accent-dim)] hover:text-[var(--accent)] cursor-pointer"
                title="Ver proyecto"
              >
                <Eye size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // NIVEL 2: ciclos dentro de una carrera
  if (carrera) {
    const ciclos = arbol[carrera] || {};
    const entradas = Object.entries(ciclos);
    return (
      <div className="flex flex-col gap-6 pb-24">
        <div>
          <Breadcrumb />
          <h2 className="text-2xl font-bold text-[var(--text-main)]">{carrera}</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{entradas.length} ciclo(s) con proyectos</p>
        </div>

        <CardGrid>
          {entradas.map(([nombreCiclo, alumnos]) => {
            const totalProyectos = Object.values(alumnos).reduce((n, arr) => n + arr.length, 0);
            return (
              <TileButton
                key={nombreCiclo}
                onClick={() => navigate(`${base}/${encodeURIComponent(carrera)}/${encodeURIComponent(nombreCiclo)}`)}
                title={nombreCiclo}
                subtitle={`${Object.keys(alumnos).length} alumno(s) · ${totalProyectos} proyecto(s)`}
              />
            );
          })}
        </CardGrid>
      </div>
    );
  }

  // NIVEL 1: todas las carreras
  const entradas = Object.entries(arbol);
  return (
    <div className="flex flex-col gap-6 pb-24">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-main)]">Carreras</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Organización automática según la carrera, ciclo y alumno de cada proyecto registrado.
        </p>
      </div>

      {entradas.length === 0 ? (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] py-16 text-center text-sm text-[var(--text-muted)]">
          Aún no hay proyectos registrados en esta categoría.
        </div>
      ) : (
        <CardGrid>
          {entradas.map(([nombreCarrera, ciclos]) => {
            const totalProyectos = Object.values(ciclos)
              .flatMap((alumnos) => Object.values(alumnos))
              .reduce((n, arr) => n + arr.length, 0);
            return (
              <TileButton
                key={nombreCarrera}
                onClick={() => navigate(`${base}/${encodeURIComponent(nombreCarrera)}`)}
                icon={
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]">
                    <GraduationCap size={20} />
                  </div>
                }
                title={nombreCarrera}
                subtitle={`${Object.keys(ciclos).length} ciclo(s) · ${totalProyectos} proyecto(s)`}
              />
            );
          })}
        </CardGrid>
      )}
    </div>
  );
}