import React, { useState, useEffect } from "react";
import { Bell, CircleUserRound, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsuarioPorId } from "../../services/usuariosService";
import { getTokenPayload } from "../../services/authService";
import { useNotificacionesStore, totalNoLeidos } from "./NotificacionesStore";
import NotificacionesPanel from "./NotificacionesPanel";
import { temaActual, aplicarTema } from "../../utils/tema";

const Navbar = () => {
  // Punto verde: canal de avisos del chat conectado
  const chatConnected = useNotificacionesStore((s) => s.conectado);
  const noLeidos = useNotificacionesStore((s) => s.noLeidos);
  const notifNoLeidas = useNotificacionesStore((s) => s.notifNoLeidas);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const pendientes = notifNoLeidas + totalNoLeidos(noLeidos);
  const [imagen, setImagen] = useState(null);
  const [tema, setTema] = useState(temaActual);

  const cambiarTema = () => {
    const nuevo = tema === 'dark' ? 'light' : 'dark';
    aplicarTema(nuevo);
    setTema(nuevo);
  };
  const navigate = useNavigate();

  // Foto de perfil desde la API; Profile emite "imagen-perfil" al cambiarla
  useEffect(() => {
    const id = getTokenPayload()?.sub;
    if (id) {
      getUsuarioPorId(id)
        .then((res) => setImagen(res.data?.imagen || null))
        .catch(() => setImagen(null));
    }
    const handleImagen = (e) => setImagen(e.detail || null);
    window.addEventListener('imagen-perfil', handleImagen);
    return () => window.removeEventListener('imagen-perfil', handleImagen);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-[100] flex h-[var(--navbar-height)] items-center border-b border-[var(--border-color)] bg-[var(--bg-navbar)] px-3 sm:px-6">
      <div className="flex-1" />
      <button
        onClick={cambiarTema}
        title={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        aria-label={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        className="mr-1 flex cursor-pointer items-center justify-center rounded-[var(--radius-md)] bg-transparent p-2 text-[var(--text-primary)] transition-colors duration-150 hover:bg-[var(--color-selection)]/15"
      >
        {tema === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      <div className="relative">
        <button
          onClick={() => setPanelAbierto((v) => !v)}
          title={chatConnected ? 'Notificaciones (en vivo)' : 'Notificaciones (sin conexión en vivo)'}
          aria-label={`Notificaciones${pendientes ? `: ${pendientes} pendientes` : ''}`}
          aria-expanded={panelAbierto}
          className="relative flex cursor-pointer items-center justify-center rounded-[var(--radius-md)] bg-transparent p-2 text-[var(--text-primary)] transition-colors duration-150 hover:bg-blue-500/10"
        >
          <Bell size={28} />
          {pendientes > 0 ? (
            <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {pendientes > 99 ? '99+' : pendientes}
            </span>
          ) : chatConnected && (
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-navbar)] bg-green-500" />
          )}
        </button>
        <NotificacionesPanel isOpen={panelAbierto} onClose={() => setPanelAbierto(false)} />
      </div>
      <button
        onClick={() => navigate("/profile")}
        title="Mi perfil"
        className="ml-3 flex cursor-pointer items-center justify-center rounded-full bg-transparent text-[var(--text-primary)]"
      >
        {imagen ? (
          <img
            src={imagen}
            alt="Perfil"
            className="h-9 w-9 rounded-full border-2 border-[var(--color-primary)] object-cover"
          />
        ) : (
          <CircleUserRound size={36} strokeWidth={1.5} />
        )}
      </button>

    </nav>
  );
};

export default Navbar;
