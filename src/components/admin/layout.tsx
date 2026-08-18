import type { Metadata } from "next";
import "@/app/globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Admin Dashboard - SHOP.CO",
  description: "Admin panel for managing store orders and products",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Clerk se logged-in user ki details fetch kar rahe hain
  const user = await currentUser();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-black">
      {/* Sidebar: Sticky on the left, won't scroll */}
      <div className="sticky top-0 h-screen flex-shrink-0">
        <AdminSidebar user={user} />
      </div>

      {/* Right side wrapper: Header + Scrollable Main Content */}
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        
        {/* Header (Top) */}
        <AdminHeader user={user} />

        {/* Main Content Area (Only this area will scroll vertically) */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
        
      </div>
    </div>
  );
}