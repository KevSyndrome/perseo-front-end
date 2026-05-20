import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Settings, User, HelpCircle, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/branding.css"

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
    <nav elevation={0} style={{backgroundColor: "var(--color-blanco)"}} className={`app-navbar ${sidebarOpen ? 'sidebar-open' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      



      <div className="app-navbar__spacer" />

     

      <button style={{Color: "var(--color-negro)"}}className="app-navbar__icon-btn">
        <Bell size={30} />
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
              <User size={25} />
              Perfil
            </button>
            <button className="app-dropdown__item" onClick={() => { setDropdownOpen(false); navigate("/configuration"); }}>
              <Settings size={25} />
              Configuración
            </button>
            <button className="app-dropdown__item" onClick={() => setDropdownOpen(false)}>
              <HelpCircle size={25} />
              Ayuda
            </button>
            <div className="app-dropdown__divider" />
            <button className="app-dropdown__item" onClick={handleLogout}>
              <LogOut size={25} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
