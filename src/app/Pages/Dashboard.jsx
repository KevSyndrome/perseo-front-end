import { Plus, Link2, BarChart3 } from "lucide-react";
import Breadcrumb, { useBreadcrumb } from "../Components/Breadcrumb";
import Card from "../Components/Card";
import ProjectCarousel from "../Components/ProjectCarousel";
import "../../styles/branding.css";
import React, { useState } from "react";
import ProyectoForm from "../Forms/ProyectoForm";
import UnirseModal from '../Modals/UnirseModal'; 

const Dashboard = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [unirseOpen, setUnirseOpen] = useState(false); 
  const projects = [];

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useBreadcrumb([{ label: "Dashboard" }]);

  return (
    <div className="flex h-full w-full flex-col">
      <Breadcrumb />

      <h1 style={{ color: "var(--color-primary)" }} className="text-2xl font-bold text-slate-800">
        Bienvenido, {usuario.nombre} {usuario.apellido_paterno} {usuario.apellido_materno}
      </h1>
      <br />

      <div className="flex flex-1 flex-col gap-8 pt-6">
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
            onClick={() => setUnirseOpen(true)} // ← 3. console.log reemplazado
          />

          <Card
            icon={<Plus size={36} />}
            label="Crear proyecto"
            color="var(--color-grey)"
            onClick={() => setCreateOpen(true)}
          />
        </div>

        <ProjectCarousel projects={projects} />
      </div>

      <ProyectoForm
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <UnirseModal  // ← 4. Modal agregado
        isOpen={unirseOpen}
        onClose={() => setUnirseOpen(false)}
      />
    </div>
  );
};

export default Dashboard;