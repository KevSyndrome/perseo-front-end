export const BASE_URL = import.meta.env.VITE_API_URL;

export const getHeaders = (contentType = true) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (contentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// Ruta a la que volver después de login/registro (ej. un link de invitación /unirse/...)
const RUTA_PENDIENTE = 'ruta_pendiente';
export const guardarRutaPendiente = (ruta) => sessionStorage.setItem(RUTA_PENDIENTE, ruta);
export const tomarRutaPendiente = () => {
  const ruta = sessionStorage.getItem(RUTA_PENDIENTE);
  sessionStorage.removeItem(RUTA_PENDIENTE);
  return ruta;
};

// 401 = token inválido, expirado o sesión revocada: se fuerza nuevo login
export const apiFetch = async (url, options) => {
  const response = await fetch(url, options);
  if (response.status === 401) {
    localStorage.clear();
    sessionStorage.clear();
    // Si la sesión venció al abrir un link de invitación, se retoma después del login
    if (window.location.pathname.startsWith('/unirse/')) guardarRutaPendiente(window.location.pathname);
    window.location.replace('/login');
  }
  return response;
};
