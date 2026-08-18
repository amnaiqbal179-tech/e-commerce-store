"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gray-800 transition shadow-sm cursor-pointer"
    >
      <Printer size={16} />
      <span>Download / Print Invoice</span>
    </button>
  );
}