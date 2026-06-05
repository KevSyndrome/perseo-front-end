import { useState, useEffect } from 'react';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { getCargos } from '../../services/cargosService';
import { getPermisosCargos, crearPermisoCargo, eliminarPermisoCargo } from '../../services/permisoCargoService';

export default function PermisoCargoTab() {
  const [cargos, setCargos] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [matriz, setMatriz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cargoSel, setCargoSel] = useState("");
  const [permisoSel, setPermisoSel] = useState("");
  const [creando, setCreando] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [c, p, m] = await Promise.all([getCargos(), getPermisos(), getPermisosCargos()]);
    setCargos(Array.isArray(c.data) ? c.data : []);
    setPermisos(Array.isArray(p.data) ? p.data : []);
    setMatriz(Array.isArray(m.data) ? m.data : []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCrear = async () => {
    if (!cargoSel || !permisoSel) return;
    setCreando(true);
    await crearPermisoCargo(cargoSel, permisoSel);
    setCargoSel("");
    setPermisoSel("");
    await fetchAll();
    setCreando(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center gap-2 text-slate-500 py-10">
      <Loader2 size={24} className="animate-spin" />
      <span>Cargando matriz...</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 flex-wrap">
        <select value={cargoSel} onChange={(e) => setCargoSel(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300">
          <option value="">Seleccionar cargo...</option>
          {cargos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>

        <select value={permisoSel} onChange={(e) => setPermisoSel(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300">
          <option value="">Seleccionar permiso...</option>
          {permisos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>

        <button onClick={handleCrear} disabled={creando || !cargoSel || !permisoSel}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "var(--color-selection)" }}>
          <Plus size={16} />
          {creando ? "Asignando..." : "Asignar"}
        </button>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-md overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-4 py-3 font-semibold text-slate-600">Cargo</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Permiso</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {matriz.map((item) => (
              <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-4 py-3 text-slate-700">{item.cargo?.nombre ?? item.cargo_id}</td>
                <td className="px-4 py-3 text-slate-700">{item.permiso?.nombre ?? item.permiso_id}</td>
                <td className="px-4 py-3">
                  <button onClick={async () => { await eliminarPermisoCargo(item.id); await fetchAll(); }}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}