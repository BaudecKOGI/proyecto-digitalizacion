import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { ProjectsTable } from '../components/ProjectsTable';

const data3d = [
  { title: 'Brazo robótico v2', author: 'Equipo Fab Lab', extra: 'PLA + aluminio' },
  { title: 'Soporte para drone', author: 'J. Ramírez', extra: 'PETG' },
  { title: 'Maqueta arquitectónica', author: 'Grupo 4A', extra: 'Resina' },
];

const dataDig = [
  { title: 'App de asistencia QR', author: 'C. Torres', extra: 'React Native' },
  { title: 'Sistema de inventario Fab Lab', author: 'Equipo Fab Lab', extra: 'Django + React' },
  { title: 'Bot de reservas de laboratorio', author: 'M. Quispe', extra: 'Node.js' },
];

export const DashboardView = ({ mode, onBackToHub }) => {
  const isDig = mode === 'dig';
  const projects = isDig ? dataDig : data3d;

  return (
    <div className="shell">
      <Sidebar mode={mode} onBackToHub={onBackToHub} />
      <div className="content">
        <div className="content-header">
          <div>
            <h2>{isDig ? 'Proyectos Digitales' : 'Proyectos 3D'}</h2>
            <div className="sub">
              {isDig
                ? 'Apps, webs y sistemas desarrollados por alumnos'
                : 'Piezas y diseños fabricados en el taller'}
            </div>
          </div>
          <button className="btn-primary">+ Nuevo proyecto</button>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="num">18</div>
            <div className="lbl">PROYECTOS PUBLICADOS</div>
          </div>
          <div className="stat">
            <div className="num">3</div>
            <div className="lbl">PENDIENTES DE REVISIÓN</div>
          </div>
          <div className="stat">
            <div className="num">5</div>
            <div className="lbl">CARRERAS REPRESENTADAS</div>
          </div>
        </div>

        <ProjectsTable mode={mode} projects={projects} />
      </div>
    </div>
  );
};