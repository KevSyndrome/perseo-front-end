// src/Pages/Profile.jsx
import { getUsuarioPorId, actualizarUsuario } from "../../services/usuariosService";
import React, { useState, useEffect } from "react";
import AvatarCard from "../Components/Profile/AvatarCard";
import StatCard from "../Components/Profile/StatCard";
import InfoSection from "../Components/Profile/InfoSection";
import ChangePasswordModal from "../Modals/ChangePasswordModal";

const getTokenPayload = () => {
  try {
    const token = localStorage.getItem("token");
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const formatDate = (isoString) => {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatMonthYear = (isoString) => {
  if (!isoString) return "—";
  return new Date(isoString)
    .toLocaleDateString("es-MX", { month: "short", year: "numeric" })
    .toUpperCase();
};

const Profile = () => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalContrasena, setModalContrasena] = useState(false);

  useEffect(() => {
    const payload = getTokenPayload();
    if (!payload?.sub) {
      setError("No se encontró sesión activa.");
      setCargando(false);
      return;
    }

    getUsuarioPorId(payload.sub)
      .then((res) => {
        setUsuario(res.data ?? res);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  if (cargando) return <div style={styles.centered}><div style={styles.spinner} /></div>;
  if (error) return <p style={{ color: "red", padding: "1rem" }}>Error: {error}</p>;

  const rol = usuario.cargo?.nombre ?? "Sin rol";

  const stats = {
    proyectosPropios: 4,
    proyectosColaborativos: 2,
    tareasCompletadas: 18,
    tareasPendientes: 3,
  };

  return (
    <div style={styles.page}>

      <p style={styles.breadcrumb}>Proyectos / Propios</p>

      {/* ── TOP GRID ── */}
      <div style={styles.topGrid}>
        <AvatarCard
          nombre={usuario.nombre}
          apellidoPaterno={usuario.apellido_paterno}
          apellidoMaterno={usuario.apellido_materno}
          rol={rol}
          estado={usuario.status_logico}
        />

        <div style={styles.statsGrid}>
          <StatCard label="PROYECTOS PROPIOS ACTIVOS"       value={stats.proyectosPropios}       sublabel="en curso" />
          <StatCard label="PROYECTOS COLABORATIVOS ACTIVOS" value={stats.proyectosColaborativos} sublabel="activos" />
          <StatCard label="TAREAS COMPLETADAS"              value={stats.tareasCompletadas}      sublabel="este mes" />
          <StatCard label="ROL"                             value={rol}                          sublabel="permiso estándar" />
          <StatCard label="MIEMBRO"                         value={formatMonthYear(usuario.fecha_creacion)} sublabel={formatDate(usuario.fecha_creacion)} />
          <StatCard label="TAREAS PENDIENTES"               value={stats.tareasPendientes}       sublabel="por completar" highlight />
        </div>
      </div>

      {/* ── BOTTOM INFO ── */}
      <div style={styles.bottomGrid}>
        <InfoSection
          title="Información personal"
          fields={[
            { key: "nombre",           label: "Nombre",           value: usuario.nombre },
            { key: "apellido_paterno", label: "Apellido paterno", value: usuario.apellido_paterno },
            { key: "apellido_materno", label: "Apellido materno", value: usuario.apellido_materno },
            { key: "cargo",            label: "Cargo",            value: rol },
          ]}
          editableFields={["nombre", "apellido_paterno", "apellido_materno"]}
          onSave={async (valores) => {
            // await actualizarUsuario(usuario.id, valores); // descomentar cuando el endpoint esté listo
            setUsuario((prev) => ({ ...prev, ...valores }));
          }}
        />

        <InfoSection
          title="Acceso y seguridad"
          fields={[
            { key: "correo",         label: "Correo electrónico", value: usuario.correo },
            {
              key: "contrasena",
              label: "Contraseña",
              value: "••••••••",
              action: (
                <button
                  style={styles.changePassBtn}
                  onClick={() => setModalContrasena(true)}
                >
                  Cambiar
                </button>
              ),
            },
            { key: "fecha_creacion", label: "Fecha de creación",  value: formatDate(usuario.fecha_creacion) },
            { key: "id",             label: "ID de usuario",      value: `#${usuario.id?.slice(0, 8).toUpperCase()}` },
          ]}
          editableFields={["correo"]}
          onSave={async (valores) => {
            // await actualizarUsuario(usuario.id, { correo: valores.correo }); // descomentar cuando el endpoint esté listo
            setUsuario((prev) => ({ ...prev, correo: valores.correo }));
          }}
        />
      </div>

      {/* ── MODAL CONTRASEÑA ── */}
      {modalContrasena && (
        <ChangePasswordModal onClose={() => setModalContrasena(false)} />
      )}

    </div>
  );
};

const styles = {
  page: {
    width: "100%",
    padding: "1.5rem 0",
    fontFamily: "inherit",
  },
  breadcrumb: {
    fontSize: "0.8rem",
    color: "#888",
    marginBottom: "1.25rem",
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: "1rem",
    alignItems: "start",
    marginBottom: "1rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  changePassBtn: {
    background: "none",
    border: "1px solid #1F8A8B",
    color: "#1F8A8B",
    borderRadius: "8px",
    padding: "0.2rem 0.65rem",
    fontSize: "0.75rem",
    cursor: "pointer",
    fontWeight: 600,
  },
  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #e0e0e0",
    borderTop: "3px solid #1F8A8B",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default Profile;