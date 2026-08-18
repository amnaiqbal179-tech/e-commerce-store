"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import {
  FaBoxOpen,
  FaArrowLeft,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaChevronRight,
  FaShoppingBag,
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import Footer from "@/components/layout/Footer";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
}

interface Order {
  id: string;
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: string;
  paymentStatus?: string; // <-- New field for payment status
  createdAt: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSignedIn || !user) {
      setLoading(false);
      return;
    }

    const fetchUserOrders = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${user.id}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setOrders(data.orders);
        } else {
          setError(data.error || "Orders load karne mein masla aya hai.");
        }
      } catch (err) {
        console.error("Fetch Orders Error:", err);
        setError("Network error. Dobara koshish karein.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [isSignedIn, user]);

  // Status Badge Colors & Icons Helper
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "Pending":
        return { color: "bg-amber-100 text-amber-800 border-amber-300", icon: <FaClock /> };
      case "Processing":
        return { color: "bg-blue-100 text-blue-800 border-blue-300", icon: <FaBoxOpen /> };
      case "Shipped":
        return { color: "bg-purple-100 text-purple-800 border-purple-300", icon: <FaTruck /> };
      case "Delivered":
        return { color: "bg-green-100 text-green-800 border-green-300", icon: <FaCheckCircle /> };
      case "Cancelled":
        return { color: "bg-red-100 text-red-800 border-red-300", icon: <FaClock /> };
      default:
        return { color: "bg-gray-100 text-gray-800 border-gray-300", icon: <FaClock /> };
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-3">
        <ImSpinner2 className="animate-spin text-4xl text-black" />
        <p className="text-sm text-black/60">Aapke orders fetch ho rahe hain...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="w-full bg-white min-h-screen flex flex-col justify-between">
        <div className="max-w-[1440px] mx-auto px-4 py-20 flex-1 flex items-center justify-center">
          <div className="max-w-md w-full border border-black/10 rounded-[24px] p-8 text-center shadow-xl bg-white space-y-6">
            <div className="w-16 h-16 bg-black/5 text-black rounded-full flex items-center justify-center mx-auto text-2xl">
              <FaShoppingBag />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold uppercase text-black">Login Required</h1>
              <p className="text-sm text-black/60">
                Apne orders dekhne ke liye pehle account mein login karein.
              </p>
            </div>
            <SignInButton mode="modal">
              <button className="w-full bg-black text-white py-3.5 rounded-full font-medium text-sm hover:bg-black/80 transition-all cursor-pointer shadow-md">
                Login / Sign Up
              </button>
            </SignInButton>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="w-full bg-white">
      {/* Top Header Navigation */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] py-6 flex items-center justify-between border-b border-black/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-black/70 hover:text-black transition-colors"
        >
          <FaArrowLeft size={14} /> Continue Shopping
        </Link>
        <h1 className="text-xl font-bold uppercase tracking-tight text-black">
          My Orders History
        </h1>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-8 py-12 space-y-6 min-h-[500px]">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20 space-y-4 border border-black/10 rounded-[24px] bg-[#F9F9F9]">
            <div className="w-16 h-16 bg-black/5 text-black/50 rounded-full flex items-center justify-center mx-auto text-3xl">
              <FaBoxOpen />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-black text-lg">Koi order nahi mila</h3>
              <p className="text-xs text-black/60">Aapne abhi tak koi order place nahi kiya.</p>
            </div>
            <Link
              href="/"
              className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-black/80 transition-all"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusDetails(order.status);
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <Link
                  key={order.id}
                  href={`/order-success/${order.id}`}
                  className="block border border-black/10 hover:border-black/40 rounded-2xl p-5 sm:p-6 transition-all bg-white shadow-xs group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-4">
                    <div>
                      <p className="text-xs text-black/60 font-mono">
                        Order ID: <span className="font-bold text-black">{order.id}</span>
                      </p>
                      <p className="text-xs text-black/60 mt-0.5">Placed on: {formattedDate}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusInfo.color}`}
                      >
                        {statusInfo.icon} {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3 overflow-hidden">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 rounded-xl bg-[#F0EEED] border-2 border-white relative overflow-hidden shrink-0"
                          >
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-black">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-black/60">Payment: {order.paymentMethod}</p>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              order.paymentStatus === "Paid"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {order.paymentStatus || "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-black/60 block">Total</span>
                        <span className="font-bold text-base text-black">${order.totalAmount}</span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#F0EEED] group-hover:bg-black group-hover:text-white flex items-center justify-center transition-all">
                        <FaChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}