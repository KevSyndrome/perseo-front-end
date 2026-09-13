// src/Components/Profile/AvatarCard.jsx

import React from "react";

const getInitials = (nombre = "", apellido = "") =>
  `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

const AvatarCard = ({ nombre, apellidoPaterno, apellidoMaterno, rol, estado }) => {
  const iniciales = getInitials(nombre, apellidoPaterno);
  const nombreCompleto = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`;
  const activo = estado === true || estado === "Activo";

  return (
    <div style={styles.card}>
      <div style={styles.avatarCircle}>{iniciales}</div>
      <button style={styles.changePhotoBtn}>Cambiar foto</button>
      <p style={styles.nombre}>{nombreCompleto}</p>
      <p style={styles.rol}>{rol}</p>
      <span style={{ ...styles.badge, ...(activo ? styles.badgeActivo : styles.badgeInactivo) }}>
        {activo ? "Activo" : "Inactivo"}
      </span>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "1.5rem",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    textAlign: "center",
  },
  avatarCircle: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "#1F8A8B",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  changePhotoBtn: {
    background: "none",
    border: "none",
    color: "#1F8A8B",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.85rem",
    padding: 0,
  },
  nombre: {
    fontWeight: "bold",
    fontSize: "0.95rem",
    margin: "0.25rem 0 0",
    color: "#1a1a1a",
  },
  rol: {
    fontSize: "0.82rem",
    color: "#777",
    margin: 0,
  },
  badge: {
    marginTop: "0.5rem",
    padding: "0.25rem 1rem",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: 600,
    border: "1.5px solid",
  },
  badgeActivo: {
    backgroundColor: "#e0f2f1",
    color: "#1F8A8B",
    borderColor: "#1F8A8B",
  },
  badgeInactivo: {
    backgroundColor: "#fce4e4",
    color: "#e53935",
    borderColor: "#e53935",
  },
};

export default AvatarCard;