import { User, FolderOpen, Calendar, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectDetalleCard = ({ project }) => {

  const formatFecha = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        backgroundColor: "var(--color-primary)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "var(--radius-xl)",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        width: "100%",
      }}
    >
      {/* Header: logo + nombre + owner */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}>
        <div style={{
          width: "100px", height: "100px", borderRadius: "var(--radius-md)",
          overflow: "hidden", flexShrink: 0,
          backgroundColor: "rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {project.image && project.image !== 'https://via.placeholder.com/150/default'
            ? <img src={project.image} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <FolderOpen size={40} color="var(--color-terciario)" />}
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{
            color: "var(--color-blanco)",
            fontWeight: 800,
            fontSize: "2rem",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            margin: 0,
            lineHeight: 1.1,
          }}>
            {project.name}
          </h1>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            marginTop: "0.5rem", color: "var(--color-dark-grey)", fontSize: "0.8rem"
          }}>
            <User size={13} />
            <span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {project.owner}
            </span>
          </div>
        </div>
      </div>

      {/* Body: fechas + descripción */}
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "2rem" }}>

        {/* Fechas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <p style={{ color: "var(--color-dark-grey)", fontSize: "0.75rem", margin: "0 0 0.25rem 0" }}>
              Fecha de inicio:
            </p>
            <p style={{ color: "var(--color-blanco)", fontSize: "0.85rem", margin: 0, fontWeight: 500 }}>
              {formatFecha(project.fechaInicial)}
            </p>
          </div>
          <div>
            <p style={{ color: "var(--color-dark-grey)", fontSize: "0.75rem", margin: "0 0 0.25rem 0" }}>
              Fecha de finalización:
            </p>
            <p style={{ color: "var(--color-blanco)", fontSize: "0.85rem", margin: 0, fontWeight: 500 }}>
              {formatFecha(project.fechaFinal)}
            </p>
          </div>
        </div>

        {/* Descripción */}
        <p style={{
          color: "var(--color-blanco)",
          fontSize: "0.9rem",
          lineHeight: 1.7,
          margin: 0,
          fontWeight: 400,
        }}>
          {project.description}
        </p>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />

      {/* Sprints */}
      <div>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "1rem"
        }}>
          <h2 style={{ color: "var(--color-blanco)", fontWeight: 700, fontSize: "1.25rem", margin: 0 }}>
            Sprints
          </h2>
          
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button style={{
            backgroundColor: "var(--color-selection)",
            color: "var(--color-blanco)",
            border: "none",
            borderRadius: "999px",
            padding: "0.5rem 1.25rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}>
            <Plus size={14} />
            Crear sprint
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetalleCard;