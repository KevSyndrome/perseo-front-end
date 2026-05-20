import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="app-layout">
      <Navbar 
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      <main className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;