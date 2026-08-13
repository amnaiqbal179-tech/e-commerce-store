"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    // 1. Parent div ko fix h-screen aur overflow-hidden kar diya taake poori window ek sath scroll na ho
    <div className="flex h-screen w-full bg-gray-50/50 font-sans relative overflow-hidden">
      
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 2. SIDEBAR CONTAINER: h-full + overflow-y-auto lagaya hai taake sirf sidebar scroll ho */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full overflow-y-auto transition-transform duration-300 ease-in-out shrink-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <AdminSidebar onClose={() => setIsMobileSidebarOpen(false)} />
      </aside>

      {/* 3. MAIN CONTENT AREA: Right side ko alag se h-full overflow-hidden diya hai */}
      <div className="flex-1 flex flex-col h-full min-w-0 w-full overflow-hidden">
        
        {/* Header fixed rahega jab dashboard scroll hoga */}
        <AdminHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />
        
        {/* 4. DASHBOARD CONTENT: Sirf yeh area aap ka upward & downward scroll hoga */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
}