"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  ShoppingCart, 
  CircleUserRound, 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X 
} from "lucide-react";

export default function Navbar() {
  // Desktop Dropdown States
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Mobile Drawer & Search States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [mobileCategory, setMobileCategory] = useState<string | null>(null);

  const toggleMobileCategory = (cat: string) => {
    setMobileCategory(mobileCategory === cat ? null : cat);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileShopOpen(false);
    setMobileCategory(null);
  };

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-black/10">
      
      {/* Top Main Navbar Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[100px] py-3.5 sm:py-5 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left Side: Mobile Menu Icon & Logo */}
        <div className="flex items-center gap-3 lg:gap-8">
          {/* Mobile Hamburger Menu Icon Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="block lg:hidden text-black hover:opacity-75 transition-opacity p-1 cursor-pointer" 
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>

          {/* SHOP.CO Logo */}
          <Link 
            href="/" 
            className="font-extrabold text-[22px] sm:text-[28px] lg:text-[32px] tracking-tight leading-none text-black shrink-0"
          >
            SHOP.CO
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex flex-row items-center gap-6 font-medium text-[16px] text-black shrink-0">
          
          {/* Shop Dropdown Menu (Desktop) */}
          <div 
            className="relative"
            onMouseEnter={() => setIsShopOpen(true)}
            onMouseLeave={() => {
              setIsShopOpen(false);
              setActiveCategory(null);
            }}
          >
            <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-75 py-2 transition-opacity">
              <span>Shop</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isShopOpen ? "rotate-180" : ""}`} />
            </div>

            {/* Main Shop Dropdown */}
            {isShopOpen && (
              <div className="absolute top-full left-0 w-52 bg-white border border-black/10 rounded-2xl shadow-xl py-2 z-50">
                
                {/* Men Category */}
                <div 
                  className="relative px-4 py-2.5 hover:bg-[#F0EEED] flex items-center justify-between cursor-pointer transition-colors"
                  onMouseEnter={() => setActiveCategory("men")}
                >
                  <span className="font-medium text-black">Men</span>
                  <ChevronRight size={14} />

                  {/* Men Subcategories */}
                  {activeCategory === "men" && (
                    <div className="absolute left-full top-0 w-52 bg-white border border-black/10 rounded-2xl shadow-xl py-2 z-50">
                      <Link href="/shop/men/t-shirts" className="block px-4 py-2.5 hover:bg-[#F0EEED] text-black font-medium transition-colors">
                        T-shirts
                      </Link>
                      <Link href="/shop/men/shalwar-kameez" className="block px-4 py-2.5 hover:bg-[#F0EEED] text-black font-medium transition-colors">
                        Shalwar Kameez
                      </Link>
                      <Link href="/shop/men/jeans" className="block px-4 py-2.5 hover:bg-[#F0EEED] text-black font-medium transition-colors">
                        Jeans
                      </Link>
                    </div>
                  )}
                </div>

                {/* Women Category */}
                <div 
                  className="relative px-4 py-2.5 hover:bg-[#F0EEED] flex items-center justify-between cursor-pointer transition-colors"
                  onMouseEnter={() => setActiveCategory("women")}
                >
                  <span className="font-medium text-black">Women</span>
                  <ChevronRight size={14} />

                  {activeCategory === "women" && (
                    <div className="absolute left-full top-0 w-52 bg-white border border-black/10 rounded-2xl shadow-xl py-2 z-50">
                      <Link href="/shop/women/dresses" className="block px-4 py-2.5 hover:bg-[#F0EEED] text-black font-medium transition-colors">
                        Dresses
                      </Link>
                      <Link href="/shop/women/tops" className="block px-4 py-2.5 hover:bg-[#F0EEED] text-black font-medium transition-colors">
                        Tops &amp; Kurtis
                      </Link>
                    </div>
                  )}
                </div>

                {/* Kids Category */}
                <div 
                  className="relative px-4 py-2.5 hover:bg-[#F0EEED] flex items-center justify-between cursor-pointer transition-colors"
                  onMouseEnter={() => setActiveCategory("kids")}
                >
                  <span className="font-medium text-black">Kids</span>
                  <ChevronRight size={14} />

                  {activeCategory === "kids" && (
                    <div className="absolute left-full top-0 w-52 bg-white border border-black/10 rounded-2xl shadow-xl py-2 z-50">
                      <Link href="/shop/kids/casual" className="block px-4 py-2.5 hover:bg-[#F0EEED] text-black font-medium transition-colors">
                        Casual Wear
                      </Link>
                      <Link href="/shop/kids/party" className="block px-4 py-2.5 hover:bg-[#F0EEED] text-black font-medium transition-colors">
                        Party Wear
                      </Link>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          <Link href="#on-sale" className="hover:opacity-75 transition-opacity">On Sale</Link>
          <Link href="#new-arrivals" className="hover:opacity-75 transition-opacity">New Arrivals</Link>
          <Link href="#brands" className="hover:opacity-75 transition-opacity">Brands</Link>
        </nav>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-row items-center px-4 py-2.5 gap-3 w-full max-w-[380px] lg:max-w-[570px] h-[44px] lg:h-[48px] bg-[#F0F0F0] rounded-full focus-within:ring-2 focus-within:ring-black/10 transition-all">
          <Search size={20} className="text-black/40 shrink-0" />
          <input
            type="text"
            placeholder="Search for products..."
            className="bg-transparent border-none outline-none w-full font-normal text-[14px] lg:text-[16px] text-black placeholder:text-black/40"
          />
        </div>

        {/* Right Action Icons (Search, Cart & User) */}
        <div className="flex flex-row items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Mobile Search Icon Button */}
          <button 
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="block md:hidden text-black hover:opacity-75 transition-opacity p-1 cursor-pointer" 
            aria-label="Toggle Search"
          >
            {isMobileSearchOpen ? <X size={22} /> : <Search size={22} strokeWidth={1.75} />}
          </button>

          {/* Cart Icon */}
          <Link 
            href="/cart" 
            aria-label="Cart" 
            className="text-black hover:opacity-75 w-8 h-8 flex items-center justify-center cursor-pointer transition-opacity relative"
          >
            <ShoppingCart size={22} strokeWidth={1.75} />
            {/* Optional Badge */}
            <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </Link>
          
          {/* User Account Icon */}
          <Link 
            href="/account" 
            aria-label="Account" 
            className="text-black hover:opacity-75 w-8 h-8 flex items-center justify-center cursor-pointer transition-opacity"
          >
            <CircleUserRound size={22} strokeWidth={1.75} />
          </Link>

        </div>

      </div>

      {/* Expandable Mobile Search Bar (Appears below header when mobile search icon is clicked) */}
      {isMobileSearchOpen && (
        <div className="block md:hidden px-4 pb-3.5 pt-1 bg-white border-t border-black/5 transition-all">
          <div className="flex items-center px-4 py-2.5 gap-2.5 bg-[#F0F0F0] rounded-full">
            <Search size={18} className="text-black/40 shrink-0" />
            <input
              type="text"
              placeholder="Search for products..."
              className="bg-transparent border-none outline-none w-full text-sm text-black placeholder:text-black/40"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Backdrop Shadow */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Navigation Drawer (Slide in from left) */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-[82%] max-w-[340px] bg-white z-50 lg:hidden overflow-y-auto transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="p-5 border-b border-black/10 flex items-center justify-between">
          <Link href="/" onClick={closeMobileMenu} className="font-extrabold text-[22px] tracking-tight text-black">
            SHOP.CO
          </Link>
          <button 
            onClick={closeMobileMenu}
            className="p-1.5 text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close Menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Mobile Navigation Body */}
        <div className="p-5 flex-1 space-y-4 font-medium text-base text-black">
          
          {/* Shop Accordion Item */}
          <div className="border-b border-gray-100 pb-3">
            <button 
              onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
              className="w-full flex items-center justify-between py-1.5 text-left text-black font-semibold cursor-pointer"
            >
              <span>Shop</span>
              <ChevronDown size={18} className={`transition-transform duration-200 ${isMobileShopOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Shop Accordion Content */}
            {isMobileShopOpen && (
              <div className="pl-3 mt-2 space-y-2 border-l-2 border-black/10">
                
                {/* Men Sub-accordion */}
                <div>
                  <button 
                    onClick={() => toggleMobileCategory("men")}
                    className="w-full flex items-center justify-between py-1.5 text-sm text-gray-800 font-medium cursor-pointer"
                  >
                    <span>Men</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${mobileCategory === "men" ? "rotate-180" : ""}`} />
                  </button>
                  {mobileCategory === "men" && (
                    <div className="pl-3 space-y-1.5 mt-1 text-sm text-gray-600">
                      <Link href="/shop/men/t-shirts" onClick={closeMobileMenu} className="block py-1 hover:text-black">T-shirts</Link>
                      <Link href="/shop/men/shalwar-kameez" onClick={closeMobileMenu} className="block py-1 hover:text-black">Shalwar Kameez</Link>
                      <Link href="/shop/men/jeans" onClick={closeMobileMenu} className="block py-1 hover:text-black">Jeans</Link>
                    </div>
                  )}
                </div>

                {/* Women Sub-accordion */}
                <div>
                  <button 
                    onClick={() => toggleMobileCategory("women")}
                    className="w-full flex items-center justify-between py-1.5 text-sm text-gray-800 font-medium cursor-pointer"
                  >
                    <span>Women</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${mobileCategory === "women" ? "rotate-180" : ""}`} />
                  </button>
                  {mobileCategory === "women" && (
                    <div className="pl-3 space-y-1.5 mt-1 text-sm text-gray-600">
                      <Link href="/shop/women/dresses" onClick={closeMobileMenu} className="block py-1 hover:text-black">Dresses</Link>
                      <Link href="/shop/women/tops" onClick={closeMobileMenu} className="block py-1 hover:text-black">Tops &amp; Kurtis</Link>
                    </div>
                  )}
                </div>

                {/* Kids Sub-accordion */}
                <div>
                  <button 
                    onClick={() => toggleMobileCategory("kids")}
                    className="w-full flex items-center justify-between py-1.5 text-sm text-gray-800 font-medium cursor-pointer"
                  >
                    <span>Kids</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${mobileCategory === "kids" ? "rotate-180" : ""}`} />
                  </button>
                  {mobileCategory === "kids" && (
                    <div className="pl-3 space-y-1.5 mt-1 text-sm text-gray-600">
                      <Link href="/shop/kids/casual" onClick={closeMobileMenu} className="block py-1 hover:text-black">Casual Wear</Link>
                      <Link href="/shop/kids/party" onClick={closeMobileMenu} className="block py-1 hover:text-black">Party Wear</Link>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          <Link href="#on-sale" onClick={closeMobileMenu} className="block py-1.5 border-b border-gray-100 hover:text-gray-600 transition-colors">
            On Sale
          </Link>
          <Link href="#new-arrivals" onClick={closeMobileMenu} className="block py-1.5 border-b border-gray-100 hover:text-gray-600 transition-colors">
            New Arrivals
          </Link>
          <Link href="#brands" onClick={closeMobileMenu} className="block py-1.5 border-b border-gray-100 hover:text-gray-600 transition-colors">
            Brands
          </Link>
        </div>

        {/* Mobile Drawer Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-2">
          <Link 
            href="/account" 
            onClick={closeMobileMenu} 
            className="w-full bg-black text-white font-medium py-2.5 rounded-full text-center text-sm block shadow-sm hover:bg-gray-800 transition-colors"
          >
            My Account
          </Link>
        </div>

      </aside>

    </header>
  );
}