import { BASE_URL, getHeaders, apiFetch } from "./api";

export const getTiposStatus = async (page = 1, limit = 10) => {
  const response = await apiFetch(`${BASE_URL}/tipo-status/?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getTiposStatusOpciones = async () => {
  const response = await apiFetch(`${BASE_URL}/tipo-status/opciones`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getTipoStatusPorId = async (id) => {
  const response = await apiFetch(`${BASE_URL}/tipo-status/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const crearTipoStatus = async (tipoStatus) => {
  const response = await apiFetch(`${BASE_URL}/tipo-status/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(tipoStatus),
  });
  return await response.json();
};

export const actualizarTipoStatus = async (id, datos) => {
  const response = await apiFetch(`${BASE_URL}/tipo-status/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const eliminarTipoStatus = async (id) => {
  const response = await apiFetch(`${BASE_URL}/tipo-status/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};
