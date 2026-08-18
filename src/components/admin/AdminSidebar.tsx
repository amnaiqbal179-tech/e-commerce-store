"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CreditCard, 
  Boxes, 
  Layers, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  Settings, 
  Tag, 
  Lock, 
  Bell, 
  AlertCircle, 
  LayoutGrid, 
  X
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface AdminSidebarProps {
  onClose?: () => void;
  user?: any; // Clerk user prop
}

export default function AdminSidebar({ onClose, user }: AdminSidebarProps) {
  const pathname = usePathname();

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    dashboards: true,
    ecommerce: true,
    payment: true,
    apps: false,
    aiApps: false,
    pages: false,
    others: false,
  });

  const toggleMenu = (menuKey: string) => {
    setOpenMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  // Helper function to check if a link is active
  const isActive = (path: string) => pathname === path;

  // Dynamic styling for links
  const getLinkClass = (path: string, customPadding = "px-2.5 py-1.5") => {
    const active = isActive(path);
    return `block ${customPadding} rounded-lg transition-colors ${
      active
        ? "bg-gray-100/90 font-semibold text-gray-900 shadow-2xs"
        : "hover:bg-gray-100/70 text-gray-600 hover:text-gray-900"
    }`;
  };

  const getAiLinkClass = (path: string) => {
    const active = isActive(path);
    return `block px-3 py-1.5 rounded-lg transition-colors ${
      active
        ? "bg-purple-100/70 font-semibold text-purple-900"
        : "hover:bg-purple-50/60 text-gray-600 hover:text-purple-900"
    }`;
  };

  // User details fallback for text display next to UserButton
  const userName = user?.fullName || user?.firstName || "Admin User";
  const userEmail = user?.primaryEmailAddress?.emailAddress || "admin@shop.co";

  return (
    <aside className="w-64 sm:w-72 lg:w-64 bg-white border-r border-gray-200/80 flex flex-col h-full lg:h-screen font-sans select-none shadow-xl lg:shadow-none">
      
      {/* Brand Header */}
      <div className="p-4 border-b border-gray-200/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs">
            Z
          </div>
          <div>
            <span className="font-bold text-sm text-gray-900 tracking-tight block leading-none">
              Shadcn UI Kit
            </span>
            <span className="text-[10px] text-gray-400 font-medium">Enterprise Admin</span>
          </div>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg lg:hidden transition-colors cursor-pointer"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links with Custom Scrollbar */}
      <div className="flex-1 px-3 py-4 space-y-1 text-xs text-gray-700 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        
        {/* Dashboards Section */}
        <div>
          <button 
            onClick={() => toggleMenu("dashboards")}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium hover:bg-gray-100/70 text-gray-900 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-900">Dashboards</span>
            </span>
            {openMenus.dashboards ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>

          {openMenus.dashboards && (
            <div className="pl-6 space-y-0.5 mt-1 border-l border-gray-200/60 ml-4">
              <Link href="/admin/classic" onClick={handleNavClick} className={getLinkClass("/admin/classic", "px-3 py-1.5")}>
                Classic Dashboard
              </Link>

              {/* E-commerce Sub-dropdown */}
              <div>
                <button 
                  onClick={() => toggleMenu("ecommerce")}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-gray-100/70 text-gray-800 font-medium transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-3.5 h-3.5 text-gray-500" /> E-commerce
                  </span>
                  {openMenus.ecommerce ? (
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                </button>

                {openMenus.ecommerce && (
                  <div className="pl-4 space-y-0.5 mt-0.5 border-l border-gray-200/60 ml-3">
                    <Link href="/admin" onClick={handleNavClick} className={getLinkClass("/admin")}>
                      Dashboard
                    </Link>
                    <Link href="/admin/products" onClick={handleNavClick} className={getLinkClass("/admin/products")}>
                      Product List
                    </Link>
                    <Link href="/admin/products/detail" onClick={handleNavClick} className={getLinkClass("/admin/products/detail")}>
                      Product Detail
                    </Link>
                    <Link href="/admin/products/add" onClick={handleNavClick} className={getLinkClass("/admin/products/add")}>
                      Add Product
                    </Link>
                    <Link href="/admin/orders" onClick={handleNavClick} className={getLinkClass("/admin/orders")}>
                      Order List
                    </Link>
                    <Link href="/admin/orders/detail" onClick={handleNavClick} className={getLinkClass("/admin/orders/detail")}>
                      Order Detail
                    </Link>
                  </div>
                )}
              </div>

              {/* Payment Dashboard Sub-dropdown */}
              <div>
                <button 
                  onClick={() => toggleMenu("payment")}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-gray-100/70 text-gray-800 font-medium transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-gray-500" /> Payment
                  </span>
                  {openMenus.payment ? (
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                </button>

                {openMenus.payment && (
                  <div className="pl-4 space-y-0.5 mt-0.5 border-l border-gray-200/60 ml-3">
                    <Link href="/admin/payment" onClick={handleNavClick} className={getLinkClass("/admin/payment")}>
                      Dashboard
                    </Link>
                    <Link href="/admin/payment/transactions" onClick={handleNavClick} className={getLinkClass("/admin/payment/transactions")}>
                      Transactions
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/admin/hotel" onClick={handleNavClick} className={getLinkClass("/admin/hotel", "px-3 py-1.5")}>
                Hotel Dashboard
              </Link>
              <Link href="/admin/projects" onClick={handleNavClick} className={getLinkClass("/admin/projects", "px-3 py-1.5")}>
                Project Management
              </Link>
              <Link href="/admin/sales" onClick={handleNavClick} className={getLinkClass("/admin/sales", "px-3 py-1.5")}>
                Sales
              </Link>
              
              <div className={`flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors ${isActive("/admin/hr") ? "bg-gray-100/90 font-semibold text-gray-900 shadow-2xs" : "hover:bg-gray-100/70 text-gray-600 hover:text-gray-900"}`}>
                <Link href="/admin/hr" onClick={handleNavClick} className="w-full">HR System</Link>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-semibold px-1.5 py-0.5 rounded-md border border-emerald-100">New</span>
              </div>
            </div>
          )}
        </div>

        {/* Apps Section */}
        <div>
          <button 
            onClick={() => toggleMenu("apps")}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium hover:bg-gray-100/70 text-gray-900 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <Boxes className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-900">Apps</span>
            </span>
            {openMenus.apps ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>

          {openMenus.apps && (
            <div className="pl-6 space-y-0.5 mt-1 border-l border-gray-200/60 ml-4">
              <Link href="/apps/kanban" onClick={handleNavClick} className={getLinkClass("/apps/kanban", "px-3 py-1.5")}>
                Kanban
              </Link>
              <Link href="/apps/chats" onClick={handleNavClick} className={`flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors ${isActive("/apps/chats") ? "bg-gray-100/90 font-semibold text-gray-900 shadow-2xs" : "hover:bg-gray-100/70 text-gray-600 hover:text-gray-900"}`}>
                <span>Chats</span>
                <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded-full">5</span>
              </Link>
              <Link href="/apps/mail" onClick={handleNavClick} className={getLinkClass("/apps/mail", "px-3 py-1.5")}>
                Mail Box
              </Link>
              <Link href="/apps/calendar" onClick={handleNavClick} className={getLinkClass("/apps/calendar", "px-3 py-1.5")}>
                Calendar
              </Link>
            </div>
          )}
        </div>

        {/* AI Apps Section */}
        <div>
          <button 
            onClick={() => toggleMenu("aiApps")}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium hover:bg-purple-50/50 text-gray-900 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-gray-900">AI Applications</span>
            </span>
            {openMenus.aiApps ? (
              <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            )}
          </button>

          {openMenus.aiApps && (
            <div className="pl-6 space-y-0.5 mt-1 border-l border-purple-100 ml-4">
              <Link href="/ai/chat" onClick={handleNavClick} className={getAiLinkClass("/ai/chat")}>
                AI Assistant Chat
              </Link>
              <Link href="/ai/image-generator" onClick={handleNavClick} className={getAiLinkClass("/ai/image-generator")}>
                Image Generator
              </Link>
            </div>
          )}
        </div>

        {/* Pages Section */}
        <div>
          <button 
            onClick={() => toggleMenu("pages")}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium hover:bg-gray-100/70 text-gray-900 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-900">Pages</span>
            </span>
            {openMenus.pages ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>

          {openMenus.pages && (
            <div className="pl-6 space-y-0.5 mt-1 border-l border-gray-200/60 ml-4">
              <Link href="/pages/users" onClick={handleNavClick} className={getLinkClass("/pages/users", "px-3 py-1.5")}>
                Users List
              </Link>
              <Link href="/pages/profile-v1" onClick={handleNavClick} className={getLinkClass("/pages/profile-v1", "px-3 py-1.5")}>
                User Profile
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links Section */}
        <div className="pt-3 space-y-0.5 border-t border-gray-100 mt-2">
          <Link href="/settings" onClick={handleNavClick} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors ${isActive("/settings") ? "bg-gray-100/90 font-semibold text-gray-900 shadow-2xs" : "hover:bg-gray-100/70 text-gray-700 hover:text-gray-900"}`}>
            <Settings className="w-4 h-4 text-gray-500" /> Settings
          </Link>
          <Link href="/pricing" onClick={handleNavClick} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors ${isActive("/pricing") ? "bg-gray-100/90 font-semibold text-gray-900 shadow-2xs" : "hover:bg-gray-100/70 text-gray-700 hover:text-gray-900"}`}>
            <Tag className="w-4 h-4 text-gray-500" /> Pricing
          </Link>
          <Link href="/authentication" onClick={handleNavClick} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors ${isActive("/authentication") ? "bg-gray-100/90 font-semibold text-gray-900 shadow-2xs" : "hover:bg-gray-100/70 text-gray-700 hover:text-gray-900"}`}>
            <Lock className="w-4 h-4 text-gray-500" /> Authentication
          </Link>
          <Link href="/notifications" onClick={handleNavClick} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors ${isActive("/notifications") ? "bg-gray-100/90 font-semibold text-gray-900 shadow-2xs" : "hover:bg-gray-100/70 text-gray-700 hover:text-gray-900"}`}>
            <Bell className="w-4 h-4 text-gray-500" /> Notifications
          </Link>
          <Link href="/error" onClick={handleNavClick} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors ${isActive("/error") ? "bg-gray-100/90 font-semibold text-gray-900 shadow-2xs" : "hover:bg-gray-100/70 text-gray-700 hover:text-gray-900"}`}>
            <AlertCircle className="w-4 h-4 text-gray-500" /> Error Pages
          </Link>
        </div>

        {/* Others Section */}
        <div className="pt-2">
          <button 
            onClick={() => toggleMenu("others")}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium hover:bg-gray-100/70 text-gray-900 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <LayoutGrid className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-900">Others</span>
            </span>
            {openMenus.others ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>

          {openMenus.others && (
            <div className="pl-6 space-y-0.5 mt-1 border-l border-gray-200/60 ml-4">
              <Link href="/widgets" onClick={handleNavClick} className={getLinkClass("/widgets", "px-3 py-1.5")}>
                Widgets
              </Link>
              <Link href="/components" onClick={handleNavClick} className={getLinkClass("/components", "px-3 py-1.5")}>
                UI Components
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Unlock Everything Promo Card */}
      <div className="p-4 mx-3 my-2 bg-white rounded-2xl border border-gray-100 text-xs space-y-2 shadow-2xs shrink-0">
        <p className="font-bold text-gray-900 tracking-tight">Unlock Everything</p>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Get instant access to all premium dashboards, templates, and UI components. Pay once, use forever in unlimited projects.
        </p>
        <button className="w-full bg-black text-white font-semibold py-2 rounded-xl text-xs hover:bg-gray-800 transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer mt-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          Get Full Access
        </button>
      </div>

      {/* User Profile Footer with Clerk UserButton */}
      <div className="p-3 border-t border-gray-200/80 flex items-center justify-between bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="shrink-0">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-xl border border-gray-200/80 shadow-2xs"
                }
              }}
            />
          </div>
          <div className="overflow-hidden leading-tight">
            <p className="text-xs font-bold text-gray-900 truncate">{userName}</p>
            <p className="text-[10px] text-gray-500 truncate mt-0.5">{userEmail}</p>
          </div>
        </div>
      </div>

    </aside>
  );
}