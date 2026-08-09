"use client";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

class AuthClient {
  async signUp(_) {
    return { error: "El registro público está desactivado. Solicita acceso a un Administrador." };
  }

  async signInWithOAuth(_) {
    return { error: "Social authentication not implemented" };
  }

  async signInWithPassword(params) {
    const { email, password } = params;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Credenciales incorrectas." };
      }

      if (data.success && data.user) {
        const formattedUser = {
          id: data.user.id,
          avatar: data.user.avatar_url || data.user.avatar || "/assets/user.png",
          firstName: data.user.nombre.split(" ")[0] || data.user.nombre,
          lastName: data.user.nombre.split(" ").slice(1).join(" ") || "",
          name: data.user.nombre,
          email: data.user.email,
          rol: data.user.rol,
          is_active: data.user.is_active,
        };

        localStorage.setItem("custom-auth-token", data.token);
        localStorage.setItem("custom-auth-user", JSON.stringify(formattedUser));

        return { data: { user: formattedUser, token: data.token } };
      }

      return { error: "Error inesperado al iniciar sesión." };
    } catch (err) {
      console.error("Error al autenticar con el servidor:", err);
      return { error: "No se pudo conectar con el servidor de autenticación." };
    }
  }

  async resetPassword({ email }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || "No se pudo solicitar el restablecimiento." };
      }
      return { data: { success: true } };
    } catch (err) {
      return { error: "Error de red al solicitar restablecimiento." };
    }
  }

  async confirmPasswordReset({ uid, token, password }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || "No se pudo actualizar la contraseña." };
      }
      return { data: { success: true } };
    } catch (err) {
      return { error: "Error de red al actualizar la contraseña." };
    }
  }

  async updateProfile({ nombre, email, avatar, remove_avatar }) {
    const token = localStorage.getItem("custom-auth-token");
    const storedUser = localStorage.getItem("custom-auth-user");
    let current_email = "";
    if (storedUser) {
      try {
        current_email = JSON.parse(storedUser).email || "";
      } catch (e) {}
    }
    try {
      const formData = new FormData();
      if (nombre) formData.append("nombre", nombre);
      if (email) formData.append("email", email);
      if (current_email) formData.append("current_email", current_email);
      if (avatar) formData.append("avatar", avatar);
      if (remove_avatar) formData.append("remove_avatar", "true");

      const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || "Error al actualizar el perfil." };
      }
      if (data.success && data.user) {
        const formattedUser = {
          id: data.user.id,
          avatar: data.user.avatar_url || data.user.avatar || "/assets/user.png",
          firstName: data.user.nombre.split(" ")[0] || data.user.nombre,
          lastName: data.user.nombre.split(" ").slice(1).join(" ") || "",
          name: data.user.nombre,
          email: data.user.email,
          rol: data.user.rol,
          is_active: data.user.is_active,
        };
        localStorage.setItem("custom-auth-user", JSON.stringify(formattedUser));
        return { data: { user: formattedUser } };
      }
      return { error: "No se pudo procesar la respuesta del perfil." };
    } catch (err) {
      return { error: "Error de red al actualizar el perfil." };
    }
  }

  async updatePassword({ current_password, new_password }) {
    const token = localStorage.getItem("custom-auth-token");
    const storedUser = localStorage.getItem("custom-auth-user");
    let current_email = "";
    if (storedUser) {
      try {
        current_email = JSON.parse(storedUser).email || "";
      } catch (e) {}
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password, new_password, current_email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || "Error al cambiar la contraseña." };
      }
      return { data: { success: true, message: data.message } };
    } catch (err) {
      return { error: "Error de red al cambiar la contraseña." };
    }
  }

  async getUser() {
    try {
      const token = localStorage.getItem("custom-auth-token");
      if (!token) return { data: null };
      
      const userStr = localStorage.getItem("custom-auth-user");
      if (userStr) {
        const parsed = JSON.parse(userStr);
        if (parsed.avatar === "/assets/avatar_jonel.png") {
          parsed.avatar = "/assets/user.png";
          localStorage.setItem("custom-auth-user", JSON.stringify(parsed));
        }
        return { data: parsed };
      }
      return { data: null };
    } catch (e) {
      localStorage.removeItem("custom-auth-token");
      localStorage.removeItem("custom-auth-user");
      return { data: null };
    }
  }

  async signOut() {
    const token = localStorage.getItem("custom-auth-token");
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } catch (e) {
      console.error("Error al cerrar sesión en el servidor:", e);
    } finally {
      localStorage.removeItem("custom-auth-token");
      localStorage.removeItem("custom-auth-user");
    }

    return {};
  }
}

export const authClient = new AuthClient();
