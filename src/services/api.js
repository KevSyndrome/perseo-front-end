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

// Renueva la sesión con el refresh token (7 días; el access token dura ~15 min).
// Una sola renovación a la vez: el backend rota los tokens, y una segunda con el
// refresh viejo cerraría la sesión. Devuelve true si se renovó.
let renovacion = null;
export const refrescarSesion = () => {
  renovacion ??= (async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return false;
    try {
      const response = await fetch(`${BASE_URL}/usuarios/me/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      });
      if (!response.ok) return false;
      const { data } = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      return true;
    } catch {
      return false;
    }
  })().finally(() => { renovacion = null; });
  return renovacion;
};

export const cerrarSesionYIrALogin = () => {
  localStorage.clear();
  sessionStorage.clear();
  // Si la sesión venció al abrir un link de invitación, se retoma después del login
  if (window.location.pathname.startsWith('/unirse/')) guardarRutaPendiente(window.location.pathname);
  window.location.replace('/login');
};

// 401 = access token vencido o sesión revocada: se intenta renovar una vez y se repite
// la petición; si no se puede renovar, se fuerza nuevo login
export const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (response.status !== 401) return response;

  if (await refrescarSesion()) {
    const reintento = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (reintento.status !== 401) return reintento;
  }
  cerrarSesionYIrALogin();
  return response;
};
