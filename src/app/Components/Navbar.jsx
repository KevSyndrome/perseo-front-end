import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Settings, User, HelpCircle, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/branding.css"

const Navbar = ({ sidebarOpen, sidebarCollapsed, onToggleSidebar }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chatConnected, setChatConnected] = useState(false);
  const dropdownRef = useRef(null);

  // Escuchar estado de conexión del chat
  useEffect(() => {
    const handleStorage = () => {
      const status = localStorage.getItem('chat_connected');
      setChatConnected(status === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
      <button style={{Color: "var(--color-negro)"}}className="app-navbar__icon-btn relative">
        <Bell size={30} />
        {chatConnected && (
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" title="Chat conectado" />
        )}
      </button>

      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <img
          src="https://i.pravatar.cc/300"
          alt="Perfil"
          className="app-navbar__avatar"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        
        {dropdownOpen && (
          <button className="app-dropdown">
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
