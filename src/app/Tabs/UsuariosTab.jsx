import { useState, useMemo, useEffect } from 'react';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import DataTable from '../Components/DataTable';
import { getUsuarios, crearUsuario, desactivarUsuario } from '../../services/usuariosService';
import { getPermisosCargos } from '../../services/permisoCargoService';

export default function UsuariosTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permisosCargos, setPermisosCargos] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: "", apellido_paterno: "", apellido_materno: "",
    correo: "", contraseña: "", permiso_cargo_id: ""
  });
  const [creando, setCreando] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [u, pc] = await Promise.all([getUsuarios(), getPermisosCargos()]);
    setData(Array.isArray(u.data) ? u.data : []);
    setPermisosCargos(Array.isArray(pc.data) ? pc.data : []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCrear = async () => {
    if (!form.nombre || !form.correo || !form.contraseña || !form.permiso_cargo_id) return;
    setCreando(true);
    await crearUsuario(form);
    setForm({ nombre: "", apellido_paterno: "", apellido_materno: "", correo: "", contraseña: "", permiso_cargo_id: "" });
    setFormOpen(false);
    await fetchData();
    setCreando(false);
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'nombre',
      header: 'Nombre Completo',
      cell: ({ row }) => (
        <span className="font-medium text-slate-800">
          {row.original.nombre} {row.original.apellido_paterno} {row.original.apellido_materno}
        </span>
      ),
    },
    { accessorKey: 'correo', header: 'Usuario/Correo' },
    {
      accessorKey: 'status_logico',
      header: 'Estado',
      cell: (info) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${info.getValue() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          {info.getValue() ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <button onClick={async () => { await desactivarUsuario(row.original.id); await fetchData(); }}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 cursor-pointer"
          title="Desactivar usuario">
          <Trash2 size={16} />
        </button>
      ),
    },
  ], []);

  if (loading) return (
    <div className="flex items-center justify-center gap-2 text-slate-500 py-10">
      <Loader2 size={24} className="animate-spin" />
      <span>Cargando usuarios...</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button onClick={() => setFormOpen(!formOpen)}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition cursor-pointer"
          style={{ backgroundColor: "var(--color-selection)" }}>
          <Plus size={16} />
          Nuevo Usuario
        </button>
      </div>

      {formOpen && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm grid grid-cols-2 gap-3">
          {[
            { key: "nombre", label: "Nombre", type: "text" },
            { key: "apellido_paterno", label: "Apellido Paterno", type: "text" },
            { key: "apellido_materno", label: "Apellido Materno", type: "text" },
            { key: "correo", label: "Correo", type: "email" },
            { key: "contraseña", label: "Contraseña", type: "password" },
          ].map(({ key, label, type }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">{label}</label>
              <input type={type} value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Permiso/Cargo</label>
            <select value={form.permiso_cargo_id}
              onChange={(e) => setForm((prev) => ({ ...prev, permiso_cargo_id: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300">
              <option value="">Seleccionar...</option>
              {permisosCargos.map((pc) => (
                <option key={pc.id} value={pc.id}>
                  {pc.cargo?.nombre} - {pc.permiso?.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-2">
            <button onClick={() => setFormOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
              Cancelar
            </button>
            <button onClick={handleCrear} disabled={creando}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: "var(--color-selection)" }}>
              {creando ? "Creando..." : "Crear Usuario"}
            </button>
          </div>
        </div>
      )}

      <DataTable data={data} columns={columns} pageSize={8} />
    </div>
  );
}