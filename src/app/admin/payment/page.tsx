"use client";

import React, { useState, useEffect } from "react";
import { ArrowRightLeft, Info, X, ChevronRight, RefreshCw, Loader2 } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from "recharts";

// Exact wave curve data matching shadcn UI kit
const exchangeData = [
  { date: "Jun 26", value: 35 },
  { date: "Jun 27", value: 85 },
  { date: "Jun 28", value: 85 },
  { date: "Jun 29", value: 15 },
  { date: "Jun 30", value: 75 },
];

// Fallback default data agar database abhi khali ho
const defaultBalances = [
  { currency: "USD", amount: 1240.30 },
  { currency: "EUR", amount: 500.00 },
  { currency: "GBP", amount: 0.00 },
];

const defaultTransactions = [
  { id: "1", date: "16 Aug 2025", title: "Withdrawal to JP Morgan Chase (0440)", status: "Completed", amount: "-1,275.79 USD" },
  { id: "2", date: "5 Aug 2025", title: "Withdrawal to Citibank (2290)", status: "Completed", amount: "-202.99 USD" },
  { id: "3", date: "5 Aug 2025", title: "Withdrawal to Bank of America (3311)", status: "Completed", amount: "-1,272.30 USD" },
  { id: "4", date: "4 Aug 2025", title: "Payment from Paddle", status: "Completed", amount: "+5,651.56 USD" },
  { id: "5", date: "22 Aug 2025", title: "Scheduled Payout - Stripe", status: "Pending", amount: "+2,345.75 USD" },
  { id: "6", date: "25 Aug 2025", title: "Scheduled Payout - PayPal", status: "Pending", amount: "+850.00 USD" },
];

export default function PaymentDashboardPage() {
  const [activeTab, setActiveTab] = useState<"latest" | "upcoming">("latest");
  const [showAlert, setShowAlert] = useState(true);
  
  // Backend data states
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Backend API se data fetch karna
  useEffect(() => {
    async function fetchPaymentData() {
      try {
        const res = await fetch("/api/admin/payment");
        const json = await res.json();
        if (res.ok) {
          setBalances(json.balances || []);
          setTransactions(json.transactions || []);
        }
      } catch (error) {
        console.error("Failed to fetch payment data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPaymentData();
  }, []);

  // Use database data if available, otherwise use defaults
  const finalBalances = balances.length > 0 ? balances : defaultBalances;
  const finalTransactions = transactions.length > 0 ? transactions : defaultTransactions;

  // Find individual currency amounts
  const getBalanceAmount = (curr: string) => {
    const item = finalBalances.find((b) => b.currency.toUpperCase() === curr);
    return item ? item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
  };

  // Calculate total funds across all balances
  const totalFundsNum = finalBalances.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const formattedTotal = totalFundsNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Separate latest (Completed) and upcoming (Pending) transactions
  const latestList = finalTransactions.filter((tx) => tx.status !== "Pending");
  const upcomingList = finalTransactions.filter((tx) => tx.status === "Pending");
  const currentList = activeTab === "latest" ? latestList : upcomingList;

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-[#fbfbfb]">
        <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-black" />
          Loading payment dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 bg-[#fbfbfb] min-h-screen font-sans text-gray-900">
      
      {/* Page Header */}
      <div className="mb-3">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Balances</h1>
        <p className="text-gray-500 text-[11px] mt-0.5">
          Total funds in all balances: <span className="font-semibold text-gray-800">{formattedTotal} USD</span>
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Yellow Alert Banner */}
            {showAlert && (
              <div className="flex items-center justify-between bg-[#fffdeb] border border-[#fef08a] text-amber-900 px-4 py-2.5 rounded-xl shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full border border-amber-500/80 flex items-center justify-center text-amber-700 shrink-0">
                    <Info className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-medium text-gray-800">
                    You have information to submit in verification center
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="bg-black text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer">
                    Submit Now
                  </button>
                  <button 
                    onClick={() => setShowAlert(false)}
                    className="text-gray-400 hover:text-gray-700 transition-colors p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 3 Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-2xs hover:border-gray-200 transition-all">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-gray-400">US</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{getBalanceAmount("USD")}</h3>
                    <span className="text-[11px] font-semibold text-gray-500">USD</span>
                  </div>
                </div>
                <div className="w-6 h-6 bg-gray-50/80 rounded-full flex items-center justify-center text-gray-400 border border-gray-100 shrink-0">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-2xs hover:border-gray-200 transition-all">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-gray-400">EU</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{getBalanceAmount("EUR")}</h3>
                    <span className="text-[11px] font-semibold text-gray-500">EUR</span>
                  </div>
                </div>
                <div className="w-6 h-6 bg-gray-50/80 rounded-full flex items-center justify-center text-gray-400 border border-gray-100 shrink-0">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-2xs hover:border-gray-200 transition-all">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-gray-400">GB</span>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                    {getBalanceAmount("GBP")} <span className="text-[11px] font-semibold text-gray-500">GBP</span>
                  </h3>
                </div>
                <div className="w-6 h-6 bg-gray-50/80 rounded-full flex items-center justify-center text-gray-400 border border-gray-100 shrink-0">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="font-bold text-xs text-gray-900">Transactions</h2>
                  <p className="text-[10px] text-gray-400 mt-0.5">Updated every several minutes</p>
                </div>
                <button className="bg-gray-100/80 hover:bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-xl transition-colors flex items-center gap-1 cursor-pointer">
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex gap-5 border-b border-gray-100 mb-3">
                <button 
                  onClick={() => setActiveTab("latest")}
                  className={`pb-2 text-xs font-semibold transition-colors cursor-pointer relative ${
                    activeTab === "latest" ? "text-black border-b-2 border-black -mb-[1px]" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Latest
                </button>
                <button 
                  onClick={() => setActiveTab("upcoming")}
                  className={`pb-2 text-xs font-semibold transition-colors cursor-pointer relative ${
                    activeTab === "upcoming" ? "text-black border-b-2 border-black -mb-[1px]" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Upcoming
                </button>
              </div>

              <div className="space-y-2">
                {currentList.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No transactions found.</p>
                ) : (
                  currentList.map((tx: any, idx: number) => {
                    const isDeposit = tx.amount?.toString().startsWith("+");
                    return (
                      <div 
                        key={tx.id || idx} 
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-6">
                          <span className="text-[11px] font-medium text-gray-400 w-20 shrink-0">{tx.date}</span>
                          <div>
                            <p className="font-semibold text-xs text-gray-900">{tx.title}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{tx.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`font-semibold text-xs ${isDeposit ? "text-emerald-600" : "text-rose-500"}`}>
                            {tx.amount}
                          </span>
                          <div className="p-1 border border-gray-200/80 rounded-lg text-gray-400">
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - Exchange Rates & Chart */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col justify-between h-full">
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xs text-gray-900">Exchange rates</h2>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                <span>Last updated: 11:08 AM</span>
                <RefreshCw className="w-3 h-3 cursor-pointer hover:rotate-180 transition-transform duration-300" />
              </div>
            </div>
            
            {/* Dropdowns */}
            <div className="flex items-center gap-2 mb-4">
              <select className="bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold text-gray-800 w-full focus:outline-none cursor-pointer">
                <option>EU EUR</option>
              </select>
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 shrink-0">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>
              <select className="bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold text-gray-800 w-full focus:outline-none cursor-pointer">
                <option>us USD</option>
              </select>
            </div>

            {/* Timeframe Badges */}
            <div className="flex justify-between bg-gray-100/60 p-1 rounded-xl mb-6 text-[10px] font-semibold text-gray-500">
              <button className="px-2.5 py-1 rounded-lg hover:text-black transition-all cursor-pointer">1D</button>
              <button className="px-2.5 py-1 rounded-lg bg-black text-white shadow-2xs cursor-pointer">7D</button>
              <button className="px-2.5 py-1 rounded-lg hover:text-black transition-all cursor-pointer">30D</button>
              <button className="px-2.5 py-1 rounded-lg hover:text-black transition-all cursor-pointer">90D</button>
              <button className="px-2.5 py-1 rounded-lg hover:text-black transition-all cursor-pointer">1Y</button>
            </div>

            {/* Graph */}
            <div className="h-56 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={exchangeData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.04}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis hide domain={[0, 100]} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#000000" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorWave)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <button className="w-full bg-black text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer shadow-2xs">
              Convert Currencies
            </button>
            
            <button className="w-full border border-gray-200/80 bg-white text-gray-800 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-1 h-2 bg-blue-500 rounded-2xs"></span>
                <span className="w-1 h-3 bg-amber-400 rounded-2xs"></span>
                <span className="w-1 h-2.5 bg-emerald-500 rounded-2xs"></span>
              </div>
              Rate Alerts
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}