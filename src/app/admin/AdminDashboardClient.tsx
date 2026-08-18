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
  ChevronLeft,
  Tag,
  Plus
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

export default function AdminDashboardClient({ initialProducts, initialOrders, initialCoupons = [], totalRevenue }: any) {
  const [orderFilter, setOrderFilter] = useState("");
  const [orderSortAsc, setOrderSortAsc] = useState<boolean | null>(null);
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 8;

  const [productFilter, setProductFilter] = useState("");
  const [productSortField, setProductSortField] = useState<"price" | "sold" | null>(null);
  const [productSortAsc, setProductSortAsc] = useState<boolean>(true);

  // 🟢 Database Connected Coupon States
  const [coupons, setCoupons] = useState(initialCoupons);
  const [newCode, setNewCode] = useState("");
  const [newDiscountPercent, setNewDiscountPercent] = useState("");
  const [newMinOrder, setNewMinOrder] = useState("");
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [isSubmittingCoupon, setIsSubmittingCoupon] = useState(false);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    try {
      setIsSubmittingCoupon(true);
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          code: newCode.toUpperCase(),
          discountPercent: newDiscountPercent ? Number(newDiscountPercent) : 10,
          minOrderAmount: newMinOrder ? Number(newMinOrder) : 0,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCoupons([data.coupon, ...coupons]);
        setNewCode("");
        setNewDiscountPercent("");
        setNewMinOrder("");
        setIsAddingCoupon(false);
      } else {
        alert(data.message || "Failed to create coupon");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      alert("An error occurred while saving the coupon to database.");
    } finally {
      setIsSubmittingCoupon(false);
    }
  };

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

  const filteredOrders = useMemo(() => {
    let result = initialOrders.filter((item: any) =>
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
  }, [initialOrders, orderFilter, orderSortAsc]);

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, orderPage]);

  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;

  const filteredProducts = useMemo(() => {
    let result = initialProducts.filter((item: any) =>
      item.name.toLowerCase().includes(productFilter.toLowerCase())
    );

    if (productSortField) {
      result = [...result].sort((a: any, b: any) => {
        const valA = a[productSortField];
        const valB = b[productSortField];
        return productSortAsc ? valA - valB : valB - valA;
      });
    }
    return result;
  }, [initialProducts, productFilter, productSortField, productSortAsc]);

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
            <span>📅 Live Database Data</span>
          </div>
        </div>
      </div>

      {/* Top Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-4">
        <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Store Performance 🎉</h3>
            <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Real-time inventory metrics</p>
          </div>
          <div className="mt-4 flex items-end justify-between gap-2">
            <div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> Live from DB
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 truncate">Total Products</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Active</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{initialProducts.length}</h2>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Total Orders</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Synced</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{initialOrders.length}</h2>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Store Status</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Online</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">100%</h2>
          </div>
        </div>
      </div>

      {/* Middle Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="lg:col-span-7 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">Total Revenue</h2>
              <p className="text-xs text-gray-500 mt-0.5">Income statistics</p>
            </div>
          </div>
          <div className="h-[220px] sm:h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barGap={0} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6', opacity: 0.4 }} />
                <Bar dataKey="desktop" fill="#0f172a" radius={[3, 3, 0, 0]} maxBarSize={32} />
                <Bar dataKey="mobile" fill="#4b5563" radius={[3, 3, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Returning Rate</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <h2 className="text-xl sm:text-[28px] font-bold text-gray-900 leading-none">$42,379</h2>
              </div>
            </div>
          </div>
          <div className="h-[220px] sm:h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={returningRateData} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} dy={10} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="linear" dataKey="desktop" stroke="#0f172a" strokeWidth={2.5} dot={false} />
                <Line type="linear" dataKey="mobile" stroke="#d1d5db" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TABLES SECTION (Recent Orders & Real Database Products) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-7 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">Recent Orders</h2>
            </div>
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
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 font-medium">
                    <th className="pb-3 pr-2 font-medium">ID</th>
                    <th className="pb-3 px-2 font-medium">Customer</th>
                    <th className="pb-3 px-2 font-medium">Product</th>
                    <th className="pb-3 px-2 font-medium cursor-pointer hover:text-gray-900 select-none" onClick={() => setOrderSortAsc(orderSortAsc === true ? false : true)}>
                      <div className="flex items-center gap-1">Amount <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="pb-3 px-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedOrders.map((order: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 pr-2 text-gray-500 font-medium">{order.id}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          <img src={order.avatar} alt={order.customer} className="w-7 h-7 rounded-full object-cover shrink-0" />
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
                    </tr>
                  ))}
                  {paginatedOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-400">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Showing {filteredOrders.length} entries</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setOrderPage((p) => Math.max(p - 1, 1))} disabled={orderPage === 1} className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setOrderPage((p) => Math.min(p + 1, totalOrderPages))} disabled={orderPage === totalOrderPages || totalOrderPages === 0} className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Real Products Table */}
        <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">Real Store Products (Database)</h2>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Filter real products..."
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full sm:w-64 px-3 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-black placeholder-gray-400"
              />
            </div>
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 font-medium sticky top-0 bg-white">
                    <th className="pb-3 pr-2 font-medium">Product</th>
                    <th className="pb-3 px-2 font-medium cursor-pointer hover:text-gray-900 select-none" onClick={() => handleProductSort("price")}>
                      <div className="flex items-center gap-1">Price <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                    <th className="pb-3 pl-2 font-medium cursor-pointer hover:text-gray-900 select-none text-right" onClick={() => handleProductSort("sold")}>
                      <div className="flex items-center justify-end gap-1">Sold <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((product: any) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2.5">
                          <img src={product.image} alt={product.name} className="w-7 h-7 rounded-lg object-cover shrink-0" />
                          <span className="font-semibold text-gray-900 whitespace-nowrap">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 font-semibold text-gray-900">${product.price.toFixed(2)}</td>
                      <td className="py-3 pl-2 text-right font-medium text-gray-700">{product.sold}</td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-gray-400">
                        No products found in database. Add some products from admin panel!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Showing {filteredProducts.length} entries</span>
          </div>
        </div>

      </div>

      {/* 🟢 Active Coupons Section with DB Connected Form */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/80 text-gray-900">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">Active Store Coupons</h2>
              <p className="text-xs text-gray-500">Promotional discount codes management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full">
              {coupons.length} Coupons
            </span>
            <button
              onClick={() => setIsAddingCoupon(!isAddingCoupon)}
              className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> {isAddingCoupon ? "Cancel" : "Add New Coupon"}
            </button>
          </div>
        </div>

        {/* Add New Coupon Form Toggle Section */}
        {isAddingCoupon && (
          <form onSubmit={handleAddCoupon} className="p-4 bg-gray-50 border border-gray-200 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">Coupon Code</label>
              <input
                type="text"
                placeholder="e.g. SUMMER20"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                required
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs uppercase font-mono focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">Discount Percentage (%)</label>
              <input
                type="number"
                placeholder="e.g. 15"
                value={newDiscountPercent}
                onChange={(e) => setNewDiscountPercent(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">Min. Order Amount ($)</label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={newMinOrder}
                onChange={(e) => setNewMinOrder(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmittingCoupon}
                className="w-full bg-emerald-600 text-white py-1.5 px-4 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmittingCoupon ? "Saving..." : "Generate & Save"}
              </button>
            </div>
          </form>
        )}

        {coupons.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs border border-dashed border-gray-200 rounded-xl">
            No coupons found. Click "Add New Coupon" to create one!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {coupons.map((coupon: any) => (
              <div key={coupon.id} className="border border-gray-200/80 p-4 rounded-xl bg-gray-50/50 flex flex-col justify-between gap-3 hover:border-gray-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-gray-900 text-xs bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs tracking-wide">
                    {coupon.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${coupon.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-end justify-between pt-2 border-t border-gray-200/60 text-xs">
                  <div>
                    <p className="text-gray-500 text-[11px]">Discount</p>
                    <p className="font-bold text-emerald-600">
                      {coupon.discountPercent ? `${coupon.discountPercent}% OFF` : `$${coupon.fixedDiscount} OFF`}
                    </p>
                  </div>
                  {coupon.minOrderAmount > 0 && (
                    <div className="text-right">
                      <p className="text-gray-500 text-[11px]">Min. Order</p>
                      <p className="font-semibold text-gray-800">${coupon.minOrderAmount}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}