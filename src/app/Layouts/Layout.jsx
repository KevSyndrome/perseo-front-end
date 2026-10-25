import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const Layout = ({ children }) => {
  // < 1024px (tablet y móvil) arranca colapsado; en móvil "colapsado" = oculto
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth < 1024);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    // --contenido-left: dónde empieza el contenido (0 en móvil; ancho del sidebar desde md).
    // Lo usan las pantallas fixed a pantalla completa, como el chat.
    <div className={`flex min-h-screen [--contenido-left:0px] ${
      sidebarCollapsed ? 'md:[--contenido-left:var(--sidebar-collapsed)]' : 'md:[--contenido-left:var(--sidebar-width)]'
    }`}>
      <Navbar />

      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Móvil con el menú abierto: fondo para cerrarlo */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 z-[105] bg-black/40 md:hidden" onClick={handleToggleSidebar} />
      )}

      <main
        className={`flex min-w-0 flex-1 flex-col bg-[var(--bg-main)] p-3 transition-[margin] duration-300 ease-[var(--transition-slow)] sm:p-6 ${
          sidebarCollapsed ? 'md:ml-[var(--sidebar-collapsed)]' : 'md:ml-[var(--sidebar-width)]'
        }`}
        style={{
          marginTop: 'var(--navbar-height)',
          minHeight: 'calc(100dvh - var(--navbar-height))',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
