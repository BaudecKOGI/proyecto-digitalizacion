import React from 'react';
import { ProjectsTable } from '../../components/editor/ProjectsTable';

export const ProjectsList = ({ mode, projects, onDelete, onEdit }) => (
  <>
    <div className="content-header">
      <div><h2>Todos los proyectos</h2><div className="sub">Administra el inventario completo.</div></div>
    </div>
    <ProjectsTable mode={mode} projects={projects} onDelete={onDelete} onEdit={onEdit} />
  </>
);