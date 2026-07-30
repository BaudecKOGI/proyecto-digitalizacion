import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, PlusCircle, User, ArrowLeft, Hexagon } from 'lucide-react';

export const EditorSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isDig = location.pathname.includes('software');
  const basePath = isDig ? '/editor/software' : '/editor/3d';

  const checkActive = (path) => {
    if (path === 'dashboard' && location.pathname === basePath) return true;
    return location.pathname.endsWith(path);
  };

  const handleNav = (path) => {
    if (path === 'dashboard') navigate(basePath);
    else navigate(`${basePath}/${path}`);
  };

  const NavItem = ({ icon: Icon, label, path }) => {
    const active = checkActive(path);
    return (
      <button 
        onClick={() => handleNav(path)}
        className={`group relative flex w-full items-center ${isCollapsed ? 'justify-center' : 'justify-start px-4'} py-3 mb-2 rounded-xl transition-all duration-200
          ${active 
            ? 'bg-[var(--accent-dim)] font-semibold shadow-sm text-[var(--accent)]' 
            : 'text-[var(--text-muted)] hover:bg-[var(--bg-general)] hover:text-[var(--text-main)]'}`}
      >
        <Icon size={20} className={`transition-colors ${active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'}`} />
        
        <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-3'}`}>
          <span className="text-sm">{label}</span>
        </div>
      </button>
    );
  };

  return (
    <aside 
      onMouseEnter={() => setIsCollapsed(false)}
      className={`relative z-20 flex flex-col border-r border-[var(--line)] bg-[var(--panel)] transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-[76px]' : 'w-64'} hidden sm:flex`}
    >
      <div className="flex h-16 items-center justify-center border-b border-[var(--line)] mb-4 px-4 overflow-hidden whitespace-nowrap">
        {isCollapsed ? (
           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)] text-[var(--accent)] transition-all duration-300">
             <Hexagon size={24} />
           </div>
        ) : (
          <div className="flex w-full items-center gap-3 animate-in fade-in duration-300">
             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-[var(--accent)]">
               <Hexagon size={20} />
             </div>
             <span className="truncate font-display text-lg font-bold tracking-tight text-[var(--text-main)]">
               FAB LAB <span className="text-[var(--accent)]">REPO</span>
             </span>
          </div>
        )}
      </div>
      
      <div className="flex-1 px-3 overflow-y-auto no-scrollbar">
        <NavItem icon={LayoutDashboard} label="Dashboard" path="dashboard" />
        <NavItem icon={Box} label="Todos los proyectos" path="proyectos" />
        <NavItem icon={PlusCircle} label="Nuevo proyecto" path="nuevo" />
        <div className="my-4 mx-2 border-t border-[var(--line)]"></div>
        <NavItem icon={User} label="Mi Perfil" path="perfil" />
      </div>
      
      <div className="mt-auto border-t border-[var(--line)] p-3">
        <button 
          onClick={(e) => { e.stopPropagation(); navigate('/editor/hub'); }}
          className={`group relative flex w-full items-center ${isCollapsed ? 'justify-center' : 'justify-start px-4'} py-3 rounded-xl text-[var(--text-muted)] transition-all duration-200 hover:bg-red-500/10 hover:text-red-500`}
        >
          <ArrowLeft size={20} />
          <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-3'}`}>
            <span className="text-sm font-medium">Volver al inicio</span>
          </div>
        </button>
      </div>
    </aside>
  );
};