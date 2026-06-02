const BASE_URL = "https://backend-tasks-production-1f22.up.railway.app";

export const loginUsuario = async (correo, contraseña) => {
  const response = await fetch(`${BASE_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contraseña }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Error al iniciar sesión");
  }

  // Guardamos token y datos del usuario en localStorage
  localStorage.setItem("token", data.data.access_token);
  localStorage.setItem("usuario", JSON.stringify(data.data.usuario));

  return data.data.usuario;
};