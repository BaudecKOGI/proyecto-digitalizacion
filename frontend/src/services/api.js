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
// PROYECTOS LANDING PAGE
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
// GESTIÓN DE EDITORES (ROL='PROF')
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

