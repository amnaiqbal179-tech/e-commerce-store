"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import { BsTrash } from "react-icons/bs";
import { FiTag } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import { Tag } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useUser } from "@clerk/nextjs"; // 1. Clerk hook import kiya

interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  isActive?: boolean;
  expiryDate?: string;
}

export default function CartPage() {
  const router = useRouter();
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const { isSignedIn } = useUser(); // 2. User ki login state check karne ke liye

  // Item ki unique key generate karne ke liye helper
  const getItemKey = (item: any) => `${item.id}-${item.size || ""}-${item.color || ""}`;

  // Selected items store karne ke liye state
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Promo code states
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  // Page load hone par ya cart update hone par default sab items select karein aur admin-generated coupons fetch karein
  useEffect(() => {
    setSelectedKeys(cart.map((item) => getItemKey(item)));

    // Database / Admin dashboard se available coupons fetch karne ke liye API call
    async function fetchCoupons() {
      try {
        const res = await fetch("/api/coupons");
        if (res.ok) {
          const data = await res.json();
          let couponsList: Coupon[] = [];
          
          if (Array.isArray(data)) {
            couponsList = data;
          } else if (data.coupons && Array.isArray(data.coupons)) {
            couponsList = data.coupons;
          }

          // Sirf active aur valid coupons filter karein jo admin dashboard se generate huwe hain
          const activeCoupons = couponsList.filter((c: any) => 
            c.isActive !== false && 
            (!c.expiryDate || new Date(c.expiryDate) > new Date())
          );

          setAvailableCoupons(activeCoupons.length > 0 ? activeCoupons : couponsList);
        }
      } catch (error) {
        console.error("Failed to fetch coupons", error);
      }
    }
    fetchCoupons();
  }, [cart]);

  // Individual checkbox toggle logic
  const toggleSelect = (key: string) => {
    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== key));
    } else {
      setSelectedKeys([...selectedKeys, key]);
    }
  };

  // Select All toggle logic
  const toggleSelectAll = () => {
    if (selectedKeys.length === cart.length) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(cart.map((item) => getItemKey(item)));
    }
  };

  // Sirf selected items ke mutabiq items filter karein
  const selectedCartItems = cart.filter((item) =>
    selectedKeys.includes(getItemKey(item))
  );

  // Sirf selected items ke mutabiq calculation
  const subtotal = selectedCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Dynamic Discount calculation (Agar coupon applied hai toh uska percent, warna default 20% ya 0)
  const discountPercent = appliedCoupon ? appliedCoupon.discountPercent : 20;
  const discount = Math.round((subtotal * discountPercent) / 100);
  
  const deliveryFee = selectedCartItems.length > 0 ? 15 : 0;
  const total = subtotal - discount + deliveryFee;

  // Handle Apply Promo Code API call (Supports both manual input and tag click)
  const handleApplyCoupon = async (codeToApply?: string) => {
    const codeVal = codeToApply || promoCodeInput;
    if (!codeVal.trim()) {
      setCouponError("Please enter a promo code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code: codeVal.trim(),
          cartTotal: subtotal // Backend par minimum order limit check karne ke liye zaroori hai
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAppliedCoupon({
          code: codeVal.trim().toUpperCase(),
          discountPercent: data.discountPercent,
        });
        setCouponError("");
        setPromoCodeInput("");
      } else {
        setCouponError(data.message || "Invalid or expired promo code");
      }
    } catch (error) {
      setCouponError("Something went wrong. Try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Checkout redirect function (Clerk Auth Check Added)
  const handleProceedToCheckout = () => {
    if (selectedCartItems.length === 0) {
      alert("Please select at least one item to proceed to checkout!");
      return;
    }

    // Selected items aur applied coupon ko localStorage mein save karein taake Checkout page read kar sake
    localStorage.setItem("checkout_items", JSON.stringify(selectedCartItems));
    if (appliedCoupon) {
      localStorage.setItem("applied_coupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("applied_coupon");
    }

    // 3. Check karein ke user logged-in hai ya nahi
    if (!isSignedIn) {
      // Agar logged-in nahi hai, toh Clerk ke sign-in page par bhej dein aur wapas checkout par laane ke liye redirect_url set karein
      router.push("/sign-in?redirect_url=/checkout");
      return;
    }

    // Agar logged-in hai, toh seedha checkout page par redirect karein
    router.push("/checkout");
  };

  return (
    <main className="w-full bg-white">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] py-4 text-black/60 text-sm flex items-center gap-2">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <IoIosArrowForward size={12} />
        <span className="text-black font-medium">Cart</span>
      </div>

      {/* Main Cart Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] pb-20">
        <h1 className="text-black font-bold text-2xl sm:text-[32px] uppercase mb-6">
          Your cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 border border-black/10 rounded-[20px]">
            <p className="text-black/60 text-lg mb-4">Your cart is empty.</p>
            <Link
              href="/"
              className="bg-black text-white px-8 py-3 rounded-full font-medium inline-block hover:bg-black/80 transition-all"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5 items-start">

            {/* Left: Cart Items List */}
            <div className="w-full lg:flex-1 border border-black/10 rounded-[20px] p-4 sm:p-6 flex flex-col gap-6">

              {/* Select All Checkbox Header */}
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <input
                  type="checkbox"
                  checked={selectedKeys.length === cart.length && cart.length > 0}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 accent-black cursor-pointer rounded-md"
                />
                <span className="text-black font-semibold text-sm sm:text-base">
                  Select All ({selectedCartItems.length}/{cart.length} selected)
                </span>
              </div>

              {cart.map((item, index) => {
                const itemKey = getItemKey(item);
                const isSelected = selectedKeys.includes(itemKey);

                return (
                  <React.Fragment key={itemKey}>
                    <div className="flex gap-3 sm:gap-4 items-center justify-between">

                      {/* Item Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(itemKey)}
                        className="w-5 h-5 accent-black cursor-pointer rounded-md shrink-0"
                      />

                      {/* Product Image */}
                      <div className="w-[90px] h-[90px] sm:w-[124px] sm:h-[124px] bg-[#F0EEED] rounded-[16px] relative shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between h-full min-h-[90px] sm:min-h-[124px]">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-black text-base sm:text-lg">
                              {item.name}
                            </h3>
                            {item.size && (
                              <p className="text-xs sm:text-sm text-black/60 mt-1">
                                Size: <span className="text-black">{item.size}</span>
                              </p>
                            )}
                            {item.color && (
                              <p className="text-xs sm:text-sm text-black/60">
                                Color: <span className="text-black">{item.color}</span>
                              </p>
                            )}
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#FF3333] cursor-pointer hover:opacity-80 p-1"
                            title="Remove item"
                          >
                            <BsTrash size={20} />
                          </button>
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex justify-between items-center mt-3">
                          <span className="font-bold text-black text-xl sm:text-2xl">
                            ${item.price * item.quantity}
                          </span>

                          {/* Quantity Button (+ / -) */}
                          <div className="flex items-center bg-[#F0F0F0] rounded-full px-3 py-1.5 sm:py-2 gap-4">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="text-black font-bold cursor-pointer hover:opacity-60"
                            >
                              -
                            </button>
                            <span className="text-black font-medium text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="text-black font-bold cursor-pointer hover:opacity-60"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Divider between items */}
                    {index < cart.length - 1 && (
                      <hr className="border-black/10" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Right: Order Summary */}
            <div className="w-full lg:w-[505px] border border-black/10 rounded-[20px] p-5 sm:p-6 flex flex-col gap-6">
              <h2 className="font-bold text-black text-xl">Order Summary</h2>

              <div className="flex flex-col gap-4 text-black/60 text-base sm:text-lg">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount ({appliedCoupon ? `${appliedCoupon.code} - ` : ''}{discountPercent}%)</span>
                  <span className="font-bold text-[#FF3333]">-${discount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-black">${deliveryFee}</span>
                </div>
              </div>

              <hr className="border-black/10" />

              <div className="flex justify-between text-base sm:text-lg text-black font-bold">
                <span>Total</span>
                <span className="text-xl sm:text-2xl">${total}</span>
              </div>

              {/* Available Coupons Tags Section (Admin Generated Coupons Only) */}
              {availableCoupons.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-black/60 uppercase tracking-wider">
                    Available Promo Codes:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableCoupons.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleApplyCoupon(c.code)}
                        type="button"
                        className="flex items-center space-x-1 bg-gray-50 hover:bg-black hover:text-white border border-dashed border-black/20 text-black text-xs px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
                      >
                        <Tag size={12} className="mr-1 inline" />
                        <span>{c.code} ({c.discountPercent}% OFF)</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Promo Code Input & Application */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <div className="flex-1 flex items-center bg-[#F0F0F0] rounded-full px-4 py-3 gap-3">
                    <FiTag className="text-black/40" size={20} />
                    <input
                      type="text"
                      placeholder="Add promo code"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="bg-transparent text-sm outline-none w-full text-black placeholder:text-black/40 uppercase"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={isApplyingCoupon}
                    className="bg-black text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-black/80 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isApplyingCoupon ? "Applying..." : "Apply"}
                  </button>
                </div>

                {appliedCoupon && (
                  <p className="text-green-600 text-xs sm:text-sm font-medium">
                    Coupon &quot;{appliedCoupon.code}&quot; applied successfully! ({appliedCoupon.discountPercent}% off)
                  </p>
                )}

                {couponError && (
                  <p className="text-[#FF3333] text-xs sm:text-sm font-medium">
                    {couponError}
                  </p>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                disabled={selectedCartItems.length === 0}
                className="w-full bg-black text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-black/80 transition-all cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Go to Checkout ({selectedCartItems.length}) <FaArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Component */}
      <Footer />
    </main>
  );
}