import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // Agregamos useLocation
import { AuthGuard } from '@/components/auth/AuthGuard';
import { EditorSidebar } from '../components/editor/EditorSidebar';
import { EditorNavbar } from '../components/editor/EditorNavbar';
import '../styles/editor-panel.css';

export default function EditorLayout() {
  const location = useLocation(); // Esto lee la URL actual

  useEffect(() => {
    // Si la ruta incluye la palabra 'software', usamos el color digital, si no, el de 3D
    const isSoftware = location.pathname.includes('software');
    const accentColor = isSoftware ? 'var(--cdig)' : 'var(--c3d)';

    document.documentElement.style.setProperty('--accent', accentColor);
  }, [location.pathname]); // Se vuelve a ejecutar cada vez que cambias de página

  return (
    <AuthGuard requiredRole={["EDITOR"]}>
      <div className="shell">
        {/* 1. Ponemos el Sidebar fijo a la izquierda */}
        <EditorSidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 2. Ponemos el Navbar fijo arriba */}
          <EditorNavbar />

          {/* 3. Aquí es donde ocurre la magia */}
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

