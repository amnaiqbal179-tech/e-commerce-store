import Link from 'next/link';
import { Search, ShoppingCart, CircleUserRound, ChevronDown, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-black/5 py-4 sm:py-5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[100px] flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Icon & Logo */}
        <div className="flex items-center gap-3 lg:gap-8">
          {/* Mobile Hamburger Menu Icon */}
          <button className="block lg:hidden text-black hover:opacity-75" aria-label="Toggle Menu">
            <Menu size={24} />
          </button>

          {/* SHOP.CO Logo */}
          <Link 
            href="/" 
            className="font-integral font-bold text-[24px] sm:text-[28px] lg:text-[32px] leading-none text-black shrink-0"
          >
            SHOP.CO
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex flex-row items-center gap-6 font-satoshi font-normal text-[16px] text-black shrink-0">
          <div className="flex items-center gap-1 cursor-pointer hover:opacity-75">
            Shop <ChevronDown size={16} />
          </div>
          <Link href="#on-sale" className="hover:opacity-75">On Sale</Link>
          <Link href="#new-arrivals" className="hover:opacity-75">New Arrivals</Link>
          <Link href="#brands" className="hover:opacity-75">Brands</Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex flex-row items-center px-4 py-3 gap-3 w-full max-w-[400px] lg:max-w-[577px] h-[44px] lg:h-[48px] bg-[#F0F0F0] rounded-[62px]">
          <Search size={20} className="text-black/40 shrink-0" />
          <input
            type="text"
            placeholder="Search for products..."
            className="bg-transparent border-none outline-none w-full font-satoshi font-normal text-[14px] lg:text-[16px] text-black placeholder:text-black/40"
          />
        </div>

        {/* Icons (Search, Cart & User) */}
        <div className="flex flex-row items-center gap-3 sm:gap-4 shrink-0">
          <button className="block md:hidden text-black hover:opacity-75" aria-label="Search">
            <Search size={24} strokeWidth={1.75} />
          </button>

          <Link href="/cart" aria-label="Cart" className="text-black hover:opacity-75 w-6 h-6 flex items-center justify-center">
            <ShoppingCart size={24} strokeWidth={1.75} />
          </Link>
          
          <Link href="/account" aria-label="Account" className="text-black hover:opacity-75 w-6 h-6 flex items-center justify-center">
            <CircleUserRound size={24} strokeWidth={1.75} />
          </Link>
        </div>

      </div>
    </header>
  );
}