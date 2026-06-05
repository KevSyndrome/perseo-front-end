import { useState, useMemo, useEffect } from 'react';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import DataTable from '../Components/DataTable';

export default function PermisosTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevoPermiso, setNuevoPermiso] = useState("");
  const [creando, setCreando] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getPermisos();
    setData(Array.isArray(result.data) ? result.data : []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCrear = async () => {
    if (!nuevoPermiso.trim()) return;
    setCreando(true);
    await crearPermiso(nuevoPermiso.trim());
    setNuevoPermiso("");
    await fetchData();
    setCreando(false);
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: (info) => <span className="font-medium text-slate-800">{info.getValue()}</span>,
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <button onClick={async () => { await eliminarPermiso(row.original.id); await fetchData(); }}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 cursor-pointer">
          <Trash2 size={16} />
        </button>
      ),
    },
  ], []);

  if (loading) return (
    <div className="flex items-center justify-center gap-2 text-slate-500 py-10">
      <Loader2 size={24} className="animate-spin" />
      <span>Cargando permisos...</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Nombre del nuevo permiso..."
          value={nuevoPermiso}
          onChange={(e) => setNuevoPermiso(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        <button
          onClick={handleCrear}
          disabled={creando || !nuevoPermiso.trim()}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "var(--color-selection)" }}
        >
          <Plus size={16} />
          {creando ? "Creando..." : "Crear Permiso"}
        </button>
      </div>
      <DataTable data={data} columns={columns} pageSize={5} />
    </div>
  );
}