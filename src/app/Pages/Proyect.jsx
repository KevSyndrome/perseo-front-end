import React, { useState } from "react";
import { Plus } from "lucide-react";
import Breadcrumb, { useBreadcrumb } from "../Components/Breadcrumb";
import ToggleGroup from "../Components/ToggleGroup";
import FilterButton from "../Components/FilterButton";
import ProjectCard from "../Components/ProjectCard";

const sampleProjects = [
  { id: 1, name: "Task Board App", description: "Plataforma de gestiÃ³n de tareas con sprints y equipos", owner: "User", image: "" },
  { id: 2, name: "E-commerce API", description: "Backend para tienda online con pagos y envÃ­os", owner: "User", image: "" },
  { id: 3, name: "RediseÃ±o Web", description: "ActualizaciÃ³n completa del diseÃ±o corporativo", owner: "User", image: "" },
];

const Proyect = () => {
  const [mode, setMode] = useState("propios");

  useBreadcrumb([
    { label: "Dashboard", path: "/dashboard" },
    { label: "Proyectos" },
  ]);

  const toggleOptions = [
    { label: "Propios", value: "propios" },
    { label: "Colaborativos", value: "colaborativos" },
  ];

  const filteredProjects = mode === "propios" ? sampleProjects : [];

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <Breadcrumb />

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <ToggleGroup options={toggleOptions} value={mode} onChange={setMode} />
        </div>
      </div>
      <FilterButton onClick={() => {}} />
        <button
          onClick={() => {}}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition hover:bg-primary-hover cursor-pointer"
        >
          <Plus size={16} />
          Crear proyecto
        </button>
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
          <p className="text-lg font-medium">No hay proyectos para mostrar</p>
        </div>
      )}
    </div>
  );
};

export default Proyect;
