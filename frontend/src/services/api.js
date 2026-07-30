// src/services/api.js

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Función auxiliar para manejar respuestas y errores del servidor
async function handleResponse(res) {
  if (!res.ok) {
    let errorMsg = "Error en la solicitud al servidor.";
    try {
      const errorData = await res.json();
      if (typeof errorData === "object") {
        errorMsg = Object.values(errorData).flat().join(" ");
      } else {
        errorMsg = errorData;
      }
    } catch (e) {
      errorMsg = res.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }
  if (res.status === 204) return null;
  return await res.json();
}

// ==========================================
// PROYECTOS LANDING PAGE / 3D
// ==========================================
export const fetchProyectos3D = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/proyectos-3d/`);
    if (!res.ok) throw new Error('Error');
    return await res.json();
  } catch (error) {
    console.log("Backend no disponible o sin datos 3D, usando datos vacíos");
    return [];
  }
};

export const createProyecto3D = async (formData) => {
  // Nota vital: Cuando envías FormData con fetch, NO debes poner el "Content-Type".
  // El navegador lo calcula automáticamente y añade el "boundary" necesario para los archivos.
  const res = await fetch(`${API_BASE_URL}/proyectos-3d/`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
};

// NUEVO: Obtener un solo proyecto 3D por su ID para editarlo
export const fetchProyecto3DById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/proyectos-3d/${id}/`);
  return handleResponse(res);
};

// NUEVO: Actualizar un proyecto 3D existente
export const updateProyecto3D = async (id, formData) => {
  // Usamos PATCH para actualizar solo los campos que se envíen
  const res = await fetch(`${API_BASE_URL}/proyectos-3d/${id}/`, {
    method: "PATCH",
    body: formData, // Al ser FormData (con o sin archivos nuevos), no lleva Content-Type
  });
  return handleResponse(res);
};

// NUEVO: Eliminar un proyecto 3D
export const deleteProyecto3D = async (id) => {
  const res = await fetch(`${API_BASE_URL}/proyectos-3d/${id}/`, {
    method: "DELETE",
  });
  return handleResponse(res);
};

export const fetchProyectosSoftware = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/proyectos-software/`);
    if (!res.ok) throw new Error('Error');
    return await res.json();
  } catch (error) {
    console.log("Backend no disponible o sin datos Software, usando datos vacíos");
    return [];
  }
};

// ==========================================
// GESTIÓN DE EDITORES (ROL='EDITOR')
// ==========================================
export const fetchEditores = async (search = "") => {
  const url = search 
    ? `${API_BASE_URL}/editores/?search=${encodeURIComponent(search)}` 
    : `${API_BASE_URL}/editores/`;
  const res = await fetch(url);
  return handleResponse(res);
};

export const createEditor = async (editorData) => {
  const res = await fetch(`${API_BASE_URL}/editores/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editorData),
  });
  return handleResponse(res);
};

export const updateEditor = async (id, editorData) => {
  const res = await fetch(`${API_BASE_URL}/editores/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editorData),
  });
  return handleResponse(res);
};

export const deleteEditor = async (id) => {
  const res = await fetch(`${API_BASE_URL}/editores/${id}/`, {
    method: "DELETE",
  });
  return handleResponse(res);
};

// ==========================================
// PERFIL DE USUARIO Y SEGURIDAD
// ==========================================

// Actualizar los datos de la cuenta (Nombre, Correo)
export const updatePerfil = async (perfilData) => {
  const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
    method: "PATCH", // Usamos PATCH o PUT (depende de cómo lo programaron en views.py)
    headers: {
      "Content-Type": "application/json",
      // OJO: Como vi que usas 'rest_framework_simplejwt', seguramente necesites enviar el token.
      // Si guardas tu token en localStorage, descomenta la siguiente línea:
      // "Authorization": `Bearer ${localStorage.getItem('access')}`
    },
    body: JSON.stringify(perfilData),
  });
  return handleResponse(res);
};

// Actualizar la contraseña
export const updatePassword = async (passwordData) => {
  const res = await fetch(`${API_BASE_URL}/auth/change-password/`, {
    method: "POST", // Por lo general cambiar password suele ser POST o PUT
    headers: {
      "Content-Type": "application/json",
      // Si guardas tu token en localStorage, descomenta la siguiente línea:
      // "Authorization": `Bearer ${localStorage.getItem('access')}`
    },
    // El backend espera recibir algo como { "actual": "...", "nueva": "..." }
    body: JSON.stringify(passwordData), 
  });
  return handleResponse(res);
};

// ==========================================
// GESTIÓN DE CATEGORÍAS
// ==========================================
export const fetchCategorias = async (search = "") => {
  const url = search 
    ? `${API_BASE_URL}/categorias/?search=${encodeURIComponent(search)}` 
    : `${API_BASE_URL}/categorias/`;
  const res = await fetch(url);
  return handleResponse(res);
};

export const createCategoria = async (categoriaData) => {
  const res = await fetch(`${API_BASE_URL}/categorias/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoriaData),
  });
  return handleResponse(res);
};

export const updateCategoria = async (id, categoriaData) => {
  const res = await fetch(`${API_BASE_URL}/categorias/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoriaData),
  });
  return handleResponse(res);
};

export const deleteCategoria = async (id) => {
  const res = await fetch(`${API_BASE_URL}/categorias/${id}/`, {
    method: "DELETE",
  });
  return handleResponse(res);
};

// ==========================================
// GESTIÓN DE TECNOLOGÍAS
// ==========================================
export const fetchTecnologias = async (search = "") => {
  const url = search 
    ? `${API_BASE_URL}/tecnologias/?search=${encodeURIComponent(search)}` 
    : `${API_BASE_URL}/tecnologias/`;
  const res = await fetch(url);
  return handleResponse(res);
};

export const createTecnologia = async (techData) => {
  const res = await fetch(`${API_BASE_URL}/tecnologias/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(techData),
  });
  return handleResponse(res);
};

export const updateTecnologia = async (id, techData) => {
  const res = await fetch(`${API_BASE_URL}/tecnologias/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(techData),
  });
  return handleResponse(res);
};

export const deleteTecnologia = async (id) => {
  const res = await fetch(`${API_BASE_URL}/tecnologias/${id}/`, {
    method: "DELETE",
  });
  return handleResponse(res);
};

// ==========================================
// GESTIÓN DE PROYECTOS SOFTWARE (ADMIN / EDITOR)
// ==========================================
export const fetchProyectosSoftwareAdmin = async ({ search = "", ods = "", categoria = "", estado = "" } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (ods) params.append("ods", ods);
  if (categoria) params.append("categoria", categoria);
  if (estado) params.append("estado", estado);
  const url = `${API_BASE_URL}/proyectos-software/${params.toString() ? "?" + params.toString() : ""}`;
  const res = await fetch(url);
  return handleResponse(res);
};

export const createProyectoSoftware = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/proyectos-software/`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
};

export const updateProyectoSoftware = async (id, formData) => {
  const res = await fetch(`${API_BASE_URL}/proyectos-software/${id}/`, {
    method: "PATCH",
    body: formData,
  });
  return handleResponse(res);
};

export const deleteProyectoSoftware = async (id) => {
  const res = await fetch(`${API_BASE_URL}/proyectos-software/${id}/`, {
    method: "DELETE",
  });
  return handleResponse(res);
};
