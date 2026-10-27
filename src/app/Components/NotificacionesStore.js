import { create } from 'zustand';
import { crearConexionAvisos } from '../../services/mensajesServices';
import { getSalas } from '../../services/salaService';
import { refrescarSesion, cerrarSesionYIrALogin } from '../../services/api';
import {
  getNotificaciones,
  marcarNotificacionLeida,
  leerTodasNotificaciones,
  eliminarNotificacion,
} from '../../services/notificacionesService';

let ws = null;
let reintento = null;

// No leídos por sala + notificaciones generales + canal de avisos en tiempo real (una
// conexión por sesión). "ultimoAviso" cambia con cada mensaje nuevo para que el panel de
// salas reaccione.
export const useNotificacionesStore = create((set, get) => ({
  noLeidos: {},
  salaAbierta: null,
  conectado: false,
  token: null,
  ultimoAviso: null,
  notificaciones: [], // las más recientes (primera página)
  notifNoLeidas: 0,

  // Idempotente: solo reconecta si cambió el token (otro login)
  conectar: () => {
    let token = localStorage.getItem('token');
    if (!token || get().token === token) return;
    clearTimeout(reintento);
    ws?.close();
    set({ token, noLeidos: {}, conectado: false, notificaciones: [], notifNoLeidas: 0 });
    get().cargarNotificaciones();

    getSalas()
      .then((res) => get().setDesdeSalas(res.data || []))
      .catch(() => {});

    // renovado: ya se intentó renovar en este intento de conexión (evita bucles)
    const abrir = (renovado = false) => {
      ws = crearConexionAvisos(
        (aviso) => {
          const { salaAbierta, noLeidos } = get();
          // La sala abierta ya recibe el mensaje por el WS del chat
          if (aviso.sala_id === salaAbierta) return;
          set({
            noLeidos: { ...noLeidos, [aviso.sala_id]: (noLeidos[aviso.sala_id] || 0) + 1 },
            ultimoAviso: aviso,
          });
          // Notificación del navegador si la pestaña no está a la vista
          if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(aviso.sala_nombre, {
              body: `${aviso.data?.usuario?.nombre || 'Alguien'}: ${aviso.data?.mensaje || 'Envió un archivo'}`,
              icon: '/IsotipoPrometeoColoresOscuros.png',
            });
          }
        },
        (event) => {
          set({ conectado: false });
          if (get().token !== token) return;
          // 1006 y otros = red caída: reintentar. 1008 = rechazo con motivo en reason.
          if (event.code !== 1008) {
            reintento = setTimeout(abrir, 5000);
          } else if (/token/i.test(event.reason) && !renovado) {
            // "Token inválido o expirado": renovar una vez y reconectar
            refrescarSesion().then((ok) => {
              if (!ok) return cerrarSesionYIrALogin();
              token = localStorage.getItem('token');
              set({ token });
              abrir(true);
            });
          } else if (/sesi[oó]n/i.test(event.reason)) {
            // "Sesión revocada o expirada"
            cerrarSesionYIrALogin();
          }
          // Otro motivo (ej. el cargo no tiene acceso a mensajes): no reintentar
        },
        (notif) => {
          // Notificación general en vivo: arriba de la lista
          set((st) => ({
            notificaciones: [notif, ...st.notificaciones.filter((n) => n.id !== notif.id)].slice(0, 30),
            notifNoLeidas: st.notifNoLeidas + (notif.leida ? 0 : 1),
          }));
          if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(notif.titulo, { body: notif.mensaje || '', icon: '/IsotipoPrometeoColoresOscuros.png' });
          }
        }
      );
      ws.onopen = () => set({ conectado: true });
    };
    abrir();
  },

  setDesdeSalas: (salas) =>
    set({ noLeidos: Object.fromEntries(salas.map((s) => [s.id, s.no_leidos || 0])) }),

  // Al abrir una sala el backend la marca leída sola (GET /mensajes page=1 y el WS)
  abrirSala: (salaId) =>
    set((st) => ({ salaAbierta: salaId, noLeidos: { ...st.noLeidos, [salaId]: 0 } })),
  cerrarSala: () => set({ salaAbierta: null }),
  marcarLeida: (salaId) => set((st) => ({ noLeidos: { ...st.noLeidos, [salaId]: 0 } })),

  // El backend genera las de "tarea por vencer/vencida" al consultar: se piden al conectar
  cargarNotificaciones: async () => {
    try {
      const res = await getNotificaciones(1, 20);
      set({ notificaciones: res.data || [], notifNoLeidas: res.no_leidas ?? 0 });
    } catch {
      // Sin notificaciones no se rompe nada: la campana sigue con los chats
    }
  },

  leerNotificacion: async (id) => {
    const res = await marcarNotificacionLeida(id);
    set((st) => ({
      notificaciones: st.notificaciones.map((n) => (n.id === id ? { ...n, leida: true } : n)),
      notifNoLeidas: res.no_leidas ?? Math.max(0, st.notifNoLeidas - 1),
    }));
  },

  leerTodas: async () => {
    await leerTodasNotificaciones();
    set((st) => ({ notificaciones: st.notificaciones.map((n) => ({ ...n, leida: true })), notifNoLeidas: 0 }));
  },

  borrarNotificacion: async (id) => {
    const res = await eliminarNotificacion(id);
    set((st) => ({
      notificaciones: st.notificaciones.filter((n) => n.id !== id),
      notifNoLeidas: res.no_leidas ?? st.notifNoLeidas,
    }));
  },
}));

export const totalNoLeidos = (noLeidos) => Object.values(noLeidos).reduce((a, b) => a + b, 0);
