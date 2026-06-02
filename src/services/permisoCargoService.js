import { BASE_URL } from "./api";

export const getPermisosCargos = async () => {
  const response = await fetch(`${BASE_URL}/permisos-cargos/`);
  return await response.json();
};

export const getPermisoCargoPorId = async (id) => {
  const response = await fetch(`${BASE_URL}/permisos-cargos/${id}`);
  return await response.json();
};

export const crearPermisoCargo = async (cargo_id, permiso_id) => {
  const response = await fetch(`${BASE_URL}/permisos-cargos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cargo_id, permiso_id }),
  });
  return await response.json();
};

export const eliminarPermisoCargo = async (id) => {
  const response = await fetch(`${BASE_URL}/permisos-cargos/${id}`, { method: "DELETE" });
  return response.ok;
};