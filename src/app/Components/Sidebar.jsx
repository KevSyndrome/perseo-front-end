import React from 'react';
import { Home, BarChart2, Users, Settings, LogOut, MessageCircleMoreIcon, FolderKanban } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: FolderKanban, label: 'Proyectos', path: '/proyectos' },
  { icon: MessageCircleMoreIcon, label: 'Chat', path: '/mensajes' },
  { icon: Settings, label: 'Calendario', path: '/configuration' },
  { icon: Settings, label: 'Configuración', path: '/configuration' },
];

const Sidebar = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="app-sidebar__header">   
        <div className="app-sidebar__logo-icon">
          <BarChart2 size={24} strokeWidth={2.5} />
        </div>
        <span className="app-sidebar__logo-text" onClick={ '/'}>SOLUTIONS</span>
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
          <span className="app-sidebar__logout-text">Salir</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
