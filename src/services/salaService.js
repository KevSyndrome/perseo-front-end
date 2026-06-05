import { BASE_URL, getHeaders } from "./api";

export const getSalas = async (page = 1, limit = 10, tipo = null, proyectoId = null) => {
  let url = `${BASE_URL}/salas/?page=${page}&limit=${limit}`;
  if (tipo) url += `&tipo=${tipo}`;
  if (proyectoId) url += `&proyecto_id=${proyectoId}`;
  const response = await fetch(url, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getSalaPorId = async (id) => {
  const response = await fetch(`${BASE_URL}/salas/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const crearSala = async (sala) => {
  const response = await fetch(`${BASE_URL}/salas/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(sala),
  });
  return await response.json();
};

export const actualizarSala = async (id, datos) => {
  const response = await fetch(`${BASE_URL}/salas/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const eliminarSala = async (id) => {
  const response = await fetch(`${BASE_URL}/salas/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};
