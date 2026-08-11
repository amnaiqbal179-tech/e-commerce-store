"use client";

import { FaTwitter, FaFacebookF, FaInstagram, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F0F0F0] pt-16 sm:pt-20 pb-10 relative mt-20 sm:mt-24">
      
      {/* 1. Newsletter Box (Overlapping Top) */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative -top-24 sm:-top-32 mb-[-48px] sm:mb-[-64px] z-10">
        <div className="bg-black rounded-[20px] px-6 sm:px-10 lg:px-16 py-8 lg:py-9 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          
          <h3 
            className="text-white font-extrabold uppercase text-[24px] sm:text-[32px] lg:text-[40px] leading-[1.1] max-w-[551px] text-center lg:text-left"
            style={{ fontFamily: "'Integral CF', 'Arial Black', sans-serif" }}
          >
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h3>

          <div className="w-full lg:w-auto flex flex-col gap-3 w-full max-w-[350px]">
            {/* Email Input */}
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-black/40">
                <FaEnvelope size={18} />
              </span>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-white text-black text-[14px] rounded-full pl-11 pr-4 py-3.5 focus:outline-none placeholder:text-black/40 font-medium"
              />
            </div>

            {/* Subscribe Button */}
            <button className="w-full bg-white text-black font-medium text-[14px] rounded-full px-6 py-3.5 hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer">
              Subscribe to Newsletter
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Footer Links Section */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 lg:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 pb-12 border-b border-black/10">
          
          {/* Column 1: Brand Info & Socials (Full width on mobile/tablet) */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <h2 
              className="text-black font-black text-[28px] lg:text-[32px] tracking-tight"
              style={{ fontFamily: "'Integral CF', 'Arial Black', sans-serif" }}
            >
              SHOP.CO
            </h2>
            <p className="text-black/60 text-[14px] leading-[22px] font-normal">
              We have clothes that suits your style and which you&apos;re proud to wear. From women to men.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                <FaTwitter size={14} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-all">
                <FaFacebookF size={14} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                <FaInstagram size={14} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                <FaGithub size={14} />
              </a>
            </div>
          </div>

          {/* Links Grid for Mobile (2 Columns) & Laptop (4 Columns) */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            
            {/* Column 2: Company */}
            <div className="flex flex-col gap-4">
              <h4 className="text-black font-bold text-[14px] sm:text-[16px] tracking-[2px] sm:tracking-[3px] uppercase">
                Company
              </h4>
              <ul className="flex flex-col gap-3 text-black/60 text-[14px]">
                <li><a href="#" className="hover:text-black transition-colors">About</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Works</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Career</a></li>
              </ul>
            </div>

            {/* Column 3: Help */}
            <div className="flex flex-col gap-4">
              <h4 className="text-black font-bold text-[14px] sm:text-[16px] tracking-[2px] sm:tracking-[3px] uppercase">
                Help
              </h4>
              <ul className="flex flex-col gap-3 text-black/60 text-[14px]">
                <li><a href="#" className="hover:text-black transition-colors">Customer Support</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Delivery Details</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Column 4: FAQ */}
            <div className="flex flex-col gap-4">
              <h4 className="text-black font-bold text-[14px] sm:text-[16px] tracking-[2px] sm:tracking-[3px] uppercase">
                FAQ
              </h4>
              <ul className="flex flex-col gap-3 text-black/60 text-[14px]">
                <li><a href="#" className="hover:text-black transition-colors">Account</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Manage Deliveries</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Orders</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Payments</a></li>
              </ul>
            </div>

            {/* Column 5: Resources */}
            <div className="flex flex-col gap-4">
              <h4 className="text-black font-bold text-[14px] sm:text-[16px] tracking-[2px] sm:tracking-[3px] uppercase">
                Resources
              </h4>
              <ul className="flex flex-col gap-3 text-black/60 text-[14px]">
                <li><a href="#" className="hover:text-black transition-colors">Free eBooks</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Development Tutorial</a></li>
                <li><a href="#" className="hover:text-black transition-colors">How to - Blog</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Youtube Playlist</a></li>
              </ul>
            </div>

          </div>

        </div>

        {/* 3. Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-black/60 text-[14px]">
            Shop.co &copy; 2000-2023. All Rights Reserved
          </p>

          {/* Payment Cards Badges */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="bg-white px-2.5 py-1 rounded-[4px] shadow-sm border border-black/5 flex items-center justify-center h-[30px] w-[46px]">
              <span className="font-bold italic text-[14px] text-[#14238A]">VISA</span>
            </div>
            <div className="bg-white px-2.5 py-1 rounded-[4px] shadow-sm border border-black/5 flex items-center justify-center h-[30px] w-[46px]">
              <div className="flex -space-x-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-80"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-80"></div>
              </div>
            </div>
            <div className="bg-white px-2.5 py-1 rounded-[4px] shadow-sm border border-black/5 flex items-center justify-center h-[30px] w-[46px]">
              <span className="font-bold text-[12px] text-[#003087]">PayPal</span>
            </div>
            <div className="bg-white px-2.5 py-1 rounded-[4px] shadow-sm border border-black/5 flex items-center justify-center h-[30px] w-[46px]">
              <span className="font-bold text-[12px] text-black">Pay</span>
            </div>
            <div className="bg-white px-2.5 py-1 rounded-[4px] shadow-sm border border-black/5 flex items-center justify-center h-[30px] w-[46px]">
              <span className="font-bold text-[12px] text-black">GPay</span>
            </div>
          </div>
        </div>

      </div>

    </footer>
  );
}