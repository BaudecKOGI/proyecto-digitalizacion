import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, GraduationCap, PlusCircle, User, ArrowLeft, Hexagon, X } from 'lucide-react';

export const EditorSidebar = ({ isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isDig = location.pathname.includes('software');
  const basePath = isDig ? '/editor/software' : '/editor/3d';

  // OJO: cambiado de .endsWith(path) a .startsWith(`${basePath}/${path}`)
  // para que rutas anidadas como /carreras/:carrera/:ciclo también
  // marquen "Carreras" como activo, no solo /carreras exacto.
  const checkActive = (path) => {
    if (path === 'dashboard') {
      return location.pathname === basePath || location.pathname === `${basePath}/dashboard`;
    }
    return location.pathname.startsWith(`${basePath}/${path}`);
  };

  const handleNav = (path) => {
    if (path === 'dashboard') navigate(basePath);
    else navigate(`${basePath}/${path}`);
    
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const NavItem = ({ icon: Icon, label, path }) => {
    const active = checkActive(path);
    return (
      <button
        onClick={() => handleNav(path)}
        className={`group relative flex w-full items-center py-3 mb-2 rounded-xl transition-all duration-200
          ${isCollapsed ? 'sm:justify-center justify-start px-4' : 'justify-start px-4'} 
          ${active 
            ? 'bg-[var(--accent-dim)] font-semibold shadow-sm text-[var(--accent)]' 
            : 'text-[var(--text-muted)] hover:bg-[var(--bg-general)] hover:text-[var(--text-main)]'}`}
      >
        <Icon size={20} className={`shrink-0 transition-colors ${active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'}`} />
        <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ml-3 
          ${isCollapsed ? 'sm:w-0 sm:opacity-0 w-auto opacity-100' : 'w-auto opacity-100'}`}>
          <span className="text-sm">{label}</span>
        </div>
      </button>
    );
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Aquí usamos transition-transform en vez de transition-all */}
      <aside 
        onMouseEnter={() => setIsCollapsed && setIsCollapsed(false)}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--line)] bg-[var(--panel)] transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
          sm:relative sm:translate-x-0 sm:shadow-none
          ${isCollapsed ? 'sm:w-[76px]' : 'sm:w-64'} 
          w-72`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--line)] mb-4 px-4 overflow-hidden whitespace-nowrap">
          <div className={`flex items-center gap-3 animate-in fade-in duration-300 ${isCollapsed ? 'sm:hidden' : 'flex'}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-[var(--accent)]">
              <Hexagon size={20} />
            </div>
            <span className="truncate font-display text-lg font-bold tracking-tight text-[var(--text-main)]">
              FAB LAB <span className="text-[var(--accent)]">REPO</span>
            </span>
          </div>

          <div className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)] text-[var(--accent)] transition-all duration-300 mx-auto ${isCollapsed ? 'sm:flex' : 'sm:hidden'}`}>
            <Hexagon size={24} />
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="sm:hidden p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-general)] rounded-lg shrink-0"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 px-3 overflow-y-auto no-scrollbar">
          <NavItem icon={LayoutDashboard} label="Dashboard" path="dashboard" />
          <NavItem icon={Box} label="Todos los proyectos" path="proyectos" />
          <NavItem icon={GraduationCap} label="Carreras" path="carreras" />
          <NavItem icon={PlusCircle} label="Nuevo proyecto" path="nuevo" />
          <div className="my-4 mx-2 border-t border-[var(--line)]"></div>
          <NavItem icon={User} label="Mi Perfil" path="perfil" />
        </div>
        
        <div className="mt-auto border-t border-[var(--line)] p-3">
          <button 
            onClick={(e) => { e.stopPropagation(); navigate('/editor/hub'); }}
            className={`group relative flex w-full items-center py-3 rounded-xl text-[var(--text-muted)] transition-all duration-200 hover:bg-red-500/10 hover:text-red-500
              ${isCollapsed ? 'sm:justify-center justify-start px-4' : 'justify-start px-4'}`}
          >
            <ArrowLeft size={20} className="shrink-0" />
            <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ml-3 
              ${isCollapsed ? 'sm:w-0 sm:opacity-0 w-auto opacity-100' : 'w-auto opacity-100'}`}>
              <span className="text-sm font-medium">Volver al inicio</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};