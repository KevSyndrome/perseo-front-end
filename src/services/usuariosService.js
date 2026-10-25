import { BASE_URL, getHeaders, apiFetch } from "./api";

export const getUsuarios = async (page = 1, limit = 10, nombre = null, correo = null, status = null) => {
  let url = `${BASE_URL}/usuarios/?page=${page}&limit=${limit}`;
  if (nombre) url += `&nombre=${nombre}`;
  if (correo) url += `&correo=${correo}`;
  if (status !== null) url += `&status_logico=${status}`;
  const response = await apiFetch(url, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getUsuarioPorId = async (id) => {
  const response = await apiFetch(`${BASE_URL}/usuarios/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getUsuarioPublico = async (id) => {
  const response = await apiFetch(`${BASE_URL}/usuarios/publico/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const crearUsuario = async (usuario) => {
  const response = await apiFetch(`${BASE_URL}/usuarios/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(usuario),
  });
  return await response.json();
};

export const actualizarUsuario = async (id, datos) => {
  const response = await apiFetch(`${BASE_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const desactivarUsuario = async (id) => {
  const response = await apiFetch(`${BASE_URL}/usuarios/desactivar/${id}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  return await response.json();
};

export const cambiarContraseña = async (datos) => {
  const response = await apiFetch(`${BASE_URL}/usuarios/cambiar-contraseña`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al cambiar contraseña");
  }
  
  return await response.json();
};
