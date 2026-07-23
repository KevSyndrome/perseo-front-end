import { useState, useMemo, useEffect } from 'react';
import { Trash2, Plus, Loader2, RotateCcw, Pencil } from 'lucide-react';
import DataTable from '../Components/DataTable';
import UsuarioForm from '../Forms/UsuarioForm';
import { getUsuarios, desactivarUsuario, actualizarUsuario } from '../../services/usuariosService';

export default function UsuariosTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // null = modo crear

  const fetchData = async () => {
    setLoading(true);
    try {
      const u = await getUsuarios();
      setData(Array.isArray(u.data) ? u.data : []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const abrirCrear = () => {
    setUsuarioSeleccionado(null);
    setFormOpen(true);
  };

  const abrirEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setFormOpen(true);
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
        <div className="flex items-center gap-2">
          <button onClick={() => abrirEditar(row.original)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-500 cursor-pointer"
            title="Editar usuario">
            <Pencil size={16} />
          </button>
          {row.original.status_logico ? (
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
          )}
        </div>
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
        <button onClick={abrirCrear}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition cursor-pointer"
          style={{ backgroundColor: "var(--color-selection)" }}>
          <Plus size={16} />
          Nuevo Usuario
        </button>
      </div>

      <DataTable data={data} columns={columns} pageSize={8} />

      <UsuarioForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        usuario={usuarioSeleccionado}
        onGuardado={fetchData}
      />
    </div>
  );
}