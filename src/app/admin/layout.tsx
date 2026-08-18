import type { Metadata } from "next";
import "@/app/globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Admin Dashboard - SHOP.CO",
  description: "Admin panel for managing store orders and products",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // 1. Agar user login nahi hai, toh admin page par hi Clerk ka Login form dikhayein
  if (!userId) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Admin Portal Login</h2>
          <p className="text-sm text-gray-500">Baraye meharbani apne admin account se sign in karein</p>
        </div>
        <SignIn routing="hash" />
      </div>
    );
  }

  // 2. User login hai, ab check karein ke kya woh admin hai ya nahi
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = (user.publicMetadata as { role?: string })?.role;

  // 3. Agar user login hai lekin uska role "admin" nahi hai
  if (role !== "admin") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 text-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            Aapka yeh account regular customer account hai. Isay admin access ki ijazat nahi hai.
          </p>
          <p className="text-xs text-gray-400">
            (Apne Clerk dashboard se is email par role "admin" set karein ya admin account se login karein)
          </p>
        </div>
      </div>
    );
  }

  // 4. Agar sab theek hai (User is Admin), toh dashboard open kar dein
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 text-black">
      {/* Sidebar Container (print:hidden added) */}
      <div className="w-64 flex-shrink-0 h-full print:hidden">
        <AdminSidebar />
      </div>

      {/* Right Column: Header + Scrollable Content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header Container (print:hidden added) */}
        <div className="h-16 flex-shrink-0 print:hidden">
          <AdminHeader />
        </div>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}