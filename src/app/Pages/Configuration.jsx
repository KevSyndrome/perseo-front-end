import { useState, useMemo, useEffect } from 'react';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import DataTable from '../Components/DataTable';
import { useBreadcrumb } from '../Components/Breadcrumb';
import { getData } from '../../api';

export default function Configuration() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useBreadcrumb([
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Configuración' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getData();
        setData(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        setError('Error al cargar los cargos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre',
        header: 'Nombre',
        cell: (info) => (
          <span className="font-medium text-slate-800">{info.getValue()}</span>
        ),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Editar: ${row.original.nombre}`)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-500 cursor-pointer"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setData((prev) => prev.filter((d) => d.id !== row.original.id))}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="text-sm font-medium">Cargando cargos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-red-500">
        <p className="text-lg font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cargos</h1>
          <p className="text-sm text-slate-500">Gestiona los roles del sistema</p>
        </div>
        <button
          onClick={() => alert('Crear cargo')}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover cursor-pointer"
        >
          <Plus size={16} />
          Nuevo cargo
        </button>
      </div>

      <DataTable data={data} columns={columns} pageSize={5} />
    </div>
  );
}
