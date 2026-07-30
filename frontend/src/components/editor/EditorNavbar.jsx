import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, Sun, Moon, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';
import { authClient } from '@/lib/auth/client';

// Añadimos onGoToProfile como propiedad (prop)
export const EditorNavbar = ({ onGoToProfile }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark'));
  const navigate = useNavigate();
  const { user, checkSession } = useUser();
  const dropdownRef = useRef(null);

  const displayName = user?.name || user?.firstName || "Editor";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      await checkSession?.();
      navigate('/auth/sign-in', { replace: true });
    } catch (e) {
      console.error("Error al cerrar sesión:", e);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(false); // Cerramos el desplegable
    if (onGoToProfile) {
      onGoToProfile(); // Llamamos a la función que cambia el apartado
    } else {
      // Por si acaso usas rutas hash o query params y no la prop
      navigate('#perfil'); 
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[var(--line)] bg-[var(--panel)] px-4 md:px-8 transition-colors duration-300">
      
      <div className="text-sm font-medium text-[var(--text-muted)]">
        Bienvenido, <strong className="text-[var(--text-main)]">{displayName}</strong>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Toggle Modo Oscuro */}
        <button 
          onClick={toggleTheme} 
          className="rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-general)] hover:text-[var(--accent)]"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Perfil */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)} 
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-[var(--bg-general)]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-sm">
              <User size={16} />
            </div>
            <div className="hidden items-center gap-1 text-sm font-semibold text-[var(--text-main)] md:flex">
              {displayName} 
              <ChevronDown size={14} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Desplegable */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--panel)] shadow-xl py-1 z-50 origin-top-right animate-in fade-in zoom-in-95 transition-colors">
              
              <div className="border-b border-[var(--line)] px-4 py-2 mb-1 md:hidden">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Cuenta</p>
                <p className="truncate text-sm font-semibold text-[var(--text-main)]">{displayName}</p>
              </div>

              {/* NUEVO BOTÓN DE CONFIGURACIÓN */}
              <button
                onClick={handleProfileClick}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--text-main)] transition-colors hover:bg-[var(--bg-general)] hover:text-[var(--accent)]"
              >
                <Settings size={16} /> Configuración
              </button>

              <div className="my-1 border-t border-[var(--line)]"></div>

              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
              >
                <LogOut size={16} /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};