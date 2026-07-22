// src/services/api.js

export const fetchProyectos3D = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/proyectos-3d/`);
    if (!res.ok) throw new Error('Error');
    return await res.json();
  } catch (error) {
    console.log("Backend no disponible, usando datos vacíos");
    return [];
  }
};

// 👉 AÑADE ESTA FUNCIÓN:
export const fetchProyectosSoftware = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/proyectos-software/`); // Asegúrate de que esta sea tu ruta correcta
    if (!res.ok) throw new Error('Error');
    return await res.json();
  } catch (error) {
    console.log("Backend no disponible, usando datos vacíos");
    return [];
  }
};