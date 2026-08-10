import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { EditorSidebar } from '../components/editor/EditorSidebar';
import { EditorNavbar } from '../components/editor/EditorNavbar';
import '../styles/editor-panel.css';

export default function EditorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Esto es para el celular
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detectamos si estamos en la sección de software o 3d
  const isSoftware = location.pathname.includes('software');

  useEffect(() => {
    const accentColor = isSoftware ? 'var(--cdig)' : 'var(--c3d)';
    document.documentElement.style.setProperty('--accent', accentColor);
  }, [isSoftware]);

  // Función inteligente que decide a qué perfil llevarte
  const handleGoToProfile = () => {
    if (isSoftware) {
      navigate('/editor/software/perfil');
    } else {
      navigate('/editor/3d/perfil');
    }
  };

  return (
    <AuthGuard requiredRole={["EDITOR"]}>
      <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-general)] font-sans text-[var(--text-main)] transition-colors duration-300">

        <EditorSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          // Pasamos los estados del celular al sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">

          <EditorNavbar
            onGoToProfile={handleGoToProfile}
            // Pasamos la función para abrir el menú al navbar
            onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
          />

          <main
            onClick={() => setIsCollapsed(true)}
            className="flex-1 overflow-y-auto p-4 md:p-8 cursor-default"
            style={{ scrollbarWidth: 'thin' }}
          >
            <div className="mx-auto max-w-7xl h-full">
              <Outlet />
            </div>
          </main>

        </div>
      </div>
    </AuthGuard>
  );
}