import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768); 
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-x-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen((p) => !p)}
      />

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300
        ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}
      >
        <Header toggleSidebar={() => setIsSidebarOpen((p) => !p)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
