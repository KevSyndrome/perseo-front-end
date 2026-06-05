import { BASE_URL, getHeaders } from "./api";

export const getTareas = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}/tareas/?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getTareaPorId = async (id) => {
  const response = await fetch(`${BASE_URL}/tareas/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const crearTarea = async (tarea) => {
  const response = await fetch(`${BASE_URL}/tareas/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(tarea),
  });
  return await response.json();
};

export const actualizarTarea = async (id, datos) => {
  const response = await fetch(`${BASE_URL}/tareas/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const eliminarTarea = async (id) => {
  const response = await fetch(`${BASE_URL}/tareas/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};

export const getTareaDetalles = async (id) => {
  const response = await fetch(`${BASE_URL}/tareas/detalles/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getTareaEstadisticas = async (faseId) => {
  const response = await fetch(`${BASE_URL}/tareas/estadisticas/${faseId}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const moverTarea = async (id, faseId) => {
  const response = await fetch(`${BASE_URL}/tareas/mover/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ fase_id: faseId }),
  });
  return await response.json();
};

export const bulkCreateTareas = async (tareas) => {
  const response = await fetch(`${BASE_URL}/tareas/bulk`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ tareas }),
  });
  return await response.json();
};
