import { useState, useMemo, useEffect } from 'react';
import { Pencil, Trash2, Plus, Loader2, Check, X } from 'lucide-react';
import DataTable from '../Components/DataTable';
import { getCargos, crearCargo, eliminarCargo, actualizarCargo } from '../../services/cargosService';

export default function CargosTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoCargo, setNuevoCargo] = useState("");
  const [creando, setCreando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getCargos();
      setData(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError("Error al cargar los cargos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCrear = async () => {
    if (!nuevoCargo.trim()) return;
    setCreando(true);
    await crearCargo(nuevoCargo.trim());
    setNuevoCargo("");
    await fetchData();
    setCreando(false);
  };

  const handleEliminar = async (id) => {
    await eliminarCargo(id);
    setData((prev) => prev.filter((d) => d.id !== id));
  };

  const handleGuardarEdicion = async (id) => {
    await actualizarCargo(id, editNombre);
    setEditandoId(null);
    await fetchData();
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) =>
        editandoId === row.original.id ? (
          <input
            className="rounded border border-slate-300 px-2 py-1 text-sm"
            value={editNombre}
            onChange={(e) => setEditNombre(e.target.value)}
          />
        ) : (
          <span className="font-medium text-slate-800">{row.original.nombre}</span>
        ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) =>
        editandoId === row.original.id ? (
          <div className="flex items-center gap-2">
            <button onClick={() => handleGuardarEdicion(row.original.id)}
              className="rounded-lg p-1.5 text-green-500 hover:bg-green-50 cursor-pointer">
              <Check size={16} />
            </button>
            <button onClick={() => setEditandoId(null)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => { setEditandoId(row.original.id); setEditNombre(row.original.nombre); }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-500 cursor-pointer">
              <Pencil size={16} />
            </button>
            <button onClick={() => handleEliminar(row.original.id)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 cursor-pointer">
              <Trash2 size={16} />
            </button>
          </div>
        ),
    },
  ], [editandoId, editNombre]);

  if (loading) return (
    <div className="flex items-center justify-center gap-2 text-slate-500 py-10">
      <Loader2 size={24} className="animate-spin" />
      <span>Cargando cargos...</span>
    </div>
  );

  if (error) return <p className="text-red-500 py-4">{error}</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Nombre del nuevo cargo..."
          value={nuevoCargo}
          onChange={(e) => setNuevoCargo(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        <button
          onClick={handleCrear}
          disabled={creando || !nuevoCargo.trim()}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "var(--color-selection)" }}
        >
          <Plus size={16} />
          {creando ? "Creando..." : "Crear Cargo"}
        </button>
      </div>

      <DataTable data={data} columns={columns} pageSize={5} />
    </div>
  );
}