"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import { BsTrash } from "react-icons/bs";
import { FiTag } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import Footer from "@/components/layout/Footer";

export default function CartPage() {
  // Cart items state with your public folder product images
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Gradient Graphic T-shirt",
      size: "Large",
      color: "White",
      price: 145,
      image: "/product-5.png",
      quantity: 1,
    },
    {
      id: 2,
      name: "Checkered Shirt",
      size: "Medium",
      color: "Red",
      price: 180,
      image: "/product-9.png",
      quantity: 1,
    },
    {
      id: 3,
      name: "Skinny Fit Jeans",
      size: "Large",
      color: "Blue",
      price: 240,
      image: "/product-8.png",
      quantity: 1,
    },
  ]);

  // Quantity increase handler
  const handleIncrement = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Quantity decrease handler
  const handleDecrement = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Item remove (delete) handler
  const handleRemove = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = Math.round(subtotal * 0.2); // 20% discount matching design
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const total = subtotal - discount + deliveryFee;

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

        {cartItems.length === 0 ? (
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
              {cartItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="flex gap-4 items-start justify-between">
                    {/* Product Image */}
                    <div className="w-[100px] h-[100px] sm:w-[124px] sm:h-[124px] bg-[#F0EEED] rounded-[16px] relative shrink-0 overflow-hidden flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between h-full min-h-[100px] sm:min-h-[124px]">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-black text-base sm:text-lg">
                            {item.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-black/60 mt-1">
                            Size: <span className="text-black">{item.size}</span>
                          </p>
                          <p className="text-xs sm:text-sm text-black/60">
                            Color: <span className="text-black">{item.color}</span>
                          </p>
                        </div>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleRemove(item.id)}
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
                            onClick={() => handleDecrement(item.id)}
                            className="text-black font-bold cursor-pointer hover:opacity-60"
                          >
                            -
                          </button>
                          <span className="text-black font-medium text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item.id)}
                            className="text-black font-bold cursor-pointer hover:opacity-60"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider between items */}
                  {index < cartItems.length - 1 && (
                    <hr className="border-black/10" />
                  )}
                </React.Fragment>
              ))}
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
                  <span>Discount (-20%)</span>
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

              {/* Promo Code Input */}
              <div className="flex gap-3">
                <div className="flex-1 flex items-center bg-[#F0F0F0] rounded-full px-4 py-3 gap-3">
                  <FiTag className="text-black/40" size={20} />
                  <input
                    type="text"
                    placeholder="Add promo code"
                    className="bg-transparent text-sm outline-none w-full text-black placeholder:text-black/40"
                  />
                </div>
                <button className="bg-black text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-black/80 transition-all cursor-pointer">
                  Apply
                </button>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-black text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-black/80 transition-all cursor-pointer">
                Go to Checkout <FaArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Component Imported */}
      <Footer />
    </main>
  );
}