import { useState, useEffect } from 'react';
import { useBreadcrumb } from '../Components/Breadcrumb';
import Breadcrumb from '../Components/Breadcrumb';
import UsuariosTab from '../Tabs/UsuariosTab';
import CargosTab from '../Tabs/CargosTab';
import PermisoCargoTab from '../Tabs/PermisoCargoTab';
import { usePermisosStore, tieneModulo } from '../Components/PermisosStore';

// Usuarios depende del módulo "usuarios"; los catálogos, de "configuracion"
const TABS = [
  { nombre: "Usuarios", modulo: "usuarios" },
  { nombre: "Cargos", modulo: "configuracion" },
  { nombre: "Permisos por Cargo", modulo: "configuracion" },
];

export default function Configuration() {
  const [activeTab, setActiveTab] = useState(null);
  const { permisos, cargar } = usePermisosStore();

  useEffect(() => { cargar(); }, [cargar]);

  const tabs = TABS.filter((t) => tieneModulo(permisos, t.modulo)).map((t) => t.nombre);
  const tabActiva = tabs.includes(activeTab) ? activeTab : tabs[0];

  useBreadcrumb([
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Configuración' },
  ]);

  if (permisos === null) return null;

  if (tabs.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-slate-500">
        <p className="text-lg font-semibold">No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <Breadcrumb />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Configuración de Sistema: Gestión de Usuarios</h1>
          <p className="text-sm text-slate-500">Configura usuarios, roles y permisos de acceso</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium transition border-b-2 cursor-pointer ${
              tabActiva === tab
                ? "border-slate-800 text-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {tabActiva === "Usuarios" && <UsuariosTab />}
      {tabActiva === "Cargos" && <CargosTab />}
      {tabActiva === "Permisos por Cargo" && <PermisoCargoTab />}
    </div>
  );
}