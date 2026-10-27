import { Plus, Link2, BarChart3, ListTodo, MessageCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumb, { useBreadcrumb } from "../Components/Breadcrumb";
import Card from "../Components/Cards/Card";
import ProjectCarousel from "../Components/ProjectCarousel";
import React, { useState, useEffect } from "react";
import ProyectoForm from "../Forms/ProyectoForm";
import UnirseModal from '../Modals/UnirseModal';
import { getMiResumen } from "../../services/usuariosService";
import { getSalas } from "../../services/salaService";
import { useNotificacionesStore } from "../Components/NotificacionesStore";
import { generarSlugProyecto } from "../../utils/slug";
import { textoVencimiento } from "../../utils/vencimiento";

const hora = (iso) => {
  const d = new Date(iso);
  return new Date().toDateString() === d.toDateString()
    ? d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [unirseOpen, setUnirseOpen] = useState(false);
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState("");
  const [salas, setSalas] = useState([]);
  const { noLeidos, ultimoAviso } = useNotificacionesStore();

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useBreadcrumb([{ label: "Dashboard" }]);

  const cargarResumen = () =>
    getMiResumen().then(setResumen).catch((err) => setError(err.message));

  useEffect(() => {
    cargarResumen();
    getSalas().then((res) => setSalas(res.data || [])).catch(() => setSalas([]));
  }, []);

  // Mensaje nuevo en cualquier sala: actualiza la actividad sin recargar
  useEffect(() => {
    if (!ultimoAviso) return;
    setSalas((prev) => prev.map((s) => (s.id === ultimoAviso.sala_id ? { ...s, ultimo_mensaje: ultimoAviso.data } : s)));
  }, [ultimoAviso]);

  const proyectos = resumen?.proyectos || [];
  const activos = proyectos.filter((p) => p.status?.nombre?.toLowerCase() === "activo").length;
  const actividad = salas
    .filter((s) => s.ultimo_mensaje)
    .sort((a, b) => new Date(b.ultimo_mensaje.fechaC) - new Date(a.ultimo_mensaje.fechaC))
    .slice(0, 6);

  return (
    <div className="flex h-full w-full flex-col">
      <Breadcrumb />

      <h1 className="text-2xl font-bold text-slate-800">
        Bienvenido, {usuario.nombre} {usuario.apellido_paterno} {usuario.apellido_materno}
      </h1>

      <div className="flex flex-1 flex-col gap-8 pt-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card
            icon={<BarChart3 size={32} />}
            label="Proyectos activos"
            value={resumen ? activos : undefined}
            color="var(--color-selection)"
            onClick={() => navigate("/proyectos")}
          />
          <Card
            icon={<Link2 size={36} />}
            label="Unirse al proyecto"
            color="var(--color-selection)"
            onClick={() => setUnirseOpen(true)}
          />
          <Card
            icon={<Plus size={36} />}
            label="Crear proyecto"
            color="var(--color-grey)"
            onClick={() => setCreateOpen(true)}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* General: proyectos con su avance */}
        <section>
          <h2 className="mb-3 text-lg font-bold text-slate-800">Mis proyectos</h2>
          {resumen
            ? <ProjectCarousel projects={proyectos} />
            : !error && <div className="flex justify-center py-8 text-slate-400"><Loader2 className="animate-spin" /></div>}
        </section>

        {/* Personal: tareas y actividad */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
              <ListTodo size={18} /> Mis tareas pendientes
              {resumen?.total_mis_tareas > 0 && (
                <span className="rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-600">{resumen.total_mis_tareas}</span>
              )}
            </h2>
            {resumen?.mis_tareas?.length ? (
              <ul className="flex flex-col divide-y divide-slate-100">
                {resumen.mis_tareas.map((t) => {
                  const vence = textoVencimiento(t.fecha_finalizacion);
                  return (
                    <li key={t.id}>
                      <button
                        onClick={() => navigate(`/proyectos/${generarSlugProyecto(t.proyecto)}`)}
                        className="flex w-full cursor-pointer items-center gap-3 py-2.5 text-left hover:bg-slate-50"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-slate-800">{t.nombre}</span>
                          <span className="block truncate text-xs text-slate-500">
                            {t.proyecto?.nombre}{t.fase?.nombre && ` · ${t.fase.nombre}`}
                          </span>
                        </span>
                        <span className="shrink-0 text-right text-xs">
                          {t.status?.nombre && <span className="block capitalize text-slate-500">{t.status.nombre}</span>}
                          {vence && <span className={vence.startsWith("venció") ? "text-red-500" : "text-slate-400"}>{vence}</span>}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-slate-400">
                {resumen ? "No tienes tareas pendientes asignadas." : "Cargando..."}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
              <MessageCircle size={18} /> Actividad reciente
            </h2>
            {actividad.length ? (
              <ul className="flex flex-col divide-y divide-slate-100">
                {actividad.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => navigate(`/mensajes/${s.id}`)}
                      className="flex w-full cursor-pointer items-center gap-3 py-2.5 text-left hover:bg-slate-50"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-800">{s.nombre}</span>
                        <span className="block truncate text-xs text-slate-500">
                          <span className="font-semibold">{s.ultimo_mensaje.usuario?.nombre}:</span>{" "}
                          {s.ultimo_mensaje.mensaje || "📎 Archivo"}
                        </span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-1 text-xs text-slate-400">
                        {hora(s.ultimo_mensaje.fechaC)}
                        {noLeidos[s.id] > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                            {noLeidos[s.id] > 99 ? "99+" : noLeidos[s.id]}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-slate-400">Sin mensajes recientes en tus salas.</p>
            )}
          </div>
        </section>
      </div>

      <ProyectoForm
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onProyectoCreado={cargarResumen}
      />

      <UnirseModal
        isOpen={unirseOpen}
        onClose={() => setUnirseOpen(false)}
        onUnido={cargarResumen}
      />
    </div>
  );
};

export default Dashboard;
