import React, { useState, useEffect } from 'react';
import { 
  User, Mail, ShieldCheck, Activity, 
  Lock, Eye, EyeOff 
} from 'lucide-react';
import { useUser } from '@/hooks/use-user'; 
import { authClient } from '@/lib/auth/client'; 

export const Profile = () => {
  const { user, checkSession } = useUser(); 
  
  // Estado para la Información de la Cuenta
  const [accountData, setAccountData] = useState({
    nombre: '',
    correo: '',
  });

  // Efecto para llenar los datos cuando el hook useUser obtiene la información
  useEffect(() => {
    if (user) {
      setAccountData({
        nombre: user.name || '',
        correo: user.email || '',
      });
    }
  }, [user]);

  // Estado para las Contraseñas
  const [passwords, setPasswords] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });

  // Estado para mostrar/ocultar contraseñas
  const [showPass, setShowPass] = useState({
    actual: false,
    nueva: false,
  });

  // Estados visuales de guardado
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleAccountChange = (e) => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const toggleShowPass = (field) => {
    setShowPass({ ...showPass, [field]: !showPass[field] });
  };

  // Lógica para guardar la información de la cuenta
  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setIsSavingAccount(true);
    
    const { error } = await authClient.updateProfile({
      nombre: accountData.nombre,
      email: accountData.correo
    });

    if (error) {
      alert(`Error: ${error}`);
    } else {
      alert("¡Información de la cuenta actualizada correctamente!");
      await checkSession?.(); 
    }
    
    setIsSavingAccount(false);
  };

  // Lógica para actualizar la contraseña
  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (passwords.nueva !== passwords.confirmar) {
      alert("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    setIsSavingPassword(true);
    
    const { error } = await authClient.updatePassword({
      current_password: passwords.actual,
      new_password: passwords.nueva
    });

    if (error) {
      alert(`Error: ${error}`);
    } else {
      alert("¡Contraseña actualizada correctamente!");
      setPasswords({ actual: '', nueva: '', confirmar: '' }); 
    }
    
    setIsSavingPassword(false);
  };

  // Clases reutilizables para los inputs
  const inputContainerClass = "relative border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--bg-general)] focus-within:border-[var(--accent)] transition-colors";
  const labelClass = "text-[11px] font-semibold text-[var(--text-muted)] block mb-1";
  const inputWrapperClass = "flex items-center gap-2";
  const inputClass = "w-full bg-transparent border-none outline-none text-sm text-[var(--text-main)]";

  return (
    <div className="flex flex-col h-full pb-8">
      
      {/* CABECERA */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1 text-[var(--text-main)]">Mi Perfil</h2>
        <div className="text-sm text-[var(--text-muted)]">Gestiona tu información personal y configuración de seguridad.</div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA: TARJETA DE PERFIL */}
        <div className="w-full lg:w-[320px] shrink-0 bg-[var(--panel)] rounded-xl border border-[var(--line)] overflow-hidden shadow-sm flex flex-col">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-slate-700 to-slate-800 relative"></div>
          
          {/* Avatar (Superpuesto) */}
          <div className="flex justify-center -mt-12 relative z-10">
            <div className="w-24 h-24 rounded-full bg-[var(--panel)] p-1.5">
              <div className="w-full h-full rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center border border-[var(--accent)]/20 overflow-hidden">
                 {user?.avatar ? (
                   <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                   <User size={48} />
                 )}
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 pt-5 flex flex-col items-center text-center flex-1">
            <h3 className="text-xl font-bold text-[var(--text-main)] m-0 mb-1">{user?.name || accountData.nombre || 'Cargando...'}</h3>
            <p className="text-sm text-[var(--text-muted)] m-0 mb-4">{user?.email || accountData.correo || 'Cargando...'}</p>

            <span className="bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-[var(--accent)]/20">
              {user?.rol === 'ADMIN' ? 'Administrador' : 'Editor de Proyectos'}
            </span>
          </div>

          <div className="border-t border-[var(--line)] p-4 bg-[var(--bg-general)]/50 text-center">
            <p className="text-[11px] text-[var(--text-muted)] font-medium">
              Cuenta de administración protegida · FAB LAB
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIOS */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          
          {/* SECCIÓN 1: INFORMACIÓN DE LA CUENTA */}
          <form onSubmit={handleSaveAccount} className="bg-[var(--panel)] p-6 rounded-xl border border-[var(--line)] shadow-sm">
            <div className="border-b border-[var(--line)] pb-4 mb-5">
              <h3 className="text-lg font-bold text-[var(--text-main)] mb-1">Información de la Cuenta</h3>
              <p className="text-sm text-[var(--text-muted)] m-0">Actualiza tu nombre de editor y correo de acceso.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className={inputContainerClass}>
                <label className={labelClass}>Nombre de Editor *</label>
                <div className={inputWrapperClass}>
                  <User size={16} className="text-[var(--text-muted)]" />
                  <input type="text" name="nombre" value={accountData.nombre} onChange={handleAccountChange} className={inputClass} required />
                </div>
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>Correo Electrónico (Usuario) *</label>
                <div className={inputWrapperClass}>
                  <Mail size={16} className="text-[var(--text-muted)]" />
                  <input type="email" name="correo" value={accountData.correo} onChange={handleAccountChange} className={inputClass} required />
                </div>
              </div>

              <div className={`${inputContainerClass} opacity-70 cursor-not-allowed`}>
                <label className={labelClass}>Rol Asignado</label>
                <div className={inputWrapperClass}>
                  <ShieldCheck size={16} className="text-[var(--text-muted)]" />
                  <input type="text" value={user?.rol || "EDITOR"} disabled className={inputClass} />
                </div>
              </div>

              <div className={`${inputContainerClass} opacity-70 cursor-not-allowed`}>
                <label className={labelClass}>Estado de la cuenta</label>
                <div className={inputWrapperClass}>
                  <Activity size={16} className="text-[var(--text-muted)]" />
                  <input type="text" value={user?.is_active !== false ? "Activa (En línea)" : "Inactiva"} disabled className={inputClass} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--line)]">
              <button type="submit" disabled={isSavingAccount} className="bg-[var(--accent)] text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70">
                {isSavingAccount ? 'Guardando...' : 'Guardar Información'}
              </button>
            </div>
          </form>

          {/* SECCIÓN 2: SEGURIDAD Y CONTRASEÑA */}
          <form onSubmit={handleSavePassword} className="bg-[var(--panel)] p-6 rounded-xl border border-[var(--line)] shadow-sm">
            <div className="border-b border-[var(--line)] pb-4 mb-5">
              <h3 className="text-lg font-bold text-[var(--text-main)] mb-1">Seguridad y Contraseña</h3>
              <p className="text-sm text-[var(--text-muted)] m-0">Modifica tu clave secreta de inicio de sesión.</p>
            </div>

            <div className="flex flex-col gap-4 mb-2">
              <div className={inputContainerClass}>
                <label className={labelClass}>Contraseña Actual *</label>
                <div className={inputWrapperClass}>
                  <Lock size={16} className="text-[var(--text-muted)]" />
                  <input 
                    type={showPass.actual ? "text" : "password"} 
                    name="actual" 
                    value={passwords.actual} 
                    onChange={handlePasswordChange} 
                    className={inputClass} 
                    placeholder="••••••••" 
                    required 
                  />
                  <button type="button" onClick={() => toggleShowPass('actual')} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                    {showPass.actual ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={inputContainerClass}>
                  <label className={labelClass}>Nueva Contraseña *</label>
                  <div className={inputWrapperClass}>
                    <Lock size={16} className="text-[var(--text-muted)]" />
                    <input 
                      type={showPass.nueva ? "text" : "password"} 
                      name="nueva" 
                      value={passwords.nueva} 
                      onChange={handlePasswordChange} 
                      className={inputClass} 
                      placeholder="••••••••" 
                      required 
                      minLength={6}
                    />
                    <button type="button" onClick={() => toggleShowPass('nueva')} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                      {showPass.nueva ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className={inputContainerClass}>
                  <label className={labelClass}>Confirmar Nueva Contraseña *</label>
                  <div className={inputWrapperClass}>
                    <Lock size={16} className="text-[var(--text-muted)]" />
                    <input 
                      type="password" 
                      name="confirmar" 
                      value={passwords.confirmar} 
                      onChange={handlePasswordChange} 
                      className={inputClass} 
                      placeholder="••••••••" 
                      required 
                      minLength={6}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-[11px] text-[var(--text-muted)] mb-6 ml-1">Mínimo 6 caracteres</p>

            <div className="flex justify-end pt-4 border-t border-[var(--line)]">
              <button type="submit" disabled={isSavingPassword || !passwords.actual || !passwords.nueva} className="bg-[var(--accent)] text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed">
                {isSavingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};