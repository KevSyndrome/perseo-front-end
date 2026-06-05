import { BASE_URL } from './api'

const WS_URL = BASE_URL.replace(/^http/, 'ws');

// Obtener mensajes de una sala (REST) con paginación
export const obtenerMensajes = async (sala_id = null, page = 1, limit = 20) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();
  if (sala_id) params.append('sala_id', sala_id);
  params.append('page', page);
  params.append('limit', limit);
  const query = params.toString();
  const response = await fetch(`${BASE_URL}/mensajes?${query}`, {
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
