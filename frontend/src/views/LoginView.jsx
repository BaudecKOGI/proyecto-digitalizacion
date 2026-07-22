import React, { useState } from 'react';

export const LoginView = ({ onLogin }) => {
  const [user, setUser] = useState('editor');
  const [pass, setPass] = useState('••••••••');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="screen">
      <div className="login-card">
        <div className="eyebrow">IMAGYNER PROJECT</div>
        <h1>Panel Editor — FabLab UNI</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Usuario"
          />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Contraseña"
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
};