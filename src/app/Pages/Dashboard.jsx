import { Plus, Link2, BarChart3 } from "lucide-react";
import Breadcrumb, { useBreadcrumb } from "../Components/Breadcrumb";
import Card from "../Components/Card";
import ProjectCarousel from "../Components/ProjectCarousel";
import "../../styles/branding.css"
import React,  {useState } from "react";
import ProyectoForm from "../Forms/ProyectoForm";



const Dashboard = () => {
  const [createOpen, setCreateOpen]= useState(false);
  const projects = [];

  const createproject = [];

  const handlerCreateProyect = () => {
    setCreateOpen(true);
  };

  useBreadcrumb([{ label: "Dashboard" }]);

  return (
    <div className="flex h-full w-full flex-col">
      <Breadcrumb />
    
      <h1 style={{color: "var(--color-primary)"}}className="text-2xl font-bold text-slate-800">Bienvenido usuario</h1>
      <br></br>
      <div  className="flex flex-1 flex-col gap-8 pt-6">
        <div className="grid grid-cols-3 gap-4">
          <Card
            icon={<BarChart3 size={36} />}
            
            label="Proyectos activos"
            color="var(--color-selection)"  
          />

          <button>
           <Card
            icon={<Link2 size={36} />}
            label="Unirse al proyecto"
            color="var(--color-selection)"
            />
          </button>

          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm 
          font-medium text-slate-600 transition hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
          >
            <Card
            icon={<Plus size={36} />}
            label="Crear proyecto"
            color="var(--color-grey)"
           />
          </button>
        </div>

        <ProjectCarousel projects={projects} />
      </div>
      {/* ← Agregar el componente al final */}
      <ProyectoForm
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />

    </div>
  );
};

export default Dashboard;
