// src/Components/Profile/InfoSection.jsx

import React, { useState } from "react";

const InfoSection = ({ title, fields, onSave, editableFields = [] }) => {
  const [editando, setEditando] = useState(false);
  const [valores, setValores] = useState(
    fields.reduce((acc, field) => {
      acc[field.key] = field.value;
      return acc;
    }, {})
  );
  const [guardando, setGuardando] = useState(false);

  const handleChange = (key, value) => {
    setValores((prev) => ({ ...prev, [key]: value }));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await onSave(valores);
      setEditando(false);
    } catch (err) {
      console.error("Error al guardar:", err);
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelar = () => {
    // restaura valores originales
    setValores(
      fields.reduce((acc, field) => {
        acc[field.key] = field.value;
        return acc;
      }, {})
    );
    setEditando(false);
  };

  return (
    <div style={styles.section}>

      {/* Header */}
      <div style={styles.header}>
        <p style={styles.title}>{title}</p>
        {onSave && !editando && (
          <button style={styles.editBtn} onClick={() => setEditando(true)}>
            Editar
          </button>
        )}
      </div>

      {/* Fields */}
{fields.map((field) => {
  const esEditable = editando && editableFields.includes(field.key);
  return (
    <div key={field.key} style={styles.field}>
      <span style={styles.label}>{field.label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {esEditable ? (
          <input
            style={styles.input}
            value={valores[field.key] || ""}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        ) : (
          <span style={styles.value}>{field.value || "—"}</span>
        )}
        {/* 👇 esto renderiza el botón "Cambiar" cuando existe */}
        {field.action && !editando && field.action}
      </div>
    </div>
  );
})}

      {/* Acciones */}
      {editando && (
        <div style={styles.actions}>
          <button
            style={styles.saveBtn}
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
          <button style={styles.cancelBtn} onClick={handleCancelar}>
            Cancelar
          </button>
        </div>
      )}

    </div>
  );
};

const styles = {
  section: {
    padding: "1.5rem 2rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  title: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    fontWeight: 500,
    margin: 0,
  },
  editBtn: {
    background: "none",
    border: "1px solid #1F8A8B",
    color: "#1F8A8B",
    borderRadius: "8px",
    padding: "0.25rem 0.75rem",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontWeight: 600,
  },
  field: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    marginBottom: "0.2rem",
  },
  value: {
    display: "block",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "var(--text-primary)",
  },
  input: {
    width: "100%",
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "var(--text-primary)",
    border: "1.5px solid #1F8A8B",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "var(--bg-input)",
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "0.5rem",
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
  cancelBtn: {
    background: "none",
    border: "1px solid var(--border-color)",
    color: "var(--text-secondary)",
    borderRadius: "8px",
    padding: "0.5rem 1.25rem",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
};

export default InfoSection;