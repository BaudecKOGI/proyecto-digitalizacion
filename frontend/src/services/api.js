// src/services/api.js

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Función auxiliar para obtener cabeceras con autenticación JWT
function getAuthHeaders(isFormData = false) {
  const headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  const token = localStorage.getItem("custom-auth-token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// Función auxiliar para manejar respuestas y errores del servidor
async function handleResponse(res) {
  if (!res.ok) {
    let errorMsg = "Error en la solicitud al servidor.";
    try {
      const errorData = await res.json();
      if (typeof errorData === "object" && errorData !== null) {
        errorMsg = Object.entries(errorData)
          .map(([field, msgs]) => {
            const msgStr = Array.isArray(msgs) ? msgs.join(" ") : String(msgs);
            return field !== "detail" && field !== "non_field_errors" ? `${field}: ${msgStr}` : msgStr;
          })
          .join(" | ");
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

// PROYECTOS LANDING PAGE / 3D
export const fetchProyectos3D = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/proyectos-3d/`, {
      headers: getAuthHeaders(false)
    });
    if (!res.ok) throw new Error("Error");
    return await res.json();
  } catch (error) {
    console.log("Backend no disponible o sin datos 3D, usando datos vacíos");
    return [];
  }
};

export const fetchProyectos3DAdmin = async ({ search = "", ods = "", categoria = "", estado = "" } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (ods) params.append("ods", ods);
  if (categoria) params.append("categoria", categoria);
  if (estado) params.append("estado", estado);
  const url = `${API_BASE_URL}/proyectos-3d/${params.toString() ? "?" + params.toString() : ""}`;
  const res = await fetch(url, {
    headers: getAuthHeaders(false)
  });
  return handleResponse(res);
};

export const createProyecto3D = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/proyectos-3d/`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: formData,
  });
  return handleResponse(res);
};

export const fetchProyecto3DById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/proyectos-3d/${id}/`, {
    headers: getAuthHeaders(false)
  });
  return handleResponse(res);
};

export const updateProyecto3D = async (id, formData) => {
  const res = await fetch(`${API_BASE_URL}/proyectos-3d/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(true),
    body: formData,
  });
  return handleResponse(res);
};

export const deleteProyecto3D = async (id) => {
  const res = await fetch(`${API_BASE_URL}/proyectos-3d/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(false)
  });
  return handleResponse(res);
};

export const fetchProyectosSoftware = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/proyectos-software/`, {
      headers: getAuthHeaders(false)
    });
    if (!res.ok) throw new Error("Error");
    return await res.json();
  } catch (error) {
    console.log("Backend no disponible o sin datos Software, usando datos vacíos");
    return [];
  }
};

// GESTIÓN DE EDITORES (ROL='EDITOR')
export const fetchEditores = async (search = "") => {
  const url = search
    ? `${API_BASE_URL}/editores/?search=${encodeURIComponent(search)}`
    : `${API_BASE_URL}/editores/`;
  const res = await fetch(url, {
    headers: getAuthHeaders(false)
  });
  return handleResponse(res);
};

export const createEditor = async (editorData) => {
  const res = await fetch(`${API_BASE_URL}/editores/`, {
    method: "POST",
    headers: getAuthHeaders(false),
    body: JSON.stringify(editorData),
  });
  return handleResponse(res);
};

export const updateEditor = async (id, editorData) => {
  const res = await fetch(`${API_BASE_URL}/editores/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(false),
    body: JSON.stringify(editorData),
  });
  return handleResponse(res);
};

export const deleteEditor = async (id) => {
  const res = await fetch(`${API_BASE_URL}/editores/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(false)
  });
  return handleResponse(res);
};

// PERFIL DE USUARIO Y SEGURIDAD
export const updatePerfil = async (perfilData) => {
  const isFormData = perfilData instanceof FormData;
  const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
    method: "PATCH",
    headers: getAuthHeaders(isFormData),
    body: isFormData ? perfilData : JSON.stringify(perfilData),
  });
  return handleResponse(res);
};

export const updatePassword = async (passwordData) => {
  const res = await fetch(`${API_BASE_URL}/auth/change-password/`, {
    method: "POST",
    headers: getAuthHeaders(false),
    body: JSON.stringify(passwordData),
  });
  return handleResponse(res);
};

// GESTIÓN DE CATEGORÍAS
export const fetchCategorias = async (search = "") => {
  const url = search
    ? `${API_BASE_URL}/categorias/?search=${encodeURIComponent(search)}`
    : `${API_BASE_URL}/categorias/`;
  const res = await fetch(url, {
    headers: getAuthHeaders(false)
  });
  return handleResponse(res);
};

export const createCategoria = async (categoriaData) => {
  const res = await fetch(`${API_BASE_URL}/categorias/`, {
    method: "POST",
    headers: getAuthHeaders(false),
    body: JSON.stringify(categoriaData),
  });
  return handleResponse(res);
};

export const updateCategoria = async (id, categoriaData) => {
  const res = await fetch(`${API_BASE_URL}/categorias/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(false),
    body: JSON.stringify(categoriaData),
  });
  return handleResponse(res);
};

export const deleteCategoria = async (id) => {
  const res = await fetch(`${API_BASE_URL}/categorias/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(false)
  });
  return handleResponse(res);
};

// GESTIÓN DE TECNOLOGÍAS
export const fetchTecnologias = async (search = "") => {
  const url = search
    ? `${API_BASE_URL}/tecnologias/?search=${encodeURIComponent(search)}`
    : `${API_BASE_URL}/tecnologias/`;
  const res = await fetch(url, {
    headers: getAuthHeaders(false)
  });
  return handleResponse(res);
};

export const createTecnologia = async (techData) => {
  const res = await fetch(`${API_BASE_URL}/tecnologias/`, {
    method: "POST",
    headers: getAuthHeaders(false),
    body: JSON.stringify(techData),
  });
  return handleResponse(res);
};

export const updateTecnologia = async (id, techData) => {
  const res = await fetch(`${API_BASE_URL}/tecnologias/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(false),
    body: JSON.stringify(techData),
  });
  return handleResponse(res);
};

export const deleteTecnologia = async (id) => {
  const res = await fetch(`${API_BASE_URL}/tecnologias/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(false)
  });
  return handleResponse(res);
};

// GESTIÓN DE PROYECTOS SOFTWARE (ADMIN / EDITOR)
export const fetchProyectosSoftwareAdmin = async ({ search = "", ods = "", categoria = "", estado = "" } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (ods) params.append("ods", ods);
  if (categoria) params.append("categoria", categoria);
  if (estado) params.append("estado", estado);
  const url = `${API_BASE_URL}/proyectos-software/${params.toString() ? "?" + params.toString() : ""}`;
  const res = await fetch(url, {
    headers: getAuthHeaders(false)
  });
  return handleResponse(res);
};

export const createProyectoSoftware = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/proyectos-software/`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: formData,
  });
  return handleResponse(res);
};

export const fetchProyectoSoftwareById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/proyectos-software/${id}/`, {
    headers: getAuthHeaders(false)
  });
  return handleResponse(res);
};

export const updateProyectoSoftware = async (id, formData) => {
  const res = await fetch(`${API_BASE_URL}/proyectos-software/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(true),
    body: formData,
  });
  return handleResponse(res);
};

export const deleteProyectoSoftware = async (id) => {
  const res = await fetch(`${API_BASE_URL}/proyectos-software/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(false)
  });
  return handleResponse(res);
};
