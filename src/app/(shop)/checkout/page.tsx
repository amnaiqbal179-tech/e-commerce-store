"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { IoIosArrowForward } from "react-icons/io";
import {
  FaLock,
  FaTruck,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaCreditCard,
  FaMoneyBillWave,
  FaSearchLocation,
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const { removeFromCart } = useCart();

  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // Shipping Form State
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "Cash on Delivery",
    notes: "",
  });

  // Auto-fill user email & name from Clerk if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName:
          prev.customerName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.username ||
          "",
        customerEmail:
          prev.customerEmail || user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user]);

  // Load selected items from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("checkout_items");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        } else {
          router.push("/cart");
        }
      } catch (err) {
        console.error("Failed to parse checkout items:", err);
        router.push("/cart");
      }
    } else {
      router.push("/cart");
    }
  }, [router]);

  // Calculations
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = Math.round(subtotal * 0.2); // 20% Discount
  const deliveryFee = items.length > 0 ? 250 : 0; // Standard delivery fee in PKR (Rs. 250)
  const totalAmount = subtotal - discount + deliveryFee;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!isSignedIn) {
      alert("Pehlay login karna zaroori hai!");
      return;
    }

    // Basic Phone Number Validation (Pakistani format check)
    const phoneRegex = /^03\d{9}$/;
    const cleanPhone = formData.customerPhone.replace(/[\s-]/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      alert("Barah-e-karam sahi Pakistani mobile number likhein (e.g. 03001234567)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          customerPhone: cleanPhone,
          items,
          totalAmount,
          userId: user?.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.url) {
          localStorage.removeItem("checkout_items");
          items.forEach((item) => removeFromCart(item.id));
          window.location.href = data.url; // Redirect to Stripe Checkout
        } else if (data.success) {
          localStorage.removeItem("checkout_items");
          items.forEach((item) => removeFromCart(item.id));

          setPlacedOrderId(data.order.id);
          setOrderSuccess(true);
        } else {
          alert(data.error || "Order place karne mein masla aya hai.");
        }
      } else {
        alert(data.error || "Order place karne mein masla aya hai.");
      }
    } catch (error) {
      console.error("Checkout Submit Error:", error);
      alert("Network error. Dobara koshish karein.");
    } finally {
      setLoading(false);
    }
  };

  // Order Success Screen
  if (orderSuccess) {
    return (
      <main className="w-full bg-white min-h-screen flex flex-col justify-between">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] py-20 flex-1 flex items-center justify-center">
          <div className="max-w-md w-full border border-black/10 rounded-[24px] p-8 text-center shadow-xl bg-white space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce">
              <FaCheckCircle />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black uppercase">
                Order Confirmed!
              </h1>
              <p className="text-black/60 text-sm mt-2">
                Shukriya! Aapka order successfully place ho chuka hai.
              </p>
            </div>
            {placedOrderId && (
              <div className="bg-[#F0EEED] p-3.5 rounded-xl text-xs sm:text-sm font-mono text-black/80">
                Order ID: <span className="font-bold text-black">{placedOrderId}</span>
              </div>
            )}
            <div className="flex flex-col gap-3 pt-2">
              {placedOrderId && (
                <Link
                  href={`/order-success?id=${placedOrderId}`}
                  className="w-full bg-black text-white py-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-black/80 transition-all cursor-pointer shadow-md"
                >
                  <FaSearchLocation /> Track Order
                </Link>
              )}
              <Link
                href="/"
                className="w-full border border-black text-black py-4 rounded-full font-medium text-sm inline-block hover:bg-black hover:text-white transition-all cursor-pointer"
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ImSpinner2 className="animate-spin text-3xl text-black" />
      </div>
    );
  }

  return (
    <main className="w-full bg-white">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] py-4 text-black/60 text-sm flex items-center gap-2">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <IoIosArrowForward size={12} />
        <Link href="/cart" className="hover:text-black">
          Cart
        </Link>
        <IoIosArrowForward size={12} />
        <span className="text-black font-medium">Checkout</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] pb-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-black font-bold text-2xl sm:text-[32px] uppercase">
            Checkout
          </h1>
          <Link
            href="/cart"
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-black/60 hover:text-black transition-colors"
          >
            <FaArrowLeft size={12} /> Back to Cart
          </Link>
        </div>

        {!isSignedIn && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-amber-900">
              <span className="font-bold">Note:</span> Order place karne ke liye aapka account mein login hona lazmi hai taake aap apni order history track kar sakien.
            </p>
            <SignInButton mode="modal">
              <button className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 hover:bg-black/80 transition-all cursor-pointer">
                Login / Sign Up
              </button>
            </SignInButton>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Side: Delivery Details & Payment */}
          <div className="w-full lg:flex-1 space-y-6">
            <div className="border border-black/10 rounded-[20px] p-5 sm:p-7 space-y-4 bg-white shadow-xs">
              <h2 className="font-bold text-black text-lg sm:text-xl border-b border-black/10 pb-3">
                1. Shipping Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-black/70 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Amna Imran"
                    className="w-full px-4 py-3 border border-black/15 rounded-xl text-sm outline-none focus:border-black transition-all bg-[#F9F9F9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-black/70 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="03001234567"
                    className="w-full px-4 py-3 border border-black/15 rounded-xl text-sm outline-none focus:border-black transition-all bg-[#F9F9F9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-black/70 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  required
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="amna@example.com"
                  className="w-full px-4 py-3 border border-black/15 rounded-xl text-sm outline-none focus:border-black transition-all bg-[#F9F9F9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-black/70 mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House #, Street name, Area"
                  className="w-full px-4 py-3 border border-black/15 rounded-xl text-sm outline-none focus:border-black transition-all bg-[#F9F9F9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-black/70 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Gujrat"
                    className="w-full px-4 py-3 border border-black/15 rounded-xl text-sm outline-none focus:border-black transition-all bg-[#F9F9F9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-black/70 mb-1.5">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="50700"
                    className="w-full px-4 py-3 border border-black/15 rounded-xl text-sm outline-none focus:border-black transition-all bg-[#F9F9F9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-black/70 mb-1.5">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special instructions for delivery..."
                  className="w-full px-4 py-3 border border-black/15 rounded-xl text-sm outline-none focus:border-black transition-all bg-[#F9F9F9] resize-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="border border-black/10 rounded-[20px] p-5 sm:p-7 space-y-4 bg-white shadow-xs">
              <h2 className="font-bold text-black text-lg sm:text-xl border-b border-black/10 pb-3">
                2. Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === "Cash on Delivery"
                      ? "border-black bg-black/5"
                      : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === "Cash on Delivery"}
                    onChange={handleChange}
                    className="mt-1 accent-black cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-black">
                      <FaMoneyBillWave className="text-green-600" /> Cash on Delivery
                    </div>
                    <p className="text-xs text-black/60 mt-1">
                      Pay with cash upon delivery.
                    </p>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === "Bank Transfer"
                      ? "border-black bg-black/5"
                      : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bank Transfer"
                    checked={formData.paymentMethod === "Bank Transfer"}
                    onChange={handleChange}
                    className="mt-1 accent-black cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-black">
                      <FaCreditCard className="text-blue-600" /> Bank Transfer
                    </div>
                    <p className="text-xs text-black/60 mt-1">
                      Direct account transfer.
                    </p>
                  </div>
                </label>

                {/* Stripe Payment */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === "Stripe"
                      ? "border-black bg-black/5"
                      : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Stripe"
                    checked={formData.paymentMethod === "Stripe"}
                    onChange={handleChange}
                    className="mt-1 accent-black cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-black">
                      <FaCreditCard className="text-purple-600" /> Pay with Stripe
                    </div>
                    <p className="text-xs text-black/60 mt-1">
                      Secure online credit/debit card.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-[#F0EEED] rounded-2xl text-center text-xs text-black/70">
              <div className="flex flex-col items-center gap-1">
                <FaLock className="text-black text-base" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <FaTruck className="text-black text-base" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <FaShieldAlt className="text-black text-base" />
                <span>Verified Purchase</span>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="w-full lg:w-[480px] border border-black/10 rounded-[20px] p-5 sm:p-6 flex flex-col gap-6 sticky top-6 bg-white shadow-xs">
            <h2 className="font-bold text-black text-xl border-b border-black/10 pb-3">
              Order Summary ({items.length} items)
            </h2>

            <div className="flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.id}-${item.size || ""}-${item.color || ""}`} className="flex gap-3 items-center">
                  <div className="w-16 h-16 bg-[#F0EEED] rounded-xl relative shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-black text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-black/60">
                      Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ""}
                    </p>
                    <p className="font-bold text-xs mt-0.5 text-black">Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <span className="font-bold text-sm text-black">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-black/10" />

            <div className="flex flex-col gap-3 text-black/60 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-black">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount (-20%)</span>
                <span className="font-bold text-[#FF3333]">-Rs. {discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-black">Rs. {deliveryFee.toLocaleString()}</span>
              </div>
            </div>

            <hr className="border-black/10" />

            <div className="flex justify-between text-lg text-black font-bold">
              <span>Total Amount</span>
              <span className="text-2xl">Rs. {totalAmount.toLocaleString()}</span>
            </div>

            {isSignedIn ? (
              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full bg-black text-white py-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-black/80 transition-all cursor-pointer shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <ImSpinner2 className="animate-spin text-lg" /> Processing Order...
                  </>
                ) : (
                  <>Complete Order (Rs. {totalAmount.toLocaleString()})</>
                )}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="w-full bg-black text-white py-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-black/80 transition-all cursor-pointer shadow-lg"
                >
                  Login to Complete Order
                </button>
              </SignInButton>
            )}
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}