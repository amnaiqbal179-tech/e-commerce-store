"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ChevronLeft, 
  Printer, 
  Check, 
  Truck, 
  CreditCard,
  Loader2 
} from "lucide-react";

interface OrderItem {
  id: string;
  title: string | null;
  image: string | null;
  size: string | null;
  quantity: number;
  price: number;
}

interface OrderDetail {
  id: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  address: string;
  city: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch Order Details
  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetail = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error("Error fetching order detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  // Update Status in Database
  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrder((prev) => (prev ? { ...prev, status: updated.status } : null));
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Something went wrong while updating status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-center space-y-4 font-sans">
        <p className="text-gray-500 text-sm">Order not found.</p>
        <Link href="/admin/orders" className="text-xs font-semibold text-black underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = order.totalAmount > subtotal ? order.totalAmount - subtotal : 250;

  // Stepper helper logic
  const statusList = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStatusLower = order.status.toLowerCase();

  const isStepCompleted = (stepName: string) => {
    const stepIdx = statusList.findIndex((s) => s.toLowerCase() === stepName.toLowerCase());
    const currentIdx = statusList.findIndex((s) => s.toLowerCase() === currentStatusLower);
    return currentIdx >= stepIdx;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-screen font-sans text-gray-800">
      
      {/* TOP TOOLBAR (Print ke waqt hide ho jayega) */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/admin/orders"
          className="p-2.5 bg-white border border-gray-200/80 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>Print Invoice / Save PDF</span>
          </button>
          
          {/* Quick Status Update Dropdown */}
          <select
            value={order.status}
            disabled={updatingStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-white border border-gray-300 text-black px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer outline-none"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ================= INVOICE WRAPPER (Print Optimized) ================= */}
      <div className="space-y-6 print:space-y-4 print:p-0 print:m-0">
        
        {/* INVOICE HEADER BRANDING (Only prominent when printing or viewing) */}
        <div className="hidden print:flex justify-between items-start pb-6 border-b border-gray-300">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-black">SHOP.CO</h1>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">Official Tax Invoice</p>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-bold text-gray-900">INVOICE #{order.orderNumber || order.id.slice(-8).toUpperCase()}</h2>
            <p className="text-xs text-gray-500 mt-1">Date: {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            <span className="inline-block mt-2 px-3 py-0.5 bg-gray-100 text-black text-xs font-semibold rounded-md border border-gray-300">
              {order.status}
            </span>
          </div>
        </div>

        {/* TOP GRID: ORDER INFO & SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
          
          {/* Left Card: Customer Details */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-6 print:border-none print:shadow-none print:p-0">
            <div className="border-b border-gray-100 pb-5 flex justify-between items-start print:hidden">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Order {order.orderNumber || `#${order.id.slice(-5)}`}
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                order.status === "Delivered" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                order.status === "Processing" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                order.status === "Shipped" ? "bg-gray-100 text-gray-700" : 
                order.status === "Cancelled" ? "bg-red-50 text-red-600 border border-red-200" :
                "bg-orange-50 text-orange-600 border border-orange-200"
              }`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer Information</h2>
              <div className="text-xs space-y-1 text-gray-600">
                <p className="font-semibold text-gray-900 text-sm">{order.customerName}</p>
                <p>{order.customerEmail || "No Email Provided"}</p>
                <p>{order.customerPhone}</p>
                <p className="bg-gray-50 print:bg-transparent p-3 print:p-0 rounded-xl border border-gray-100 print:border-none mt-2 text-gray-800">
                  {order.address}, {order.city}
                </p>
              </div>

              <div className="mt-4 p-3.5 bg-gray-50/70 print:bg-transparent border border-gray-100 print:border-none rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-gray-700 mb-1">Payment Method</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CreditCard className="w-4 h-4 text-gray-500 print:hidden" />
                    <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Order Summary */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs flex flex-col justify-between print:border print:border-gray-200 print:rounded-xl print:p-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">Rs. {shippingFee.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="border-t border-gray-100 my-4" />
              <div className="flex items-center justify-between text-sm font-bold text-gray-900">
                <span>Total Amount</span>
                <span>Rs. {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* DELIVERY STATUS CARD (Print par hide rahega taake invoice clean lage) */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-6 print:hidden">
          <h2 className="text-sm font-bold text-gray-900">Delivery Status</h2>

          {/* Timeline Stepper */}
          <div className="relative pt-2 pb-4 max-w-2xl mx-auto">
            <div className="absolute top-[26px] left-12 right-12 h-1 bg-gray-200 -z-0">
              <div 
                className="h-full bg-black transition-all duration-300"
                style={{
                  width: currentStatusLower === "pending" ? "10%" : 
                         currentStatusLower === "processing" ? "35%" : 
                         currentStatusLower === "shipped" ? "68%" : 
                         currentStatusLower === "delivered" ? "100%" : "0%"
                }}
              />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-2xs ${
                  isStepCompleted("Pending") ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-semibold text-gray-700">Pending</span>
              </div>

              <div className="flex flex-col items-center gap-2 text-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-2xs ${
                  isStepCompleted("Processing") ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-semibold text-gray-700">Processing</span>
              </div>

              <div className="flex flex-col items-center gap-2 text-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-2xs ${
                  isStepCompleted("Shipped") ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  <Truck className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[11px] font-semibold text-gray-700">Shipped</span>
              </div>

              <div className="flex flex-col items-center gap-2 text-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-2xs ${
                  isStepCompleted("Delivered") ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  <Check className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className="text-[11px] font-semibold text-gray-700">Delivered</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Last updated: {new Date(order.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        {/* ORDER ITEMS TABLE */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-4 print:border print:border-gray-200 print:shadow-none">
          <h2 className="text-sm font-bold text-gray-900">Order Items / Invoice Details</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 bg-gray-50/40 print:bg-gray-100">
                  <th className="p-3 font-medium text-gray-600 rounded-l-xl">Product</th>
                  <th className="p-3 font-medium text-gray-600 text-center">Size</th>
                  <th className="p-3 font-medium text-gray-600 text-center">Quantity</th>
                  <th className="p-3 font-medium text-gray-600 text-right">Price</th>
                  <th className="p-3 font-medium text-gray-600 text-right rounded-r-xl">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "https://via.placeholder.com/150"}
                          alt={item.title || "Product"}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200/60 print:hidden"
                        />
                        <span className="font-semibold text-gray-900">{item.title || "Product"}</span>
                      </div>
                    </td>

                    <td className="p-3 text-center text-gray-700 font-medium">
                      {item.size || "N/A"}
                    </td>

                    <td className="p-3 text-center text-gray-700 font-medium">
                      {item.quantity}
                    </td>

                    <td className="p-3 text-right text-gray-700 font-medium">
                      Rs. {item.price.toLocaleString()}
                    </td>

                    <td className="p-3 text-right font-semibold text-gray-900">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note for Print */}
        <div className="hidden print:block mt-12 pt-6 border-t border-gray-300 text-center text-xs text-gray-500 space-y-1">
          <p className="font-bold text-black">Thank you for shopping with SHOP.CO!</p>
          <p>This is a computer-generated official tax invoice.</p>
        </div>

      </div>

    </div>
  );
}