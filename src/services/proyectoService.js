import { BASE_URL, getHeaders, apiFetch } from "./api";

// Solo devuelve proyectos donde soy propietario o colaborador.
// filtros: { status_id, colaborativo: true|false, solo_propios: true }
export const getProyectos = async (page = 1, limit = 10, filtros = {}) => {
  const params = new URLSearchParams({ page, limit, ...filtros });
  const response = await apiFetch(`${BASE_URL}/proyectos/?${params}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getProyectoPorId = async (id) => {
  const response = await apiFetch(`${BASE_URL}/proyectos/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const crearProyecto = async (proyecto) => {
  const response = await apiFetch(`${BASE_URL}/proyectos/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(proyecto),
  });
  const data = await response.json();
  if (!response.ok) {
    console.error('Error al crear proyecto:', JSON.stringify(data, null, 2));
  }
  return data;
};

export const actualizarProyecto = async (id, datos) => {
  const response = await apiFetch(`${BASE_URL}/proyectos/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const eliminarProyecto = async (id) => {
  const response = await apiFetch(`${BASE_URL}/proyectos/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};

export const getStatusProyectos = async () => {
  const response = await apiFetch(`${BASE_URL}/tipo-status/?page=1&limit=10`, {
    headers: getHeaders(),
  });
  return await response.json();
};

// Lanza Error con el detail del backend para mostrarlo en pantalla
const jsonOrThrow = async (response) => {
  const data = await response.json();
  // 422 de validación trae detail como lista
  if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Datos inválidos");
  return data;
};

export const subirLogoProyecto = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiFetch(`${BASE_URL}/proyectos/${id}/logo`, {
    method: "POST",
    headers: getHeaders(false),
    body: formData,
  });
  return jsonOrThrow(response);
};

export const regenerarCodigoProyecto = async (id) => {
  const response = await apiFetch(`${BASE_URL}/proyectos/${id}/codigo`, {
    method: "POST",
    headers: getHeaders(),
  });
  return jsonOrThrow(response);
};

export const unirseProyecto = async (codigo) => {
  const response = await apiFetch(`${BASE_URL}/proyectos/unirse`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ codigo }),
  });
  return jsonOrThrow(response);
};

export const getColaboradoresProyecto = async (id) => {
  const response = await apiFetch(`${BASE_URL}/proyectos/${id}/colaboradores`, {
    headers: getHeaders(),
  });
  return jsonOrThrow(response);
};

// El propietario quita a alguien, o un colaborador se sale con su propio id
export const eliminarColaborador = async (id, usuarioId) => {
  const response = await apiFetch(`${BASE_URL}/proyectos/${id}/colaboradores/${usuarioId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};
