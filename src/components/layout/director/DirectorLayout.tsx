import { Outlet } from "react-router-dom";
import { DirectorSidebar } from "@/pages/director/DirectorSidebar";
import { DirectorHeader } from "@/pages/director/DirectorHeader";
import { useState } from "react";

export const DirectorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <DirectorHeader 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen} 
      />
      <div className="flex">
        <DirectorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
