import { useState } from 'react';
import { useBreadcrumb } from '../Components/Breadcrumb';
import Breadcrumb from '../Components/Breadcrumb';
import UsuariosTab from '../Tabs/UsuariosTab';
import CargosTab from '../Tabs/CargosTab';
import PermisosTab from '../Tabs/PermisosTab';
import PermisoCargoTab from '../Tabs/PermisoCargoTab';

const ADMIN_PERMISO_CARGO_ID = "c7a1e832-1633-4b99-9265-2e2b0837823e";

const tabs = ["Usuarios", "Cargos", "Permisos", "Asignar Permisos (Matriz)"];

export default function Configuration() {
  const [activeTab, setActiveTab] = useState("Usuarios");

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const esAdmin = usuario.permiso_cargo_id === ADMIN_PERMISO_CARGO_ID;

  useBreadcrumb([
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Configuración' },
  ]);

  if (!esAdmin) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-slate-500">
        <p className="text-lg font-semibold">No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Configuración de Sistema: Gestión de Usuarios</h1>
          <p className="text-sm text-slate-500">Configura usuarios, roles y permisos de acceso</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium transition border-b-2 cursor-pointer ${
              activeTab === tab
                ? "border-slate-800 text-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      {activeTab === "Usuarios" && <UsuariosTab />}
      {activeTab === "Cargos" && <CargosTab />}
      {activeTab === "Permisos" && <PermisosTab />}
      {activeTab === "Asignar Permisos (Matriz)" && <PermisoCargoTab />}
    </div>
  );
}