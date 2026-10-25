import { BASE_URL, apiFetch } from './api'

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
    if (msg.error) {
      console.error('❌ Error del servidor:', msg.error);
      return;
    }
    if (msg.type === 'new_message' && onMessage) {
      onMessage(msg.data);
    }
    // typing llega en la raíz, no dentro de data
    if (msg.type === 'typing' && onMessage) {
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
export const enviarMensajeWS = (ws, mensaje) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ mensaje }));
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
