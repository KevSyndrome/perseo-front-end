import React from "react";
import { Plus, Link2, BarChart3 } from "lucide-react";
import Breadcrumb, { useBreadcrumb } from "../Components/Breadcrumb";
import Card from "../Components/Card";
import ProjectCarousel from "../Components/ProjectCarousel";
import "../../styles/branding.css"

const Dashboard = () => {
  const projects = [];

  useBreadcrumb([{ label: "Dashboard" }]);

  return (
    <div className="flex h-full w-full flex-col">
      <Breadcrumb />
      <h1 style={{color: "var(--color-primary)"}}className="text-2xl font-bold text-slate-800">Bienvenido usuario</h1>

      <div  className="flex flex-1 flex-col gap-8 pt-6">
        <div className="grid grid-cols-3 gap-4">
          <Card
            icon={<BarChart3 size={36} />}
            
            label="Proyectos activos"
            color="var(--color-selection)"  
          />
          <Card
            icon={<Link2 size={36} />}
            label="Unirse al proyecto"
            color="var(--color-selection)"
          />
          <Card
            icon={<Plus size={36} />}
            label="Crear proyecto"
            color="var(--color-grey)"
          />
        </div>

        <ProjectCarousel projects={projects} />
      </div>
    </div>
  );
};

export default Dashboard;
