// src/Pages/Profile.jsx
import { getUsuarioPorId, subirImagenPerfil } from "../../services/usuariosService";
import { getTokenPayload } from "../../services/authService";
import React, { useState, useEffect } from "react";
import AvatarCard from "../Components/Profile/AvatarCard";
import StatCard from "../Components/Profile/StatCard";
import InfoSection from "../Components/Profile/InfoSection";
import ChangePasswordModal from "../Modals/ChangePasswordModal";
import Breadcrumb, { useBreadcrumb } from "../Components/Breadcrumb";


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
  const [errorFoto, setErrorFoto] = useState(null);

  useBreadcrumb([{ label: "Profile" }]);

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

  const handleCambiarFoto = async (file) => {
    setErrorFoto(null);
    try {
      const res = await subirImagenPerfil(file);
      setUsuario((prev) => ({ ...prev, imagen: res.data.imagen }));
      // Avisa al Navbar para que cambie la foto sin recargar
      window.dispatchEvent(new CustomEvent("imagen-perfil", { detail: res.data.imagen }));
    } catch (err) {
      setErrorFoto(err.message);
    }
  };

  const stats = {
    proyectosPropios: 4,
    proyectosColaborativos: 2,
    tareasCompletadas: 18,
    tareasPendientes: 3,
  };

  return (
    <div style={styles.page}>

    <Breadcrumb/>
    <br></br>

      {/* ── TOP GRID ── */}
      <div className="mb-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[260px_1fr]">
        <AvatarCard
          nombre={usuario.nombre}
          apellidoPaterno={usuario.apellido_paterno}
          apellidoMaterno={usuario.apellido_materno}
          rol={rol}
          estado={usuario.status_logico}
          imagen={usuario.imagen}
          onCambiarFoto={handleCambiarFoto}
          errorFoto={errorFoto}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="PROYECTOS PROPIOS ACTIVOS"       value={stats.proyectosPropios}       sublabel="en curso" />
          <StatCard label="PROYECTOS COLABORATIVOS ACTIVOS" value={stats.proyectosColaborativos} sublabel="activos" />
          <StatCard label="TAREAS COMPLETADAS"              value={stats.tareasCompletadas}      sublabel="este mes" />
          <StatCard label="ROL"                             value={rol}                          sublabel="permiso estándar" />
          <StatCard label="MIEMBRO"                         value={formatMonthYear(usuario.fecha_creacion)} sublabel={formatDate(usuario.fecha_creacion)} />
          <StatCard label="TAREAS PENDIENTES"               value={stats.tareasPendientes}       sublabel="por completar" highlight />
        </div>
      </div>

      {/* ── BOTTOM INFO ── */}
      <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-[#e0e0e0] bg-white md:grid-cols-2">
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