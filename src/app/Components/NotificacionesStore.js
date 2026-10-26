import { create } from 'zustand';
import { crearConexionAvisos } from '../../services/mensajesServices';
import { getSalas } from '../../services/salaService';
import { refrescarSesion, cerrarSesionYIrALogin } from '../../services/api';

let ws = null;
let reintento = null;

// No leídos por sala + canal de avisos en tiempo real (una conexión por sesión).
// "ultimoAviso" cambia con cada mensaje nuevo para que el panel de salas reaccione.
export const useNotificacionesStore = create((set, get) => ({
  noLeidos: {},
  salaAbierta: null,
  conectado: false,
  token: null,
  ultimoAviso: null,

  // Idempotente: solo reconecta si cambió el token (otro login)
  conectar: () => {
    let token = localStorage.getItem('token');
    if (!token || get().token === token) return;
    clearTimeout(reintento);
    ws?.close();
    set({ token, noLeidos: {}, conectado: false });

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
}));

export const totalNoLeidos = (noLeidos) => Object.values(noLeidos).reduce((a, b) => a + b, 0);
