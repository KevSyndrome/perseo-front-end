import { BASE_URL, getHeaders } from "./api";

export const getPermisosCargos = async (page = 1, limit = 10, cargoId = null) => {
  let url = `${BASE_URL}/permisos-cargos/?page=${page}&limit=${limit}`;
  if (cargoId) url += `&cargo_id=${cargoId}`;
  const response = await fetch(url, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getPermisoCargoPorId = async (id) => {
  const response = await fetch(`${BASE_URL}/permisos-cargos/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const crearPermisoCargo = async (datos) => {
  const response = await fetch(`${BASE_URL}/permisos-cargos/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const actualizarPermisoCargo = async (id, datos) => {
  const response = await fetch(`${BASE_URL}/permisos-cargos/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const eliminarPermisoCargo = async (id) => {
  const response = await fetch(`${BASE_URL}/permisos-cargos/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};
