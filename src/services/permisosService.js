import { BASE_URL } from "./api";

export const getPermisos = async () => {
  const response = await fetch(`${BASE_URL}/permisos/`);
  return await response.json();
};

export const getPermisoPorId = async (id) => {
  const response = await fetch(`${BASE_URL}/permisos/${id}`);
  return await response.json();
};

export const crearPermiso = async (nombre) => {
  const response = await fetch(`${BASE_URL}/permisos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre }),
  });
  return await response.json();
};

export const eliminarPermiso = async (id) => {
  const response = await fetch(`${BASE_URL}/permisos/${id}`, { method: "DELETE" });
  return response.ok;
};