"use client";

import { Search, Bell, Moon, Palette, PanelLeft } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface AdminHeaderProps {
  onMenuClick?: () => void;
  user?: any; // Clerk user prop
}

export default function AdminHeader({ onMenuClick, user }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-3 sm:px-6 py-2.5 sm:py-3 transition-all">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Section: Sidebar Toggle & Search Bar */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-xl">
          {/* Mobile/Desktop Sidebar Toggle Button */}
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Toggle Sidebar"
          >
            <PanelLeft className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>

          {/* Search Bar - Responsive for all screen sizes */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl pl-9 pr-3 sm:pr-12 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
            />
            {/* Keyboard shortcut (Desktop only) */}
            <div className="absolute inset-y-0 right-0 items-center pr-2.5 pointer-events-none hidden md:flex">
              <kbd className="bg-white border border-gray-200 text-gray-400 text-[10px] px-1.5 py-0.5 rounded shadow-2xs font-mono">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Right Section: Actions, Theme, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Pro Badge (Hidden on small screens) */}
          <button className="hidden md:inline-flex text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-xl transition-colors border border-violet-100/80 cursor-pointer">
            Get Pro
          </button>

          {/* Notifications Bell */}
          <button 
            className="w-8 h-8 rounded-xl border border-gray-200/80 flex items-center justify-center text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Theme Toggle (Dark Mode) */}
          <button 
            className="w-8 h-8 rounded-xl border border-gray-200/80 flex items-center justify-center text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            <Moon className="w-4 h-4" />
          </button>

          {/* Palette (Customizer - Hidden on mobile) */}
          <button 
            className="hidden sm:flex w-8 h-8 rounded-xl border border-gray-200/80 items-center justify-center text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-colors cursor-pointer"
            aria-label="Theme Customizer"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Real Clerk UserButton for Profile Management & Logout */}
          <div className="ml-0.5 sm:ml-1 flex items-center">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-xl border border-gray-200/80 shadow-2xs"
                }
              }}
            />
          </div>
          
        </div>

      </div>
    </header>
  );
}