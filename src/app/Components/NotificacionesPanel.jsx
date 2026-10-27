import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ListTodo, CheckCheck, UserPlus, UserMinus, Reply, Clock, AlertTriangle, MessageSquare, X } from 'lucide-react';
import { getSalas, marcarSalaLeida } from '../../services/salaService';
import { useNotificacionesStore } from './NotificacionesStore';

const ICONO = {
  tarea_asignada: ListTodo, tarea_estado: ListTodo, comentario_tarea: MessageSquare,
  tarea_por_vencer: Clock, tarea_vencida: AlertTriangle,
  colaborador_unido: UserPlus, miembro_sala: UserPlus, quitado_de_proyecto: UserMinus,
  respuesta_mensaje: Reply,
};

const hora = (iso) => {
  const d = new Date(iso);
  return new Date().toDateString() === d.toDateString()
    ? d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
};

// shortcut: la pantalla de Tareas aún usa datos de prueba; las notificaciones de tareas
// abren el proyecto (el detalle lo busca por los 8 primeros caracteres del id). Cuando se
// conecte Tareas, usar n.ruta tal cual (/task/{id}).
const rutaDe = (n) =>
  n.ruta?.startsWith('/task/') && n.datos?.proyecto_id ? `/proyectos/p--${n.datos.proyecto_id.slice(0, 8)}` : n.ruta;

// Panel de la campana: notificaciones generales + chats sin leer (en vivo)
export default function NotificacionesPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { noLeidos, marcarLeida, ultimoAviso, notificaciones, notifNoLeidas, leerNotificacion, leerTodas, borrarNotificacion, cargarNotificaciones } = useNotificacionesStore();
  const [salas, setSalas] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    cargarNotificaciones();
    getSalas().then((res) => setSalas(res.data || [])).catch(() => {});
  }, [isOpen, cargarNotificaciones]);

  useEffect(() => {
    if (!ultimoAviso) return;
    setSalas((prev) => prev.map((s) => (s.id === ultimoAviso.sala_id ? { ...s, ultimo_mensaje: ultimoAviso.data } : s)));
  }, [ultimoAviso]);

  if (!isOpen) return null;

  const chats = salas.filter((s) => noLeidos[s.id] > 0);
  const ir = (ruta) => { onClose(); if (ruta) navigate(ruta); };
  const abrirNotif = (n) => { if (!n.leida) leerNotificacion(n.id).catch(() => {}); ir(rutaDe(n)); };
  const marcarTodo = () => {
    leerTodas().catch(() => {});
    chats.forEach((s) => marcarSalaLeida(s.id).then(() => marcarLeida(s.id)).catch(() => {}));
  };

  return (
    <>
      <div className="fixed inset-0 z-[150]" onClick={onClose} />
      <div className="fixed inset-x-2 top-[calc(var(--navbar-height)+4px)] z-[160] flex max-h-[70dvh] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[var(--shadow-xl)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 className="font-bold text-slate-800">Notificaciones</h2>
          {(notifNoLeidas > 0 || chats.length > 0) && (
            <button onClick={marcarTodo} className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50">
              <CheckCheck size={14} /> Marcar todo como leído
            </button>
          )}
        </div>
        <div className="overflow-y-auto">
          {notificaciones.map((n) => {
            const Icono = ICONO[n.tipo] ?? ListTodo;
            return (
              <div key={n.id} className={`group flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 ${n.leida ? '' : 'bg-teal-50/40'}`}>
                <button onClick={() => abrirNotif(n)} className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 text-left">
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.tipo === 'tarea_vencida' ? 'bg-red-50 text-red-500' : n.tipo === 'tarea_por_vencer' ? 'bg-amber-50 text-amber-500' : 'bg-teal-50 text-teal-600'}`}>
                    <Icono size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm text-slate-800 ${n.leida ? '' : 'font-semibold'}`}>{n.titulo}</span>
                    {n.mensaje && <span className="block truncate text-xs text-slate-500">{n.mensaje}</span>}
                    <span className="text-[11px] text-slate-400">{hora(n.fecha)}</span>
                  </span>
                </button>
                {!n.leida && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-500" />}
                <button onClick={() => borrarNotificacion(n.id).catch(() => {})} title="Eliminar" className="cursor-pointer rounded p-1 text-slate-300 opacity-0 hover:text-slate-500 group-hover:opacity-100">
                  <X size={14} />
                </button>
              </div>
            );
          })}

          {chats.length > 0 && (
            <section>
              <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Chats sin leer</p>
              {chats.map((s) => (
                <button key={s.id} onClick={() => ir(`/mensajes/${s.id}`)} className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600"><MessageCircle size={16} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">{s.nombre}</span>
                    <span className="block truncate text-xs text-slate-500">
                      {s.ultimo_mensaje && <><b>{s.ultimo_mensaje.usuario?.nombre}:</b> {s.ultimo_mensaje.mensaje || '📎 Archivo'}</>}
                    </span>
                  </span>
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">{noLeidos[s.id]}</span>
                </button>
              ))}
            </section>
          )}

          {!notificaciones.length && !chats.length && (
            <p className="px-4 py-10 text-center text-sm text-slate-400">Estás al día. No hay notificaciones.</p>
          )}
        </div>
      </div>
    </>
  );
}
