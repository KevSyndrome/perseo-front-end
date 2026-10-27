import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FolderOpen, ChevronLeft, ChevronRight, Users, CalendarClock, ListTodo, CheckCircle2, ArrowRight } from "lucide-react";
import { generarSlugProyecto } from "../../utils/slug";
import { textoVencimiento } from "../../utils/vencimiento";

const INTERVALO_MS = 6000;

// Anillo de avance (SVG); porcentaje = null cuando el proyecto aún no tiene tareas
function AnilloAvance({ porcentaje }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative h-32 w-32 shrink-0 sm:h-36 sm:w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" stroke="var(--color-terciario)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - (porcentaje ?? 0) / 100) }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        {porcentaje === null ? (
          <span className="px-4 text-xs leading-tight text-white/70">Sin tareas aún</span>
        ) : (
          <>
            <span className="text-3xl font-bold">{porcentaje}%</span>
            <span className="text-[11px] text-white/70">avance</span>
          </>
        )}
      </div>
    </div>
  );
}

// Carrusel tipo anuncio: un proyecto grande a la vez que rota solo.
// Se pausa con el cursor encima o al interactuar; en táctil se desliza.
export default function ProjectCarousel({ projects = [] }) {
  const navigate = useNavigate();
  const reducirMovimiento = useReducedMotion();
  const [[indice, direccion], setActual] = useState([0, 1]);
  const [pausado, setPausado] = useState(false);
  const total = projects.length;

  const ir = (nuevo, dir) => setActual([(nuevo + total) % total, dir]);
  const siguiente = () => ir(indice + 1, 1);
  const anterior = () => ir(indice - 1, -1);

  // Rotación automática (no con "reducir movimiento" ni con un solo proyecto)
  useEffect(() => {
    if (pausado || reducirMovimiento || total < 2) return;
    const t = setTimeout(siguiente, INTERVALO_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indice, pausado, reducirMovimiento, total]);

  if (!total) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-12 text-slate-400">
        <FolderOpen size={48} className="mb-3" />
        <p className="text-lg font-medium">No hay proyectos para mostrar</p>
        <p className="text-sm">Crea uno o únete con un código.</p>
      </div>
    );
  }

  const p = projects[Math.min(indice, total - 1)];
  const vence = textoVencimiento(p.fecha_final);
  const abrir = () => navigate(`/proyectos/${generarSlugProyecto(p)}`);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      aria-roledescription="carrusel"
    >
      {/* Flechas junto al título "Mis proyectos" */}
      {total > 1 && (
        <div className="absolute -top-10 right-0 flex gap-1">
          <button onClick={anterior} aria-label="Proyecto anterior" className="cursor-pointer rounded-full bg-white p-1.5 text-slate-600 shadow-sm hover:bg-slate-50">
            <ChevronLeft size={18} />
          </button>
          <button onClick={siguiente} aria-label="Siguiente proyecto" className="cursor-pointer rounded-full bg-white p-1.5 text-slate-600 shadow-sm hover:bg-slate-50">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <div className="relative h-[340px] overflow-hidden rounded-2xl sm:h-[230px]">
        <AnimatePresence initial={false} custom={direccion}>
          <motion.div
            key={p.id}
            custom={direccion}
            variants={{
              entra: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0.6 }),
              centro: { x: 0, opacity: 1 },
              sale: (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0.6 }),
            }}
            initial="entra"
            animate="centro"
            exit="sale"
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            drag={total > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragStart={() => setPausado(true)}
            onDragEnd={(_, info) => {
              setPausado(false);
              if (info.offset.x < -80) siguiente();
              else if (info.offset.x > 80) anterior();
            }}
            // onTap no se dispara si hubo arrastre (deslizar no debe abrir el proyecto)
            onTap={(e) => !e.target.closest("button") && abrir()}
            className="absolute inset-0 flex cursor-pointer flex-col gap-4 p-5 text-white sm:flex-row sm:items-center sm:gap-8 sm:p-7"
            style={{ background: "linear-gradient(120deg, var(--color-primary) 0%, #0f3a44 55%, var(--color-selection) 140%)" }}
          >
            {/* Brillo decorativo */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--color-terciario)] opacity-10 blur-2xl" />

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex items-center gap-3">
                {p.logo
                  ? <img src={p.logo} alt={p.nombre} className="h-14 w-14 rounded-xl object-cover ring-2 ring-white/20" />
                  : <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10"><FolderOpen size={26} className="text-[var(--color-terciario)]" /></span>}
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-bold sm:text-2xl">{p.nombre}</h3>
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/70">
                    {p.status?.nombre && <span className="rounded-full bg-white/15 px-2 py-0.5 font-medium capitalize text-white">{p.status.nombre}</span>}
                    <span className="flex items-center gap-1"><Users size={12} /> {p.total_colaboradores ?? 0} colaboradores</span>
                    {p.propietario?.nombre && <span>Dueño: {p.propietario.nombre}</span>}
                  </p>
                </div>
              </div>
              {p.descripcion && <p className="line-clamp-2 text-sm text-white/80">{p.descripcion}</p>}
              <div className="flex flex-wrap gap-2 text-xs">
                {p.total_tareas > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1"><CheckCircle2 size={13} /> {p.tareas_completadas}/{p.total_tareas} completadas</span>
                )}
                <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                  <ListTodo size={13} /> {p.mis_tareas_pendientes ? `${p.mis_tareas_pendientes} tareas tuyas` : "Nada pendiente para ti"}
                </span>
                {vence && (
                  <span className={`flex items-center gap-1 rounded-full px-3 py-1 ${vence.startsWith("venció") ? "bg-red-500/80" : "bg-white/10"}`}>
                    <CalendarClock size={13} /> {vence}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:flex-col sm:justify-center">
              <AnilloAvance porcentaje={p.porcentaje} />
              <button onClick={abrir} className="flex cursor-pointer items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0f3a44] hover:bg-white/90">
                Ver proyecto <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Puntitos: posición y salto directo */}
      {total > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {projects.map((x, i) => (
            <button
              key={x.id}
              onClick={() => ir(i, i > indice ? 1 : -1)}
              aria-label={`Ver ${x.nombre}`}
              aria-current={i === indice}
              className={`h-2 cursor-pointer rounded-full transition-all ${i === indice ? "w-6 bg-[var(--color-selection)]" : "w-2 bg-slate-300 hover:bg-slate-400"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
