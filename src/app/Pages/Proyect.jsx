import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Filter, Search, Tag } from "lucide-react";
import Breadcrumb, { useBreadcrumb } from "../Components/Breadcrumb";
import ToggleGroup from "../Components/ToggleGroup";
import FilterPanel from "../Components/FilterPanel";
import Input from "../Components/Input";
import ViewToggle from "../Components/ViewToggle";
import ProjectCard from "../Components/ProjectCard";

const sampleProjects = [
  { id: 1, name: "Task Board App", description: "Plataforma de gestiÃ³n de tareas con sprints y equipos", owner: "Zio Zukey", image: "", status: "activo", startDate: "01/2026" },
  { id: 2, name: "E-commerce API", description: "Backend para tienda online con pagos y envÃ­os", owner: "Zio Zukey", image: "", status: "activo", startDate: "03/2026" },
  { id: 3, name: "RediseÃ±o Web", description: "ActualizaciÃ³n completa del diseÃ±o corporativo", owner: "Ana G.", image: "", status: "pendiente", startDate: "06/2026" },
  { id: 4, name: "App MÃ³vil", description: "Desarrollo de app nativa para iOS y Android", owner: "Carlos R.", image: "", status: "activo", startDate: "02/2026" },
];

const Proyect = () => {
  const [mode, setMode] = useState("propios");
  const [view, setView] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  useBreadcrumb([
    { label: "Dashboard", path: "/dashboard" },
    { label: "Proyectos" },
  ]);

  const toggleOptions = [
    { label: "Propios", value: "propios" },
    { label: "Colaborativos", value: "colaborativos" },
  ];

  const filteredProjects = mode === "propios" ? sampleProjects : [];

  const handleFilter = () => {
    setFilterOpen(false);
  };

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <Breadcrumb />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <ToggleGroup options={toggleOptions} value={mode} onChange={setMode} />
        </div>

        <ViewToggle view={view} onChange={setView} />

        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm 
          font-medium text-slate-600 transition hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
        >
          <Filter size={16} />
          Filtros
        </button>

        <button
          onClick={() => {}}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white
          transition hover:bg-primary-hover cursor-pointer"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Crear proyecto</span>
        </button>
      </div>

      <FilterPanel isOpen={filterOpen} onClose={() => setFilterOpen(false)} onFilter={handleFilter}>
        <Input label="Nombre del proyecto" icon={<Search size={16} />} placeholder="Buscar por nombre..." />
        <Input label="Estado" icon={<Tag size={16} />} placeholder="Activo, pendiente, inactivo..." />
        <Input label="Autor" placeholder="Buscar por autor..." />
      </FilterPanel>

      <AnimatePresence mode="wait">
        {filteredProjects.length > 0 ? (
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={view === 'grid'
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "flex flex-col gap-3"
            }
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                view={view}
                onClick={() => {}}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400"
          >
            <p className="text-lg font-medium">No hay proyectos para mostrar</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Proyect;
