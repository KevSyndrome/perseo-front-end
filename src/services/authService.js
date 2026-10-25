import { BASE_URL } from "./api";

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

export const loginUsuario = async (correo, contraseña) => {
  const response = await fetch(`${BASE_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contraseña }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Error al iniciar sesión");
  const payload = data.data;
  localStorage.setItem("token", payload.access_token);
  localStorage.setItem("usuario", JSON.stringify(payload.usuario));
  return payload;
};

// Registro público: el backend asigna el cargo "Usuario Básico" (no se manda cargo_id).
// Lanza Error con el mensaje del backend; en 422 junta los mensajes de validación.
export const registrarUsuario = async (datos) => {
  const response = await fetch(`${BASE_URL}/usuarios/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  const data = await response.json();
  if (!response.ok) {
    const detail = data.detail;
    throw new Error(
      Array.isArray(detail)
        ? detail.map((d) => d.msg.replace(/^Value error, /, "")).join(". ")
        : detail || "Error al registrarse"
    );
  }
  return data;
};

export const logoutUsuario = () => {
  localStorage.clear();
  sessionStorage.clear();
};

// Payload del access token: { sub (id del usuario), correo, sid }
export const getTokenPayload = () => {
  try {
    const token = localStorage.getItem("token");
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};
