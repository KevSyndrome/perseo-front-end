import { BASE_URL, getHeaders } from "./api";

export const getFases = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}/fases/?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getFasePorId = async (id) => {
  const response = await fetch(`${BASE_URL}/fases/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const crearFase = async (fase) => {
  const response = await fetch(`${BASE_URL}/fases/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(fase),
  });
  return await response.json();
};

export const actualizarFase = async (id, datos) => {
  const response = await fetch(`${BASE_URL}/fases/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const eliminarFase = async (id) => {
  const response = await fetch(`${BASE_URL}/fases/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};

export const getFasesTimeline = async (proyectoId) => {
  const response = await fetch(`${BASE_URL}/fases/timeline/${proyectoId}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const reordenarFases = async (fases) => {
  const response = await fetch(`${BASE_URL}/fases/reordenar`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ fases }),
  });
  return await response.json();
};

export const getFaseEstadisticas = async (faseId) => {
  const response = await fetch(`${BASE_URL}/fases/estadisticas/${faseId}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const bulkCreateFases = async (fases) => {
  const response = await fetch(`${BASE_URL}/fases/bulk`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ fases }),
  });
  return await response.json();
};
