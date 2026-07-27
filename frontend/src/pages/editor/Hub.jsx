import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const Hub = () => {
  const navigate = useNavigate();
  const [activeSide, setActiveSide] = useState('3d');

  return (
    <AuthGuard requiredRole={["PROF", "EDITOR"]}>
      <div className="hub-wrapper">
        <div className="hub-title">
          <div className="eyebrow">¿Qué quieres gestionar hoy?</div>
          <h1>Proyectos del Fab Lab</h1>
        </div>
        <div className="split">
          <div
            className={`half side-3d ${activeSide === '3d' ? 'hot' : 'dim'}`}
            onMouseEnter={() => setActiveSide('3d')}
            onClick={() => navigate('/editor/3d')}
          >
            <div className="grid-bg"></div>
            <div className="half-content">
              <div className="icon-wrap">▲</div>
              <div className="half-tag">Fabricación digital</div>
              <div className="half-title">Proyectos 3D</div>
              <div className="half-desc">
                Piezas impresas, cortadas o modeladas en el taller físico
              </div>
            </div>
          </div>

          <div className="divider-label mono">VS</div>

          <div
            className={`half side-dig ${activeSide === 'dig' ? 'hot' : 'dim'}`}
            onMouseEnter={() => setActiveSide('dig')}
            onClick={() => navigate('/editor/software')}
          >
            <div className="grid-bg"></div>
            <div className="half-content">
              <div className="icon-wrap">&lt;/&gt;</div>
              <div className="half-tag">Desarrollo de software</div>
              <div className="half-title">Proyectos Digitales</div>
              <div className="half-desc">
                Apps, webs y sistemas hechos por los alumnos
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};