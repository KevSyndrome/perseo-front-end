import { create } from 'zustand';
import { crearConexionAvisos } from '../../services/mensajesServices';
import { getSalas } from '../../services/salaService';
import { refrescarSesion, cerrarSesionYIrALogin } from '../../services/api';
import { getTokenPayload } from '../../services/authService';

// Vencido o ilegible (con 10 s de margen)
const tokenVencido = () => {
  const exp = getTokenPayload()?.exp;
  return !exp || exp * 1000 < Date.now() + 10000;
};

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

    const abrir = () => {
      let abierto = false;
      const tokenUsado = localStorage.getItem('token');
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
              body: `${aviso.data?.usuario?.nombre || 'Alguien'}: ${aviso.data?.mensaje}`,
              icon: '/IsotipoPrometeoColoresOscuros.png',
            });
          }
        },
        (event) => {
          set({ conectado: false });
          if (get().token !== token) return;
          // Si el backend rechaza el token en el handshake, el navegador solo ve 1006 (no 1008).
          // Rechazada sin abrir y con el token vencido → renovar y reconectar (o ir a login).
          if (event.code === 1008 || (!abierto && tokenVencido())) {
            refrescarSesion().then((ok) => {
              if (!ok) return cerrarSesionYIrALogin();
              token = localStorage.getItem('token');
              set({ token });
              abrir();
            });
          } else if (!abierto && localStorage.getItem('token') !== tokenUsado) {
            // Otra petición ya renovó la sesión mientras se conectaba: reintentar ya
            abrir();
          } else {
            reintento = setTimeout(abrir, 5000);
          }
        }
      );
      ws.onopen = () => {
        abierto = true;
        set({ conectado: true });
      };
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
