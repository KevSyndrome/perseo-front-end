import React, { useState, useEffect } from 'react';
import { Home, Settings, LogOut, MessageCircleMoreIcon, FolderKanban, Calendar, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutModal from '../Modals/LogoutModal';
import { usePermisosStore, tieneModulo } from './PermisosStore';
import { useNotificacionesStore, totalNoLeidos } from './NotificacionesStore';

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
  const { permisos, cargar } = usePermisosStore();
  const { noLeidos, conectar } = useNotificacionesStore();
  const unreadCount = totalNoLeidos(noLeidos);

  useEffect(() => { cargar(); }, [cargar]);
  // Canal de avisos del chat: una conexión mientras haya sesión
  useEffect(() => { conectar(); }, [conectar]);

  // Configuración solo si el cargo tiene algo de usuarios o configuracion
  const items = menuItems.filter((item) =>
    item.path !== '/configuration' || tieneModulo(permisos, 'usuarios') || tieneModulo(permisos, 'configuracion')
  );

  return (
    <>
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[110] flex flex-col overflow-hidden border-r border-[var(--border-color)] bg-[var(--color-primary)] p-4 shadow-[var(--shadow-lg)] transition-[width,transform] duration-300 ease-[var(--transition-slow)] ${
          isCollapsed
            ? '-translate-x-full md:w-[var(--sidebar-collapsed)] md:translate-x-0'
            : 'w-[var(--sidebar-width)] translate-x-0'
        }`}
      >
        <div
          className="flex items-center gap-2.5 px-3 py-2"
          style={{ height: 'var(--navbar-height)' }}
        >
          <img
            src="/IsotipoPrometeoColoresOscuros.png"
            alt="Logo Prometeo"
            className="h-11 w-11 object-contain shrink-0"
          />
          {!isCollapsed && (
            <span className="whitespace-nowrap text-2xl font-bold text-[var(--color-blanco)]">
              Prometeo
            </span>
          )}
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            // También activo en subrutas: /mensajes/:salaId, /proyectos/:slug
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  // En móvil el menú tapa la pantalla: se cierra al elegir una opción
                  if (!isCollapsed && window.innerWidth < 768) onToggleSidebar();
                }}
                className={`group relative flex w-full items-center gap-3.5 rounded-xl border-none bg-transparent px-3 py-3 text-left text-[0.9375rem] font-medium text-[var(--color-blanco)] transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white/15 font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                <span className="relative flex h-[22px] w-[22px] shrink-0 items-center justify-center transition-transform duration-150 group-hover:scale-110">
                  <Icon size={22} />
                  {item.label === 'Chat' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </span>
                <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : ''}`}>
                  {item.label}
                </span>
                {isCollapsed && (
                  <span className="pointer-events-none absolute left-[calc(100%+12px)] z-[100] whitespace-nowrap rounded-md bg-[var(--color-secondary)] px-3 py-2 text-sm font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/20 pt-4">
          <button
            onClick={() => setLogoutOpen(true)}
            className="group flex w-full items-center gap-3.5 rounded-xl border-none bg-transparent px-3 py-3 text-left text-[0.9375rem] font-medium text-[var(--color-blanco)]/70 transition-all duration-150 cursor-pointer whitespace-nowrap hover:bg-white/10 hover:text-[var(--color-blanco)]"
          >
            <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center">
              <LogOut size={22} />
            </span>
            <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : ''}`}>
              Cerrar sesion
            </span>
          </button>
        </div>
      </aside>

      <button
        onClick={onToggleSidebar}
        className={`fixed top-4 z-[120] flex items-center justify-center rounded-r-lg bg-white p-2 text-[var(--text-primary)] shadow-[var(--shadow-md)] transition-[left] duration-300 ease-[var(--transition-slow)] cursor-pointer ${
          isCollapsed ? 'left-0 md:left-[var(--sidebar-collapsed)]' : 'left-[var(--sidebar-width)]'
        }`}
      >
        <Menu size={22} />
      </button>

      <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  );
};

export default Sidebar;
