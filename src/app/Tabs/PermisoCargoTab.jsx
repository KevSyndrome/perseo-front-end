// src/app/Tabs/PermisoCargoTab.jsx
import { useState, useEffect, useMemo } from 'react';
import { Trash2, Plus, Loader2, Check, X, Pencil } from 'lucide-react';
import { getCargos } from '../../services/cargosService';
import { getPermisosCargos, crearPermisoCargo, actualizarPermisoCargo, eliminarPermisoCargo } from '../../services/permisoCargoService';

const ACCIONES_DEFAULT = { ver: false, crear: false, editar: false, eliminar: false };

export default function PermisoCargoTab() {
  const [cargos, setCargos] = useState([]);
  const [cargoSeleccionado, setCargoSeleccionado] = useState("");
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cargandoPermisos, setCargandoPermisos] = useState(false);
  const [error, setError] = useState("");

  // Formulario para nuevo módulo
  const [nuevoModulo, setNuevoModulo] = useState("");
  const [nuevasAcciones, setNuevasAcciones] = useState(ACCIONES_DEFAULT);
  const [creando, setCreando] = useState(false);

  // Edición inline
  const [editandoId, setEditandoId] = useState(null);
  const [editAcciones, setEditAcciones] = useState(ACCIONES_DEFAULT);

  const fetchCargos = async () => {
    setLoading(true);
    try {
      const res = await getCargos(1, 50);
      const lista = Array.isArray(res.data) ? res.data : [];
      setCargos(lista);
      if (lista.length > 0) setCargoSeleccionado(lista[0].id);
    } catch (err) {
      setError("Error al cargar los cargos");
    } finally {
      setLoading(false);
    }
  };

  const fetchPermisos = async (cargoId) => {
    if (!cargoId) return;
    setCargandoPermisos(true);
    try {
      const res = await getPermisosCargos(1, 50, cargoId);
      setPermisos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Error al cargar los permisos del cargo");
    } finally {
      setCargandoPermisos(false);
    }
  };

  useEffect(() => { fetchCargos(); }, []);
  useEffect(() => { if (cargoSeleccionado) fetchPermisos(cargoSeleccionado); }, [cargoSeleccionado]);

  const handleCrear = async () => {
    if (!nuevoModulo.trim() || !cargoSeleccionado) return;
    setError("");
    setCreando(true);
    try {
      const resultado = await crearPermisoCargo({
        cargo_id: cargoSeleccionado,
        modulo: nuevoModulo.trim(),
        acciones: nuevasAcciones,
      });
      if (resultado.detail) {
        setError(typeof resultado.detail === 'string' ? resultado.detail : "Error al crear el permiso");
        return;
      }
      setNuevoModulo("");
      setNuevasAcciones(ACCIONES_DEFAULT);
      await fetchPermisos(cargoSeleccionado);
    } catch (err) {
      setError("Ocurrió un error al crear el permiso");
    } finally {
      setCreando(false);
    }
  };

  const iniciarEdicion = (permiso) => {
    setEditandoId(permiso.id);
    setEditAcciones({ ...ACCIONES_DEFAULT, ...permiso.acciones });
    setError("");
  };

  const handleGuardarEdicion = async (id) => {
    setError("");
    try {
      // Importante: NO mandamos cargo_id aquí, solo lo que cambió, para evitar
      // el falso positivo de "combinación duplicada" en el backend.
      const resultado = await actualizarPermisoCargo(id, { acciones: editAcciones });
      if (resultado.detail) {
        setError(typeof resultado.detail === 'string' ? resultado.detail : "Error al actualizar el permiso");
        return;
      }
      setEditandoId(null);
      await fetchPermisos(cargoSeleccionado);
    } catch (err) {
      setError("Ocurrió un error al actualizar el permiso");
    }
  };

  const handleEliminar = async (id) => {
    setError("");
    try {
      const ok = await eliminarPermisoCargo(id);
      if (!ok) {
        setError("No se pudo eliminar el permiso");
        return;
      }
      setPermisos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError("Ocurrió un error al eliminar el permiso");
    }
  };

  const nombreCargoActual = useMemo(
    () => cargos.find((c) => c.id === cargoSeleccionado)?.nombre ?? "",
    [cargos, cargoSeleccionado]
  );

  if (loading) return (
    <div className="flex items-center justify-center gap-2 text-slate-500 py-10">
      <Loader2 size={24} className="animate-spin" />
      <span>Cargando cargos...</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Selector de cargo */}
      <div className="flex flex-col gap-1 max-w-xs">
        <label className="text-xs font-medium text-slate-500">Cargo</label>
        <select
          value={cargoSeleccionado}
          onChange={(e) => setCargoSeleccionado(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          {cargos.length === 0 && <option value="">No hay cargos creados</option>}
          {cargos.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Formulario para agregar módulo nuevo */}
      {cargoSeleccionado && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-700">
            Agregar módulo para "{nombreCargoActual}"
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              placeholder="Nombre del módulo (ej. proyectos, tareas)"
              value={nuevoModulo}
              onChange={(e) => setNuevoModulo(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            {Object.keys(ACCIONES_DEFAULT).map((accion) => (
              <label key={accion} className="flex items-center gap-1.5 text-sm text-slate-600 capitalize">
                <input
                  type="checkbox"
                  checked={nuevasAcciones[accion]}
                  onChange={(e) => setNuevasAcciones((prev) => ({ ...prev, [accion]: e.target.checked }))}
                />
                {accion}
              </label>
            ))}
            <button
              onClick={handleCrear}
              disabled={creando || !nuevoModulo.trim()}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: "var(--color-selection)" }}
            >
              <Plus size={16} />
              {creando ? "Agregando..." : "Agregar"}
            </button>
          </div>
        </div>
      )}

      {/* Tabla de módulos y permisos del cargo seleccionado */}
      {cargandoPermisos ? (
        <div className="flex items-center justify-center gap-2 text-slate-500 py-10">
          <Loader2 size={24} className="animate-spin" />
          <span>Cargando permisos...</span>
        </div>
      ) : (
        <div className="rounded-xl bg-white p-5 shadow-md overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 font-semibold text-slate-600">Módulo</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Ver</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Crear</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Editar</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Eliminar</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {permisos.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    Este cargo no tiene módulos configurados todavía.
                  </td>
                </tr>
              )}
              {permisos.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.modulo}</td>
                  {["ver", "crear", "editar", "eliminar"].map((accion) => (
                    <td key={accion} className="px-4 py-3">
                      {editandoId === item.id ? (
                        <input
                          type="checkbox"
                          checked={editAcciones[accion]}
                          onChange={(e) => setEditAcciones((prev) => ({ ...prev, [accion]: e.target.checked }))}
                        />
                      ) : (
                        <span className={item.acciones?.[accion] ? "text-green-600" : "text-slate-300"}>
                          {item.acciones?.[accion] ? "✔" : "—"}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    {editandoId === item.id ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleGuardarEdicion(item.id)}
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
                        <button onClick={() => iniciarEdicion(item)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-500 cursor-pointer">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleEliminar(item.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}