"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaHome, FaTruck } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

function OrderContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="text-center space-y-6 max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">
          <FaCheckCircle />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-black tracking-tight">Order Received!</h1>
          <p className="text-black/60 text-sm">
            Aapka order successfully place ho gaya hai.
          </p>
        </div>
        
        {orderId ? (
          <div className="bg-[#F9F9F9] border border-black/10 rounded-2xl p-5 text-left space-y-3 shadow-xs">
            <div className="flex justify-between items-center text-xs font-mono text-black/60 border-b border-black/10 pb-2">
              <span>Order ID:</span>
              <span className="font-bold text-black">{orderId}</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-4 text-black/60 gap-2 text-xs">
                <ImSpinner2 className="animate-spin" /> Payment & Order details load ho rahi hain...
              </div>
            ) : order ? (
              <div className="space-y-2 pt-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-black/60">Total Amount:</span>
                  <span className="font-bold text-black">${order.totalAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/60">Payment Method:</span>
                  <span className="font-medium text-black">{order.paymentMethod || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/60">Payment Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    (order.paymentStatus || "Pending") === "Paid"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}>
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs font-mono text-black/70 pt-1">
                Order ID: <span className="font-bold">{orderId}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-red-500 text-sm">Order ID nahi mili.</p>
        )}

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          
          {/* Order Track Button */}
          <Link
            href={orderId ? `/order-tracking/${orderId}` : "/orders"}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-black/80 transition-all font-medium text-sm shadow-sm"
          >
            <FaTruck /> Track Order
          </Link>

          {/* Continue Shopping / Back to Home Button */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-all font-medium text-sm border border-black/5"
          >
            <FaHome /> Continue Shopping
          </Link>

        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-medium text-black/60">Loading success page...</div>}>
      <OrderContent />
    </Suspense>
  );
}