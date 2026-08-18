"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  ArrowUpDown, 
  Columns3, 
  MoreHorizontal,
  Loader2 
} from "lucide-react";

interface OrderItem {
  id: string;
  title: string | null;
  image: string | null;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string | null;
  status: string;
  paymentStatus?: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabs = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (activeTab !== "All") queryParams.append("status", activeTab);
        if (searchQuery) queryParams.append("search", searchQuery);

        const res = await fetch(`/api/admin/orders?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab, searchQuery]);

  // Order Status ya Payment Status update karne ke liye universal function
  const handleUpdateOrder = async (orderId: string, updates: { status?: string; paymentStatus?: string }) => {
    try {
      const res = await fetch("/api/admin/orders/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, ...updates }),
      });

      const data = await res.json();
      if (res.ok) {
        setOpenDropdownId(null);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, ...updates } : order
          )
        );
      } else {
        alert(data.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Something went wrong while updating order.");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(orders.map((o) => o.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full border border-orange-300 text-orange-600 bg-orange-50/50">
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full border border-blue-300 text-blue-600 bg-blue-50/50">
            Processing
          </span>
        );
      case "completed":
      case "delivered":
        return (
          <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full border border-emerald-300 text-emerald-600 bg-emerald-50/50">
            {status}
          </span>
        );
      case "shipped":
        return (
          <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full bg-gray-200/80 text-gray-700">
            Shipped
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full border border-red-300 text-red-600 bg-red-50/50">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full border border-gray-300 text-gray-600">
            {status || "N/A"}
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-screen font-sans text-gray-800">
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
        <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Create Order</span>
        </button>
      </div>

      <div className="flex items-center gap-1 border-b border-gray-200/80 pb-3 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? "bg-gray-200/70 text-gray-900 font-semibold shadow-2xs"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button className="bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5 text-gray-500" />
            <span>Status</span>
          </button>
          <button className="bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
            <span>Columns</span>
            <Columns3 className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200/80 text-gray-500 bg-gray-50/40">
                <th className="p-3.5 pl-4 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={orders.length > 0 && selectedRows.length === orders.length}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                </th>
                <th className="p-3.5 font-medium text-gray-600">Order #</th>
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
                <th className="p-3.5 font-medium text-gray-600">Payment</th>
                <th className="p-3.5 font-medium text-gray-600">Status</th>
                <th className="p-3.5 pr-4 w-10 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-black" />
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isSelected = selectedRows.includes(order.id);
                  const firstItem = order.items[0];
                  const isDropdownOpen = openDropdownId === order.id;

                  return (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-gray-50/60 transition-colors relative ${
                        isSelected ? "bg-gray-50/80" : ""
                      }`}
                    >
                      <td className="p-3.5 pl-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(order.id)}
                          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                        />
                      </td>

                      <td className="p-3.5 font-medium text-gray-900">
                        <Link href={`/admin/orders/${order.id}`} className="hover:underline text-black font-semibold">
                          {order.orderNumber || `#${order.id.slice(-5)}`}
                        </Link>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={firstItem?.image || "https://via.placeholder.com/100"}
                            alt={firstItem?.title || "Product"}
                            className="w-10 h-10 rounded-xl object-cover bg-gray-100 border border-gray-200/60"
                          />
                          <div>
                            <span className="font-medium text-gray-900 block">
                              {firstItem?.title || "Order Item"}
                            </span>
                            {order.items.length > 1 && (
                              <span className="text-[10px] text-gray-400">
                                +{order.items.length - 1} more items
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 font-medium text-gray-800">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>

                      <td className="p-3.5">
                        <div>
                          <p className="font-bold text-gray-900">{order.customerName}</p>
                          <p className="text-[11px] text-gray-400 font-normal">{order.customerEmail || "N/A"}</p>
                        </div>
                      </td>

                      <td className="p-3.5 text-gray-600 font-medium">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>

                      {/* Payment Method & Status Badge */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-gray-800">{order.paymentMethod || "COD"}</span>
                          <span className={`text-[10px] font-semibold w-fit px-1.5 py-0.2 rounded ${
                            order.paymentStatus === "Paid" 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                              : "bg-amber-50 text-amber-600 border border-amber-200"
                          }`}>
                            {order.paymentStatus || "Pending"}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5">{renderStatusBadge(order.status)}</td>

                      <td className="p-3.5 pr-4 text-right relative">
                        <button 
                          onClick={() => setOpenDropdownId(isDropdownOpen ? null : order.id)}
                          className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                          aria-label="Actions"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {isDropdownOpen && (
                          <div 
                            ref={dropdownRef}
                            className="absolute right-8 top-8 w-44 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50 text-left"
                          >
                            <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 border-b border-gray-100 uppercase tracking-wider">
                              Change Order Status
                            </div>
                            <button
                              onClick={() => handleUpdateOrder(order.id, { status: "Pending" })}
                              className="w-full px-3 py-2 text-xs font-medium hover:bg-orange-50 text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              Pending
                            </button>
                            <button
                              onClick={() => handleUpdateOrder(order.id, { status: "Processing" })}
                              className="w-full px-3 py-2 text-xs font-medium hover:bg-blue-50 text-blue-600 transition-colors text-left cursor-pointer"
                            >
                              Processing
                            </button>
                            <button
                              onClick={() => handleUpdateOrder(order.id, { status: "Shipped" })}
                              className="w-full px-3 py-2 text-xs font-medium hover:bg-gray-100 text-gray-700 transition-colors text-left cursor-pointer"
                            >
                              Shipped
                            </button>
                            <button
                              onClick={() => handleUpdateOrder(order.id, { status: "Delivered" })}
                              className="w-full px-3 py-2 text-xs font-medium hover:bg-emerald-50 text-emerald-600 transition-colors text-left cursor-pointer"
                            >
                              Delivered
                            </button>
                            <button
                              onClick={() => handleUpdateOrder(order.id, { status: "Cancelled" })}
                              className="w-full px-3 py-2 text-xs font-medium hover:bg-red-50 text-red-600 transition-colors text-left cursor-pointer"
                            >
                              Cancelled
                            </button>

                            {/* Payment Status Options */}
                            <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 border-t border-b border-gray-100 uppercase tracking-wider mt-1">
                              Payment Status
                            </div>
                            <button
                              onClick={() => handleUpdateOrder(order.id, { paymentStatus: "Paid" })}
                              className="w-full px-3 py-2 text-xs font-medium hover:bg-emerald-50 text-emerald-600 transition-colors text-left cursor-pointer"
                            >
                              Mark as Paid
                            </button>
                            <button
                              onClick={() => handleUpdateOrder(order.id, { paymentStatus: "Pending" })}
                              className="w-full px-3 py-2 text-xs font-medium hover:bg-amber-50 text-amber-600 transition-colors text-left cursor-pointer"
                            >
                              Mark as Pending
                            </button>

                            <div className="border-t border-gray-100 mt-1 pt-1">
                              <button
                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                                className="w-full px-3 py-2 text-xs font-medium hover:bg-gray-100 text-gray-700 transition-colors text-left cursor-pointer"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            {selectedRows.length} of {orders.length} row(s) selected.
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