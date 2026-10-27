import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, ChevronLeft, ChevronRight, Users, CalendarClock, ListTodo } from "lucide-react";
import { generarSlugProyecto } from "../../utils/slug";
import { textoVencimiento } from "../../utils/vencimiento";

// Carrusel de proyectos del Dashboard con avance. Proyecto = fila de GET /usuarios/me/resumen.
export default function ProjectCarousel({ projects = [] }) {
  const navigate = useNavigate();
  const pistaRef = useRef(null);
  const mover = (dir) => pistaRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  if (!projects.length) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-12 text-slate-400">
        <FolderOpen size={48} className="mb-3" />
        <p className="text-lg font-medium">No hay proyectos para mostrar</p>
        <p className="text-sm">Crea uno o únete con un código.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={pistaRef} className="flex w-full snap-x gap-4 overflow-x-auto scroll-smooth pb-2">
        {projects.map((p) => {
          const vence = textoVencimiento(p.fecha_final);
          const vencido = vence?.startsWith("venció");
          return (
            <button
              key={p.id}
              onClick={() => navigate(`/proyectos/${generarSlugProyecto(p)}`)}
              className="flex w-[270px] shrink-0 snap-start cursor-pointer flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                {p.logo
                  ? <img src={p.logo} alt={p.nombre} className="h-11 w-11 rounded-lg object-cover" />
                  : <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-400"><FolderOpen size={22} /></span>}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-800">{p.nombre}</p>
                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    {p.status?.nombre && (
                      <span className="rounded-full bg-teal-50 px-2 py-0.5 font-medium capitalize text-teal-700">{p.status.nombre}</span>
                    )}
                    <span className="flex items-center gap-1"><Users size={12} /> {p.total_colaboradores ?? 0}</span>
                  </p>
                </div>
              </div>

              {/* Avance: porcentaje = null cuando el proyecto aún no tiene tareas */}
              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Avance</span>
                  <span className="font-semibold text-slate-700">
                    {p.porcentaje === null ? "Sin tareas aún" : `${p.porcentaje}% · ${p.tareas_completadas}/${p.total_tareas}`}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[var(--color-selection)] transition-[width]" style={{ width: `${p.porcentaje ?? 0}%` }} />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <ListTodo size={13} />
                  {p.mis_tareas_pendientes ? `${p.mis_tareas_pendientes} tareas mías` : "Nada pendiente para ti"}
                </span>
                {vence && (
                  <span className={`flex items-center gap-1 ${vencido ? "text-red-500" : ""}`}>
                    <CalendarClock size={13} /> {vence}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {/* Flechas arriba a la derecha, junto al título (solo pantallas grandes; en táctil se desliza) */}
      <div className="absolute -top-10 right-0 hidden gap-1 md:flex">
        <button onClick={() => mover(-1)} aria-label="Proyectos anteriores" className="cursor-pointer rounded-full bg-white p-1.5 text-slate-600 shadow-sm hover:bg-slate-50">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => mover(1)} aria-label="Más proyectos" className="cursor-pointer rounded-full bg-white p-1.5 text-slate-600 shadow-sm hover:bg-slate-50">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
