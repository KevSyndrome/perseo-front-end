import { useState, useMemo, useEffect } from 'react';
import { Trash2, Plus, Loader2, RotateCcw } from 'lucide-react';
import DataTable from '../Components/DataTable';
import { getUsuarios, crearUsuario, desactivarUsuario, actualizarUsuario } from '../../services/usuariosService';
import { getCargos } from '../../services/cargosService';

export default function UsuariosTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cargos, setCargos] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: "", apellido_paterno: "", apellido_materno: "",
    correo: "", contraseña: "", cargo_id: ""
  });
  const [creando, setCreando] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [u, c] = await Promise.all([getUsuarios(), getCargos(1, 50)]);
      setData(Array.isArray(u.data) ? u.data : []);
      setCargos(Array.isArray(c.data) ? c.data : []);
    } catch (error) {
      console.error("Error al cargar usuarios/cargos:", error);
      setData([]);
      setCargos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCrear = async () => {
    setErrorMsg("");

    if (!form.nombre || !form.apellido_paterno || !form.apellido_materno || !form.correo || !form.contraseña || !form.cargo_id) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }

    setCreando(true);
    try {
      const resultado = await crearUsuario(form);

      if (resultado.detail) {
        const mensaje = Array.isArray(resultado.detail)
          ? resultado.detail.map((d) => d.msg).join(" | ")
          : resultado.detail;
        setErrorMsg(mensaje);
        return;
      }

      setForm({ nombre: "", apellido_paterno: "", apellido_materno: "", correo: "", contraseña: "", cargo_id: "" });
      setFormOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setErrorMsg("Ocurrió un error inesperado al crear el usuario.");
    } finally {
      setCreando(false);
    }
  };

  const handleDesactivar = async (id) => {
    try {
      await desactivarUsuario(id);
      await fetchData();
    } catch (error) {
      console.error("Error al desactivar usuario:", error);
    }
  };

  const handleActivar = async (usuario) => {
    try {
      // Se manda correo también porque el backend requiere ese campo
      // aunque solo se quiera cambiar status_logico (bug conocido del endpoint PUT).
      const resultado = await actualizarUsuario(usuario.id, {
        status_logico: true,
        correo: usuario.correo,
      });
      if (resultado.detail) {
        console.error("Error al activar usuario:", resultado.detail);
        return;
      }
      await fetchData();
    } catch (error) {
      console.error("Error al activar usuario:", error);
    }
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
      accessorKey: 'cargo',
      header: 'Cargo',
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">{row.original.cargo?.nombre || '—'}</span>
      ),
    },
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
        row.original.status_logico ? (
          <button onClick={() => handleDesactivar(row.original.id)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 cursor-pointer"
            title="Desactivar usuario">
            <Trash2 size={16} />
          </button>
        ) : (
          <button onClick={() => handleActivar(row.original)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-green-50 hover:text-green-600 cursor-pointer"
            title="Activar usuario">
            <RotateCcw size={16} />
          </button>
        )
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
        <button onClick={() => { setFormOpen(!formOpen); setErrorMsg(""); }}
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
            <label className="text-xs font-medium text-slate-500">Cargo</label>
            <select value={form.cargo_id}
              onChange={(e) => setForm((prev) => ({ ...prev, cargo_id: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300">
              <option value="">Seleccionar...</option>
              {cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.nombre}
                </option>
              ))}
            </select>
          </div>

          {errorMsg && (
            <div className="col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMsg}
            </div>
          )}

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