import React from 'react';

export const Overview = ({ isDig, projectsCount }) => (
  <>
    <div className="content-header">
      <div>
        <h2>Dashboard</h2>
        <div className="sub">Resumen general de {isDig ? 'Desarrollo de Software' : 'Fabricación Digital'}</div>
      </div>
    </div>
    <div className="stats">
      <div className="stat"><div className="num">{projectsCount}</div><div className="lbl">PROYECTOS PUBLICADOS</div></div>
      <div className="stat"><div className="num">0</div><div className="lbl">PENDIENTES DE REVISIÓN</div></div>
    </div>
  </>
);