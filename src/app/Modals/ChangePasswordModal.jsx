// src/Components/Profile/ChangePasswordModal.jsx

import React, { useState } from "react";
import { cambiarContraseña } from "../../services/usuariosService";
import { logoutUsuario } from "../../services/authService";

const ChangePasswordModal = ({ onClose }) => {
  const [valores, setValores] = useState({
    contraseña_actual: "",
    nueva_contraseña: "",
    confirmar_contraseña: "",
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  const handleChange = (key, value) => {
    setValores((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleGuardar = async () => {
    // Validaciones
    if (!valores.contraseña_actual || !valores.nueva_contraseña || !valores.confirmar_contraseña) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (valores.nueva_contraseña !== valores.confirmar_contraseña) {
      setError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }
    if (valores.nueva_contraseña.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setGuardando(true);
    try {
      await cambiarContraseña({
        contraseña_actual: valores.contraseña_actual,
        nueva_contraseña: valores.nueva_contraseña,
      });
      setExito(true);
      // El backend cierra todas las sesiones al cambiar la contraseña
      setTimeout(() => {
        logoutUsuario({ revocar: false }).then(() => window.location.replace("/login"));
      }, 1500);
    } catch (err) {
      setError("Contraseña actual incorrecta o error al actualizar.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    // Fondo oscuro
    <div style={styles.overlay} onClick={onClose}>

      {/* Modal — el onClick detiene la propagación para no cerrar al hacer clic dentro */}
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        <h3 style={styles.title}>Cambiar contraseña</h3>
        <p style={styles.subtitle}>Ingresa tu contraseña actual y luego la nueva.</p>

        <div style={styles.field}>
          <label style={styles.label}>Contraseña actual</label>
          <input
            type="password"
            style={styles.input}
            value={valores.contraseña_actual}
            onChange={(e) => handleChange("contraseña_actual", e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Nueva contraseña</label>
          <input
            type="password"
            style={styles.input}
            value={valores.nueva_contraseña}
            onChange={(e) => handleChange("nueva_contraseña", e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Confirmar nueva contraseña</label>
          <input
            type="password"
            style={styles.input}
            value={valores.confirmar_contraseña}
            onChange={(e) => handleChange("confirmar_contraseña", e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {/* Error */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Éxito */}
        {exito && <p style={styles.exito}>¡Contraseña actualizada! Vuelve a iniciar sesión.</p>}

        {/* Acciones */}
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose} disabled={guardando}>
            Cancelar
          </button>
          <button style={styles.saveBtn} onClick={handleGuardar} disabled={guardando || exito}>
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>

      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "2rem",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#1a1a1a",
    margin: "0 0 0.25rem 0",
  },
  subtitle: {
    fontSize: "0.82rem",
    color: "#aaa",
    margin: "0 0 1.5rem 0",
  },
  field: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontSize: "0.75rem",
    color: "#aaa",
    marginBottom: "0.3rem",
  },
  input: {
    width: "100%",
    padding: "0.6rem 0.75rem",
    fontSize: "0.95rem",
    border: "1.5px solid #e0e0e0",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    color: "#1a1a1a",
    transition: "border-color 0.2s",
  },
  error: {
    fontSize: "0.8rem",
    color: "#e53935",
    margin: "0.5rem 0 0",
  },
  exito: {
    fontSize: "0.8rem",
    color: "#1F8A8B",
    margin: "0.5rem 0 0",
    fontWeight: 600,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "1.5rem",
  },
  cancelBtn: {
    background: "none",
    border: "1px solid #ccc",
    color: "#777",
    borderRadius: "8px",
    padding: "0.5rem 1.25rem",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  saveBtn: {
    backgroundColor: "#1F8A8B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.5rem 1.25rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default ChangePasswordModal;