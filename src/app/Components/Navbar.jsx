import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Settings, User, HelpCircle, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ sidebarOpen, sidebarCollapsed, onToggleSidebar }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className={`app-navbar ${sidebarOpen ? 'sidebar-open' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <button className="app-navbar__toggle-btn" onClick={onToggleSidebar}>
        <Menu size={22} />
      </button>

      <div className="app-navbar__icon-placeholder" />

      <div className="app-navbar__spacer" />

      <div className="app-navbar__search">
        <Search size={18} color="var(--text-muted)" />
        <input type="text" placeholder="Buscar..." />
      </div>

      <button className="app-navbar__icon-btn">
        <Bell size={22} />
      </button>

      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <img
          src="https://i.pravatar.cc/300"
          alt="Perfil"
          className="app-navbar__avatar"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        
        {dropdownOpen && (
          <div className="app-dropdown">
            <div className="app-dropdown__header">user</div>
            <div className="app-dropdown__divider" />
            <button className="app-dropdown__item" onClick={() => { setDropdownOpen(false); navigate("/profile"); }}>
              <User size={18} />
              Perfil
            </button>
            <button className="app-dropdown__item" onClick={() => { setDropdownOpen(false); navigate("/configuration"); }}>
              <Settings size={18} />
              Configuración
            </button>
            <button className="app-dropdown__item" onClick={() => setDropdownOpen(false)}>
              <HelpCircle size={18} />
              Ayuda
            </button>
            <div className="app-dropdown__divider" />
            <button className="app-dropdown__item" onClick={handleLogout}>
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
