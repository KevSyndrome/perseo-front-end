import { BASE_URL, getHeaders, apiFetch } from "./api";

// Sin filtros devuelve el drive personal; filtros: { tarea_id | proyecto_id | mensaje_id }
export const getArchivos = async (page = 1, limit = 10, filtros = {}) => {
  const params = new URLSearchParams({ page, limit, ...filtros });
  const response = await apiFetch(`${BASE_URL}/archivos/?${params}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getArchivoPorId = async (id) => {
  const response = await apiFetch(`${BASE_URL}/archivos/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const subirArchivo = async (formData) => {
  const response = await apiFetch(`${BASE_URL}/archivos/upload`, {
    method: "POST",
    headers: getHeaders(false), // FormData maneja su propio Content-Type
    body: formData,
  });
  return await response.json();
};

export const actualizarArchivo = async (id, datos) => {
  const response = await apiFetch(`${BASE_URL}/archivos/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const eliminarArchivo = async (id) => {
  const response = await apiFetch(`${BASE_URL}/archivos/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};
