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

// 401 = token inválido, expirado o sesión revocada: se fuerza nuevo login
export const apiFetch = async (url, options) => {
  const response = await fetch(url, options);
  if (response.status === 401) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace('/login');
  }
  return response;
};
