import { BASE_URL, getHeaders } from "./api";

export const getArchivos = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}/archivos/?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getArchivosDrive = async () => {
  const response = await fetch(`${BASE_URL}/archivos/drive`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getArchivoPorId = async (id) => {
  const response = await fetch(`${BASE_URL}/archivos/${id}`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const getArchivoMetadata = async (id) => {
  const response = await fetch(`${BASE_URL}/archivos/${id}/metadata`, {
    headers: getHeaders(),
  });
  return await response.json();
};

export const crearArchivo = async (archivo) => {
  const response = await fetch(`${BASE_URL}/archivos/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(archivo),
  });
  return await response.json();
};

export const subirArchivo = async (formData) => {
  const response = await fetch(`${BASE_URL}/archivos/upload`, {
    method: "POST",
    headers: getHeaders(false), // FormData maneja su propio Content-Type
    body: formData,
  });
  return await response.json();
};

export const actualizarArchivo = async (id, datos) => {
  const response = await fetch(`${BASE_URL}/archivos/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return await response.json();
};

export const eliminarArchivo = async (id) => {
  const response = await fetch(`${BASE_URL}/archivos/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.ok;
};
