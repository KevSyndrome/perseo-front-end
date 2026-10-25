// Mismas reglas que el backend (registro y restablecer contraseña).
// Devuelve el mensaje de error o null si la contraseña es válida.
export function errorContrasena(contrasena, confirmacion) {
  const p = contrasena || '';
  if (p.length < 8 || !/[A-Z]/.test(p) || !/[a-z]/.test(p) || !/\d/.test(p) || !/[^A-Za-z0-9]/.test(p)) {
    return 'La contraseña debe tener al menos 8 caracteres, con mayúscula, minúscula, número y carácter especial.';
  }
  if (p !== confirmacion) return 'Las contraseñas no coinciden.';
  return null;
}
