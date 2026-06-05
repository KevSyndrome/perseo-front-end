import { BASE_URL, getHeaders } from "./api";

export const getComentarios = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}/comentarios/?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getComentarioPorId = async (id) => {
  const response = await fetch(`${BASE_URL}/comentarios/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const crearComentario = async (comentario) => {
  const response = await fetch(`${BASE_URL}/comentarios/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(comentario),
  });
  return await response.json();
};

export const actualizarComentario = async (id, datos) => {
  const response = await fetch(`${BASE_URL}/comentarios/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const eliminarComentario = async (id) => {
  const response = await fetch(`${BASE_URL}/comentarios/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};
