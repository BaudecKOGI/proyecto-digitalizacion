import React from 'react';
import { User } from 'lucide-react';

export const Profile = () => (
  <>
    <div className="content-header">
      <div>
        <h2>Mi Perfil</h2>
        <div className="sub">Información de tu cuenta de Editor.</div>
      </div>
    </div>
    
    <div style={{ background: 'var(--panel)', padding: '32px', borderRadius: '12px', border: '1px solid var(--line)', display: 'flex', gap: '24px', alignItems: 'center' }}>
      
      {/* Avatar grande */}
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <User size={40} />
      </div>
      
      {/* Datos del usuario */}
      <div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: 'var(--text-main)' }}>Cuenta de Editor</h3>
        <p style={{ margin: '0 0 4px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
          <strong>Rol:</strong> Editor (Acceso a proyectos del Fab Lab)
        </p>
        <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '14px' }}>
          <strong>Permisos:</strong> Subir, editar y gestionar proyectos.
        </p>
      </div>
      
    </div>
  </>
);