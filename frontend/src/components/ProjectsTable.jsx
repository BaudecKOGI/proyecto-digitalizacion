import React from 'react';

export const ProjectsTable = ({ mode, projects }) => {
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
        {projects.map((project, index) => (
          <tr key={index}>
            <td>{project.title}</td>
            <td>{project.author}</td>
            <td>{project.extra}</td>
            <td>
              <span className="tag-pill">Publicado</span>
            </td>
            <td className="row-actions">
              <span>Editar</span>
              <span>Eliminar</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};