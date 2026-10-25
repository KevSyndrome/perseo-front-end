import React, { useState, useEffect } from "react";
import { Search, Bell, Settings, User, HelpCircle, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../Pages/Profile"

const Navbar = () => {
  const [chatConnected, setChatConnected] = useState(false);
  const [imagen, setImagen] = useState(() => JSON.parse(localStorage.getItem('usuario') || '{}').imagen);
  const navigate = useNavigate();

  // Escuchar estado de conexión del chat
  useEffect(() => {
    const handleStorage = () => {
      const status = localStorage.getItem('chat_connected');
      setChatConnected(status === 'true');
      setImagen(JSON.parse(localStorage.getItem('usuario') || '{}').imagen);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-[100] flex h-[var(--navbar-height)] items-center border-b border-[var(--border-color)] bg-[var(--color-blanco)] px-6">
      <div className="flex-1" />
      <button className="relative flex cursor-pointer items-center justify-center rounded-[var(--radius-md)] bg-transparent p-2 text-[var(--color-negro)] transition-colors duration-150 hover:bg-blue-500/10">
        <Bell size={30} />
        {chatConnected && (
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" title="Chat conectado" />
        )}
      </button>
      <button>
        <div style={{ position: 'relative' }}>
        <img
          src={imagen || "https://i.pravatar.cc/300"}
          alt="Perfil"
          className="ml-3 h-9 w-9 cursor-pointer rounded-full border-2 border-[var(--color-primary)] object-cover"
          onClick={() => navigate("/profile")}
        />  

      </div>
      </button>
      
    </nav>
  );
};

export default Navbar;
