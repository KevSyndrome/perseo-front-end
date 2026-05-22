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
          <button className="app-dropdown">
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
