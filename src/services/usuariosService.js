import { BASE_URL } from "./api";

export const getUsuarios = async () => {
  const response = await fetch(`${BASE_URL}/usuarios/`);
  return await response.json();
};

export const getUsuarioPorId = async (id) => {
  const response = await fetch(`${BASE_URL}/usuarios/${id}`);
  return await response.json();
};

export const crearUsuario = async (usuario) => {
  const response = await fetch(`${BASE_URL}/usuarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  return await response.json();
};

export const actualizarUsuario = async (id, datos) => {
  const response = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const desactivarUsuario = async (id) => {
  const response = await fetch(`${BASE_URL}/usuarios/desactivar/${id}`, {
    method: "PUT",
  });
  return await response.json();
};