"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      size: "Large", // Default size agar user card se direct add kare
      color: "Default",
    });
  };

  return (
    <div className="group flex flex-col">
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F0EEED] shadow-sm transition-all duration-300">
        
        {/* Top-Left Badge */}
        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-white/90 backdrop-blur-md text-black text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-xs">
          New Arrival
        </span>

        {/* Top-Right Wishlist Button */}
        <button 
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 hover:text-red-500 hover:bg-white transition-all shadow-xs cursor-pointer active:scale-90"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Product Image Link */}
        <Link href={`/shop/product/${product.id}`} className="block w-full h-full">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" 
          />
        </Link>

        {/* Add to Cart Button */}
        <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4">
          <button 
            onClick={handleAdd}
            className="w-full bg-white/95 hover:bg-black hover:text-white text-black text-xs sm:text-sm font-bold py-3 px-4 rounded-full shadow-md flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="mt-3 sm:mt-4 flex flex-col space-y-1 sm:space-y-1.5">
        <Link href={`/shop/product/${product.id}`}>
          <h3 className="font-bold text-sm sm:text-base text-gray-900 hover:text-gray-600 transition truncate tracking-tight">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-400">4.8</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-base sm:text-lg font-black text-gray-900">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}