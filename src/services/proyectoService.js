import { BASE_URL, getHeaders } from "./api";

export const getProyectos = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}/proyectos/?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getProyectoPorId = async (id) => {
  const response = await fetch(`${BASE_URL}/proyectos/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const crearProyecto = async (proyecto) => {
  const response = await fetch(`${BASE_URL}/proyectos/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(proyecto),
  });
  return await response.json();
};

export const actualizarProyecto = async (id, datos) => {
  const response = await fetch(`${BASE_URL}/proyectos/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const eliminarProyecto = async (id) => {
  const response = await fetch(`${BASE_URL}/proyectos/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};
