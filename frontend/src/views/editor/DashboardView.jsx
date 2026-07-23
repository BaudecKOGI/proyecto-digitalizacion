import React, { useState, useEffect } from 'react';
import { EditorSidebar } from '../../components/editor/EditorSidebar';
import { EditorNavbar } from '../../components/editor/EditorNavbar';
import { Overview } from './Overview';
import { ProjectsList } from './ProjectsList';
import { NewProject } from './NewProject';
import { Profile } from './Profile'; // <-- 1. Importamos la vista del Perfil

export const DashboardView = ({ mode, onBackToHub }) => {
  const isDig = mode === 'dig';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [projects, setProjects] = useState([]);

  // Lógica real del Modo Oscuro
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    // Aplicamos o quitamos la clase 'dark' a la etiqueta <body>
    if (newTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  // Limpiamos el modo oscuro si el usuario sale del dashboard para no afectar el resto de la web
  useEffect(() => {
    return () => document.body.classList.remove('dark');
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Overview isDig={isDig} projectsCount={projects.length} />;
      case 'proyectos': return <ProjectsList mode={mode} projects={projects} onDelete={() => {}} onEdit={() => {}} />;
      case 'nuevo': return <NewProject />;
      case 'perfil': return <Profile />; // <-- 2. Añadimos el caso 'perfil'
      default: return <div>En construcción...</div>;
    }
  };

  return (
    <div className="shell">
      <EditorSidebar mode={mode} onBackToHub={onBackToHub} activeTab={activeTab} onTabChange={setActiveTab} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <EditorNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};