import React from 'react';
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

export const EditorSidebar = ({ mode, onBackToHub, activeTab, onTabChange }) => {
  const isDig = mode === 'dig';

  // Función para agregar la clase "active" si la pestaña seleccionada coincide
  const checkActive = (tabName) => activeTab === tabName ? 'active' : '';

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
        onClick={() => onTabChange('dashboard')}
      >
        <LayoutDashboard size={18} /> Dashboard
      </div>
      
      <div 
        className={`nav-item ${checkActive('proyectos')}`}
        onClick={() => onTabChange('proyectos')}
      >
        <Box size={18} /> Todos los proyectos
      </div>
      
      <div 
        className={`nav-item ${checkActive('nuevo')}`}
        onClick={() => onTabChange('nuevo')}
      >
        <PlusCircle size={18} /> Nuevo proyecto
      </div>
      
      <div 
        className={`nav-item ${checkActive('categorias')}`}
        onClick={() => onTabChange('categorias')}
      >
        <Tags size={18} /> Categorías / Carreras
      </div>
      
      <div 
        className={`nav-item ${checkActive('papelera')}`}
        onClick={() => onTabChange('papelera')}
      >
        <Trash2 size={18} /> Papelera
      </div>
      
      {/* NUEVA OPCIÓN: Perfil (Reemplaza a Ajustes) */}
      <div 
        className={`nav-item ${checkActive('perfil')}`}
        onClick={() => onTabChange('perfil')}
      >
        <User size={18} /> Mi Perfil
      </div>
      
      {/* Botón para regresar */}
      <div className="back-hub" onClick={onBackToHub}>
        <ArrowLeft size={16} /> Volver al inicio
      </div>
    </div>
  );
};