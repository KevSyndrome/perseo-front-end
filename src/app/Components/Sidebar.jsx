import React from 'react';
import { Home, Settings, LogOut, MessageCircleMoreIcon, FolderKanban, Calendar, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../../styles/branding.css"

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

  return (
    <>
      <aside
        style={{ backgroundColor: "var(--color-primary)" }}
        className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}
      >
        <div className="app-sidebar__header" />

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
                </span>
                <span className="app-sidebar__item-text">{item.label}</span>
                <span className="app-sidebar__item-tooltip">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="app-sidebar__footer">
          <button className="app-sidebar__logout" onClick={() => navigate('/login')}>
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
    </>
  );
};

export default Sidebar;