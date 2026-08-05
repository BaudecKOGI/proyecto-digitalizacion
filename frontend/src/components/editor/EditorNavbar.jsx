import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, Sun, Moon, Settings, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';
import { authClient } from '@/lib/auth/client';

export const EditorNavbar = ({ onGoToProfile, onToggleMobileMenu }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark'));
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  const { user, checkSession } = useUser();
  const dropdownRef = useRef(null);

  const displayName = user?.nombre || user?.name || user?.firstName || 'Editor';
  const avatarUrl = user?.avatar_url || user?.avatar || null;

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

  const handleSignOutClick = () => {
    setIsProfileOpen(false);
    setShowLogoutConfirm(true);
  };

  const handleConfirmSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      await checkSession?.();
      navigate('/auth/sign-in', { replace: true });
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    if (onGoToProfile) {
      onGoToProfile();
    } else {
      navigate('#perfil');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[var(--line)] bg-[var(--panel)] px-4 md:px-8 transition-colors duration-300">
        
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleMobileMenu();
            }}
            className="p-1 -ml-1 text-[var(--text-muted)] hover:text-[var(--text-main)] sm:hidden z-50 relative"
          >
            <Menu size={24} />
          </button>

          <div className="hidden sm:block text-sm font-medium text-[var(--text-muted)]">
            Bienvenido, <strong className="text-[var(--text-main)]">{displayName}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          
          <button 
            onClick={toggleTheme} 
            className="rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-general)] hover:text-[var(--accent)]"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-[var(--bg-general)]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--text-muted)] shadow-sm overflow-hidden border border-[var(--line)]">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={16} />
                )}
              </div>

              <div className="hidden items-center gap-1 text-sm font-semibold text-[var(--text-main)] md:flex">
                {displayName}
                <ChevronDown size={14} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--panel)] shadow-xl py-1 z-50 origin-top-right animate-in fade-in zoom-in-95 transition-colors">
                
                <div className="border-b border-[var(--line)] px-4 py-2 mb-1 md:hidden">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Cuenta</p>
                  <p className="truncate text-sm font-semibold text-[var(--text-main)]">{displayName}</p>
                </div>

                <button
                  onClick={handleProfileClick}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--text-main)] transition-colors hover:bg-[var(--bg-general)] hover:text-[var(--accent)]"
                >
                  <Settings size={16} /> Configuración
                </button>

                <div className="my-1 border-t border-[var(--line)]"></div>

                <button
                  onClick={handleSignOutClick}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}
          />
          <div className="relative bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <LogOut size={22} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[var(--text-main)] m-0 mb-1">
                  Cerrar sesión
                </h3>
                <p className="text-sm text-[var(--text-muted)] m-0 leading-relaxed">
                  ¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al panel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-muted)] border border-[var(--line)] hover:text-[var(--text-main)] transition-all cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSignOut}
                disabled={isLoggingOut}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? 'Cerrando...' : 'Sí, cerrar sesión'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};