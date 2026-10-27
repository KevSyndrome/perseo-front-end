import { BASE_URL, getHeaders, apiFetch } from "./api";

// Notificaciones generales del usuario (tareas, proyectos, salas, respuestas).
// Formato: {id, tipo, titulo, mensaje, ruta, leida, fecha, actor, datos}
const pedir = async (ruta, method = "GET") => {
  const response = await apiFetch(`${BASE_URL}/notificaciones/${ruta}`, { method, headers: getHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Error en notificaciones");
  return data;
};

// También genera las de "tarea por vencer" / "tarea vencida" (el backend las crea al consultar)
export const getNotificaciones = (page = 1, limit = 20, soloNoLeidas = false) =>
  pedir(`?${new URLSearchParams({ page, limit, solo_no_leidas: soloNoLeidas })}`);

export const marcarNotificacionLeida = (id) => pedir(`${id}/leida`, "POST");
export const leerTodasNotificaciones = () => pedir("leer-todas", "POST");
export const eliminarNotificacion = (id) => pedir(id, "DELETE");
