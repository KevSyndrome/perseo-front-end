import { BASE_URL, apiFetch, getHeaders } from './api'

const WS_URL = BASE_URL.replace(/^http/, 'ws');

// Obtener mensajes de una sala (REST) con paginación
export const obtenerMensajes = async (sala_id = null, page = 1, limit = 20) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();
  if (sala_id) params.append('sala_id', sala_id);
  params.append('page', page);
  params.append('limit', limit);
  const query = params.toString();
  const response = await apiFetch(`${BASE_URL}/mensajes/?${query}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Error al obtener mensajes');
  }
  const data = await response.json();
  return data.data || [];
};

// Mensaje con archivo (multipart). El mensaje llega a todos (también al autor) por el
// WS de la sala como new_message; aquí solo se manejan los errores (400, 404, 502).
export const enviarMensajeConArchivo = async (sala_id, mensaje, file, respuestaAId = null) => {
  const formData = new FormData();
  formData.append('file', file);
  if (mensaje) formData.append('mensaje', mensaje);
  if (sala_id) formData.append('sala_id', sala_id);
  if (respuestaAId) formData.append('respuesta_a_id', respuestaAId);
  const response = await apiFetch(`${BASE_URL}/mensajes/`, {
    method: 'POST',
    headers: getHeaders(false),
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'No se pudo enviar el archivo');
  return data.data;
};

// Solo el autor. El cambio llega a los demás por WS (mensaje_editado / mensaje_eliminado).
export const editarMensaje = async (id, mensaje) => {
  const response = await apiFetch(`${BASE_URL}/mensajes/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ mensaje }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'No se pudo editar el mensaje');
  return data.data;
};

export const eliminarMensaje = async (id) => {
  const response = await apiFetch(`${BASE_URL}/mensajes/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(typeof data.detail === 'string' ? data.detail : 'No se pudo eliminar el mensaje');
  }
};

// Crear conexión WebSocket
export const crearConexionWS = (sala_id = null, onMessage, onError, onClose) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const queryParams = sala_id ? `?sala_id=${sala_id}&token=${token}` : `?token=${token}`;
  const ws = new WebSocket(`${WS_URL}/mensajes/ws${queryParams}`);

  ws.onopen = () => {
    console.log('✅ WebSocket conectado');
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    // Errores del servidor (ej. responder a un mensaje de otra sala): se muestran en el chat
    if (msg.error) {
      onMessage?.({ type: 'error', mensaje: msg.error });
      return;
    }
    if (msg.type === 'new_message' && onMessage) {
      onMessage(msg.data);
    }
    // typing, mensaje_editado y mensaje_eliminado se reenvían completos (con su type)
    if (['typing', 'mensaje_editado', 'mensaje_eliminado'].includes(msg.type) && onMessage) {
      onMessage(msg);
    }
  };

  ws.onerror = (error) => {
    console.error('❌ Error WebSocket:', error);
    if (onError) onError(error);
  };

  ws.onclose = (event) => {
    console.log('🔴 WebSocket cerrado:', event.code, event.reason);
    if (onClose) onClose(event);
  };

  return ws;
};

// Canal de avisos: solo escucha. Llega {type:"nuevo_mensaje", sala_id, sala_nombre, data}
// por cada mensaje nuevo de otros usuarios en cualquier sala visible. 1008 = token inválido.
export const crearConexionAvisos = (onAviso, onClose) => {
  const token = localStorage.getItem('token');
  const ws = new WebSocket(`${WS_URL}/mensajes/ws/notificaciones?token=${token}`);
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === 'nuevo_mensaje') onAviso(msg);
  };
  ws.onclose = onClose;
  return ws;
};

// Enviar mensaje por WebSocket
// respuestaAId: id del mensaje al que se responde (opcional)
export const enviarMensajeWS = (ws, mensaje, respuestaAId = null) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ mensaje, ...(respuestaAId && { respuesta_a_id: respuestaAId }) }));
    return true;
  }
  console.error('WebSocket no está conectado');
  return false;
};

// Enviar evento de "está escribiendo"
export const enviarTypingWS = (ws) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'typing' }));
    return true;
  }
  return false;
};

// Cerrar conexión WebSocket
export const cerrarConexionWS = (ws) => {
  if (ws) {
    ws.close();
  }
};
