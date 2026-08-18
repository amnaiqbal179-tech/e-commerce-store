"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/order";
import { toast } from "react-hot-toast";

export default function AdminOrderTable({ orders }: { orders: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoadingId(orderId);
    const res = await updateOrderStatus(orderId, newStatus);
    
    if (res.success) {
      toast.success(`Order status updated to ${newStatus}`);
    } else {
      toast.error("Failed to update status");
    }
    setLoadingId(null);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-black/10">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-black/10 text-sm text-gray-500 bg-gray-50">
            <th className="p-4">Order ID</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-black/5">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50/50">
              <td className="p-4 font-medium text-black">{order.orderNumber}</td>
              <td className="p-4 text-gray-800">{order.customerName}</td>
              <td className="p-4 font-semibold text-black">Rs. {order.totalAmount}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === "Delivered" ? "bg-green-100 text-green-800" :
                  order.status === "Cancelled" ? "bg-red-100 text-red-800" :
                  "bg-amber-100 text-amber-800"
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="p-4 text-center">
                {/* 3-Dots / Dropdown menu to change status */}
                <select
                  defaultValue={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={loadingId === order.id}
                  className="px-3 py-1.5 border border-black/20 rounded-lg text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}