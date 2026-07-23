import React, { useState, useEffect } from 'react';
import { LoginView } from '../views/LoginView';
import { HubView } from '../views/HubView';
import { DashboardView } from '../views/editor/DashboardView';
import '../styles/editor-panel.css'; // Tus estilos del admin

export default function EditorPanel() {
  const [screen, setScreen] = useState('login'); // 'login' | 'hub' | 'dashboard'
  const [mode, setMode] = useState('3d'); // '3d' | 'dig'

  // Cambia el color principal según la sección seleccionada
  useEffect(() => {
    const accentColor = mode === 'dig' ? 'var(--cdig)' : 'var(--c3d)';
    document.documentElement.style.setProperty('--accent', accentColor);
  }, [mode]);

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
    setScreen('dashboard');
  };

  return (
    <div className="editor-layout">
      {screen === 'login' && <LoginView onLogin={() => setScreen('hub')} />}
      {screen === 'hub' && <HubView onSelectMode={handleSelectMode} />}
      {screen === 'dashboard' && (
        <DashboardView mode={mode} onBackToHub={() => setScreen('hub')} />
      )}
    </div>
  );
}