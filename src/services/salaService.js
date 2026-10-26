import { BASE_URL, getHeaders, apiFetch } from "./api";

// Lanza Error con el detail del backend para mostrarlo en pantalla
const jsonOrThrow = async (response) => {
  const data = await response.json();
  // 422 de validación trae detail como lista
  if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Datos inválidos");
  return data;
};

// Panel de tarjetas: solo las salas del usuario, sin paginación ({ data, total }).
// filtros: { tipo: "libre"|"proyecto"|"privada", proyecto_id }
export const getSalas = async (filtros = {}) => {
  const params = new URLSearchParams(filtros);
  const response = await apiFetch(`${BASE_URL}/salas/?${params}`, {
    headers: getHeaders(),
  });
  return jsonOrThrow(response);
};

export const getSalaPorId = async (id) => {
  const response = await apiFetch(`${BASE_URL}/salas/${id}`, {
    headers: getHeaders(),
  });
  return jsonOrThrow(response);
};

// { nombre, descripcion?, tipo: "privada"|"libre"|"proyecto", proyecto_id? }
export const crearSala = async (sala) => {
  const response = await apiFetch(`${BASE_URL}/salas/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(sala),
  });
  return jsonOrThrow(response);
};

export const actualizarSala = async (id, datos) => {
  const response = await apiFetch(`${BASE_URL}/salas/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return jsonOrThrow(response);
};

// Responde 204 sin cuerpo; la Global no se puede borrar (400)
export const eliminarSala = async (id) => {
  const response = await apiFetch(`${BASE_URL}/salas/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) await jsonOrThrow(response);
};

export const unirseSala = async (codigo) => {
  const response = await apiFetch(`${BASE_URL}/salas/unirse`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ codigo }),
  });
  return jsonOrThrow(response);
};

export const regenerarCodigoSala = async (id) => {
  const response = await apiFetch(`${BASE_URL}/salas/${id}/codigo`, {
    method: "POST",
    headers: getHeaders(),
  });
  return jsonOrThrow(response);
};

export const getMiembrosSala = async (id) => {
  const response = await apiFetch(`${BASE_URL}/salas/${id}/miembros`, {
    headers: getHeaders(),
  });
  return jsonOrThrow(response);
};

// El creador quita a alguien, o un miembro se sale con su propio id
export const eliminarMiembroSala = async (id, usuarioId) => {
  const response = await apiFetch(`${BASE_URL}/salas/${id}/miembros/${usuarioId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) await jsonOrThrow(response);
};

// Fondo animado: la clave es una de FONDOS_ANIMADOS (app/Components/fondosSala.js)
export const cambiarFondoSala = async (id, fondo) => {
  const response = await apiFetch(`${BASE_URL}/salas/${id}/fondo`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ fondo }),
  });
  return jsonOrThrow(response);
};

export const subirFondoImagenSala = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiFetch(`${BASE_URL}/salas/${id}/fondo/imagen`, {
    method: "POST",
    headers: getHeaders(false),
    body: formData,
  });
  return jsonOrThrow(response);
};

export const quitarFondoSala = async (id) => {
  const response = await apiFetch(`${BASE_URL}/salas/${id}/fondo`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return jsonOrThrow(response);
};

// Lo compartido en una sala, del más reciente al más viejo.
// tipo: "imagenes" | "archivos" | "enlaces" → { data, pagination }
export const getCompartidoSala = async (id, tipo, page = 1, limit = 30) => {
  const params = new URLSearchParams({ tipo, page, limit });
  const response = await apiFetch(`${BASE_URL}/salas/${id}/compartido?${params}`, {
    headers: getHeaders(),
  });
  return jsonOrThrow(response);
};
