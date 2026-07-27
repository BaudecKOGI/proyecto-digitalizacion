import React, { useState } from 'react';
import { User, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';
import { authClient } from '@/lib/auth/client';

export const EditorNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user, checkSession } = useUser();

  const displayName = user?.name || user?.firstName || "Editor";

  // Lógica del Modo Oscuro
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

  return (
    <header style={{
      height: '64px', background: 'var(--panel)', borderBottom: '1px solid var(--line)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px'
    }}>
      <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
        Bienvenido, <strong style={{ color: 'var(--text-main)' }}>{displayName}</strong>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontWeight: '600'
          }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
            </div>
            {displayName} <ChevronDown size={16} />
          </button>

          {isProfileOpen && (
            <div style={{ position: 'absolute', top: '110%', right: '0', background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '8px', width: '160px', zIndex: 10 }}>
              <div
                onClick={handleSignOut}
                style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#ef4444', fontSize: '13px', fontWeight: '500' }}
              >
                <LogOut size={16} /> Cerrar Sesión
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};