import { BASE_URL, getHeaders, apiFetch } from "./api";

export const getFases = async (proyectoId, page = 1, limit = 10) => {
  const response = await apiFetch(`${BASE_URL}/fases/?proyecto_id=${proyectoId}&page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getFasePorId = async (id) => {
  const response = await apiFetch(`${BASE_URL}/fases/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const crearFase = async (fase) => {
  const response = await apiFetch(`${BASE_URL}/fases/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(fase),
  });
  return await response.json();
};

export const actualizarFase = async (id, datos) => {
  const response = await apiFetch(`${BASE_URL}/fases/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const eliminarFase = async (id) => {
  const response = await apiFetch(`${BASE_URL}/fases/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};

export const getFasesTimeline = async (proyectoId) => {
  const response = await apiFetch(`${BASE_URL}/fases/timeline/${proyectoId}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const reordenarFases = async (fases) => {
  const response = await apiFetch(`${BASE_URL}/fases/reordenar`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ fases }),
  });
  return await response.json();
};

export const getFaseEstadisticas = async (faseId) => {
  const response = await apiFetch(`${BASE_URL}/fases/estadisticas/${faseId}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

