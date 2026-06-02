import { BASE_URL } from "./api";

export const getCargos = async () => {
  const response = await fetch(`${BASE_URL}/cargos/`);
  return await response.json();
};

export const getCargoPorId = async (id) => {
  const response = await fetch(`${BASE_URL}/cargos/${id}`);
  return await response.json();
};

export const crearCargo = async (nombre) => {
  const response = await fetch(`${BASE_URL}/cargos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre }),
  });
  return await response.json();
};

export const actualizarCargo = async (id, nombre) => {
  const response = await fetch(`${BASE_URL}/cargos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre }),
  });
  return await response.json();
};

export const eliminarCargo = async (id) => {
  const response = await fetch(`${BASE_URL}/cargos/${id}`, { method: "DELETE" });
  return response.ok;
};