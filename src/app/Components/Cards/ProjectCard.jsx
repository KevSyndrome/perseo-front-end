import { motion } from 'framer-motion';
import { User, FolderOpen } from 'lucide-react';

export default function ProjectCard({ project, view = 'grid', onClick }) {
  if (view === 'list') {
    return (
      <motion.button
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onClick}
        style={{
          backgroundColor: "var(--color-primary)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "var(--radius-xl)",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          width: "100%",
          textAlign: "left",
          cursor: "pointer",
          transition: "all var(--transition-fast)",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        <div style={{
          width: "48px", height: "48px", borderRadius: "var(--radius-md)",
          overflow: "hidden", flexShrink: 0,
          backgroundColor: "rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {project.image
            ? <img src={project.image} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <FolderOpen size={22} color="var(--color-terciario)" />}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ color: "var(--color-blanco)", fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>{project.name}</h3>
          <p style={{ color: "var(--color-dark-grey)", fontSize: "0.8rem", margin: 0 }}>{project.description}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-blanco)", fontSize: "0.8rem", flexShrink: 0 }}>
          <User size={13} />
          {project.owner}
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      style={{
        backgroundColor: "var(--color-primary)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "var(--radius-xl)",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.875rem",
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        transition: "all var(--transition-fast)",
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "var(--radius-md)",
          overflow: "hidden", flexShrink: 0,
          backgroundColor: "rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {project.image
            ? <img src={project.image} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <FolderOpen size={26} color="var(--color-terciario)" />}
        </div>

        <h3 style={{
          color: "var(--color-blanco)",
          fontWeight: 800,
          fontSize: "1.1rem",
          lineHeight: 1.2,
          margin: 0,
          textTransform: "uppercase",
          letterSpacing: "0.01em",
        }}>
          {project.name}
        </h3>
      </div>

      <p style={{
        color: "var(--color-dark-grey)",
        fontSize: "0.82rem",
        lineHeight: 1.5,
        margin: 0,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {project.description}
      </p>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-dark-grey)", fontSize: "0.8rem" }}>
          <User size={13} />
          {project.owner}
        </div>
      </div>
    </motion.button>
  );
}