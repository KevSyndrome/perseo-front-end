import { BASE_URL, getHeaders } from "./api";

export const getCargos = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}/cargos/?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getCargoPorId = async (id) => {
  const response = await fetch(`${BASE_URL}/cargos/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const crearCargo = async (nombre) => {
  const response = await fetch(`${BASE_URL}/cargos/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ nombre }),
  });
  return await response.json();
};

export const actualizarCargo = async (id, nombre) => {
  const response = await fetch(`${BASE_URL}/cargos/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ nombre }),
  });
  return await response.json();
};

export const eliminarCargo = async (id) => {
  const response = await fetch(`${BASE_URL}/cargos/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};
