import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Importamos el icono User y quitamos Settings
import { 
  LayoutDashboard, 
  Box, 
  PlusCircle, 
  Tags, 
  Trash2, 
  User, 
  ArrowLeft 
} from 'lucide-react';

export const EditorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determinamos el modo actual basado en la URL
  const isDig = location.pathname.includes('software');
  const basePath = isDig ? '/editor/software' : '/editor/3d';

  // Función para agregar la clase "active" si la pestaña seleccionada coincide con la URL
  const checkActive = (path) => {
    if (path === 'dashboard' && location.pathname === basePath) return 'active';
    return location.pathname.endsWith(path) ? 'active' : '';
  };

  const handleNav = (path) => {
    if (path === 'dashboard') navigate(basePath);
    else navigate(`${basePath}/${path}`);
  };

  return (
    <div className="sidebar">
      {/* Título y Modo Actual */}
      <div className="brand">
        <div className="eyebrow">Gestionando</div>
        <div className="mode">
          {isDig ? 'Proyectos Digitales' : 'Proyectos 3D'}
        </div>
      </div>
      
      {/* Opciones del Menú */}
      <div 
        className={`nav-item ${checkActive('dashboard')}`}
        onClick={() => handleNav('dashboard')}
      >
        <LayoutDashboard size={18} /> Dashboard
      </div>
      
      <div 
        className={`nav-item ${checkActive('proyectos')}`}
        onClick={() => handleNav('proyectos')}
      >
        <Box size={18} /> Todos los proyectos
      </div>
      
      <div 
        className={`nav-item ${checkActive('nuevo')}`}
        onClick={() => handleNav('nuevo')}
      >
        <PlusCircle size={18} /> Nuevo proyecto
      </div>
      
      <div 
        className={`nav-item ${checkActive('categorias')}`}
        onClick={() => handleNav('categorias')}
      >
        <Tags size={18} /> Categorías / Carreras
      </div>
      
      <div 
        className={`nav-item ${checkActive('papelera')}`}
        onClick={() => handleNav('papelera')}
      >
        <Trash2 size={18} /> Papelera
      </div>
      
      {/* NUEVA OPCIÓN: Perfil (Reemplaza a Ajustes) */}
      <div 
        className={`nav-item ${checkActive('perfil')}`}
        onClick={() => handleNav('perfil')}
      >
        <User size={18} /> Mi Perfil
      </div>
      
      {/* Botón para regresar */}
      <div className="back-hub" onClick={() => navigate('/editor/hub')}>
        <ArrowLeft size={16} /> Volver al inicio
      </div>
    </div>
  );
};