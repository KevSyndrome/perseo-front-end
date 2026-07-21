import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LayoutGrid, List, Users, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Breadcrumb, { useBreadcrumb } from "../Components/Breadcrumb";
import ProjectCard from "../Components/Cards/ProjectCard";
import ProyectoForm from "../Forms/ProyectoForm";
import UnirseModal from "../Modals/UnirseModal";
import { getProyectos } from "../../services/proyectoService";

const Proyect = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("propios");
  const [view, setView] = useState("grid");
  const [createOpen, setCreateOpen] = useState(false);
  const [unirseOpen, setUnirseOpen] = useState(false);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  useBreadcrumb([
    { label: "Dashboard", path: "/dashboard" },
    { label: "Proyectos" },
  ]);

  useEffect(() => {
    setLoading(true);
    getProyectos()
      .then((data) => setProyectos(data?.data || data || []))
      .catch(() => setProyectos([]))
      .finally(() => setLoading(false));
  }, []);

  const handleProyectoCreado = (nuevo) => {
    setProyectos((prev) => [nuevo, ...prev]);
  };

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const filteredProjects = mode === "propios"
    ? proyectos.filter((p) => p.tipo === "privado" && p.propietario_id === usuario.id)
    : proyectos.filter((p) => p.tipo === "colaborativo");

  return (
    <div className="flex h-full w-full flex-col gap-5">

      <div className="flex items-center justify-between">
        <Breadcrumb />
        <button
          onClick={() => mode === "propios" ? setCreateOpen(true) : setUnirseOpen(true)}
          style={{
            backgroundColor: "var(--color-selection)",
            color: "var(--color-blanco)",
            borderRadius: "var(--radius-lg)",
            padding: "0.6rem 1.25rem",
            fontWeight: 600,
            fontSize: "0.875rem",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "opacity var(--transition-fast)",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <Plus size={16} />
          {mode === "propios" ? "Nuevo proyecto" : "Unirse a proyecto"}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div style={{
          display: "flex",
          backgroundColor: "var(--color-blanco)",
          borderRadius: "999px",
          padding: "4px",
          gap: "2px",
          border: "1px solid var(--border-color)",
        }}>
          {[
            { value: "propios", label: "Propios", Icon: User },
            { value: "colaborativos", label: "Colaborativos", Icon: Users },
          ].map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.6rem 2rem",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
                flex: 1,
                transition: "all var(--transition-fast)",
                backgroundColor: mode === value ? "var(--color-selection)" : "transparent",
                color: mode === value ? "var(--color-blanco)" : "var(--color-negro)",
              }}
            >
              <Icon size={15} color={mode === value ? "var(--color-blanco)" : "var(--color-negro)"} />
              {label}
            </button>
          ))}
        </div>

        <div style={{
          display: "flex",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          backgroundColor: "var(--bg-card)",
        }}>
          {[
            { value: "grid", Icon: LayoutGrid },
            { value: "list", Icon: List },
          ].map(({ value, Icon }) => (
            <button
              key={value}
              onClick={() => setView(value)}
              style={{
                padding: "0.5rem 0.65rem",
                border: "none",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                backgroundColor: view === value ? "var(--color-primary)" : "transparent",
                color: view === value ? "var(--color-blanco)" : "var(--color-dark-grey)",
              }}
            >
              <Icon size={17} />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 items-center justify-center"
          >
            <p style={{ color: "var(--text-muted)" }}>Cargando proyectos...</p>
          </motion.div>
        ) : filteredProjects.length > 0 ? (
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-3"
            }
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={{
                  id: project.id,
                  name: project.nombre,
                  description: project.descripcion,
                  owner: project.propietario?.nombre || "Sin propietario",
                  image: project.logo || "",
                  status: project.status?.nombre?.toLowerCase() || "activo",
                  startDate: project.fecha_inicial?.slice(0, 7),
                }}
                view={view}
                onClick={() => navigate(`/proyectos/${project.id}`)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ borderColor: "var(--border-color)" }}
            className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed"
          >
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", fontWeight: 500 }}>
              No hay proyectos para mostrar
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <ProyectoForm
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onProyectoCreado={handleProyectoCreado}
      />
      <UnirseModal
        isOpen={unirseOpen}
        onClose={() => setUnirseOpen(false)}
      />
    </div>
  );
};

export default Proyect;