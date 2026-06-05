import { BASE_URL } from "./api";

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

export const logoutUsuario = () => {
  localStorage.clear();
  sessionStorage.clear();
};