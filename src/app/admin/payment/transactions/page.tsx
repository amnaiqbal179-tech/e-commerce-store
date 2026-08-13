"use client";

import { useState } from "react";
import { Calendar, Download, ChevronRight } from "lucide-react";

// Exact Transactions Data from Screenshot
const transactionsData = [
  {
    id: 1,
    date: "16 Aug 2025",
    title: "Withdrawal to JP Morgan Chase (0440)",
    status: "Completed",
    amount: "-1,275.79 USD",
    type: "withdrawal",
  },
  {
    id: 2,
    date: "5 Aug 2025",
    title: "Withdrawal to Citibank (2290)",
    status: "Completed",
    amount: "-202.99 USD",
    type: "withdrawal",
  },
  {
    id: 3,
    date: "5 Aug 2025",
    title: "Withdrawal to Bank of America (3311)",
    status: "Completed",
    amount: "-1,272.30 USD",
    type: "withdrawal",
  },
  {
    id: 4,
    date: "4 Aug 2025",
    title: "Payment from Paddle",
    status: "Completed",
    amount: "+5,651.56 USD",
    type: "payment",
  },
  {
    id: 5,
    date: "4 Aug 2025",
    title: "Withdrawal to HSBC (5522)",
    status: "Completed",
    amount: "-1,679.35 USD",
    type: "withdrawal",
  },
  {
    id: 6,
    date: "20 Aug 2025",
    title: "Withdrawal to JP Morgan Chase (1133)",
    status: "Completed",
    amount: "-3,420.00 USD",
    type: "withdrawal",
  },
  {
    id: 7,
    date: "18 Aug 2025",
    title: "Payment from Stripe",
    status: "Completed",
    amount: "+2,345.75 USD",
    type: "payment",
  },
];

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("Latest");

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-screen font-sans text-gray-800">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Transactions</h1>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2">
          {/* Date Picker Button */}
          <button className="bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 shadow-2xs transition-colors cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span>17 Jul 2026 - 13 Aug 2026</span>
          </button>

          {/* Download Button */}
          <button className="bg-black hover:bg-gray-800 text-white p-2.5 rounded-xl shadow-2xs transition-colors cursor-pointer">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= TABS NAVIGATION ================= */}
      <div className="flex items-center gap-1">
        <div className="bg-gray-100/70 p-1 rounded-xl flex items-center gap-1">
          <button
            onClick={() => setActiveTab("Latest")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "Latest"
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setActiveTab("Upcoming")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "Upcoming"
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* ================= TRANSACTIONS LIST CARD ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden divide-y divide-gray-100">
        {transactionsData.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
          >
            {/* Left: Date */}
            <div className="w-28 sm:w-36 text-xs font-semibold text-gray-800 shrink-0">
              {item.date}
            </div>

            {/* Middle: Title & Status */}
            <div className="flex-1 px-2 sm:px-4">
              <p className="text-xs font-medium text-gray-900 leading-snug">
                {item.title}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 font-normal">
                {item.status}
              </p>
            </div>

            {/* Right: Amount & Chevron */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <span
                className={`text-xs font-semibold ${
                  item.type === "payment"
                    ? "text-emerald-600"
                    : "text-rose-500"
                }`}
              >
                {item.amount}
              </span>

              <button className="p-1.5 border border-gray-200/80 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}