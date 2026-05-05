import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="app-layout">
      <Navbar 
        sidebarOpen={sidebarOpen && !sidebarCollapsed} 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      
      <Sidebar 
        isCollapsed={sidebarCollapsed}
      />

      <main className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
