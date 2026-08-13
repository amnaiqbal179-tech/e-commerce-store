"use client";

import React, { useState, useMemo } from "react";
import { 
  TrendingUp, 
  Download, 
  ArrowUpRight,
  Star,
  ChevronRight,
  ArrowUpDown,
  MoreHorizontal,
  ChevronLeft
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from "recharts";

// --- Mock Data ---

const revenueData = [
  { month: "Jan", desktop: 18000, mobile: 21000 },
  { month: "Feb", desktop: 24000, mobile: 22000 },
  { month: "Mar", desktop: 28000, mobile: 26000 },
  { month: "Apr", desktop: 16000, mobile: 19000 },
  { month: "May", desktop: 22000, mobile: 25000 },
  { month: "Jun", desktop: 30000, mobile: 27000 },
];

const returningRateData = [
  { month: "Mar", desktop: 12000, mobile: 6000 },
  { month: "Apr", desktop: 22000, mobile: 11000 },
  { month: "May", desktop: 16000, mobile: 8000 },
  { month: "Jun", desktop: 28000, mobile: 14000 },
  { month: "Jul", desktop: 20000, mobile: 10000 },
  { month: "Aug", desktop: 34000, mobile: 17000 },
  { month: "Oct", desktop: 22000, mobile: 11000 },
  { month: "Dec", desktop: 48000, mobile: 24000 },
];

const locationData = [
  { country: "Canada", change: "+5.2%", positive: true, percent: 85 },
  { country: "Greenland", change: "+7.8%", positive: true, percent: 80 },
  { country: "Russia", change: "-2.1%", positive: false, percent: 63 },
  { country: "China", change: "+3.4%", positive: true, percent: 60 },
  { country: "Australia", change: "+1.2%", positive: true, percent: 45 },
  { country: "Greece", change: "+1%", positive: true, percent: 40 },
];

const ratingBreakdown = [
  { stars: 5, count: "4000", percent: 80, color: "bg-emerald-500" },
  { stars: 4, count: "2100", percent: 45, color: "bg-lime-500" },
  { stars: 3, count: "800", percent: 20, color: "bg-amber-400" },
  { stars: 2, count: "631", percent: 12, color: "bg-orange-500" },
  { stars: 1, count: "344", percent: 7, color: "bg-rose-500" },
];

// Initial Data for Recent Orders
const initialOrders = [
  { id: "#1023", customer: "Theodore Bell", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop", product: "Tire Doodad", amount: 300.00, status: "Processing" },
  { id: "#2045", customer: "Amelia Grant", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", product: "Engine Kit", amount: 450.00, status: "Paid" },
  { id: "#3067", customer: "Eleanor Ward", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop", product: "Brake Pad", amount: 200.00, status: "Success" },
  { id: "#4089", customer: "Henry Carter", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", product: "Fuel Pump", amount: 500.00, status: "Processing" },
  { id: "#5102", customer: "Olivia Harris", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop", product: "Steering Wheel", amount: 350.00, status: "Failed" },
  { id: "#6123", customer: "James Robinson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop", product: "Air Filter", amount: 180.00, status: "Paid" },
  { id: "#7145", customer: "Sophia Martinez", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop", product: "Oil Filter", amount: 220.00, status: "Success" },
  { id: "#8167", customer: "Liam Thompson", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&h=80&fit=crop", product: "Radiator Cap", amount: 290.00, status: "Processing" },
  { id: "#9188", customer: "Emma Watson", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop", product: "Spark Plug", amount: 120.00, status: "Success" },
  { id: "#9231", customer: "Noah Davis", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop", product: "Brake Fluid", amount: 90.00, status: "Paid" },
];

// Initial Data for Best Selling Products
const initialProducts = [
  { id: 1, name: "Sports Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop", price: 316.00, sold: 10 },
  { id: 2, name: "Black T-Shirt", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80&h=80&fit=crop", price: 274.00, sold: 20 },
  { id: 3, name: "Jeans", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=80&h=80&fit=crop", price: 195.00, sold: 15 },
  { id: 4, name: "Red Sneakers", image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=80&h=80&fit=crop", price: 402.00, sold: 40 },
  { id: 5, name: "Red Scarf", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=80&h=80&fit=crop", price: 280.00, sold: 37 },
  { id: 6, name: "Kitchen Accessory", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=80&h=80&fit=crop", price: 150.00, sold: 18 },
  { id: 7, name: "Bicycle", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=80&h=80&fit=crop", price: 316.00, sold: 25 },
  { id: 8, name: "Sports Shoes", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=80&h=80&fit=crop", price: 290.00, sold: 12 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 p-2.5 sm:p-3 rounded-xl shadow-lg text-xs z-50 relative">
        <p className="font-semibold text-gray-900 mb-1.5">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 sm:gap-6 py-0.5">
            <span className="text-gray-500 capitalize text-[10px] sm:text-[11px] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: entry.color }}></span>
              {entry.dataKey}
            </span>
            <span className="font-bold text-gray-900">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function Page() {
  // Orders State
  const [orderFilter, setOrderFilter] = useState("");
  const [orderSortAsc, setOrderSortAsc] = useState<boolean | null>(null);
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 8;

  // Products State
  const [productFilter, setProductFilter] = useState("");
  const [productSortField, setProductSortField] = useState<"price" | "sold" | null>(null);
  const [productSortAsc, setProductSortAsc] = useState<boolean>(true);

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-blue-50/60 text-blue-600 border border-blue-200/80";
      case "Paid":
        return "bg-amber-50/60 text-amber-600 border border-amber-200/80";
      case "Success":
        return "bg-emerald-50/60 text-emerald-600 border border-emerald-200/80";
      case "Failed":
        return "bg-rose-600 text-white font-semibold";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Filtered and Sorted Orders
  const filteredOrders = useMemo(() => {
    let result = initialOrders.filter((item) =>
      item.customer.toLowerCase().includes(orderFilter.toLowerCase()) ||
      item.product.toLowerCase().includes(orderFilter.toLowerCase()) ||
      item.id.toLowerCase().includes(orderFilter.toLowerCase())
    );

    if (orderSortAsc !== null) {
      result = [...result].sort((a, b) =>
        orderSortAsc ? a.amount - b.amount : b.amount - a.amount
      );
    }
    return result;
  }, [orderFilter, orderSortAsc]);

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, orderPage]);

  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = initialProducts.filter((item) =>
      item.name.toLowerCase().includes(productFilter.toLowerCase())
    );

    if (productSortField) {
      result = [...result].sort((a, b) => {
        const valA = a[productSortField];
        const valB = b[productSortField];
        return productSortAsc ? valA - valB : valB - valA;
      });
    }
    return result;
  }, [productFilter, productSortField, productSortAsc]);

  const handleProductSort = (field: "price" | "sold") => {
    if (productSortField === field) {
      setProductSortAsc(!productSortAsc);
    } else {
      setProductSortField(field);
      setProductSortAsc(true);
    }
  };

  return (
    <div className="space-y-5 w-full pb-8">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">E-Commerce Dashboard</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-white border border-gray-200/80 px-3.5 py-1.5 rounded-xl text-xs font-medium text-gray-700 shadow-2xs">
            <span>📅 17 Jul 2026 - 13 Aug 2026</span>
          </div>
          <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors shadow-sm cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>

      {/* Top Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-4">
        
        {/* Card 1: Congratulations */}
        <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="absolute top-3 right-4 flex items-center gap-1.5 pointer-events-none opacity-75">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span className="w-2.5 h-1 bg-amber-400 rotate-45 rounded-xs"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span className="w-1.5 h-1.5 bg-emerald-400 rotate-12"></span>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Congratulations Toby! 🎉</h3>
            <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Best seller of the month</p>
          </div>
          
          <div className="mt-4 flex items-end justify-between gap-2">
            <div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">$15,231.89</span>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +65% from last month
              </p>
            </div>
            <button className="px-3 py-1.5 border border-gray-200 bg-white rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs shrink-0 cursor-pointer">
              View Sales
            </button>
          </div>
        </div>

        {/* Card 2: MRR */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 truncate">Monthly recurring r...</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">+6.1%</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">$34.1K</h2>
          </div>
          <div className="mt-4 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-600 hover:text-black cursor-pointer">
            <span>View more</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Users */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Users</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">+19.2%</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">500.1K</h2>
          </div>
          <div className="mt-4 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-600 hover:text-black cursor-pointer">
            <span>View more</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: User Growth */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">User growth</span>
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">-1.2%</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">11.3%</h2>
          </div>
          <div className="mt-4 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-600 hover:text-black cursor-pointer">
            <span>View more</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Middle Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Total Revenue Bar Chart Card */}
        <div className="lg:col-span-7 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">Total Revenue</h2>
              <p className="text-xs text-gray-500 mt-0.5">Income in the last 28 days</p>
            </div>
            
            <div className="flex items-center justify-between sm:justify-start gap-6 sm:gap-8 bg-white border border-gray-200/80 px-4 sm:px-5 py-2 rounded-xl shadow-2xs">
              <div className="flex flex-col items-start">
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Desktop</span>
                <span className="font-bold text-gray-900 text-base sm:text-xl leading-none">24,828</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Mobile</span>
                <span className="font-bold text-gray-900 text-base sm:text-xl leading-none">25,010</span>
              </div>
            </div>
          </div>

          <div className="h-[220px] sm:h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barGap={0} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 11 }} 
                  dy={10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6', opacity: 0.4 }} />
                <Bar dataKey="desktop" fill="#0f172a" radius={[3, 3, 0, 0]} maxBarSize={32} />
                <Bar dataKey="mobile" fill="#4b5563" radius={[3, 3, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Returning Rate Line Chart Card */}
        <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Returning Rate</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <h2 className="text-xl sm:text-[28px] font-bold text-gray-900 leading-none">$42,379</h2>
                <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+2.5%</span>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer shrink-0">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>

          <div className="h-[220px] sm:h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={returningRateData} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 10 }} 
                  dy={10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="linear" 
                  dataKey="desktop" 
                  stroke="#0f172a" 
                  strokeWidth={2.5} 
                  dot={false} 
                  activeDot={{ r: 5, fill: "#0f172a", strokeWidth: 0 }}
                />
                <Line 
                  type="linear" 
                  dataKey="mobile" 
                  stroke="#d1d5db" 
                  strokeWidth={2.5} 
                  dot={false} 
                  activeDot={{ r: 5, fill: "#d1d5db", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Middle Row 2: Location, Store Visits, Customer Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Sales by Location */}
        <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">Sales by Location</h2>
              <button className="flex items-center gap-1.5 px-3 py-1 border border-gray-200/80 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
                <Download className="w-3 h-3" /> Export
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-6">Income in the last 28 days</p>

            <div className="space-y-4">
              {locationData.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{item.country}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${item.positive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                        {item.change}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-black h-full rounded-full transition-all duration-500" 
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Store Visits by Source */}
        <div className="lg:col-span-3 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-sm sm:text-base text-center sm:text-left">Store Visits by Source</h2>
          </div>

          <div className="my-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">10.2K</h1>
            <p className="text-xs text-gray-400 font-medium mt-1">Visitors</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-medium text-gray-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-black"></span>
              <span>Direct</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-gray-300"></span>
              <span>Referrals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-gray-400"></span>
              <span>Email</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-gray-200"></span>
              <span>Other</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-gray-800"></span>
              <span>Social</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="lg:col-span-4 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h2 className="font-bold text-gray-900 text-sm sm:text-base">Customer Reviews</h2>
                <p className="text-xs text-gray-500 mt-0.5">Based on 5,500 verified purchases</p>
              </div>
              <button className="flex items-center gap-1 text-xs font-semibold text-gray-700 border border-gray-200/80 px-2.5 py-1 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex flex-col items-center justify-center pr-3 border-r border-gray-100">
                <div className="flex items-center gap-0.5 mb-1">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <Star className="w-3.5 h-3.5 fill-amber-400/30 text-amber-400" />
                </div>
                <span className="text-2xl font-bold text-gray-900 leading-none">4.5</span>
                <span className="text-[10px] text-gray-400 font-medium mt-1">out of 5</span>
              </div>

              <div className="flex-1 space-y-1.5">
                {ratingBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-gray-500 text-[11px] font-medium">{item.stars}★</span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percent}%` }}></div>
                    </div>
                    <span className="w-8 text-right text-gray-400 text-[11px] font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50/60 border border-gray-100 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-gray-400">March 12, 2025</span>
            </div>

            <h4 className="font-bold text-gray-900 text-xs">Exceeded my expectations!</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              I was skeptical at first, but this product has completely changed my daily routine. The quality is outstanding and it's so easy to use.
            </p>

            <div className="pt-1 flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-900">Sarah J.</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                Verified Purchase
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* NEW BOTTOM ROW: TABLES SECTION (Recent Orders & Best Selling Products) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* 1. Recent Orders Table (Grid 7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">Recent Orders</h2>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>

            {/* Filter Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Filter orders..."
                value={orderFilter}
                onChange={(e) => {
                  setOrderFilter(e.target.value);
                  setOrderPage(1);
                }}
                className="w-full sm:w-64 px-3 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-black placeholder-gray-400"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 font-medium">
                    <th className="pb-3 pr-2 font-medium">ID</th>
                    <th className="pb-3 px-2 font-medium">Customer</th>
                    <th className="pb-3 px-2 font-medium">Product</th>
                    <th 
                      className="pb-3 px-2 font-medium cursor-pointer hover:text-gray-900 select-none"
                      onClick={() => setOrderSortAsc(orderSortAsc === true ? false : true)}
                    >
                      <div className="flex items-center gap-1">
                        Amount
                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                      </div>
                    </th>
                    <th className="pb-3 px-2 font-medium">Status</th>
                    <th className="pb-3 pl-2 font-medium text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 pr-2 text-gray-500 font-medium">{order.id}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={order.avatar} 
                            alt={order.customer} 
                            className="w-7 h-7 rounded-full object-cover shrink-0" 
                          />
                          <span className="font-semibold text-gray-900 whitespace-nowrap">{order.customer}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-700 whitespace-nowrap">{order.product}</td>
                      <td className="py-3 px-2 font-semibold text-gray-900">${order.amount.toFixed(2)}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <button className="p-1 text-gray-400 hover:text-gray-700 rounded cursor-pointer">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-400">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer / Pagination */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing {filteredOrders.length > 0 ? (orderPage - 1) * ordersPerPage + 1 : 0} to{" "}
              {Math.min(orderPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setOrderPage((p) => Math.max(p - 1, 1))}
                disabled={orderPage === 1}
                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setOrderPage((p) => Math.min(p + 1, totalOrderPages))}
                disabled={orderPage === totalOrderPages || totalOrderPages === 0}
                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Best Selling Products Table (Grid 5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">Best Selling Products</h2>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>

            {/* Filter Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Filter products..."
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full sm:w-64 px-3 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-black placeholder-gray-400"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 font-medium">
                    <th className="pb-3 pr-2 font-medium">Product</th>
                    <th 
                      className="pb-3 px-2 font-medium cursor-pointer hover:text-gray-900 select-none"
                      onClick={() => handleProductSort("price")}
                    >
                      <div className="flex items-center gap-1">
                        Sales
                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                      </div>
                    </th>
                    <th 
                      className="pb-3 px-2 font-medium cursor-pointer hover:text-gray-900 select-none"
                      onClick={() => handleProductSort("sold")}
                    >
                      <div className="flex items-center gap-1">
                        Sold
                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                      </div>
                    </th>
                    <th className="pb-3 pl-2 font-medium text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-2.5 pr-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0" 
                          />
                          <span className="font-semibold text-gray-900 whitespace-nowrap">{prod.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 font-semibold text-gray-900">${prod.price.toFixed(2)}</td>
                      <td className="py-2.5 px-2 text-gray-600 font-medium">{prod.sold}</td>
                      <td className="py-2.5 pl-2 text-right">
                        <button className="p-1 text-gray-400 hover:text-gray-700 rounded cursor-pointer">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-400">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>0 of {filteredProducts.length} row(s) selected.</span>
            <div className="flex items-center gap-1">
              <button disabled className="p-1.5 border border-gray-200 rounded-lg opacity-40 cursor-not-allowed">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button disabled className="p-1.5 border border-gray-200 rounded-lg opacity-40 cursor-not-allowed">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}