import { BASE_URL, getHeaders } from "./api";

export const getProyectosColaborativos = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}/proyectos-colaborativos/?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getProyectoColaborativoPorId = async (id) => {
  const response = await fetch(`${BASE_URL}/proyectos-colaborativos/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const crearProyectoColaborativo = async (datos) => {
  const response = await fetch(`${BASE_URL}/proyectos-colaborativos/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const actualizarProyectoColaborativo = async (id, datos) => {
  const response = await fetch(`${BASE_URL}/proyectos-colaborativos/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const eliminarProyectoColaborativo = async (id) => {
  const response = await fetch(`${BASE_URL}/proyectos-colaborativos/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};

export const getColaboradoresPorProyecto = async (proyectoId) => {
  const response = await fetch(`${BASE_URL}/proyectos-colaborativos/proyecto/${proyectoId}/colaboradores`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getProyectosPorUsuario = async (usuarioId) => {
  const response = await fetch(`${BASE_URL}/proyectos-colaborativos/usuario/${usuarioId}/proyectos`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getEstadisticasColaboracion = async (proyectoId) => {
  const response = await fetch(`${BASE_URL}/proyectos-colaborativos/estadisticas/${proyectoId}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const bulkCreateColaboraciones = async (colaboraciones) => {
  const response = await fetch(`${BASE_URL}/proyectos-colaborativos/bulk`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ colaboraciones }),
  });
  return await response.json();
};

export const eliminarColaboracion = async (proyectoId, usuarioId) => {
  const response = await fetch(`${BASE_URL}/proyectos-colaborativos/eliminar`, {
    method: "DELETE",
    headers: getHeaders(),
    body: JSON.stringify({ proyecto_id: proyectoId, usuario_id: usuarioId }),
  });
  return response.ok;
};
