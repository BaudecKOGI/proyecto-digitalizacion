import React from 'react';

export const Sidebar = ({ mode, onBackToHub }) => {
  const isDig = mode === 'dig';

  return (
    <div className="sidebar">
      <div className="brand">
        <div className="eyebrow">Gestionando</div>
        <div className="mode">
          {isDig ? 'Proyectos Digitales' : 'Proyectos 3D'}
        </div>
      </div>
      <div className="nav-item active">
        <span className="dot"></span> Resumen
      </div>
      <div className="nav-item">
        <span className="dot"></span> Todos los proyectos
      </div>
      <div className="nav-item">
        <span className="dot"></span> Nuevo proyecto
      </div>
      <div className="nav-item">
        <span className="dot"></span> Categorías / Carreras
      </div>
      <div className="nav-item">
        <span className="dot"></span> Papelera
      </div>
      <div className="nav-item">
        <span className="dot"></span> Ajustes
      </div>
      <div className="back-hub" onClick={onBackToHub}>
        ← Volver al inicio
      </div>
    </div>
  );
};