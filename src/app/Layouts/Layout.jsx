import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="flex min-h-screen">
      <Navbar />

      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      <main
        className="flex flex-1 flex-col bg-[var(--bg-main)] p-6 transition-[margin] duration-300 ease-[var(--transition-slow)]"
        style={{
          marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          marginTop: 'var(--navbar-height)',
          minHeight: 'calc(100vh - var(--navbar-height))',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
