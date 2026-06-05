import React, { useState, useEffect } from 'react';
import { Home, Settings, LogOut, MessageCircleMoreIcon, FolderKanban, Calendar, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../../styles/branding.css"
import LogoutModal from '../Modals/LogoutModal';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: FolderKanban, label: 'Proyectos', path: '/proyectos' },
  { icon: MessageCircleMoreIcon, label: 'Chat', path: '/mensajes' },
  { icon: Calendar, label: 'Calendario', path: '/calendario' },
  { icon: Settings, label: 'Configuración', path: '/configuration' },
];



const Sidebar = ({ isCollapsed, onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Escuchar cambios en mensajes no leídos
  useEffect(() => {
    const updateUnread = () => {
      const count = parseInt(localStorage.getItem('unread_messages') || '0');
      setUnreadCount(count);
    };
    updateUnread();
    window.addEventListener('storage', updateUnread);
    // También actualizar cada 5 segundos como fallback
    const interval = setInterval(updateUnread, 5000);
    return () => {
      window.removeEventListener('storage', updateUnread);
      clearInterval(interval);
    };
  }, []);

  // Resetear contador al entrar a mensajes
  useEffect(() => {
    if (location.pathname === '/mensajes') {
      localStorage.setItem('unread_messages', '0');
      setUnreadCount(0);
    }
  }, [location.pathname]);

  return (
    <>
      <aside
        style={{ backgroundColor: "var(--color-primary)" }}
        className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}
      >
        <div className="app-sidebar__header" style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 12px" }}>
            <img
            src="/IsotipoPrometeoColoresOscuros.png"
            alt="Logo Prometeo"
            style={{ width: 45, height: 45, objectFit: "contain", flexShrink: 0 }}
          />
          {!isCollapsed && (
            <span style={{ color: "var(--color-blanco)", fontWeight: "bold", fontSize: 25, whiteSpace: "nowrap" }}>
              Prometeo
            </span>
          )}
        </div>

        <nav className="app-sidebar__nav">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                className={`app-sidebar__item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                style={{ color: "var(--color-blanco)" }}
              >
                <span className="app-sidebar__item-icon">
                  <Icon size={22} />
                  {item.label === 'Chat' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </span>
                <span className="app-sidebar__item-text">{item.label}</span>
                <span className="app-sidebar__item-tooltip">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ← Cambiado: ya no navega directo, abre el modal */}
        <div className="app-sidebar__footer">
          <button
            className="app-sidebar__logout"
            onClick={() => setLogoutOpen(true)}
          >
            <span className="app-sidebar__item-icon">
              <LogOut size={22} />
            </span>
            <span className="app-sidebar__logout-text">Cerrar sesion</span>
          </button>
        </div>
      </aside>

      <button
        className={`app-sidebar__hamburger ${isCollapsed ? 'collapsed' : ''}`}
        onClick={onToggleSidebar}
      >
        <Menu size={22} />
      </button>

      {/* ← Agregado: modal fuera del aside para que el overlay cubra toda la pantalla */}
      <LogoutModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
      />
    </>
  );
};

export default Sidebar;