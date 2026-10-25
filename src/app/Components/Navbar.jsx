import React, { useState, useEffect } from "react";
import { Bell, CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsuarioPorId } from "../../services/usuariosService";
import { getTokenPayload } from "../../services/authService";
import { useNotificacionesStore } from "./NotificacionesStore";

const Navbar = () => {
  // Punto verde: canal de avisos del chat conectado
  const chatConnected = useNotificacionesStore((s) => s.conectado);
  const [imagen, setImagen] = useState(null);
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
    <nav className="fixed inset-x-0 top-0 z-[100] flex h-[var(--navbar-height)] items-center border-b border-[var(--border-color)] bg-[var(--color-blanco)] px-3 sm:px-6">
      <div className="flex-1" />
      <button className="relative flex cursor-pointer items-center justify-center rounded-[var(--radius-md)] bg-transparent p-2 text-[var(--color-negro)] transition-colors duration-150 hover:bg-blue-500/10">
        <Bell size={30} />
        {chatConnected && (
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" title="Chat conectado" />
        )}
      </button>
      <button
        onClick={() => navigate("/profile")}
        title="Mi perfil"
        className="ml-3 flex cursor-pointer items-center justify-center rounded-full bg-transparent text-[var(--color-primary)]"
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
