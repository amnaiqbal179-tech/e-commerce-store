"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { updateOrderStatus } from "@/actions/order";
import { toast } from "react-hot-toast";

export default function OrderList({ orders }: { orders: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (orderId: string, status: string) => {
    setLoading(true);
    const result = await updateOrderStatus(orderId, status);
    if (result.success) {
      toast.success("Status updated!");
    } else {
      toast.error("Failed to update");
    }
    setLoading(false);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-4">Order ID</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="p-4">{order.id}</td>
              <td className="p-4 font-semibold">{order.status}</td>
              <td className="p-4 relative">
                {/* 3 Dots Menu */}
                <select 
                  className="p-2 border rounded"
                  defaultValue={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={loading}
                >
                  <option value="PENDING">Pending</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}