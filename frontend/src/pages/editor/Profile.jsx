import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, ShieldCheck, Activity, 
  Lock, Eye, EyeOff, Camera, Trash2,
  CheckCircle2, X, AlertTriangle
} from 'lucide-react';
import { useUser } from '@/hooks/use-user'; 
import { authClient } from '@/lib/auth/client'; 

export const Profile = () => {
  const { user, checkSession } = useUser(); 
  const fileInputRef = useRef(null);
  const pendingAvatarRef = useRef(null);
  const avatarLoadedRef = useRef(false);
  
  const [accountData, setAccountData] = useState({
    nombre: '',
    correo: '',
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  const [passwords, setPasswords] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });

  const [showPass, setShowPass] = useState({
    actual: false,
    nueva: false,
  });

  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: '',
    message: '',
    action: null,
  });

  const [toast, setToast] = useState(null);

  const getUserNombre = (u) => u?.nombre || u?.name || '';
  const getUserEmail = (u) => u?.email || '';
  const getUserAvatar = (u) => u?.avatar_url || u?.avatar || null;

  useEffect(() => {
    if (!user) return;

    setAccountData({
      nombre: getUserNombre(user),
      correo: getUserEmail(user),
    });

    if (!avatarLoadedRef.current && !pendingAvatarRef.current) {
      setAvatarPreview(getUserAvatar(user));
      avatarLoadedRef.current = true;
    }
  }, [user]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openConfirm = (title, message, action) => {
    setConfirmModal({ open: true, title, message, action });
  };

  const closeConfirm = () => {
    setConfirmModal({ open: false, title: '', message: '', action: null });
  };

  const handleAccountChange = (e) => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const toggleShowPass = (field) => {
    setShowPass({ ...showPass, [field]: !showPass[field] });
  };

  const handleOpenFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Solo se permiten archivos de imagen.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'La imagen no debe superar los 5 MB.');
      return;
    }

    pendingAvatarRef.current = file;
    setAvatarPreview(URL.createObjectURL(file));

    openConfirm(
      'Actualizar foto de perfil',
      '¿Estás seguro de que deseas cambiar tu foto de perfil?',
      'avatar'
    );
  };

  const cancelPendingAvatar = () => {
    pendingAvatarRef.current = null;
    setAvatarPreview(getUserAvatar(user));
    if (fileInputRef.current) fileInputRef.current.value = '';
    closeConfirm();
  };

  const doSaveAvatar = async () => {
    const file = pendingAvatarRef.current;

    if (!file) {
      showToast('error', 'No hay ninguna foto seleccionada.');
      closeConfirm();
      return;
    }

    const nombre = (accountData.nombre || getUserNombre(user) || '').trim();
    const email = (accountData.correo || getUserEmail(user) || '').trim().toLowerCase();

    if (!nombre || !email) {
      showToast('error', 'No se pudo obtener tu nombre o correo. Recarga la página e inténtalo de nuevo.');
      closeConfirm();
      return;
    }

    setIsSavingAvatar(true);
    try {
      const { error, data } = await authClient.updateProfile({
        nombre,
        email,
        avatar: file,
      });

      if (error) {
        showToast('error', error);
        return;
      }

      const newAvatar = data?.user?.avatar || null;
      if (newAvatar) {
        const sep = newAvatar.includes('?') ? '&' : '?';
        setAvatarPreview(`${newAvatar}${sep}t=${Date.now()}`);
      }

      pendingAvatarRef.current = null;
      avatarLoadedRef.current = true;
      if (fileInputRef.current) fileInputRef.current.value = '';

      await checkSession?.();

      showToast('success', '¡Foto de perfil actualizada correctamente!');
      closeConfirm();
    } catch (err) {
      console.error('Error al subir avatar:', err);
      showToast('error', err.message || 'Error al actualizar la foto de perfil.');
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    openConfirm(
      'Eliminar foto de perfil',
      '¿Estás seguro de que deseas eliminar tu foto de perfil actual?',
      'remove_avatar'
    );
  };

  const doRemoveAvatar = async () => {
    const nombre = (accountData.nombre || getUserNombre(user) || '').trim();
    const email = (accountData.correo || getUserEmail(user) || '').trim().toLowerCase();

    setIsSavingAvatar(true);
    try {
      const { error } = await authClient.updateProfile({
        nombre,
        email,
        remove_avatar: true,
      });

      if (error) {
        showToast('error', error);
        return;
      }

      setAvatarPreview(null);
      pendingAvatarRef.current = null;
      avatarLoadedRef.current = true;
      if (fileInputRef.current) fileInputRef.current.value = '';

      await checkSession?.();
      showToast('success', '¡Foto de perfil eliminada correctamente!');
      closeConfirm();
    } catch (err) {
      showToast('error', 'Error al eliminar la foto de perfil.');
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const doSaveAccount = async () => {
    setIsSavingAccount(true);
    
    const { error } = await authClient.updateProfile({
      nombre: accountData.nombre,
      email: accountData.correo
    });

    if (error) {
      showToast('error', error);
    } else {
      showToast('success', '¡Información de la cuenta actualizada correctamente!');
      await checkSession?.(); 
    }
    
    setIsSavingAccount(false);
    closeConfirm();
  };

  const doSavePassword = async () => {
    setIsSavingPassword(true);
    
    const { error } = await authClient.updatePassword({
      current_password: passwords.actual,
      new_password: passwords.nueva
    });

    if (error) {
      showToast('error', error);
    } else {
      showToast('success', '¡Contraseña actualizada correctamente!');
      setPasswords({ actual: '', nueva: '', confirmar: '' }); 
    }
    
    setIsSavingPassword(false);
    closeConfirm();
  };

  const handleConfirmAction = async () => {
    if (confirmModal.action === 'avatar') {
      await doSaveAvatar();
    } else if (confirmModal.action === 'remove_avatar') {
      await doRemoveAvatar();
    } else if (confirmModal.action === 'account') {
      await doSaveAccount();
    } else if (confirmModal.action === 'password') {
      await doSavePassword();
    } else {
      closeConfirm();
    }
  };

  const handleModalCancel = () => {
    if (confirmModal.action === 'avatar') {
      cancelPendingAvatar();
    } else {
      closeConfirm();
    }
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    openConfirm(
      'Actualizar información',
      '¿Estás seguro de que deseas actualizar tu nombre y correo electrónico?',
      'account'
    );
  };

  const handleSavePassword = (e) => {
    e.preventDefault();

    if (passwords.nueva !== passwords.confirmar) {
      showToast('error', 'La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    openConfirm(
      'Actualizar contraseña',
      '¿Estás seguro de que deseas cambiar tu contraseña? Tendrás que usar la nueva la próxima vez que inicies sesión.',
      'password'
    );
  };

  const inputContainerClass = "relative border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--bg-general)] focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/20 transition-all";
  const labelClass = "text-[11px] font-semibold text-[var(--text-muted)] block mb-1";
  const inputWrapperClass = "flex items-center gap-2";
  const inputClass = "w-full bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 text-sm text-[var(--text-main)]";

  return (
    <div className="flex flex-col h-full pb-8 relative">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1 text-[var(--text-main)]">Mi Perfil</h2>
        <div className="text-sm text-[var(--text-muted)]">Gestiona tu información personal y configuración de seguridad.</div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        <div className="w-full lg:w-[320px] shrink-0 bg-[var(--panel)] rounded-xl border border-[var(--line)] overflow-hidden shadow-sm flex flex-col">
          <div className="h-24 bg-gradient-to-r from-slate-700 to-slate-800 relative"></div>
          
          <div className="flex justify-center -mt-12 relative z-10">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-[var(--panel)] p-1.5">
                <div className="w-full h-full rounded-full bg-white text-[var(--text-muted)] flex items-center justify-center border border-[var(--line)] overflow-hidden">
                  {avatarPreview ? (
                    <img 
                      key={avatarPreview}
                      src={avatarPreview} 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User size={48} />
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenFilePicker}
                disabled={isSavingAvatar}
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-md hover:opacity-90 transition-opacity cursor-pointer border-2 border-[var(--panel)] disabled:opacity-50"
                title="Cambiar foto de perfil"
              >
                <Camera size={14} />
              </button>

              {avatarPreview && !avatarPreview.includes("/assets/user.png") && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={isSavingAvatar}
                  className="absolute bottom-1 left-1 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:opacity-90 transition-opacity cursor-pointer border-2 border-[var(--panel)] disabled:opacity-50"
                  title="Eliminar foto de perfil"
                >
                  <Trash2 size={14} />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="px-6 pb-6 pt-5 flex flex-col items-center text-center flex-1">
            <h3 className="text-xl font-bold text-[var(--text-main)] m-0 mb-1">
              {getUserNombre(user) || accountData.nombre || 'Cargando...'}
            </h3>
            <p className="text-sm text-[var(--text-muted)] m-0 mb-4">
              {getUserEmail(user) || accountData.correo || 'Cargando...'}
            </p>

            <span className="bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-[var(--accent)]/20">
              {user?.rol === 'ADMIN' ? 'Administrador' : 'Editor de Proyectos'}
            </span>

            {isSavingAvatar && (
              <p className="text-xs text-[var(--accent)] font-medium animate-pulse">
                Subiendo foto...
              </p>
            )}
          </div>

          <div className="border-t border-[var(--line)] p-4 bg-[var(--bg-general)]/50 text-center">
            <p className="text-[11px] text-[var(--text-muted)] font-medium">
              Cuenta de administración protegida · FAB LAB
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6 w-full">
          
          <form onSubmit={handleSaveAccount} className="bg-[var(--panel)] p-6 rounded-xl border border-[var(--line)] shadow-sm">
            <div className="border-b border-[var(--line)] pb-4 mb-5">
              <h3 className="text-lg font-bold text-[var(--text-main)] mb-1">Información de la Cuenta</h3>
              <p className="text-sm text-[var(--text-muted)] m-0">Actualiza tu nombre de editor y correo de acceso.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className={inputContainerClass}>
                <label className={labelClass}>Nombre de Editor *</label>
                <div className={inputWrapperClass}>
                  <User size={16} className="text-[var(--text-muted)] shrink-0" />
                  <input type="text" name="nombre" value={accountData.nombre} onChange={handleAccountChange} className={inputClass} required />
                </div>
              </div>

              <div className={inputContainerClass}>
                <label className={labelClass}>Correo Electrónico (Usuario) *</label>
                <div className={inputWrapperClass}>
                  <Mail size={16} className="text-[var(--text-muted)] shrink-0" />
                  <input type="email" name="correo" value={accountData.correo} onChange={handleAccountChange} className={inputClass} required />
                </div>
              </div>

              <div className={`${inputContainerClass} opacity-70 cursor-not-allowed`}>
                <label className={labelClass}>Rol Asignado</label>
                <div className={inputWrapperClass}>
                  <ShieldCheck size={16} className="text-[var(--text-muted)] shrink-0" />
                  <input type="text" value={user?.rol || "EDITOR"} disabled className={inputClass} />
                </div>
              </div>

              <div className={`${inputContainerClass} opacity-70 cursor-not-allowed`}>
                <label className={labelClass}>Estado de la cuenta</label>
                <div className={inputWrapperClass}>
                  <Activity size={16} className="text-[var(--text-muted)] shrink-0" />
                  <input type="text" value={user?.is_active !== false ? "Activa (En línea)" : "Inactiva"} disabled className={inputClass} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--line)]">
              <button type="submit" disabled={isSavingAccount} className="bg-[var(--accent)] text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 cursor-pointer">
                {isSavingAccount ? 'Guardando...' : 'Guardar Información'}
              </button>
            </div>
          </form>

          <form onSubmit={handleSavePassword} className="bg-[var(--panel)] p-6 rounded-xl border border-[var(--line)] shadow-sm">
            <div className="border-b border-[var(--line)] pb-4 mb-5">
              <h3 className="text-lg font-bold text-[var(--text-main)] mb-1">Seguridad y Contraseña</h3>
              <p className="text-sm text-[var(--text-muted)] m-0">Modifica tu clave secreta de inicio de sesión.</p>
            </div>

            <div className="flex flex-col gap-4 mb-2">
              <div className={inputContainerClass}>
                <label className={labelClass}>Contraseña Actual *</label>
                <div className={inputWrapperClass}>
                  <Lock size={16} className="text-[var(--text-muted)] shrink-0" />
                  <input 
                    type={showPass.actual ? "text" : "password"} 
                    name="actual" 
                    value={passwords.actual} 
                    onChange={handlePasswordChange} 
                    className={inputClass} 
                    placeholder="••••••••" 
                    required 
                  />
                  <button type="button" onClick={() => toggleShowPass('actual')} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer">
                    {showPass.actual ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={inputContainerClass}>
                  <label className={labelClass}>Nueva Contraseña *</label>
                  <div className={inputWrapperClass}>
                    <Lock size={16} className="text-[var(--text-muted)] shrink-0" />
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
                    <button type="button" onClick={() => toggleShowPass('nueva')} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer">
                      {showPass.nueva ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className={inputContainerClass}>
                  <label className={labelClass}>Confirmar Nueva Contraseña *</label>
                  <div className={inputWrapperClass}>
                    <Lock size={16} className="text-[var(--text-muted)] shrink-0" />
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
              <button type="submit" disabled={isSavingPassword || !passwords.actual || !passwords.nueva} className="bg-[var(--accent)] text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer">
                {isSavingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </div>
          </form>

        </div>
      </div>

      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleModalCancel} />
          <div className="relative bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-main)] m-0 mb-1">{confirmModal.title}</h3>
                <p className="text-sm text-[var(--text-muted)] m-0 leading-relaxed">{confirmModal.message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={handleModalCancel} disabled={isSavingAvatar || isSavingAccount || isSavingPassword} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-muted)] border border-[var(--line)] hover:text-[var(--text-main)] transition-all cursor-pointer disabled:opacity-50">
                Cancelar
              </button>
              <button type="button" onClick={handleConfirmAction} disabled={isSavingAvatar || isSavingAccount || isSavingPassword} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[var(--accent)] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
                {(isSavingAvatar || isSavingAccount || isSavingPassword) ? 'Guardando...' : 'Sí, confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          <span className="text-sm font-semibold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-75 transition-opacity cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};