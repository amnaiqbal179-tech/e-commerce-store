"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  ArrowUpDown, 
  SlidersHorizontal, 
  Columns3, 
  MoreHorizontal 
} from "lucide-react";

// Exact Orders Data from Screenshots
const ordersData = [
  {
    id: "#12342",
    product: "Wireless Headphones",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100&auto=format&fit=crop&q=80",
    price: "$200",
    customer: "Liam Johnson",
    email: "liam@example.com",
    date: "Jun 23, 2023",
    type: "Sale",
    status: "Pending",
  },
  {
    id: "#24342",
    product: "Bluetooth Speaker",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80",
    price: "$150",
    customer: "Emma Brown",
    email: "emma@example.com",
    date: "Jul 11, 2023",
    type: "Sale",
    status: "Completed",
  },
  {
    id: "#32183",
    product: "Smartwatch",
    image: "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=100&auto=format&fit=crop&q=80",
    price: "$250",
    customer: "Noah Williams",
    email: "noah@example.com",
    date: "Aug 03, 2023",
    type: "Return",
    status: "Pending",
  },
  {
    id: "#45542",
    product: "Laptop Stand",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=100&auto=format&fit=crop&q=80",
    price: "$320",
    customer: "Olivia Garcia",
    email: "olivia@example.com",
    date: "Sep 15, 2023",
    type: "Sale",
    status: "Shipped",
  },
  {
    id: "#54345",
    product: "Portable Charger",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80",
    price: "$80",
    customer: "Elijah Jones",
    email: "elijah@example.com",
    date: "Oct 09, 2023",
    type: "Sale",
    status: "Delivered",
  },
  {
    id: "#64257",
    product: "USB Hub",
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=100&auto=format&fit=crop&q=80",
    price: "$60",
    customer: "Ava Miller",
    email: "ava@example.com",
    date: "Nov 21, 2023",
    type: "Return",
    status: "Pending",
  },
  {
    id: "#74346",
    product: "4K Monitor",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=100&auto=format&fit=crop&q=80",
    price: "$500",
    customer: "James Martinez",
    email: "james@example.com",
    date: "Dec 02, 2023",
    type: "Sale",
    status: "Completed",
  },
  {
    id: "#84322",
    product: "Mechanical Keyboard",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100&auto=format&fit=crop&q=80",
    price: "$100",
    customer: "Sophia Anderson",
    email: "sophia@example.com",
    date: "Jan 18, 2024",
    type: "Sale",
    status: "Shipped",
  },
  {
    id: "#91452",
    product: "Wireless Mouse",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80",
    price: "$75",
    customer: "Lucas Thomas",
    email: "lucas@example.com",
    date: "Feb 27, 2024",
    type: "Return",
    status: "Completed",
  },
  {
    id: "#10232",
    product: "Tablet",
    image: "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=100&auto=format&fit=crop&q=80",
    price: "$340",
    customer: "Mia Jackson",
    email: "mia@example.com",
    date: "Mar 10, 2024",
    type: "Sale",
    status: "Delivered",
  },
];

export default function OrderListPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = ["All", "Completed", "Processed", "Returned", "Canceled"];

  // Handle select all checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(ordersData.map((o) => o.id));
    } else {
      setSelectedRows([]);
    }
  };

  // Handle single row selection
  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Helper for Status Pills Styling
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full border border-orange-300 text-orange-600 bg-orange-50/50">
            Pending
          </span>
        );
      case "Completed":
        return (
          <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full border border-emerald-300 text-emerald-600 bg-emerald-50/50">
            Completed
          </span>
        );
      case "Shipped":
        return (
          <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full bg-gray-200/80 text-gray-700">
            Shipped
          </span>
        );
      case "Delivered":
        return (
          <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full border border-emerald-300 text-emerald-600 bg-emerald-50/50">
            Delivered
          </span>
        );
      default:
        return (
          <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full border border-gray-300 text-gray-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-screen font-sans text-gray-800">
      
      {/* ================= PAGE HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
        <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Create Order</span>
        </button>
      </div>

      {/* ================= TABS NAVIGATION ================= */}
      <div className="flex items-center gap-1 border-b border-gray-200/80 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-gray-200/70 text-gray-900 font-semibold shadow-2xs"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= FILTER & CONTROLS ROW ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Search input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3.5 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-2xs"
          />
        </div>

        {/* Right: Action Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button className="bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5 text-gray-500" />
            <span>Status</span>
          </button>

          <button className="bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5 text-gray-500" />
            <span>Category</span>
          </button>

          <button className="bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
            <span>Columns</span>
            <Columns3 className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>

      </div>

      {/* ================= ORDERS DATA TABLE ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200/80 text-gray-500 bg-gray-50/40">
                <th className="p-3.5 pl-4 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedRows.length === ordersData.length}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                </th>
                <th className="p-3.5 font-medium text-gray-600">#</th>
                <th className="p-3.5 font-medium text-gray-600">Product</th>
                <th className="p-3.5 font-medium text-gray-600">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="p-3.5 font-medium text-gray-600">Customer</th>
                <th className="p-3.5 font-medium text-gray-600">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="p-3.5 font-medium text-gray-600">Type</th>
                <th className="p-3.5 font-medium text-gray-600">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="p-3.5 pr-4 w-10 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ordersData.map((order) => {
                const isSelected = selectedRows.includes(order.id);
                return (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-gray-50/60 transition-colors ${
                      isSelected ? "bg-gray-50/80" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3.5 pl-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(order.id)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                      />
                    </td>

                    {/* Order ID */}
                    <td className="p-3.5 font-medium text-gray-500">{order.id}</td>

                    {/* Product (Image + Title) */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.image}
                          alt={order.product}
                          className="w-10 h-10 rounded-xl object-cover bg-gray-100 border border-gray-200/60"
                        />
                        <span className="font-medium text-gray-900">{order.product}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-3.5 font-medium text-gray-800">{order.price}</td>

                    {/* Customer */}
                    <td className="p-3.5">
                      <div>
                        <p className="font-bold text-gray-900">{order.customer}</p>
                        <p className="text-[11px] text-gray-400 font-normal">{order.email}</p>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-gray-600 font-medium">{order.date}</td>

                    {/* Type */}
                    <td className="p-3.5 text-gray-700 font-medium">{order.type}</td>

                    {/* Status Badge */}
                    <td className="p-3.5">{renderStatusBadge(order.status)}</td>

                    {/* Actions */}
                    <td className="p-3.5 pr-4 text-right">
                      <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ================= TABLE FOOTER / PAGINATION ================= */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            {selectedRows.length} of 15 row(s) selected.
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled 
              className="px-3 py-1.5 border border-gray-200/80 rounded-xl bg-white text-gray-300 cursor-not-allowed text-xs font-medium shadow-2xs"
            >
              Previous
            </button>
            <button className="px-3 py-1.5 border border-gray-200/80 rounded-xl bg-white text-gray-700 hover:bg-gray-50 cursor-pointer text-xs font-medium shadow-2xs transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}