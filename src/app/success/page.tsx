"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");

  // Jab user Stripe se wapas aaye aur orderId ho, toh status automatically "Paid" update kar do
  useEffect(() => {
    if (orderId) {
      fetch(`/api/verify-payment?order_id=${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("Order payment status updated to Paid in database.");
          }
        })
        .catch((err) => console.error("Failed to update payment status:", err));
    }
  }, [orderId]);

  return (
    <main className="w-full bg-white min-h-screen flex flex-col justify-between">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] py-20 flex-1 flex items-center justify-center">
        <div className="max-w-md w-full border border-black/10 rounded-[24px] p-8 text-center shadow-xl bg-white space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce">
            <FaCheckCircle />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black uppercase">
              Payment Successful!
            </h1>
            <p className="text-black/60 text-sm mt-2">
              Shukriya! Aapki payment successful ho chuki hai aur order confirm kar diya gaya hai.
            </p>
          </div>

          {orderId && (
            <div className="bg-[#F0EEED] p-3.5 rounded-xl text-xs sm:text-sm font-mono text-black/80">
              Order ID: <span className="font-bold text-black">{orderId}</span>
            </div>
          )}

          {sessionId && (
            <div className="bg-[#F0EEED] p-3.5 rounded-xl text-xs sm:text-sm font-mono text-black/80 truncate">
              Session ID: <span className="font-bold text-black">{sessionId}</span>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/"
              className="w-full bg-black text-white py-4 rounded-full font-medium text-sm inline-block hover:bg-black/80 transition-all cursor-pointer shadow-md"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}