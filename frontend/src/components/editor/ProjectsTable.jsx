import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export const ProjectsTable = ({ mode, projects, onDelete, onEdit }) => {
  const isDig = mode === 'dig';

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Autor(es)</th>
          <th>{isDig ? 'Tecnología' : 'Material'}</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {projects.length === 0 ? (
          <tr>
            <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
              No hay proyectos registrados aún.
            </td>
          </tr>
        ) : (
          projects.map((project, index) => (
            <tr key={project.id || index}>
              <td style={{ fontWeight: '500' }}>{project.title}</td>
              <td>{project.author}</td>
              <td>{project.extra}</td>
              <td>
                <span className="tag-pill">
                  {project.status || 'Publicado'}
                </span>
              </td>
              <td className="row-actions">
                <span onClick={() => onEdit(project)}>
                  <Pencil size={16} /> Editar
                </span>
                <span onClick={() => onDelete(project.id)}>
                  <Trash2 size={16} /> Eliminar
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};