"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { FiSliders } from "react-icons/fi";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Footer from "@/components/layout/Footer";

export default function StylePage() {
  const params = useParams();
  const styleParam = (params?.style as string) || "casual";

  // Mobile filter drawer state
  const [showFilterModal, setShowFilterModal] = useState(false);

  // URL parameter ko formatted title mein convert karna (e.g., "casual" -> "Casual")
  const formattedTitle = styleParam
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Dummy products list matching the design
  const products = [
    {
      id: 1,
      title: "Gradient Graphic T-shirt",
      image: "/product-5.png",
      rating: "3.5",
      price: "$145",
      oldPrice: "$242",
      discount: "-20%",
    },
    {
      id: 2,
      title: "Polo with Tipping Details",
      image: "/product-6.png",
      rating: "4.5",
      price: "$180",
      oldPrice: "$242",
      discount: "-20%",
    },
    {
      id: 3,
      title: "Black Striped T-shirt",
      image: "/product-7.png",
      rating: "4.0",
      price: "$120",
      oldPrice: "$150",
      discount: "-30%",
    },
    {
      id: 4,
      title: "Skinny Fit Jeans",
      image: "/product-8.png",
      rating: "3.5",
      price: "$240",
      oldPrice: "$260",
      discount: "-20%",
    },
    {
      id: 5,
      title: "Checkered Shirt",
      image: "/product-9.png",
      rating: "4.5",
      price: "$180",
    },
    {
      id: 6,
      title: "Sleeve Striped T-shirt",
      image: "/product-10.png",
      rating: "4.5",
      price: "$130",
      oldPrice: "$160",
      discount: "-30%",
    },
    {
      id: 7,
      title: "Vertical Striped Shirt",
      image: "/product-11.png",
      rating: "5.0",
      price: "$212",
      oldPrice: "$232",
      discount: "-20%",
    },
    {
      id: 8,
      title: "Courage Graphic T-shirt",
      image: "/product-12.png",
      rating: "4.0",
      price: "$145",
    },
    {
      id: 9,
      title: "Loose Fit Bermuda Shorts",
      image: "/product-13.png",
      rating: "3.0",
      price: "$80",
    },
  ];

  // Reusable Filter Content Component to avoid code duplication
  const FilterContent = () => (
    <div className="flex flex-col h-full">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-5 border-b border-black/10">
        <span className="font-bold text-black text-xl">Filters</span>
        <div className="flex items-center gap-2">
          <FiSliders size={20} className="text-black/60 cursor-pointer" />
          {showFilterModal && (
            <button onClick={() => setShowFilterModal(false)} className="lg:hidden text-black">
              <IoClose size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Categories List */}
      <div className="py-5 border-b border-black/10 flex flex-col gap-4 text-black/60 text-sm">
        <div className="flex justify-between items-center cursor-pointer hover:text-black"><span>T-shirts</span> <IoIosArrowForward /></div>
        <div className="flex justify-between items-center cursor-pointer hover:text-black"><span>Shorts</span> <IoIosArrowForward /></div>
        <div className="flex justify-between items-center cursor-pointer hover:text-black"><span>Shirts</span> <IoIosArrowForward /></div>
        <div className="flex justify-between items-center cursor-pointer hover:text-black"><span>Hoodie</span> <IoIosArrowForward /></div>
        <div className="flex justify-between items-center cursor-pointer hover:text-black"><span>Jeans</span> <IoIosArrowForward /></div>
      </div>

      {/* Price Filter */}
      <div className="py-5 border-b border-black/10">
        <div className="flex justify-between items-center font-bold text-black mb-4">
          <span>Price</span>
          <span className="text-black/60">▲</span>
        </div>
        <div className="w-full bg-black/10 h-1 rounded-full relative mb-4">
          <div className="absolute left-[20%] right-[30%] bg-black h-full rounded-full"></div>
          <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full cursor-pointer"></div>
          <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full cursor-pointer"></div>
        </div>
        <div className="flex justify-between text-sm font-medium text-black">
          <span>$50</span>
          <span>$200</span>
        </div>
      </div>

      {/* Colors Filter */}
      <div className="py-5 border-b border-black/10">
        <div className="flex justify-between items-center font-bold text-black mb-4">
          <span>Colors</span>
          <span className="text-black/60">▲</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          <div className="w-9 h-9 rounded-full bg-[#00C12B] cursor-pointer"></div>
          <div className="w-9 h-9 rounded-full bg-[#F50606] cursor-pointer"></div>
          <div className="w-9 h-9 rounded-full bg-[#F5DD06] cursor-pointer"></div>
          <div className="w-9 h-9 rounded-full bg-[#F57906] cursor-pointer"></div>
          <div className="w-9 h-9 rounded-full bg-[#06CAF5] cursor-pointer"></div>
          <div className="w-9 h-9 rounded-full bg-[#063AF5] flex items-center justify-center text-white cursor-pointer">✓</div>
          <div className="w-9 h-9 rounded-full bg-[#7D06F5] cursor-pointer"></div>
          <div className="w-9 h-9 rounded-full bg-[#F506A2] cursor-pointer"></div>
          <div className="w-9 h-9 rounded-full bg-white border border-black/20 cursor-pointer"></div>
          <div className="w-9 h-9 rounded-full bg-black cursor-pointer"></div>
        </div>
      </div>

      {/* Size Filter */}
      <div className="py-5 border-b border-black/10">
        <div className="flex justify-between items-center font-bold text-black mb-4">
          <span>Size</span>
          <span className="text-black/60">▲</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="bg-[#F0F0F0] text-black/60 text-xs px-4 py-2.5 rounded-full cursor-pointer hover:bg-black hover:text-white transition-all">XX-Small</span>
          <span className="bg-[#F0F0F0] text-black/60 text-xs px-4 py-2.5 rounded-full cursor-pointer hover:bg-black hover:text-white transition-all">X-Small</span>
          <span className="bg-[#F0F0F0] text-black/60 text-xs px-4 py-2.5 rounded-full cursor-pointer hover:bg-black hover:text-white transition-all">Small</span>
          <span className="bg-[#F0F0F0] text-black/60 text-xs px-4 py-2.5 rounded-full cursor-pointer hover:bg-black hover:text-white transition-all">Medium</span>
          <span className="bg-black text-white text-xs px-4 py-2.5 rounded-full cursor-pointer">Large</span>
          <span className="bg-[#F0F0F0] text-black/60 text-xs px-4 py-2.5 rounded-full cursor-pointer hover:bg-black hover:text-white transition-all">X-Large</span>
          <span className="bg-[#F0F0F0] text-black/60 text-xs px-4 py-2.5 rounded-full cursor-pointer hover:bg-black hover:text-white transition-all">XX-Large</span>
          <span className="bg-[#F0F0F0] text-black/60 text-xs px-4 py-2.5 rounded-full cursor-pointer hover:bg-black hover:text-white transition-all">3X-Large</span>
          <span className="bg-[#F0F0F0] text-black/60 text-xs px-4 py-2.5 rounded-full cursor-pointer hover:bg-black hover:text-white transition-all">4X-Large</span>
        </div>
      </div>

      {/* Dress Style Filter */}
      <div className="py-5 border-b border-black/10">
        <div className="flex justify-between items-center font-bold text-black mb-4">
          <span>Dress Style</span>
          <span className="text-black/60">▲</span>
        </div>
        <div className="flex flex-col gap-3 text-sm text-black/60">
          <div className="flex justify-between items-center cursor-pointer hover:text-black"><span>Casual</span> <IoIosArrowForward /></div>
          <div className="flex justify-between items-center cursor-pointer hover:text-black"><span>Formal</span> <IoIosArrowForward /></div>
          <div className="flex justify-between items-center cursor-pointer hover:text-black"><span>Party</span> <IoIosArrowForward /></div>
          <div className="flex justify-between items-center cursor-pointer hover:text-black"><span>Gym</span> <IoIosArrowForward /></div>
        </div>
      </div>

      {/* Apply Filter Button */}
      <button 
        onClick={() => setShowFilterModal(false)}
        className="w-full bg-black text-white py-4 rounded-full font-medium mt-6 hover:bg-black/80 transition-all cursor-pointer mb-6"
      >
        Apply Filter
      </button>
    </div>
  );

  return (
    <main className="w-full bg-white">
      
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] py-4 text-black/60 text-sm flex items-center gap-2">
        <Link href="/" className="hover:text-black">Home</Link> 
        <IoIosArrowForward size={12} />
        <span className="text-black font-medium capitalize">{formattedTitle}</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] pb-20">
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          
          {/* Desktop Left Sidebar: Filters */}
          <div className="hidden lg:block w-[295px] border border-black/10 rounded-[20px] p-6 shrink-0">
            <FilterContent />
          </div>

          {/* Mobile Filter Modal / Drawer */}
          {showFilterModal && (
            <div className="fixed inset-0 z-50 bg-black/50 flex justify-end lg:hidden">
              <div className="w-full max-w-[385px] bg-white h-full overflow-y-auto p-5 rounded-l-[25px]">
                <FilterContent />
              </div>
            </div>
          )}

          {/* Right Area: Products & Header */}
          <div className="flex-1 w-full">
            
            {/* Top Bar (Title & Sorting) */}
            <div className="flex flex-row items-center justify-between mb-6 gap-3">
              <h1 className="text-black font-bold text-2xl sm:text-[32px] capitalize">{formattedTitle}</h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-black/60 hidden sm:inline">Showing 1-9 of 100 Products</span>
                <div className="hidden md:flex items-center gap-1 text-black">
                  <span className="text-black/60">Sort by:</span> 
                  <span className="font-bold cursor-pointer">Most Popular ▼</span>
                </div>
                {/* Mobile Filter Button */}
                <button 
                  onClick={() => setShowFilterModal(true)}
                  className="lg:hidden w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center text-black cursor-pointer hover:bg-black hover:text-white transition-all"
                >
                  <FiSliders size={18} />
                </button>
              </div>
            </div>

            {/* Products Grid (2 columns on mobile, 3 columns on desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-3 sm:gap-x-4">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col gap-3 group cursor-pointer">
                  <div className="w-full h-[180px] sm:h-[250px] lg:h-[298px] rounded-[20px] bg-[#F0EEED] overflow-hidden relative flex items-center justify-center">
                    <Image 
                      src={product.image} 
                      alt={product.title} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-black text-sm sm:text-base lg:text-lg truncate">{product.title}</h3>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="flex text-[#FFC633] gap-0.5 sm:gap-1">
                      {[...Array(5)].map((_, i) => (<FaStar key={i} size={12} />))}
                    </div>
                    <span className="text-black text-xs sm:text-sm">{product.rating}/<span className="text-black/60">5</span></span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-bold text-black text-base sm:text-xl">{product.price}</span>
                    {product.oldPrice && <span className="font-bold text-black/30 text-sm sm:text-xl line-through">{product.oldPrice}</span>}
                    {product.discount && <span className="bg-[#FF3333]/10 text-[#FF3333] text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">{product.discount}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-black/10 pt-6 mt-10">
              <button className="flex items-center gap-1 sm:gap-2 border border-black/10 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-black hover:text-white transition-all cursor-pointer">
                <IoIosArrowBack /> Previous
              </button>
              
              <div className="hidden sm:flex items-center gap-1">
                <span className="w-10 h-10 flex items-center justify-center bg-black/10 font-medium rounded-lg cursor-pointer">1</span>
                <span className="w-10 h-10 flex items-center justify-center hover:bg-black/10 font-medium rounded-lg cursor-pointer">2</span>
                <span className="w-10 h-10 flex items-center justify-center hover:bg-black/10 font-medium rounded-lg cursor-pointer">3</span>
                <span className="w-10 h-10 flex items-center justify-center text-black/40">...</span>
                <span className="w-10 h-10 flex items-center justify-center hover:bg-black/10 font-medium rounded-lg cursor-pointer">8</span>
                <span className="w-10 h-10 flex items-center justify-center hover:bg-black/10 font-medium rounded-lg cursor-pointer">9</span>
                <span className="w-10 h-10 flex items-center justify-center hover:bg-black/10 font-medium rounded-lg cursor-pointer">10</span>
              </div>

              <button className="flex items-center gap-1 sm:gap-2 border border-black/10 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-black hover:text-white transition-all cursor-pointer">
                Next <IoIosArrowForward />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Footer Component */}
      <Footer />

    </main>
  );
}